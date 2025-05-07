const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const components = sequelize.define(
    'components',
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

      standard_dimensions: {
        type: DataTypes.DECIMAL,
      },

      recommended_materials: {
        type: DataTypes.ENUM,

        values: ['wood', 'metal', 'glass', 'acrylic'],
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

  components.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.components.belongsTo(db.workshop, {
      as: 'workshop',
      foreignKey: {
        name: 'workshopId',
      },
      constraints: false,
    });

    db.components.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.components.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return components;
};
