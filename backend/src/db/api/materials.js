const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class MaterialsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const materials = await db.materials.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        description: data.description || null,
        nominal_size: data.nominal_size || null,
        actual_size: data.actual_size || null,
        mechanical_properties: data.mechanical_properties || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await materials.setWorkshop(data.workshop || null, {
      transaction,
    });

    return materials;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const materialsData = data.map((item, index) => ({
      id: item.id || undefined,

      name: item.name || null,
      description: item.description || null,
      nominal_size: item.nominal_size || null,
      actual_size: item.actual_size || null,
      mechanical_properties: item.mechanical_properties || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const materials = await db.materials.bulkCreate(materialsData, {
      transaction,
    });

    // For each item created, replace relation files

    return materials;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const materials = await db.materials.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.name !== undefined) updatePayload.name = data.name;

    if (data.description !== undefined)
      updatePayload.description = data.description;

    if (data.nominal_size !== undefined)
      updatePayload.nominal_size = data.nominal_size;

    if (data.actual_size !== undefined)
      updatePayload.actual_size = data.actual_size;

    if (data.mechanical_properties !== undefined)
      updatePayload.mechanical_properties = data.mechanical_properties;

    updatePayload.updatedById = currentUser.id;

    await materials.update(updatePayload, { transaction });

    if (data.workshop !== undefined) {
      await materials.setWorkshop(
        data.workshop,

        { transaction },
      );
    }

    return materials;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const materials = await db.materials.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of materials) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of materials) {
        await record.destroy({ transaction });
      }
    });

    return materials;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const materials = await db.materials.findByPk(id, options);

    await materials.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await materials.destroy({
      transaction,
    });

    return materials;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const materials = await db.materials.findOne({ where }, { transaction });

    if (!materials) {
      return materials;
    }

    const output = materials.get({ plain: true });

    output.workshop = await materials.getWorkshop({
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
          [Op.and]: Utils.ilike('materials', 'name', filter.name),
        };
      }

      if (filter.description) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('materials', 'description', filter.description),
        };
      }

      if (filter.mechanical_properties) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'materials',
            'mechanical_properties',
            filter.mechanical_properties,
          ),
        };
      }

      if (filter.nominal_sizeRange) {
        const [start, end] = filter.nominal_sizeRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            nominal_size: {
              ...where.nominal_size,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            nominal_size: {
              ...where.nominal_size,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.actual_sizeRange) {
        const [start, end] = filter.actual_sizeRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            actual_size: {
              ...where.actual_size,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            actual_size: {
              ...where.actual_size,
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
      const { rows, count } = await db.materials.findAndCountAll(queryOptions);

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
          Utils.ilike('materials', 'name', query),
        ],
      };
    }

    const records = await db.materials.findAll({
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
