const sequelize = require('../config/database');
const User = require('./User');
const Topic = require('./Topic');
const Post = require('./Post');
const Interaction = require('./Interaction');
const Notification = require('./Notification');

// ── Associations ──────────────────────────────────────────────

// User <-> Post
User.hasMany(Post, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'user_id', as: 'auteur' });

// Topic <-> Post
Topic.hasMany(Post, { foreignKey: 'topic_id', onDelete: 'RESTRICT' });
Post.belongsTo(Topic, { foreignKey: 'topic_id', as: 'topic' });

// User <-> Interaction
User.hasMany(Interaction, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Interaction.belongsTo(User, { foreignKey: 'user_id', as: 'auteur' });

// Post <-> Interaction
Post.hasMany(Interaction, { foreignKey: 'post_id', onDelete: 'CASCADE' });
Interaction.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

// User <-> Notification
User.hasMany(Notification, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'destinataire' });

// User <-> Notification (expéditeur)
User.hasMany(Notification, { foreignKey: 'from_user_id', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'from_user_id', as: 'expediteur' });

// Post <-> Notification
Post.hasMany(Notification, { foreignKey: 'post_id', onDelete: 'CASCADE' });
Notification.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

module.exports = { sequelize, User, Topic, Post, Interaction, Notification };
