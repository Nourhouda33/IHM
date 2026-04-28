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

module.exports = { add, remove, signalements, getComments };
