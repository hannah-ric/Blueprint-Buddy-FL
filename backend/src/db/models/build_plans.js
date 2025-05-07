const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const build_plans = sequelize.define(
    'build_plans',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      title: {
        type: DataTypes.TEXT,
      },

      created_date: {
        type: DataTypes.DATE,
      },

      modified_date: {
        type: DataTypes.DATE,
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

  build_plans.associate = (db) => {
    db.build_plans.belongsToMany(db.components, {
      as: 'components',
      foreignKey: {
        name: 'build_plans_componentsId',
      },
      constraints: false,
      through: 'build_plansComponentsComponents',
    });

    db.build_plans.belongsToMany(db.components, {
      as: 'components_filter',
      foreignKey: {
        name: 'build_plans_componentsId',
      },
      constraints: false,
      through: 'build_plansComponentsComponents',
    });

    db.build_plans.belongsToMany(db.materials, {
      as: 'materials',
      foreignKey: {
        name: 'build_plans_materialsId',
      },
      constraints: false,
      through: 'build_plansMaterialsMaterials',
    });

    db.build_plans.belongsToMany(db.materials, {
      as: 'materials_filter',
      foreignKey: {
        name: 'build_plans_materialsId',
      },
      constraints: false,
      through: 'build_plansMaterialsMaterials',
    });

    db.build_plans.belongsToMany(db.joinery_methods, {
      as: 'joinery_methods',
      foreignKey: {
        name: 'build_plans_joinery_methodsId',
      },
      constraints: false,
      through: 'build_plansJoinery_methodsJoinery_methods',
    });

    db.build_plans.belongsToMany(db.joinery_methods, {
      as: 'joinery_methods_filter',
      foreignKey: {
        name: 'build_plans_joinery_methodsId',
      },
      constraints: false,
      through: 'build_plansJoinery_methodsJoinery_methods',
    });

    db.build_plans.belongsToMany(db.hardware_fasteners, {
      as: 'hardware_fasteners',
      foreignKey: {
        name: 'build_plans_hardware_fastenersId',
      },
      constraints: false,
      through: 'build_plansHardware_fastenersHardware_fasteners',
    });

    db.build_plans.belongsToMany(db.hardware_fasteners, {
      as: 'hardware_fasteners_filter',
      foreignKey: {
        name: 'build_plans_hardware_fastenersId',
      },
      constraints: false,
      through: 'build_plansHardware_fastenersHardware_fasteners',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.build_plans.belongsTo(db.workshop, {
      as: 'workshop',
      foreignKey: {
        name: 'workshopId',
      },
      constraints: false,
    });

    db.build_plans.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.build_plans.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return build_plans;
};
