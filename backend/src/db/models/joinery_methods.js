const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const joinery_methods = sequelize.define(
    'joinery_methods',
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

      strength_rating: {
        type: DataTypes.DECIMAL,
      },

      compatible_materials: {
        type: DataTypes.ENUM,

        values: ['wood', 'metal'],
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

  joinery_methods.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.joinery_methods.belongsTo(db.workshop, {
      as: 'workshop',
      foreignKey: {
        name: 'workshopId',
      },
      constraints: false,
    });

    db.joinery_methods.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.joinery_methods.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return joinery_methods;
};
