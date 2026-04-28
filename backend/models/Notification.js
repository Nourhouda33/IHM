const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define(
  'Notification',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Utilisateur qui reçoit la notification',
    },
    from_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Utilisateur qui a déclenché la notification',
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Post concerné par la notification',
    },
    type: {
      type: DataTypes.ENUM(
        'LIKE',
        'DISLIKE',
        'COMMENTAIRE',
        'SIGNALEMENT',
        'POST_VALIDE',
        'POST_REJETE',
        'NOUVEAU_POST',
        'NOUVEAU_MODERATEUR'
      ),
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Message de la notification',
    },
    lu: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'La notification a été lue',
    },
  },
  {
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

module.exports = Notification;
