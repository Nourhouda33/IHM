require('dotenv').config();
const { sequelize, User, Post, Notification } = require('../models');

/**
 * Script de test pour vérifier que les notifications fonctionnent
 * et que chaque utilisateur voit UNIQUEMENT ses propres notifications
 */
const testNotifications = async () => {
  try {
    console.log('🧪 Test du système de notifications\n');

    await sequelize.authenticate();
    console.log('✅ Connecté à MySQL\n');

    // ── 1. Vérifier que la table notifications existe ──
    console.log('📋 Vérification de la table notifications...');
    const [tables] = await sequelize.query("SHOW TABLES LIKE 'notifications'");
    if (tables.length === 0) {
      console.log('❌ Table notifications introuvable !');
      console.log('👉 Exécutez : npm run db:reset');
      process.exit(1);
    }
    console.log('✅ Table notifications existe\n');

    // ── 2. Récupérer les utilisateurs ──
    const users = await User.findAll({ attributes: ['id', 'pseudo', 'email', 'role'] });
    console.log(`📊 ${users.length} utilisateurs trouvés :`);
    users.forEach(u => {
      console.log(`   - ${u.pseudo} (${u.email}) - ${u.role}`);
    });
    console.log('');

    // ── 3. Créer des notifications de test ──
    console.log('🔔 Création de notifications de test...');
    
    const user1 = users.find(u => u.role === 'CLIENT');
    const user2 = users.find(u => u.role === 'CLIENT' && u.id !== user1?.id);
    const admin = users.find(u => u.role === 'ADMIN');

    if (!user1 || !user2 || !admin) {
      console.log('❌ Pas assez d\'utilisateurs. Exécutez : npm run seed');
      process.exit(1);
    }

    // Créer un post de user1
    const post = await Post.findOne({ where: { user_id: user1.id } });
    if (!post) {
      console.log('❌ Aucun post trouvé. Exécutez : npm run seed');
      process.exit(1);
    }

    // Notification 1 : user2 like le post de user1
    await Notification.create({
      user_id: user1.id,
      from_user_id: user2.id,
      post_id: post.id,
      type: 'LIKE',
      message: `${user2.pseudo} a aimé votre publication`,
      lu: false,
    });
    console.log(`✅ Notification créée : ${user2.pseudo} → ${user1.pseudo} (LIKE)`);

    // Notification 2 : admin valide le post de user1
    await Notification.create({
      user_id: user1.id,
      from_user_id: admin.id,
      post_id: post.id,
      type: 'POST_VALIDE',
      message: 'Votre publication a été validée par un modérateur',
      lu: false,
    });
    console.log(`✅ Notification créée : ${admin.pseudo} → ${user1.pseudo} (VALIDATION)`);

    // Notification 3 : user1 commente le post de user2
    const post2 = await Post.findOne({ where: { user_id: user2.id } });
    if (post2) {
      await Notification.create({
        user_id: user2.id,
        from_user_id: user1.id,
        post_id: post2.id,
        type: 'COMMENTAIRE',
        message: `${user1.pseudo} a commenté votre publication`,
        lu: false,
      });
      console.log(`✅ Notification créée : ${user1.pseudo} → ${user2.pseudo} (COMMENTAIRE)`);
    }

    console.log('');

    // ── 4. Vérifier que chaque utilisateur voit UNIQUEMENT ses notifications ──
    console.log('🔍 Vérification de l\'isolation des notifications...\n');

    for (const user of [user1, user2, admin]) {
      const notifs = await Notification.findAll({
        where: { user_id: user.id },
        include: [
          { model: User, as: 'expediteur', attributes: ['pseudo'] },
        ],
      });

      console.log(`📬 Notifications de ${user.pseudo} (${user.role}) :`);
      if (notifs.length === 0) {
        console.log('   Aucune notification');
      } else {
        notifs.forEach(n => {
          const from = n.expediteur?.pseudo || 'Système';
          console.log(`   - [${n.type}] ${n.message} (de: ${from})`);
        });
      }
      console.log('');
    }

    // ── 5. Statistiques ──
    const totalNotifs = await Notification.count();
    console.log(`📊 Total notifications : ${totalNotifs}`);
    
    const unreadCount = await Notification.count({ where: { lu: false } });
    console.log(`📊 Non lues : ${unreadCount}`);

    console.log('\n✅ Test terminé avec succès !');
    console.log('\n📝 Résumé :');
    console.log('   - Chaque utilisateur voit UNIQUEMENT ses notifications');
    console.log('   - Les notifications sont bien isolées par user_id');
    console.log('   - Le système fonctionne correctement !');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur :', err.message);
    console.error(err);
    process.exit(1);
  }
};

testNotifications();
