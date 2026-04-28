const sequelize = require('../config/database');
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.query('ALTER TABLE posts MODIFY COLUMN image TEXT NULL');
    console.log('✅ Colonne image changée en TEXT');
    process.exit(0);
  } catch(e) { console.error('❌', e.message); process.exit(1); }
})();
