const { Topic, Post } = require('../models');
const { Sequelize } = require('sequelize');

const getAll = async () => {
  const topics = await Topic.findAll({
    attributes: {
      include: [
        [Sequelize.fn('COUNT', Sequelize.col('Posts.id')), 'postCount']
      ]
    },
    include: [{ model: Post, as: 'Posts', attributes: [], required: false }],
    group: ['Topic.id'],
    order: [['nom', 'ASC']],
  });
  return topics.map(t => {
    const j = t.toJSON();
    return { ...j, postCount: parseInt(j.postCount) || 0 };
  });
};

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
