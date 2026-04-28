const topicService = require('../services/topic.service');

const getAll = async (req, res, next) => {
  try {
    const topics = await topicService.getAll();
    res.json({ ok: true, topics });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const topic = await topicService.create(req.body.nom, req.body.description);
    res.status(201).json({ ok: true, topic });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const topic = await topicService.update(req.params.id, req.body.nom, req.body.description);
    res.json({ ok: true, topic });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await topicService.remove(req.params.id);
    res.json({ ok: true, message: 'Topic supprimé' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, create, update, remove };
