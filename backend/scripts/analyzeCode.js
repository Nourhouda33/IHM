require('dotenv').config();
const { sequelize, User, Topic, Post, Interaction, Notification } = require('../models');

/**
 * Script d'analyse pour détecter les bugs et erreurs
 */
const analyzeCode = async () => {
  const errors = [];
  const warnings = [];
  const success = [];

  console.log('🔍 ANALYSE DU CODE - Détection de bugs\n');

  try {
    // ── 1. Test connexion base de données ──
    console.log('1️⃣ Test connexion MySQL...');
    await sequelize.authenticate();
    success.push('✅ Connexion MySQL OK');

    // ── 2. Vérifier que toutes les tables existent ──
    console.log('2️⃣ Vérification des tables...');
    const [tables] = await sequelize.query("SHOW TABLES");
    const tableNames = tables.map(t => Object.values(t)[0]);
    
    const requiredTables = ['users', 'topics', 'posts', 'interactions', 'notifications'];
    requiredTables.forEach(table => {
      if (tableNames.includes(table)) {
        success.push(`✅ Table ${table} existe`);
      } else {
        errors.push(`❌ Table ${table} manquante`);
      }
    });

    // ── 3. Vérifier les modèles Sequelize ──
    console.log('3️⃣ Vérification des modèles...');
    try {
      await User.findOne({ limit: 1 });
      success.push('✅ Modèle User OK');
    } catch (e) {
      errors.push(`❌ Modèle User: ${e.message}`);
    }

    try {
      await Topic.findOne({ limit: 1 });
      success.push('✅ Modèle Topic OK');
    } catch (e) {
      errors.push(`❌ Modèle Topic: ${e.message}`);
    }

    try {
      await Post.findOne({ limit: 1 });
      success.push('✅ Modèle Post OK');
    } catch (e) {
      errors.push(`❌ Modèle Post: ${e.message}`);
    }

    try {
      await Interaction.findOne({ limit: 1 });
      success.push('✅ Modèle Interaction OK');
    } catch (e) {
      errors.push(`❌ Modèle Interaction: ${e.message}`);
    }

    try {
      await Notification.findOne({ limit: 1 });
      success.push('✅ Modèle Notification OK');
    } catch (e) {
      errors.push(`❌ Modèle Notification: ${e.message}`);
    }

    // ── 4. Vérifier les associations ──
    console.log('4️⃣ Vérification des associations...');
    try {
      await Post.findOne({ include: [{ model: User, as: 'auteur' }], limit: 1 });
      success.push('✅ Association Post -> User OK');
    } catch (e) {
      errors.push(`❌ Association Post -> User: ${e.message}`);
    }

    try {
      await Post.findOne({ include: [{ model: Topic, as: 'topic' }], limit: 1 });
      success.push('✅ Association Post -> Topic OK');
    } catch (e) {
      errors.push(`❌ Association Post -> Topic: ${e.message}`);
    }

    try {
      await Notification.findOne({ include: [{ model: User, as: 'expediteur' }], limit: 1 });
      success.push('✅ Association Notification -> User (expediteur) OK');
    } catch (e) {
      errors.push(`❌ Association Notification -> User (expediteur): ${e.message}`);
    }

    // ── 5. Vérifier les données ──
    console.log('5️⃣ Vérification des données...');
    const userCount = await User.count();
    const topicCount = await Topic.count();
    const postCount = await Post.count();
    const notifCount = await Notification.count();

    if (userCount === 0) {
      warnings.push('⚠️  Aucun utilisateur dans la base (exécutez: npm run seed)');
    } else {
      success.push(`✅ ${userCount} utilisateurs dans la base`);
    }

    if (topicCount === 0) {
      warnings.push('⚠️  Aucun topic dans la base (exécutez: npm run seed)');
    } else {
      success.push(`✅ ${topicCount} topics dans la base`);
    }

    if (postCount === 0) {
      warnings.push('⚠️  Aucun post dans la base (exécutez: npm run seed)');
    } else {
      success.push(`✅ ${postCount} posts dans la base`);
    }

    success.push(`✅ ${notifCount} notifications dans la base`);

    // ── 6. Vérifier les rôles ──
    console.log('6️⃣ Vérification des rôles...');
    const adminCount = await User.count({ where: { role: 'ADMIN' } });
    const modoCount = await User.count({ where: { role: 'MODERATEUR' } });
    const clientCount = await User.count({ where: { role: 'CLIENT' } });

    if (adminCount === 0) {
      warnings.push('⚠️  Aucun admin dans la base');
    } else {
      success.push(`✅ ${adminCount} admin(s)`);
    }

    if (modoCount === 0) {
      warnings.push('⚠️  Aucun modérateur dans la base');
    } else {
      success.push(`✅ ${modoCount} modérateur(s)`);
    }

    success.push(`✅ ${clientCount} client(s)`);

    // ── 7. Vérifier les posts en attente ──
    console.log('7️⃣ Vérification des posts en attente...');
    const pendingCount = await Post.count({ where: { statut: false } });
    const approvedCount = await Post.count({ where: { statut: true } });

    success.push(`✅ ${pendingCount} post(s) en attente`);
    success.push(`✅ ${approvedCount} post(s) validé(s)`);

    // ── 8. Test création notification ──
    console.log('8️⃣ Test création notification...');
    if (userCount >= 2 && postCount >= 1) {
      const users = await User.findAll({ limit: 2 });
      const post = await Post.findOne();
      
      try {
        const testNotif = await Notification.create({
          user_id: users[0].id,
          from_user_id: users[1].id,
          post_id: post.id,
          type: 'LIKE',
          message: 'Test notification',
          lu: false,
        });
        await testNotif.destroy(); // Supprimer immédiatement
        success.push('✅ Création de notification fonctionne');
      } catch (e) {
        errors.push(`❌ Création notification: ${e.message}`);
      }
    } else {
      warnings.push('⚠️  Pas assez de données pour tester les notifications');
    }

  } catch (err) {
    errors.push(`❌ Erreur globale: ${err.message}`);
  }

  // ── RÉSULTATS ──
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSULTATS DE L\'ANALYSE');
  console.log('='.repeat(60) + '\n');

  if (success.length > 0) {
    console.log('✅ SUCCÈS (' + success.length + ')');
    success.forEach(s => console.log('   ' + s));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('⚠️  AVERTISSEMENTS (' + warnings.length + ')');
    warnings.forEach(w => console.log('   ' + w));
    console.log('');
  }

  if (errors.length > 0) {
    console.log('❌ ERREURS (' + errors.length + ')');
    errors.forEach(e => console.log('   ' + e));
    console.log('');
  }

  // ── CONCLUSION ──
  console.log('='.repeat(60));
  if (errors.length === 0 && warnings.length === 0) {
    console.log('🎉 AUCUN BUG DÉTECTÉ ! Le code est propre.');
  } else if (errors.length === 0) {
    console.log('✅ Aucune erreur critique, mais quelques avertissements.');
  } else {
    console.log('❌ Des erreurs ont été détectées. Corrigez-les avant de continuer.');
  }
  console.log('='.repeat(60));

  process.exit(errors.length > 0 ? 1 : 0);
};

analyzeCode();
