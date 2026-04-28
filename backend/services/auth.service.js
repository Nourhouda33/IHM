const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Formate l'utilisateur pour le frontend (ajoute les alias attendus)
const formatUser = (user) => {
  const data = typeof user.toJSON === 'function' ? user.toJSON() : { ...user };
  delete data.motDePasse;

  // Mapping rôles backend → frontend (whisper-original.html attend ces valeurs)
  const roleMap = {
    'ADMIN': 'Administrateur',
    'MODERATEUR': 'Moderateur',
    'CLIENT': 'Membre',
  };

  return {
    ...data,
    username: data.pseudo,
    fullName: `${data.prenom} ${data.nom}`,
    firstName: data.prenom,
    lastName: data.nom,
    phone: data.telephone,
    avatar: data.avatar || data.pseudo?.charAt(0).toUpperCase() || 'U',
    role: roleMap[data.role] || data.role,  // 'ADMIN' → 'Administrateur'
    roleRaw: data.role,                      // garder le rôle original aussi
  };
};

const register = async ({ nom, lastName, prenom, firstName, email, telephone, phone, motDePasse, password, pseudo, username, avatar, veut_etre_moderateur }) => {
  // Support both formats: frontend and backend
  const nomToUse = nom || lastName;
  const prenomToUse = prenom || firstName;
  const pseudoToUse = pseudo || username;
  const passwordToUse = motDePasse || password;
  const phoneToUse = telephone || phone;

  if (!nomToUse || !prenomToUse || !pseudoToUse || !email || !passwordToUse) {
    throw { status: 400, message: 'Tous les champs requis doivent être remplis' };
  }

  const hash = await bcrypt.hash(passwordToUse, 12);

  const user = await User.create({
    nom: nomToUse,
    prenom: prenomToUse,
    email: email.toLowerCase().trim(),
    telephone: phoneToUse || null,
    motDePasse: hash,
    pseudo: pseudoToUse,
    avatar: avatar || null,
    veut_etre_moderateur: veut_etre_moderateur || false,
    role: 'CLIENT',
  });

  const token = generateToken(user);
  const { motDePasse: _, ...userData } = user.toJSON();
  return { token, user: formatUser(user) };
};

const login = async ({ email, identifier, motDePasse, password }) => {
  // Support both formats: frontend (identifier/password) and backend (email/motDePasse)
  const emailToUse = email || identifier;
  const passwordToUse = motDePasse || password;

  if (!emailToUse || !passwordToUse) {
    throw { status: 400, message: 'Email/identifiant et mot de passe requis' };
  }

  const user = await User.findOne({ where: { email: emailToUse.toLowerCase().trim() } });
  if (!user) throw { status: 401, message: 'Email ou mot de passe incorrect' };

  const valid = await bcrypt.compare(passwordToUse, user.motDePasse);
  if (!valid) throw { status: 401, message: 'Email ou mot de passe incorrect' };

  if (user.suspendu) throw { status: 403, message: 'Votre compte a été suspendu suite à un signalement. Contactez l\'administration.' };

  const token = generateToken(user);
  return { token, user: formatUser(user) };
};

const updateProfile = async (userId, { prenom, nom, pseudo }) => {
  const user = await User.findByPk(userId);
  if (!user) throw { status: 404, message: 'Utilisateur introuvable' };

  if (pseudo && pseudo !== user.pseudo) {
    const existing = await User.findOne({ where: { pseudo } });
    if (existing) throw { status: 409, message: 'Ce pseudonyme est déjà utilisé' };
  }

  await user.update({ prenom, nom, pseudo });
  return formatUser(user);
};

const changePassword = async (userId, { oldPassword, newPassword }) => {
  const user = await User.findByPk(userId);
  if (!user) throw { status: 404, message: 'Utilisateur introuvable' };

  const isValid = await bcrypt.compare(oldPassword, user.motDePasse);
  if (!isValid) throw { status: 401, message: 'Mot de passe actuel incorrect' };

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({ motDePasse: hashedPassword });
};

module.exports = { register, login, updateProfile, changePassword };
