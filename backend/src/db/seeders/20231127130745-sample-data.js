const db = require('../models');
const Users = db.users;

const BuildPlans = db.build_plans;

const Components = db.components;

const HardwareFasteners = db.hardware_fasteners;

const JoineryMethods = db.joinery_methods;

const Materials = db.materials;

const Workshop = db.workshop;

const BuildPlansData = [
  {
    title: 'Modern Dining Set',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    created_date: new Date('2023-10-01T10:00:00Z'),

    modified_date: new Date('2023-10-02T10:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    title: 'Office Workspace',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    created_date: new Date('2023-10-03T10:00:00Z'),

    modified_date: new Date('2023-10-04T10:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    title: 'Bedroom Suite',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    created_date: new Date('2023-10-05T10:00:00Z'),

    modified_date: new Date('2023-10-06T10:00:00Z'),

    // type code here for "relation_one" field
  },
];

const ComponentsData = [
  {
    name: 'Dining Chair',

    description: 'Ergonomic dining chair with cushioned seat',

    standard_dimensions: 1.2,

    recommended_materials: 'metal',

    // type code here for "relation_one" field
  },

  {
    name: 'Coffee Table',

    description: 'Modern coffee table with glass top',

    standard_dimensions: 1.5,

    recommended_materials: 'wood',

    // type code here for "relation_one" field
  },

  {
    name: 'Bookshelf',

    description: 'Tall bookshelf with adjustable shelves',

    standard_dimensions: 2,

    recommended_materials: 'wood',

    // type code here for "relation_one" field
  },
];

const HardwareFastenersData = [
  {
    name: 'Wood Screw',

    description: 'Screw for wood applications',

    diameter: 0.5,

    length: 5,

    head_drive_type: 'torx',

    // type code here for "relation_one" field
  },

  {
    name: 'Hex Bolt',

    description: 'Bolt for metal connections',

    diameter: 1,

    length: 10,

    head_drive_type: 'torx',

    // type code here for "relation_one" field
  },

  {
    name: 'Nail',

    description: 'Common nail for general use',

    diameter: 0.3,

    length: 4,

    head_drive_type: 'phillips',

    // type code here for "relation_one" field
  },
];

const JoineryMethodsData = [
  {
    name: 'Dovetail Joint',

    description: 'Strong interlocking joint for drawers',

    strength_rating: 4.5,

    compatible_materials: 'metal',

    // type code here for "relation_one" field
  },

  {
    name: 'Mortise and Tenon',

    description: 'Traditional joint for frames and panels',

    strength_rating: 4.8,

    compatible_materials: 'metal',

    // type code here for "relation_one" field
  },

  {
    name: 'Pocket Hole',

    description: 'Quick and easy joint for frames',

    strength_rating: 3.5,

    compatible_materials: 'metal',

    // type code here for "relation_one" field
  },
];

const MaterialsData = [
  {
    name: 'Oak Wood',

    description: 'Durable hardwood with a fine grain',

    nominal_size: 2,

    actual_size: 1.8,

    mechanical_properties: 'High strength and hardness',

    // type code here for "relation_one" field
  },

  {
    name: 'Pine Wood',

    description: 'Softwood with a light color',

    nominal_size: 2.5,

    actual_size: 2.3,

    mechanical_properties: 'Moderate strength and lightweight',

    // type code here for "relation_one" field
  },

  {
    name: 'Tempered Glass',

    description: 'Safety glass with high impact resistance',

    nominal_size: 1,

    actual_size: 0.9,

    mechanical_properties: 'High impact resistance and clarity',

    // type code here for "relation_one" field
  },
];

const WorkshopData = [
  {
    name: 'Gertrude Belle Elion',
  },

  {
    name: 'Charles Lyell',
  },

  {
    name: 'Rudolf Virchow',
  },
];

// Similar logic for "relation_many"

async function associateUserWithWorkshop() {
  const relatedWorkshop0 = await Workshop.findOne({
    offset: Math.floor(Math.random() * (await Workshop.count())),
  });
  const User0 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (User0?.setWorkshop) {
    await User0.setWorkshop(relatedWorkshop0);
  }

  const relatedWorkshop1 = await Workshop.findOne({
    offset: Math.floor(Math.random() * (await Workshop.count())),
  });
  const User1 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (User1?.setWorkshop) {
    await User1.setWorkshop(relatedWorkshop1);
  }

  const relatedWorkshop2 = await Workshop.findOne({
    offset: Math.floor(Math.random() * (await Workshop.count())),
  });
  const User2 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (User2?.setWorkshop) {
    await User2.setWorkshop(relatedWorkshop2);
  }
}

// Similar logic for "relation_many"

// Similar logic for "relation_many"

// Similar logic for "relation_many"

// Similar logic for "relation_many"

async function associateBuildPlanWithWorkshop() {
  const relatedWorkshop0 = await Workshop.findOne({
    offset: Math.floor(Math.random() * (await Workshop.count())),
  });
  const BuildPlan0 = await BuildPlans.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (BuildPlan0?.setWorkshop) {
    await BuildPlan0.setWorkshop(relatedWorkshop0);
  }

  const relatedWorkshop1 = await Workshop.findOne({
    offset: Math.floor(Math.random() * (await Workshop.count())),
  });
  const BuildPlan1 = await BuildPlans.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (BuildPlan1?.setWorkshop) {
    await BuildPlan1.setWorkshop(relatedWorkshop1);
  }

  const relatedWorkshop2 = await Workshop.findOne({
    offset: Math.floor(Math.random() * (await Workshop.count())),
  });
  const BuildPlan2 = await BuildPlans.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (BuildPlan2?.setWorkshop) {
    await BuildPlan2.setWorkshop(relatedWorkshop2);
  }
}

async function associateComponentWithWorkshop() {
  const relatedWorkshop0 = await Workshop.findOne({
    offset: Math.floor(Math.random() * (await Workshop.count())),
  });
  const Component0 = await Components.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Component0?.setWorkshop) {
    await Component0.setWorkshop(relatedWorkshop0);
  }

  const relatedWorkshop1 = await Workshop.findOne({
    offset: Math.floor(Math.random() * (await Workshop.count())),
  });
  const Component1 = await Components.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Component1?.setWorkshop) {
    await Component1.setWorkshop(relatedWorkshop1);
  }

  const relatedWorkshop2 = await Workshop.findOne({
    offset: Math.floor(Math.random() * (await Workshop.count())),
  });
  const Component2 = await Components.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Component2?.setWorkshop) {
    await Component2.setWorkshop(relatedWorkshop2);
  }
}

async function associateHardwareFastenerWithWorkshop() {
  const relatedWorkshop0 = await Workshop.findOne({
    offset: Math.floor(Math.random() * (await Workshop.count())),
  });
  const HardwareFastener0 = await HardwareFasteners.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (HardwareFastener0?.setWorkshop) {
    await HardwareFastener0.setWorkshop(relatedWorkshop0);
  }

  const relatedWorkshop1 = await Workshop.findOne({
    offset: Math.floor(Math.random() * (await Workshop.count())),
  });
  const HardwareFastener1 = await HardwareFasteners.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (HardwareFastener1?.setWorkshop) {
    await HardwareFastener1.setWorkshop(relatedWorkshop1);
  }

  const relatedWorkshop2 = await Workshop.findOne({
    offset: Math.floor(Math.random() * (await Workshop.count())),
  });
  const HardwareFastener2 = await HardwareFasteners.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (HardwareFastener2?.setWorkshop) {
    await HardwareFastener2.setWorkshop(relatedWorkshop2);
  }
}

async function associateJoineryMethodWithWorkshop() {
  const relatedWorkshop0 = await Workshop.findOne({
    offset: Math.floor(Math.random() * (await Workshop.count())),
  });
  const JoineryMethod0 = await JoineryMethods.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (JoineryMethod0?.setWorkshop) {
    await JoineryMethod0.setWorkshop(relatedWorkshop0);
  }

  const relatedWorkshop1 = await Workshop.findOne({
    offset: Math.floor(Math.random() * (await Workshop.count())),
  });
  const JoineryMethod1 = await JoineryMethods.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (JoineryMethod1?.setWorkshop) {
    await JoineryMethod1.setWorkshop(relatedWorkshop1);
  }

  const relatedWorkshop2 = await Workshop.findOne({
    offset: Math.floor(Math.random() * (await Workshop.count())),
  });
  const JoineryMethod2 = await JoineryMethods.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (JoineryMethod2?.setWorkshop) {
    await JoineryMethod2.setWorkshop(relatedWorkshop2);
  }
}

async function associateMaterialWithWorkshop() {
  const relatedWorkshop0 = await Workshop.findOne({
    offset: Math.floor(Math.random() * (await Workshop.count())),
  });
  const Material0 = await Materials.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Material0?.setWorkshop) {
    await Material0.setWorkshop(relatedWorkshop0);
  }

  const relatedWorkshop1 = await Workshop.findOne({
    offset: Math.floor(Math.random() * (await Workshop.count())),
  });
  const Material1 = await Materials.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Material1?.setWorkshop) {
    await Material1.setWorkshop(relatedWorkshop1);
  }

  const relatedWorkshop2 = await Workshop.findOne({
    offset: Math.floor(Math.random() * (await Workshop.count())),
  });
  const Material2 = await Materials.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Material2?.setWorkshop) {
    await Material2.setWorkshop(relatedWorkshop2);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await BuildPlans.bulkCreate(BuildPlansData);

    await Components.bulkCreate(ComponentsData);

    await HardwareFasteners.bulkCreate(HardwareFastenersData);

    await JoineryMethods.bulkCreate(JoineryMethodsData);

    await Materials.bulkCreate(MaterialsData);

    await Workshop.bulkCreate(WorkshopData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateUserWithWorkshop(),

      // Similar logic for "relation_many"

      // Similar logic for "relation_many"

      // Similar logic for "relation_many"

      // Similar logic for "relation_many"

      await associateBuildPlanWithWorkshop(),

      await associateComponentWithWorkshop(),

      await associateHardwareFastenerWithWorkshop(),

      await associateJoineryMethodWithWorkshop(),

      await associateMaterialWithWorkshop(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('build_plans', null, {});

    await queryInterface.bulkDelete('components', null, {});

    await queryInterface.bulkDelete('hardware_fasteners', null, {});

    await queryInterface.bulkDelete('joinery_methods', null, {});

    await queryInterface.bulkDelete('materials', null, {});

    await queryInterface.bulkDelete('workshop', null, {});
  },
};
