const { Topic } = require('../models');

const getAll = () => Topic.findAll({ order: [['nom', 'ASC']] });

const create = (nom, description) => Topic.create({ nom, description });

const update = async (id, nom, description) => {
  const topic = await Topic.findByPk(id);
  if (!topic) throw { status: 404, message: 'Topic introuvable' };
  await topic.update({ nom, description });
  return topic;
};

const remove = async (id) => {
  const topic = await Topic.findByPk(id);
  if (!topic) throw { status: 404, message: 'Topic introuvable' };
  await topic.destroy();
};

module.exports = { getAll, create, update, remove };
