const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const materials = sequelize.define(
    'materials',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      description: {
        type: DataTypes.TEXT,
      },

      nominal_size: {
        type: DataTypes.DECIMAL,
      },

      actual_size: {
        type: DataTypes.DECIMAL,
      },

      mechanical_properties: {
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

  materials.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.materials.belongsTo(db.workshop, {
      as: 'workshop',
      foreignKey: {
        name: 'workshopId',
      },
      constraints: false,
    });

    db.materials.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.materials.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return materials;
};
