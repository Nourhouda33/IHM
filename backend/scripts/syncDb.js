require('dotenv').config();
const { sequelize } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion MySQL OK');
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synchronisées');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur sync DB :', err.message);
    process.exit(1);
  }
})();
