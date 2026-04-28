const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Interaction = sequelize.define(
  'Interaction',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('LIKE', 'DISLIKE', 'COMMENTAIRE', 'SIGNALEMENT'),
      allowNull: false,
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: true, // utilisé pour COMMENTAIRE
    },
    raison: {
      type: DataTypes.TEXT,
      allowNull: true, // utilisé pour SIGNALEMENT
    },
  },
  {
    tableName: 'interactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

module.exports = Interaction;
