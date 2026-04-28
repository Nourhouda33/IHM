const router = require('express').Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { Op } = require('sequelize');
const { User, Post, Topic, Interaction } = require('../models');

// GET /api/search?q=keyword
router.get('/', authenticate, async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q || q.length < 2) {
      return res.json({ ok: true, users: [], posts: [], topics: [] });
    }

    const like = { [Op.like]: `%${q}%` };

    // Search users by pseudo
    const users = await User.findAll({
      where: { pseudo: like, suspendu: false },
      attributes: ['id', 'pseudo', 'role', 'created_at'],
      limit: 5,
    });

    // Search posts by texte (approved only)
    const posts = await Post.findAll({
      where: { texte: like, statut: true },
      include: [
        { model: User,  as: 'auteur', attributes: ['id', 'pseudo'] },
        { model: Topic, as: 'topic',  attributes: ['id', 'nom'] },
        { model: Interaction, as: 'Interactions', attributes: ['id', 'type'] },
      ],
      order: [['created_at', 'DESC']],
      limit: 10,
    });

    // Search topics by nom
    const topics = await Topic.findAll({
      where: { nom: like },
      limit: 4,
    });

    const roleMap = { ADMIN: 'Administrateur', MODERATEUR: 'Modérateur', CLIENT: 'Membre' };

    res.json({
      ok: true,
      users: users.map(u => ({
        id: u.id,
        pseudo: u.pseudo,
        role: roleMap[u.role] || u.role,
        avatar: u.pseudo.charAt(0).toUpperCase(),
      })),
      posts: posts.map(p => {
        const interactions = p.Interactions || [];
        const j = p.toJSON();
        return {
          id: j.id,
          texte: j.texte,
          author: j.auteur?.pseudo || 'Anonyme',
          authorAvatar: (j.auteur?.pseudo || 'A').charAt(0).toUpperCase(),
          topic: j.topic?.nom || '',
          createdAt: j.created_at,
          likesCount: interactions.filter(i => i.type === 'LIKE').length,
          commentsCount: interactions.filter(i => i.type === 'COMMENTAIRE').length,
        };
      }),
      topics: topics.map(t => ({ id: t.id, nom: t.nom })),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
