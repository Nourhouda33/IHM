const interactionService = require('../services/interaction.service');

const add = async (req, res, next) => {
  try {
    const { post_id, type, contenu, raison } = req.body;
    const interaction = await interactionService.addInteraction({
      user_id: req.user.id,
      post_id,
      type,
      contenu,
      raison,
    });
    res.status(201).json({ ok: true, interaction });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await interactionService.deleteInteraction(req.params.id, req.user.id, req.user.role);
    res.json({ ok: true, message: 'Interaction supprimée' });
  } catch (err) {
    next(err);
  }
};

const signalements = async (req, res, next) => {
  try {
    const data = await interactionService.getSignalements();
    res.json({ ok: true, signalements: data });
  } catch (err) {
    next(err);
  }
};

const getComments = async (req, res, next) => {
  try {
    const data = await interactionService.getComments(req.params.postId);
    res.json({ ok: true, comments: data });
  } catch (err) {
    next(err);
  }
};

const getLikedPosts = async (req, res, next) => {
  try {
    const data = await interactionService.getLikedPosts(req.user.id);
    res.json({ ok: true, posts: data });
  } catch (err) {
    next(err);
  }
};

const ignorerSignalement = async (req, res, next) => {
  try {
    await interactionService.ignorerSignalement(req.params.id);
    res.json({ ok: true, message: 'Signalement ignoré' });
  } catch (err) { next(err); }
};

const supprimerPostSignale = async (req, res, next) => {
  try {
    await interactionService.supprimerPostSignale(req.params.id, req.user.id);
    res.json({ ok: true, message: 'Post supprimé' });
  } catch (err) { next(err); }
};

const suspendreUser = async (req, res, next) => {
  try {
    const result = await interactionService.suspendreUser(req.params.id, req.user.id);
    res.json({ ok: true, message: `Utilisateur ${result.pseudo} suspendu`, pseudo: result.pseudo });
  } catch (err) { next(err); }
};

module.exports = { add, remove, signalements, getComments, getLikedPosts, ignorerSignalement, supprimerPostSignale, suspendreUser };
