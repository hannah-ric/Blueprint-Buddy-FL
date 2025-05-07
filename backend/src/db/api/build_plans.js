const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Build_plansDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const build_plans = await db.build_plans.create(
      {
        id: data.id || undefined,

        title: data.title || null,
        created_date: data.created_date || null,
        modified_date: data.modified_date || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await build_plans.setWorkshop(data.workshop || null, {
      transaction,
    });

    await build_plans.setComponents(data.components || [], {
      transaction,
    });

    await build_plans.setMaterials(data.materials || [], {
      transaction,
    });

    await build_plans.setJoinery_methods(data.joinery_methods || [], {
      transaction,
    });

    await build_plans.setHardware_fasteners(data.hardware_fasteners || [], {
      transaction,
    });

    return build_plans;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const build_plansData = data.map((item, index) => ({
      id: item.id || undefined,

      title: item.title || null,
      created_date: item.created_date || null,
      modified_date: item.modified_date || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const build_plans = await db.build_plans.bulkCreate(build_plansData, {
      transaction,
    });

    // For each item created, replace relation files

    return build_plans;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const build_plans = await db.build_plans.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.title !== undefined) updatePayload.title = data.title;

    if (data.created_date !== undefined)
      updatePayload.created_date = data.created_date;

    if (data.modified_date !== undefined)
      updatePayload.modified_date = data.modified_date;

    updatePayload.updatedById = currentUser.id;

    await build_plans.update(updatePayload, { transaction });

    if (data.workshop !== undefined) {
      await build_plans.setWorkshop(
        data.workshop,

        { transaction },
      );
    }

    if (data.components !== undefined) {
      await build_plans.setComponents(data.components, { transaction });
    }

    if (data.materials !== undefined) {
      await build_plans.setMaterials(data.materials, { transaction });
    }

    if (data.joinery_methods !== undefined) {
      await build_plans.setJoinery_methods(data.joinery_methods, {
        transaction,
      });
    }

    if (data.hardware_fasteners !== undefined) {
      await build_plans.setHardware_fasteners(data.hardware_fasteners, {
        transaction,
      });
    }

    return build_plans;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const build_plans = await db.build_plans.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of build_plans) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of build_plans) {
        await record.destroy({ transaction });
      }
    });

    return build_plans;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const build_plans = await db.build_plans.findByPk(id, options);

    await build_plans.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await build_plans.destroy({
      transaction,
    });

    return build_plans;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const build_plans = await db.build_plans.findOne(
      { where },
      { transaction },
    );

    if (!build_plans) {
      return build_plans;
    }

    const output = build_plans.get({ plain: true });

    output.components = await build_plans.getComponents({
      transaction,
    });

    output.materials = await build_plans.getMaterials({
      transaction,
    });

    output.joinery_methods = await build_plans.getJoinery_methods({
      transaction,
    });

    output.hardware_fasteners = await build_plans.getHardware_fasteners({
      transaction,
    });

    output.workshop = await build_plans.getWorkshop({
      transaction,
    });

    return output;
  }

  static async findAll(filter, globalAccess, options) {
    const limit = filter.limit || 0;
    let offset = 0;
    let where = {};
    const currentPage = +filter.page;

    const user = (options && options.currentUser) || null;
    const userWorkshop = (user && user.workshop?.id) || null;

    if (userWorkshop) {
      if (options?.currentUser?.workshopId) {
        where.workshopId = options.currentUser.workshopId;
      }
    }

    offset = currentPage * limit;

    const orderBy = null;

    const transaction = (options && options.transaction) || undefined;

    let include = [
      {
        model: db.workshop,
        as: 'workshop',
      },

      {
        model: db.components,
        as: 'components',
        required: false,
      },

      {
        model: db.materials,
        as: 'materials',
        required: false,
      },

      {
        model: db.joinery_methods,
        as: 'joinery_methods',
        required: false,
      },

      {
        model: db.hardware_fasteners,
        as: 'hardware_fasteners',
        required: false,
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.title) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('build_plans', 'title', filter.title),
        };
      }

      if (filter.calendarStart && filter.calendarEnd) {
        where = {
          ...where,
          [Op.or]: [
            {
              created_date: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
            {
              modified_date: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
          ],
        };
      }

      if (filter.created_dateRange) {
        const [start, end] = filter.created_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            created_date: {
              ...where.created_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            created_date: {
              ...where.created_date,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.modified_dateRange) {
        const [start, end] = filter.modified_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            modified_date: {
              ...where.modified_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            modified_date: {
              ...where.modified_date,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.active !== undefined) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.workshop) {
        const listItems = filter.workshop.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          workshopId: { [Op.or]: listItems },
        };
      }

      if (filter.components) {
        const searchTerms = filter.components.split('|');

        include = [
          {
            model: db.components,
            as: 'components_filter',
            required: searchTerms.length > 0,
            where:
              searchTerms.length > 0
                ? {
                    [Op.or]: [
                      {
                        id: {
                          [Op.in]: searchTerms.map((term) => Utils.uuid(term)),
                        },
                      },
                      {
                        name: {
                          [Op.or]: searchTerms.map((term) => ({
                            [Op.iLike]: `%${term}%`,
                          })),
                        },
                      },
                    ],
                  }
                : undefined,
          },
          ...include,
        ];
      }

      if (filter.materials) {
        const searchTerms = filter.materials.split('|');

        include = [
          {
            model: db.materials,
            as: 'materials_filter',
            required: searchTerms.length > 0,
            where:
              searchTerms.length > 0
                ? {
                    [Op.or]: [
                      {
                        id: {
                          [Op.in]: searchTerms.map((term) => Utils.uuid(term)),
                        },
                      },
                      {
                        name: {
                          [Op.or]: searchTerms.map((term) => ({
                            [Op.iLike]: `%${term}%`,
                          })),
                        },
                      },
                    ],
                  }
                : undefined,
          },
          ...include,
        ];
      }

      if (filter.joinery_methods) {
        const searchTerms = filter.joinery_methods.split('|');

        include = [
          {
            model: db.joinery_methods,
            as: 'joinery_methods_filter',
            required: searchTerms.length > 0,
            where:
              searchTerms.length > 0
                ? {
                    [Op.or]: [
                      {
                        id: {
                          [Op.in]: searchTerms.map((term) => Utils.uuid(term)),
                        },
                      },
                      {
                        name: {
                          [Op.or]: searchTerms.map((term) => ({
                            [Op.iLike]: `%${term}%`,
                          })),
                        },
                      },
                    ],
                  }
                : undefined,
          },
          ...include,
        ];
      }

      if (filter.hardware_fasteners) {
        const searchTerms = filter.hardware_fasteners.split('|');

        include = [
          {
            model: db.hardware_fasteners,
            as: 'hardware_fasteners_filter',
            required: searchTerms.length > 0,
            where:
              searchTerms.length > 0
                ? {
                    [Op.or]: [
                      {
                        id: {
                          [Op.in]: searchTerms.map((term) => Utils.uuid(term)),
                        },
                      },
                      {
                        name: {
                          [Op.or]: searchTerms.map((term) => ({
                            [Op.iLike]: `%${term}%`,
                          })),
                        },
                      },
                    ],
                  }
                : undefined,
          },
          ...include,
        ];
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    if (globalAccess) {
      delete where.workshopId;
    }

    const queryOptions = {
      where,
      include,
      distinct: true,
      order:
        filter.field && filter.sort
          ? [[filter.field, filter.sort]]
          : [['createdAt', 'desc']],
      transaction: options?.transaction,
      logging: console.log,
    };

    if (!options?.countOnly) {
      queryOptions.limit = limit ? Number(limit) : undefined;
      queryOptions.offset = offset ? Number(offset) : undefined;
    }

    try {
      const { rows, count } = await db.build_plans.findAndCountAll(
        queryOptions,
      );

      return {
        rows: options?.countOnly ? [] : rows,
        count: count,
      };
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  static async findAllAutocomplete(
    query,
    limit,
    offset,
    globalAccess,
    organizationId,
  ) {
    let where = {};

    if (!globalAccess && organizationId) {
      where.organizationId = organizationId;
    }

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('build_plans', 'title', query),
        ],
      };
    }

    const records = await db.build_plans.findAll({
      attributes: ['id', 'title'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['title', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.title,
    }));
  }
};
