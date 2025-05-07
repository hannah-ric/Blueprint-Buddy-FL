const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const hardware_fasteners = sequelize.define(
    'hardware_fasteners',
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

      diameter: {
        type: DataTypes.DECIMAL,
      },

      length: {
        type: DataTypes.DECIMAL,
      },

      head_drive_type: {
        type: DataTypes.ENUM,

        values: ['flat', 'phillips', 'torx'],
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

  hardware_fasteners.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.hardware_fasteners.belongsTo(db.workshop, {
      as: 'workshop',
      foreignKey: {
        name: 'workshopId',
      },
      constraints: false,
    });

    db.hardware_fasteners.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.hardware_fasteners.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return hardware_fasteners;
};
