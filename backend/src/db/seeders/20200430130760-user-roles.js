const { v4: uuid } = require('uuid');

module.exports = {
  /**
   * @param{import("sequelize").QueryInterface} queryInterface
   * @return {Promise<void>}
   */
  async up(queryInterface) {
    const createdAt = new Date();
    const updatedAt = new Date();

    /** @type {Map<string, string>} */
    const idMap = new Map();

    /**
     * @param {string} key
     * @return {string}
     */
    function getId(key) {
      if (idMap.has(key)) {
        return idMap.get(key);
      }
      const id = uuid();
      idMap.set(key, id);
      return id;
    }

    await queryInterface.bulkInsert('roles', [
      {
        id: getId('SuperAdmin'),
        name: 'Super Administrator',
        createdAt,
        updatedAt,
      },

      {
        id: getId('Administrator'),
        name: 'Administrator',
        createdAt,
        updatedAt,
      },

      {
        id: getId('LeadDesigner'),
        name: 'Lead Designer',
        createdAt,
        updatedAt,
      },

      {
        id: getId('ProjectManager'),
        name: 'Project Manager',
        createdAt,
        updatedAt,
      },

      {
        id: getId('FabricationSpecialist'),
        name: 'Fabrication Specialist',
        createdAt,
        updatedAt,
      },

      {
        id: getId('DesignAssistant'),
        name: 'Design Assistant',
        createdAt,
        updatedAt,
      },

      {
        id: getId('WorkshopCoordinator'),
        name: 'Workshop Coordinator',
        createdAt,
        updatedAt,
      },
    ]);

    /**
     * @param {string} name
     */
    function createPermissions(name) {
      return [
        {
          id: getId(`CREATE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `CREATE_${name.toUpperCase()}`,
        },
        {
          id: getId(`READ_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `READ_${name.toUpperCase()}`,
        },
        {
          id: getId(`UPDATE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `UPDATE_${name.toUpperCase()}`,
        },
        {
          id: getId(`DELETE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `DELETE_${name.toUpperCase()}`,
        },
      ];
    }

    const entities = [
      'users',
      'build_plans',
      'components',
      'hardware_fasteners',
      'joinery_methods',
      'materials',
      'roles',
      'permissions',
      'workshop',
      ,
    ];
    await queryInterface.bulkInsert(
      'permissions',
      entities.flatMap(createPermissions),
    );
    await queryInterface.bulkInsert('permissions', [
      {
        id: getId(`READ_API_DOCS`),
        createdAt,
        updatedAt,
        name: `READ_API_DOCS`,
      },
    ]);
    await queryInterface.bulkInsert('permissions', [
      {
        id: getId(`CREATE_SEARCH`),
        createdAt,
        updatedAt,
        name: `CREATE_SEARCH`,
      },
    ]);

    await queryInterface.bulkUpdate(
      'roles',
      { globalAccess: true },
      { id: getId('SuperAdmin') },
    );

    await queryInterface.sequelize
      .query(`create table "rolesPermissionsPermissions"
(
"createdAt"           timestamp with time zone not null,
"updatedAt"           timestamp with time zone not null,
"roles_permissionsId" uuid                     not null,
"permissionId"        uuid                     not null,
primary key ("roles_permissionsId", "permissionId")
);`);

    await queryInterface.bulkInsert('rolesPermissionsPermissions', [
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('CREATE_BUILD_PLANS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('READ_BUILD_PLANS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('UPDATE_BUILD_PLANS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('DELETE_BUILD_PLANS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProjectManager'),
        permissionId: getId('CREATE_BUILD_PLANS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProjectManager'),
        permissionId: getId('READ_BUILD_PLANS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProjectManager'),
        permissionId: getId('UPDATE_BUILD_PLANS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('FabricationSpecialist'),
        permissionId: getId('CREATE_BUILD_PLANS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('FabricationSpecialist'),
        permissionId: getId('READ_BUILD_PLANS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('DesignAssistant'),
        permissionId: getId('CREATE_BUILD_PLANS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('DesignAssistant'),
        permissionId: getId('READ_BUILD_PLANS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('WorkshopCoordinator'),
        permissionId: getId('CREATE_BUILD_PLANS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('CREATE_COMPONENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('READ_COMPONENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('UPDATE_COMPONENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('DELETE_COMPONENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProjectManager'),
        permissionId: getId('CREATE_COMPONENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProjectManager'),
        permissionId: getId('READ_COMPONENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProjectManager'),
        permissionId: getId('UPDATE_COMPONENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('FabricationSpecialist'),
        permissionId: getId('CREATE_COMPONENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('FabricationSpecialist'),
        permissionId: getId('READ_COMPONENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('DesignAssistant'),
        permissionId: getId('CREATE_COMPONENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('DesignAssistant'),
        permissionId: getId('READ_COMPONENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('WorkshopCoordinator'),
        permissionId: getId('CREATE_COMPONENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('CREATE_HARDWARE_FASTENERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('READ_HARDWARE_FASTENERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('UPDATE_HARDWARE_FASTENERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('DELETE_HARDWARE_FASTENERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProjectManager'),
        permissionId: getId('CREATE_HARDWARE_FASTENERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProjectManager'),
        permissionId: getId('READ_HARDWARE_FASTENERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProjectManager'),
        permissionId: getId('UPDATE_HARDWARE_FASTENERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('FabricationSpecialist'),
        permissionId: getId('CREATE_HARDWARE_FASTENERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('FabricationSpecialist'),
        permissionId: getId('READ_HARDWARE_FASTENERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('DesignAssistant'),
        permissionId: getId('CREATE_HARDWARE_FASTENERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('DesignAssistant'),
        permissionId: getId('READ_HARDWARE_FASTENERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('WorkshopCoordinator'),
        permissionId: getId('CREATE_HARDWARE_FASTENERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('CREATE_JOINERY_METHODS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('READ_JOINERY_METHODS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('UPDATE_JOINERY_METHODS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('DELETE_JOINERY_METHODS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProjectManager'),
        permissionId: getId('CREATE_JOINERY_METHODS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProjectManager'),
        permissionId: getId('READ_JOINERY_METHODS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProjectManager'),
        permissionId: getId('UPDATE_JOINERY_METHODS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('FabricationSpecialist'),
        permissionId: getId('CREATE_JOINERY_METHODS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('FabricationSpecialist'),
        permissionId: getId('READ_JOINERY_METHODS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('DesignAssistant'),
        permissionId: getId('CREATE_JOINERY_METHODS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('DesignAssistant'),
        permissionId: getId('READ_JOINERY_METHODS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('WorkshopCoordinator'),
        permissionId: getId('CREATE_JOINERY_METHODS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('CREATE_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('READ_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('UPDATE_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('DELETE_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProjectManager'),
        permissionId: getId('CREATE_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProjectManager'),
        permissionId: getId('READ_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProjectManager'),
        permissionId: getId('UPDATE_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('FabricationSpecialist'),
        permissionId: getId('CREATE_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('FabricationSpecialist'),
        permissionId: getId('READ_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('DesignAssistant'),
        permissionId: getId('CREATE_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('DesignAssistant'),
        permissionId: getId('READ_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('WorkshopCoordinator'),
        permissionId: getId('CREATE_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('LeadDesigner'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('ProjectManager'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('FabricationSpecialist'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('DesignAssistant'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('WorkshopCoordinator'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_BUILD_PLANS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_BUILD_PLANS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_BUILD_PLANS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_BUILD_PLANS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_COMPONENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_COMPONENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_COMPONENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_COMPONENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_HARDWARE_FASTENERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_HARDWARE_FASTENERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_HARDWARE_FASTENERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_HARDWARE_FASTENERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_JOINERY_METHODS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_JOINERY_METHODS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_JOINERY_METHODS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_JOINERY_METHODS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_BUILD_PLANS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_BUILD_PLANS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_BUILD_PLANS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_BUILD_PLANS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_COMPONENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_COMPONENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_COMPONENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_COMPONENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_HARDWARE_FASTENERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_HARDWARE_FASTENERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_HARDWARE_FASTENERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_HARDWARE_FASTENERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_JOINERY_METHODS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_JOINERY_METHODS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_JOINERY_METHODS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_JOINERY_METHODS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_ROLES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_PERMISSIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_WORKSHOP'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_WORKSHOP'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_WORKSHOP'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_WORKSHOP'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_API_DOCS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_API_DOCS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_SEARCH'),
      },
    ]);

    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'SuperAdmin',
      )}' WHERE "email"='super_admin@flatlogic.com'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'Administrator',
      )}' WHERE "email"='admin@flatlogic.com'`,
    );

    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'LeadDesigner',
      )}' WHERE "email"='client@hello.com'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'ProjectManager',
      )}' WHERE "email"='john@doe.com'`,
    );
  },
};
