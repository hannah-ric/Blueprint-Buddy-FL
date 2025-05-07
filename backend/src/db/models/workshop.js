const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const workshop = sequelize.define(
    'workshop',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  workshop.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.workshop.hasMany(db.users, {
      as: 'users_workshop',
      foreignKey: {
        name: 'workshopId',
      },
      constraints: false,
    });

    db.workshop.hasMany(db.build_plans, {
      as: 'build_plans_workshop',
      foreignKey: {
        name: 'workshopId',
      },
      constraints: false,
    });

    db.workshop.hasMany(db.components, {
      as: 'components_workshop',
      foreignKey: {
        name: 'workshopId',
      },
      constraints: false,
    });

    db.workshop.hasMany(db.hardware_fasteners, {
      as: 'hardware_fasteners_workshop',
      foreignKey: {
        name: 'workshopId',
      },
      constraints: false,
    });

    db.workshop.hasMany(db.joinery_methods, {
      as: 'joinery_methods_workshop',
      foreignKey: {
        name: 'workshopId',
      },
      constraints: false,
    });

    db.workshop.hasMany(db.materials, {
      as: 'materials_workshop',
      foreignKey: {
        name: 'workshopId',
      },
      constraints: false,
    });

    //end loop

    db.workshop.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.workshop.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return workshop;
};
