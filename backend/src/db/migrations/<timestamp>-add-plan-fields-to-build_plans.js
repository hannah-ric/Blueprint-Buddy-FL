'use strict'

module.exports = {
  up: async (qi, Sequelize) => {
    await qi.addColumn('build_plans', 'prompt', {
      type: Sequelize.TEXT, allowNull: false
    })
    await qi.addColumn('build_plans', 'specs', {
      type: Sequelize.JSONB, allowNull: true
    })
    await qi.addColumn('build_plans', 'components', {
      type: Sequelize.JSONB, allowNull: false
    })
    await qi.addColumn('build_plans', 'materials', {
      type: Sequelize.JSONB, allowNull: false
    })
    await qi.addColumn('build_plans', 'joinery', {
      type: Sequelize.JSONB, allowNull: false
    })
    await qi.addColumn('build_plans', 'hardware', {
      type: Sequelize.JSONB, allowNull: false
    })
    await qi.addColumn('build_plans', 'cutList', {
      type: Sequelize.JSONB, allowNull: false
    })
    await qi.addColumn('build_plans', 'bom', {
      type: Sequelize.JSONB, allowNull: false
    })
    await qi.addColumn('build_plans', 'instructions', {
      type: Sequelize.ARRAY(Sequelize.TEXT), allowNull: false
    })
    await qi.addColumn('build_plans', 'modelUrl', {
      type: Sequelize.STRING, allowNull: false
    })
  },
  down: async (qi) => {
    for (const col of ['prompt','specs','components','materials','joinery','hardware','cutList','bom','instructions','modelUrl']) {
      await qi.removeColumn('build_plans', col)
    }
  }
}
