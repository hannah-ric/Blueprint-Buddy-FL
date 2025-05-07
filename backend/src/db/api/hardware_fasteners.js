const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Hardware_fastenersDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const hardware_fasteners = await db.hardware_fasteners.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        description: data.description || null,
        diameter: data.diameter || null,
        length: data.length || null,
        head_drive_type: data.head_drive_type || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await hardware_fasteners.setWorkshop(data.workshop || null, {
      transaction,
    });

    return hardware_fasteners;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const hardware_fastenersData = data.map((item, index) => ({
      id: item.id || undefined,

      name: item.name || null,
      description: item.description || null,
      diameter: item.diameter || null,
      length: item.length || null,
      head_drive_type: item.head_drive_type || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const hardware_fasteners = await db.hardware_fasteners.bulkCreate(
      hardware_fastenersData,
      { transaction },
    );

    // For each item created, replace relation files

    return hardware_fasteners;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const hardware_fasteners = await db.hardware_fasteners.findByPk(
      id,
      {},
      { transaction },
    );

    const updatePayload = {};

    if (data.name !== undefined) updatePayload.name = data.name;

    if (data.description !== undefined)
      updatePayload.description = data.description;

    if (data.diameter !== undefined) updatePayload.diameter = data.diameter;

    if (data.length !== undefined) updatePayload.length = data.length;

    if (data.head_drive_type !== undefined)
      updatePayload.head_drive_type = data.head_drive_type;

    updatePayload.updatedById = currentUser.id;

    await hardware_fasteners.update(updatePayload, { transaction });

    if (data.workshop !== undefined) {
      await hardware_fasteners.setWorkshop(
        data.workshop,

        { transaction },
      );
    }

    return hardware_fasteners;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const hardware_fasteners = await db.hardware_fasteners.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of hardware_fasteners) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of hardware_fasteners) {
        await record.destroy({ transaction });
      }
    });

    return hardware_fasteners;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const hardware_fasteners = await db.hardware_fasteners.findByPk(
      id,
      options,
    );

    await hardware_fasteners.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await hardware_fasteners.destroy({
      transaction,
    });

    return hardware_fasteners;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const hardware_fasteners = await db.hardware_fasteners.findOne(
      { where },
      { transaction },
    );

    if (!hardware_fasteners) {
      return hardware_fasteners;
    }

    const output = hardware_fasteners.get({ plain: true });

    output.workshop = await hardware_fasteners.getWorkshop({
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
          [Op.and]: Utils.ilike('hardware_fasteners', 'name', filter.name),
        };
      }

      if (filter.description) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'hardware_fasteners',
            'description',
            filter.description,
          ),
        };
      }

      if (filter.diameterRange) {
        const [start, end] = filter.diameterRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            diameter: {
              ...where.diameter,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            diameter: {
              ...where.diameter,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.lengthRange) {
        const [start, end] = filter.lengthRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            length: {
              ...where.length,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            length: {
              ...where.length,
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

      if (filter.head_drive_type) {
        where = {
          ...where,
          head_drive_type: filter.head_drive_type,
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
      const { rows, count } = await db.hardware_fasteners.findAndCountAll(
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
          Utils.ilike('hardware_fasteners', 'name', query),
        ],
      };
    }

    const records = await db.hardware_fasteners.findAll({
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
