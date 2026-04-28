require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Topic, Post, Interaction } = require('../models');

const seed = async () => {
  try {
    console.log('🌱 Démarrage du seed...');

    // Sync DB
    await sequelize.sync({ force: true });
    console.log('✅ Tables recréées');

    // ── 1. Créer des utilisateurs ──────────────────────────
    const hashAdmin = await bcrypt.hash('Admin123!', 12);
    const hashModo = await bcrypt.hash('Modo123!', 12);
    const hashUser = await bcrypt.hash('User123!', 12);

    const admin = await User.create({
      nom: 'Kchaou',
      prenom: 'Mahmoud',
      email: 'admin@hkeya.tn',
      telephone: '+21620000001',
      motDePasse: hashAdmin,
      pseudo: 'AdminHkeya',
      avatar: 'M',
      veut_etre_moderateur: false,
      role: 'ADMIN',
    });

    const modo = await User.create({
      nom: 'Ben Ali',
      prenom: 'Sarra',
      email: 'moderateur@hkeya.tn',
      telephone: '+21620000002',
      motDePasse: hashModo,
      pseudo: 'ModSarra',
      avatar: 'S',
      veut_etre_moderateur: true,
      role: 'MODERATEUR',
    });

    const user1 = await User.create({
      nom: 'Trabelsi',
      prenom: 'Yassine',
      email: 'user1@hkeya.tn',
      telephone: '+21620000003',
      motDePasse: hashUser,
      pseudo: 'YassineT',
      avatar: 'Y',
      veut_etre_moderateur: false,
      role: 'CLIENT',
    });

    const user2 = await User.create({
      nom: 'Gharbi',
      prenom: 'Amira',
      email: 'user2@hkeya.tn',
      telephone: null,
      motDePasse: hashUser,
      pseudo: 'AmiraG',
      avatar: 'A',
      veut_etre_moderateur: true,
      role: 'CLIENT',
    });

    console.log('✅ 4 utilisateurs créés');

    // ── 2. Créer des topics ────────────────────────────────
    const topicEtudes = await Topic.create({
      nom: 'Études',
      description: 'Discussions sur les études, stages, universités',
    });

    const topicTech = await Topic.create({
      nom: 'Technologie',
      description: 'Programmation, IA, cybersécurité',
    });

    const topicSante = await Topic.create({
      nom: 'Santé',
      description: 'Santé mentale, bien-être, conseils médicaux',
    });

    const topicLoi = await Topic.create({
      nom: 'Loi et droit',
      description: 'Questions juridiques, droits, procédures',
    });

    console.log('✅ 4 topics créés');

    // ── 3. Créer des posts ─────────────────────────────────
    const post1 = await Post.create({
      user_id: user1.id,
      topic_id: topicEtudes.id,
      texte: 'يخي فما شركة تقبل stagiaire مغير اكتاف ؟',
      image: null,
      statut: true,
    });

    const post2 = await Post.create({
      user_id: user2.id,
      topic_id: topicTech.id,
      texte: 'كيفاه تتعلم بيراتاج… لينك في أول كومنتار 👇',
      image: null,
      statut: true,
    });

    const post3 = await Post.create({
      user_id: user1.id,
      topic_id: topicSante.id,
      texte: 'ماعاش نحب الخروج مالدار و نحس عندي رهاب اجتماعي… نحب نعدي عند طبيب و دارنا مازالو مش مقتنعين بالطب النفسي. شنعمل؟',
      image: null,
      statut: true,
    });

    const post4 = await Post.create({
      user_id: user2.id,
      topic_id: topicLoi.id,
      texte: 'السلام عليكم بالله أنا مخطوبة من 2009 لتو لاعرسنا نحب نشكي بيه...',
      image: null,
      statut: false, // en attente de validation
    });

    console.log('✅ 4 posts créés');

    // ── 4. Créer des interactions ──────────────────────────
    await Interaction.create({
      user_id: admin.id,
      post_id: post1.id,
      type: 'LIKE',
    });

    await Interaction.create({
      user_id: modo.id,
      post_id: post1.id,
      type: 'LIKE',
    });

    await Interaction.create({
      user_id: user2.id,
      post_id: post1.id,
      type: 'COMMENTAIRE',
      contenu: 'Essaye chez Vermeg ou Sofrecom !',
    });

    await Interaction.create({
      user_id: admin.id,
      post_id: post2.id,
      type: 'LIKE',
    });

    await Interaction.create({
      user_id: user1.id,
      post_id: post3.id,
      type: 'COMMENTAIRE',
      contenu: 'Courage, consulte un psy en ligne si tu peux pas sortir',
    });

    console.log('✅ 5 interactions créées');

    console.log('\n🎉 Seed terminé avec succès !');
    console.log('\n📌 Comptes de test :');
    console.log('   👑 Admin      → admin@hkeya.tn / Admin123!');
    console.log('   👮 Modérateur → moderateur@hkeya.tn / Modo123!');
    console.log('   👤 User 1     → user1@hkeya.tn / User123!');
    console.log('   👤 User 2     → user2@hkeya.tn / User123!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur seed :', err.message);
    process.exit(1);
  }
};

seed();
