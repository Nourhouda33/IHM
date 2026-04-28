require('dotenv').config();
const { sequelize } = require('../models');

/**
 * Script pour réinitialiser complètement la base de données
 * ⚠️ ATTENTION : Supprime toutes les tables et données !
 */
const resetDatabase = async () => {
  try {
    console.log('🔄 Connexion à MySQL...');
    await sequelize.authenticate();
    console.log('✅ Connecté');

    console.log('🗑️  Suppression de toutes les tables...');
    await sequelize.drop();
    console.log('✅ Tables supprimées');

    console.log('🔨 Création des tables...');
    await sequelize.sync({ force: true });
    console.log('✅ Tables créées avec succès');

    console.log('\n✨ Base de données réinitialisée !');
    console.log('👉 Exécutez maintenant : npm run seed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur :', error.message);
    process.exit(1);
  }
};

resetDatabase();
