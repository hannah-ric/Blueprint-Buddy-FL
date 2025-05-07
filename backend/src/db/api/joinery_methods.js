const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Joinery_methodsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const joinery_methods = await db.joinery_methods.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        description: data.description || null,
        strength_rating: data.strength_rating || null,
        compatible_materials: data.compatible_materials || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await joinery_methods.setWorkshop(data.workshop || null, {
      transaction,
    });

    return joinery_methods;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const joinery_methodsData = data.map((item, index) => ({
      id: item.id || undefined,

      name: item.name || null,
      description: item.description || null,
      strength_rating: item.strength_rating || null,
      compatible_materials: item.compatible_materials || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const joinery_methods = await db.joinery_methods.bulkCreate(
      joinery_methodsData,
      { transaction },
    );

    // For each item created, replace relation files

    return joinery_methods;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const joinery_methods = await db.joinery_methods.findByPk(
      id,
      {},
      { transaction },
    );

    const updatePayload = {};

    if (data.name !== undefined) updatePayload.name = data.name;

    if (data.description !== undefined)
      updatePayload.description = data.description;

    if (data.strength_rating !== undefined)
      updatePayload.strength_rating = data.strength_rating;

    if (data.compatible_materials !== undefined)
      updatePayload.compatible_materials = data.compatible_materials;

    updatePayload.updatedById = currentUser.id;

    await joinery_methods.update(updatePayload, { transaction });

    if (data.workshop !== undefined) {
      await joinery_methods.setWorkshop(
        data.workshop,

        { transaction },
      );
    }

    return joinery_methods;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const joinery_methods = await db.joinery_methods.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of joinery_methods) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of joinery_methods) {
        await record.destroy({ transaction });
      }
    });

    return joinery_methods;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const joinery_methods = await db.joinery_methods.findByPk(id, options);

    await joinery_methods.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await joinery_methods.destroy({
      transaction,
    });

    return joinery_methods;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const joinery_methods = await db.joinery_methods.findOne(
      { where },
      { transaction },
    );

    if (!joinery_methods) {
      return joinery_methods;
    }

    const output = joinery_methods.get({ plain: true });

    output.workshop = await joinery_methods.getWorkshop({
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
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('joinery_methods', 'name', filter.name),
        };
      }

      if (filter.description) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'joinery_methods',
            'description',
            filter.description,
          ),
        };
      }

      if (filter.strength_ratingRange) {
        const [start, end] = filter.strength_ratingRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            strength_rating: {
              ...where.strength_rating,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            strength_rating: {
              ...where.strength_rating,
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

      if (filter.compatible_materials) {
        where = {
          ...where,
          compatible_materials: filter.compatible_materials,
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
      const { rows, count } = await db.joinery_methods.findAndCountAll(
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
          Utils.ilike('joinery_methods', 'name', query),
        ],
      };
    }

    const records = await db.joinery_methods.findAll({
      attributes: ['id', 'name'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }
};
