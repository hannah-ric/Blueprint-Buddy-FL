const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class ComponentsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const components = await db.components.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        description: data.description || null,
        standard_dimensions: data.standard_dimensions || null,
        recommended_materials: data.recommended_materials || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await components.setWorkshop(data.workshop || null, {
      transaction,
    });

    return components;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const componentsData = data.map((item, index) => ({
      id: item.id || undefined,

      name: item.name || null,
      description: item.description || null,
      standard_dimensions: item.standard_dimensions || null,
      recommended_materials: item.recommended_materials || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const components = await db.components.bulkCreate(componentsData, {
      transaction,
    });

    // For each item created, replace relation files

    return components;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const components = await db.components.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.name !== undefined) updatePayload.name = data.name;

    if (data.description !== undefined)
      updatePayload.description = data.description;

    if (data.standard_dimensions !== undefined)
      updatePayload.standard_dimensions = data.standard_dimensions;

    if (data.recommended_materials !== undefined)
      updatePayload.recommended_materials = data.recommended_materials;

    updatePayload.updatedById = currentUser.id;

    await components.update(updatePayload, { transaction });

    if (data.workshop !== undefined) {
      await components.setWorkshop(
        data.workshop,

        { transaction },
      );
    }

    return components;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const components = await db.components.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of components) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of components) {
        await record.destroy({ transaction });
      }
    });

    return components;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const components = await db.components.findByPk(id, options);

    await components.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await components.destroy({
      transaction,
    });

    return components;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const components = await db.components.findOne({ where }, { transaction });

    if (!components) {
      return components;
    }

    const output = components.get({ plain: true });

    output.workshop = await components.getWorkshop({
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
          [Op.and]: Utils.ilike('components', 'name', filter.name),
        };
      }

      if (filter.description) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'components',
            'description',
            filter.description,
          ),
        };
      }

      if (filter.standard_dimensionsRange) {
        const [start, end] = filter.standard_dimensionsRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            standard_dimensions: {
              ...where.standard_dimensions,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            standard_dimensions: {
              ...where.standard_dimensions,
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

      if (filter.recommended_materials) {
        where = {
          ...where,
          recommended_materials: filter.recommended_materials,
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
      const { rows, count } = await db.components.findAndCountAll(queryOptions);

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
          Utils.ilike('components', 'name', query),
        ],
      };
    }

    const records = await db.components.findAll({
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
