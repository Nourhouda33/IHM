/**
 * Migration : ajoute le champ `suspendu` à la table users
 * Run: node scripts/addSuspenduField.js
 */
const sequelize = require('../config/database');

(async () => {
  try {
    await sequelize.authenticate();
    const qi = sequelize.getQueryInterface();
    const tableDesc = await qi.describeTable('users');
    
    if (!tableDesc.suspendu) {
      await qi.addColumn('users', 'suspendu', {
        type: require('sequelize').DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      });
      console.log('✅ Champ suspendu ajouté à la table users');
    } else {
      console.log('ℹ️  Champ suspendu existe déjà');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
})();
