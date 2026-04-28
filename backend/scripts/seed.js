require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Topic, Post, Interaction, Notification } = require('../models');

const seed = async () => {
  try {
    console.log('🌱 Démarrage du seed...');
    await sequelize.sync({ force: true });
    console.log('✅ Tables recréées');

    // ── 1. USERS (12 utilisateurs) ─────────────────────────────────────────
    const hashAdmin = await bcrypt.hash('Admin123!', 12);
    const hashModo  = await bcrypt.hash('Modo123!',  12);
    const hashUser  = await bcrypt.hash('User123!',  12);

    const [admin, modo, modo2, u1, u2, u3, u4, u5, u6, u7, u8, u9] = await User.bulkCreate([
      { nom:'Kchaou',    prenom:'Mahmoud',  email:'admin@hkeya.tn',        telephone:'+21620000001', motDePasse:hashAdmin, pseudo:'AdminHkeya',   avatar:'M', role:'ADMIN',       veut_etre_moderateur:false },
      { nom:'Ben Ali',   prenom:'Sarra',    email:'moderateur@hkeya.tn',   telephone:'+21620000002', motDePasse:hashModo,  pseudo:'ModSarra',     avatar:'S', role:'MODERATEUR',  veut_etre_moderateur:true  },
      { nom:'Mansouri',  prenom:'Karim',    email:'modo2@hkeya.tn',        telephone:'+21620000010', motDePasse:hashModo,  pseudo:'ModKarim',     avatar:'K', role:'MODERATEUR',  veut_etre_moderateur:true  },
      { nom:'Trabelsi',  prenom:'Yassine',  email:'user1@hkeya.tn',        telephone:'+21620000003', motDePasse:hashUser,  pseudo:'YassineT',     avatar:'Y', role:'CLIENT',      veut_etre_moderateur:false },
      { nom:'Gharbi',    prenom:'Amira',    email:'user2@hkeya.tn',        telephone:null,           motDePasse:hashUser,  pseudo:'AmiraG',       avatar:'A', role:'CLIENT',      veut_etre_moderateur:true  },
      { nom:'Bouaziz',   prenom:'Nour',     email:'user3@hkeya.tn',        telephone:'+21621111111', motDePasse:hashUser,  pseudo:'NourB',        avatar:'N', role:'CLIENT',      veut_etre_moderateur:false },
      { nom:'Hamdi',     prenom:'Rami',     email:'user4@hkeya.tn',        telephone:'+21622222222', motDePasse:hashUser,  pseudo:'RamiH',        avatar:'R', role:'CLIENT',      veut_etre_moderateur:false },
      { nom:'Jebali',    prenom:'Lina',     email:'user5@hkeya.tn',        telephone:'+21623333333', motDePasse:hashUser,  pseudo:'LinaJ',        avatar:'L', role:'CLIENT',      veut_etre_moderateur:false },
      { nom:'Chaabane',  prenom:'Mehdi',    email:'user6@hkeya.tn',        telephone:'+21624444444', motDePasse:hashUser,  pseudo:'MehdiC',       avatar:'M', role:'CLIENT',      veut_etre_moderateur:false },
      { nom:'Riahi',     prenom:'Salma',    email:'user7@hkeya.tn',        telephone:'+21625555555', motDePasse:hashUser,  pseudo:'SalmaR',       avatar:'S', role:'CLIENT',      veut_etre_moderateur:false },
      { nom:'Ferchichi', prenom:'Amine',    email:'user8@hkeya.tn',        telephone:'+21626666666', motDePasse:hashUser,  pseudo:'AmineF',       avatar:'A', role:'CLIENT',      veut_etre_moderateur:false },
      { nom:'Belhaj',    prenom:'Yasmine',  email:'user9@hkeya.tn',        telephone:'+21627777777', motDePasse:hashUser,  pseudo:'YasmineB',     avatar:'Y', role:'CLIENT',      veut_etre_moderateur:false },
    ], { returning: true });
    console.log('✅ 12 utilisateurs créés');

    // ── 2. TOPICS (4 topics) ───────────────────────────────────────────────
    const [tEtudes, tTech, tSante, tLoi] = await Topic.bulkCreate([
      { nom:'Études',       description:'Stages, universités, orientation, diplômes' },
      { nom:'Technologie',  description:'Programmation, IA, cybersécurité, startups' },
      { nom:'Santé',        description:'Santé mentale, bien-être, conseils médicaux' },
      { nom:'Loi et droit', description:'Questions juridiques, droits, procédures légales' },
    ], { returning: true });
    console.log('✅ 4 topics créés');

    // ── 3. POSTS (14 posts) ────────────────────────────────────────────────
    const posts = await Post.bulkCreate([
      { user_id:u1.id, topic_id:tEtudes.id,   texte:'يخي فما شركة تقبل stagiaire مغير اكتاف ؟ كل مرة يقولولي ما عندناش وقت نكوّن',                                                                                statut:true  },
      { user_id:u2.id, topic_id:tTech.id,     texte:'كيفاه تتعلم برمتاج بسرعة ؟ أنا بدأت بـ Python بعد ما شفت فيديو على يوتيوب، لينك في أول كومنتار 👇',                                                          statut:true  },
      { user_id:u1.id, topic_id:tSante.id,    texte:'ماعاش نحب الخروج مالدار و نحس عندي رهاب اجتماعي… نحب نعدي عند طبيب و دارنا مازالو مش مقتنعين بالطب النفسي. شنعمل؟',                                        statut:true  },
      { user_id:u2.id, topic_id:tLoi.id,      texte:'السلام عليكم، أنا مخطوبة من 2009 لتو لاعرسنا، نحب نشكي بيه قانونياً. فما حل؟',                                                                               statut:true  },
      { user_id:u3.id, topic_id:tSante.id,    texte:'شنوة رأيكم في الصحة النفسية للشباب التونسي؟ أنا شايف الناس تبدلت بزاف على هذا الموضوع.',                                                                     statut:true  },
      { user_id:u4.id, topic_id:tTech.id,     texte:'نحب نبدأ في الـ freelance بعد ما خلصت الجامعة. فما حد عنده تجربة يشاركها؟ خاصة في المنصات الأجنبية.',                                                       statut:true  },
      { user_id:u5.id, topic_id:tSante.id,    texte:'نحس بإرهاق دائم حتى بعد النوم الكافي. ذهبت للطبيب وقالي كل شيء طبيعي. هل هذا نفسي؟',                                                                        statut:true  },
      { user_id:u6.id, topic_id:tEtudes.id,   texte:'أنا في السنة الثالثة هندسة معلوماتية، نحب نعرف أي تخصص أحسن للمستقبل: AI ولا Cybersecurity؟',                                                               statut:true  },
      { user_id:u7.id, topic_id:tLoi.id,      texte:'صاحبي اشترى سيارة وبعد شهر اكتشف فيها عيب خفي. هل يجمعو يرجعها للبائع قانونياً؟',                                                                           statut:true  },
      { user_id:u8.id, topic_id:tTech.id,     texte:'فما أفلام تونسية حديثة تستاهل المشاهدة؟ نحب نشجع السينما المحلية بصح ما نعرفش من وين نبدأ.',                                                                statut:true  },
      { user_id:u9.id, topic_id:tEtudes.id,   texte:'شنوة الشهادات الأجنبية اللي تفيد في سوق الشغل التونسي؟ خاصة في مجال الـ IT.',                                                                               statut:true  },
      { user_id:u3.id, topic_id:tLoi.id,      texte:'كيفاه نسجل شركة ناشئة في تونس؟ شنوة الإجراءات والتكاليف؟',                                                                                                   statut:true  },
      { user_id:u4.id, topic_id:tSante.id,    texte:'كيفاه تتعامل مع أهل زوجك اللي يتدخلو في كل شيء؟ نحتاج نصايح عملية.',                                                                                        statut:false },
      { user_id:u5.id, topic_id:tTech.id,     texte:'نحب نبني تطبيق موبايل بسيط. أحسن: React Native ولا Flutter؟ وأنا مبتدئ.',                                                                                    statut:false },
    ], { returning: true });
    console.log('✅ 14 posts créés');

    // ── 4. INTERACTIONS (15 interactions) ─────────────────────────────────
    await Interaction.bulkCreate([
      { user_id:admin.id, post_id:posts[0].id, type:'LIKE' },
      { user_id:modo.id,  post_id:posts[0].id, type:'LIKE' },
      { user_id:u2.id,    post_id:posts[0].id, type:'COMMENTAIRE', contenu:'Essaye chez Vermeg ou Sofrecom, ils prennent des stagiaires régulièrement !' },
      { user_id:u3.id,    post_id:posts[0].id, type:'COMMENTAIRE', contenu:'Biat et Tunisie Telecom aussi, j\'ai fait mon stage là-bas.' },
      { user_id:admin.id, post_id:posts[1].id, type:'LIKE' },
      { user_id:u4.id,    post_id:posts[1].id, type:'LIKE' },
      { user_id:u5.id,    post_id:posts[1].id, type:'COMMENTAIRE', contenu:'Moi j\'ai commencé avec freeCodeCamp, c\'est gratuit et bien structuré.' },
      { user_id:u1.id,    post_id:posts[2].id, type:'COMMENTAIRE', contenu:'Courage, consulte un psy en ligne si tu peux pas sortir. Nawat.tn propose des séances à distance.' },
      { user_id:u6.id,    post_id:posts[2].id, type:'LIKE' },
      { user_id:u7.id,    post_id:posts[3].id, type:'LIKE' },
      { user_id:u8.id,    post_id:posts[4].id, type:'LIKE' },
      { user_id:u9.id,    post_id:posts[4].id, type:'COMMENTAIRE', contenu:'Je pense que les mentalités changent surtout dans les grandes villes.' },
      { user_id:u1.id,    post_id:posts[5].id, type:'LIKE' },
      { user_id:u2.id,    post_id:posts[6].id, type:'LIKE' },
      { user_id:u3.id,    post_id:posts[7].id, type:'COMMENTAIRE', contenu:'AI a plus d\'avenir selon moi, surtout avec la demande actuelle du marché.' },
    ]);
    console.log('✅ 15 interactions créées');

    // ── 5. NOTIFICATIONS (10 notifications) ───────────────────────────────
    await Notification.bulkCreate([
      { user_id:u1.id,  from_user_id:admin.id, post_id:posts[0].id, type:'LIKE',        message:'AdminHkeya a aimé votre publication',                    lu:false },
      { user_id:u1.id,  from_user_id:modo.id,  post_id:posts[0].id, type:'LIKE',        message:'ModSarra a aimé votre publication',                      lu:false },
      { user_id:u1.id,  from_user_id:u2.id,    post_id:posts[0].id, type:'COMMENTAIRE', message:'AmiraG a commenté votre publication',                    lu:true  },
      { user_id:u2.id,  from_user_id:admin.id, post_id:posts[1].id, type:'LIKE',        message:'AdminHkeya a aimé votre publication',                    lu:false },
      { user_id:u2.id,  from_user_id:u4.id,    post_id:posts[1].id, type:'LIKE',        message:'RamiH a aimé votre publication',                         lu:true  },
      { user_id:u1.id,  from_user_id:modo.id,  post_id:posts[0].id, type:'POST_VALIDE', message:'Votre publication a été validée par un modérateur',       lu:false },
      { user_id:u2.id,  from_user_id:modo.id,  post_id:posts[1].id, type:'POST_VALIDE', message:'Votre publication a été validée par un modérateur',       lu:true  },
      { user_id:modo.id, from_user_id:u3.id,   post_id:posts[4].id, type:'NOUVEAU_POST',message:'NourB a créé une nouvelle publication en attente de validation', lu:false },
      { user_id:modo.id, from_user_id:u4.id,   post_id:posts[5].id, type:'NOUVEAU_POST',message:'RamiH a créé une nouvelle publication en attente de validation', lu:false },
      { user_id:u1.id,  from_user_id:u3.id,    post_id:posts[2].id, type:'COMMENTAIRE', message:'NourB a commenté votre publication',                     lu:false },
    ]);
    console.log('✅ 10 notifications créées');

    console.log('\n🎉 Seed terminé avec succès !');
    console.log('\n📌 Comptes de test :');
    console.log('   👑 Admin        → admin@hkeya.tn        / Admin123!');
    console.log('   👮 Modérateur 1 → moderateur@hkeya.tn   / Modo123!');
    console.log('   👮 Modérateur 2 → modo2@hkeya.tn        / Modo123!');
    console.log('   👤 Users        → user1..9@hkeya.tn     / User123!');
    console.log('\n📊 Données créées :');
    console.log('   • 12 utilisateurs  (1 admin, 2 modérateurs, 9 membres)');
    console.log('   • 4  topics        (Études, Technologie, Santé, Loi et droit)');
    console.log('   • 14 posts         (12 validés, 2 en attente)');
    console.log('   • 15 interactions  (likes + commentaires)');
    console.log('   • 10 notifications');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur seed :', err.message);
    console.error(err);
    process.exit(1);
  }
};

seed();
