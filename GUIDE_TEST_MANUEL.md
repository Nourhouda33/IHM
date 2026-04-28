# 🧪 GUIDE DE TEST MANUEL - Hkeya

## 🎯 OBJECTIF

Tester toutes les fonctionnalités pour s'assurer qu'il n'y a aucun bug.

---

## ✅ TEST 1 : AUTHENTIFICATION

### 1.1 Inscription
1. Ouvrez http://localhost:5174
2. Cliquez sur "S'inscrire"
3. Remplissez le formulaire :
   - Nom : Test
   - Prénom : User
   - Email : test@test.tn
   - Pseudo : TestUser123
   - Mot de passe : Test123!
4. Cliquez "S'inscrire"

**Résultat attendu** : ✅ Compte créé, redirection vers l'accueil

### 1.2 Connexion
1. Déconnectez-vous
2. Connectez-vous avec : `test@test.tn` / `Test123!`

**Résultat attendu** : ✅ Connexion réussie

### 1.3 Déconnexion
1. Cliquez sur votre avatar (en haut à droite)
2. Cliquez "Logout"

**Résultat attendu** : ✅ Déconnexion, retour à la page de connexion

---

## ✅ TEST 2 : POSTS (Membre)

### 2.1 Créer un post
1. Connectez-vous : `user1@hkeya.tn` / `User123!`
2. Cliquez sur "Composer" ou le bouton "+"
3. Sélectionnez un topic : "Études"
4. Écrivez : "Ceci est un test de post"
5. Cliquez "Publier"

**Résultat attendu** : ✅ Post créé (en attente de validation)

### 2.2 Voir mes posts
1. Allez dans "Profil"
2. Onglet "Publications"

**Résultat attendu** : ✅ Vous voyez votre post avec statut "En attente"

### 2.3 Liker un post
1. Allez sur "Accueil"
2. Cliquez sur le bouton "👍" d'un post

**Résultat attendu** : ✅ Like ajouté, compteur incrémenté

### 2.4 Commenter un post
1. Cliquez sur le bouton "💬" d'un post
2. Écrivez un commentaire
3. Appuyez sur Entrée

**Résultat attendu** : ✅ Commentaire ajouté

---

## ✅ TEST 3 : MODÉRATION (Modérateur)

### 3.1 Voir les posts en attente
1. Déconnectez-vous
2. Connectez-vous : `moderateur@hkeya.tn` / `Modo123!`
3. Allez dans "Modération"
4. Onglet "File d'attente"

**Résultat attendu** : ✅ Vous voyez le post de user1

### 3.2 Valider un post
1. Cliquez sur le post de user1
2. Cliquez "Accepter"

**Résultat attendu** : ✅ Post validé, disparaît de la file

### 3.3 Vérifier la notification
1. Déconnectez-vous
2. Connectez-vous : `user1@hkeya.tn` / `User123!`
3. Cliquez sur l'icône 🔔

**Résultat attendu** : ✅ Notification "Votre publication a été validée"

### 3.4 Rejeter un post
1. Connectez-vous : `user1@hkeya.tn` / `User123!`
2. Créez un nouveau post : "Post à rejeter"
3. Déconnectez-vous
4. Connectez-vous : `moderateur@hkeya.tn` / `Modo123!`
5. Allez dans "Modération"
6. Cliquez "Rejeter" sur le post

**Résultat attendu** : ✅ Post supprimé

### 3.5 Vérifier la notification de rejet
1. Déconnectez-vous
2. Connectez-vous : `user1@hkeya.tn` / `User123!`
3. Cliquez sur 🔔

**Résultat attendu** : ✅ Notification "Votre publication a été rejetée"

---

## ✅ TEST 4 : ADMINISTRATION (Admin)

### 4.1 Voir les utilisateurs
1. Connectez-vous : `admin@hkeya.tn` / `Admin123!`
2. Allez dans "Administration"
3. Onglet "Utilisateurs"

**Résultat attendu** : ✅ Liste de tous les utilisateurs

### 4.2 Changer le rôle d'un utilisateur
1. Trouvez user1 dans la liste
2. Cliquez "Changer rôle"

**Résultat attendu** : ✅ Rôle changé (Membre → Modérateur ou vice-versa)

### 4.3 Voir les topics
1. Onglet "Topics"

**Résultat attendu** : ✅ Liste des 4 topics

### 4.4 Voir les statistiques
1. Onglet "Statistiques"

**Résultat attendu** : ✅ Compteurs corrects (utilisateurs, posts, topics)

---

## ✅ TEST 5 : NOTIFICATIONS

### 5.1 Notification de like
1. Connectez-vous : `user1@hkeya.tn` / `User123!`
2. Créez un post
3. Déconnectez-vous
4. Connectez-vous : `user2@hkeya.tn` / `User123!`
5. Likez le post de user1
6. Déconnectez-vous
7. Connectez-vous : `user1@hkeya.tn` / `User123!`
8. Cliquez sur 🔔

**Résultat attendu** : ✅ Notification "AmiraG a aimé votre publication"

### 5.2 Notification de commentaire
1. Connectez-vous : `user2@hkeya.tn` / `User123!`
2. Commentez un post de user1
3. Déconnectez-vous
4. Connectez-vous : `user1@hkeya.tn` / `User123!`
5. Cliquez sur 🔔

**Résultat attendu** : ✅ Notification "AmiraG a commenté votre publication"

### 5.3 Badge de notifications
1. Vérifiez le badge rouge 🔴 en haut à droite

**Résultat attendu** : ✅ Affiche le nombre de notifications non lues

### 5.4 Marquer comme lu
1. Cliquez sur une notification

**Résultat attendu** : ✅ Notification marquée comme lue, badge mis à jour

### 5.5 Tout marquer comme lu
1. Cliquez "Tout marquer lu"

**Résultat attendu** : ✅ Toutes les notifications marquées, badge disparaît

---

## ✅ TEST 6 : TOPICS

### 6.1 Filtrer par topic
1. Dans la sidebar, cliquez sur "Technologie"

**Résultat attendu** : ✅ Seuls les posts du topic Technologie s'affichent

### 6.2 Voir tous les topics
1. Cliquez sur "Topics" dans la sidebar

**Résultat attendu** : ✅ Liste de tous les topics

---

## ✅ TEST 7 : RECHERCHE

### 7.1 Rechercher un post
1. Allez dans "Rechercher"
2. Tapez un mot-clé

**Résultat attendu** : ✅ Posts correspondants affichés

---

## ✅ TEST 8 : PROFIL

### 8.1 Voir son profil
1. Allez dans "Profil"

**Résultat attendu** : ✅ Informations correctes (pseudo, rôle, stats)

### 8.2 Voir ses publications
1. Onglet "Publications"

**Résultat attendu** : ✅ Liste de vos posts

---

## ✅ TEST 9 : SÉCURITÉ

### 9.1 Accès non autorisé (Modération)
1. Connectez-vous : `user1@hkeya.tn` / `User123!` (membre)
2. Essayez d'aller dans "Modération"

**Résultat attendu** : ✅ Bouton "Modération" caché ou accès refusé

### 9.2 Accès non autorisé (Admin)
1. Connectez-vous : `moderateur@hkeya.tn` / `Modo123!` (modérateur)
2. Essayez d'aller dans "Administration"

**Résultat attendu** : ✅ Bouton "Administration" caché ou accès refusé

### 9.3 Token expiré
1. Attendez 7 jours (ou modifiez JWT_EXPIRES_IN à 1m)
2. Essayez d'accéder à une page

**Résultat attendu** : ✅ Redirection vers login avec message "Session expirée"

---

## ✅ TEST 10 : RESPONSIVE

### 10.1 Mobile
1. Ouvrez les DevTools (F12)
2. Mode responsive (iPhone, Android)

**Résultat attendu** : ✅ Interface adaptée au mobile

### 10.2 Tablette
1. Mode iPad

**Résultat attendu** : ✅ Interface adaptée à la tablette

---

## 📊 CHECKLIST FINALE

| Test | Statut | Commentaire |
|------|--------|-------------|
| Inscription | ⬜ | |
| Connexion | ⬜ | |
| Déconnexion | ⬜ | |
| Créer post | ⬜ | |
| Liker post | ⬜ | |
| Commenter post | ⬜ | |
| Valider post (modo) | ⬜ | |
| Rejeter post (modo) | ⬜ | |
| Notification validation | ⬜ | |
| Notification rejet | ⬜ | |
| Notification like | ⬜ | |
| Notification commentaire | ⬜ | |
| Badge notifications | ⬜ | |
| Marquer lu | ⬜ | |
| Changer rôle (admin) | ⬜ | |
| Voir utilisateurs (admin) | ⬜ | |
| Voir topics (admin) | ⬜ | |
| Filtrer par topic | ⬜ | |
| Recherche | ⬜ | |
| Profil | ⬜ | |
| Sécurité accès | ⬜ | |
| Responsive mobile | ⬜ | |

---

## 🎯 RÉSULTAT

**Tests réussis** : __ / 22

**Bugs trouvés** : __

**Statut** : ⬜ Tous les tests passent ⬜ Bugs à corriger

---

## 📝 NOTES

Notez ici les bugs trouvés :

1. 
2. 
3. 

---

**Date du test** : __________
**Testeur** : __________
