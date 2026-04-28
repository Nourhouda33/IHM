/**
 * API Loader - Charge les données réelles depuis le backend
 * Ce fichier remplace les données fictives par des appels API
 */

const API_BASE = 'http://localhost:4000/api';

// ═══════════════════════════════════════════════════════════
// HELPER : Récupérer le token
// ═══════════════════════════════════════════════════════════
function getToken() {
  return localStorage.getItem('whisper_api_token_v1');
}

// ═══════════════════════════════════════════════════════════
// CHARGER LES UTILISATEURS (Admin)
// ═══════════════════════════════════════════════════════════
async function loadRealUsers() {
  const token = getToken();
  if (!token) return;

  try {
    const response = await fetch(`${API_BASE}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.status === 401) {
      handleSessionExpired();
      return;
    }

    const data = await response.json();
    if (!data.ok || !data.users) return;

    // Remplir le tableau des utilisateurs
    const tbody = document.querySelector('#admin-users-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    data.users.forEach(user => {
      const roleClass = user.role === 'ADMIN' ? 'sc-admin' : 
                       user.role === 'MODERATEUR' ? 'sc-modo' : 'sc-member';
      const roleText = user.role === 'ADMIN' ? 'Administrateur' :
                      user.role === 'MODERATEUR' ? 'Moderateur' : 'Membre';
      
      const avatar = (user.avatar || user.pseudo?.charAt(0) || 'U').charAt(0).toUpperCase();
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="av av3" style="width:28px;height:28px;font-size:11px">${avatar}</div>
            <div>
              <div style="font-size:13px;font-weight:600;color:var(--t1)">${user.pseudo || 'Anonyme'}</div>
              <div style="font-size:11px;color:var(--t3)">${user.email}</div>
            </div>
          </div>
        </td>
        <td><span class="status-chip ${roleClass}">${roleText}</span></td>
        <td style="font-size:12px;color:var(--t2)">${new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
        <td>
          <div class="inline-actions">
            ${user.role !== 'ADMIN' ? `
              <button class="btn btn-outline btn-sm" onclick="changeUserRole(${user.id}, '${user.role}')">
                Changer rôle
              </button>
              <button class="btn btn-danger btn-sm" onclick="deleteUserById(${user.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:11px;height:11px">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/>
                </svg>
                Supprimer
              </button>
            ` : '<span style="font-size:11px;color:var(--t3)">Admin principal</span>'}
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Mettre à jour le compteur
    const userCount = document.querySelector('.stat-card-value');
    if (userCount) userCount.textContent = data.users.length;

  } catch (err) {
    console.error('Erreur chargement utilisateurs:', err);
  }
}

// ═══════════════════════════════════════════════════════════
// CHARGER LES TOPICS (Admin)
// ═══════════════════════════════════════════════════════════
async function loadRealTopics() {
  const token = getToken();
  if (!token) return;

  try {
    const response = await fetch(`${API_BASE}/topics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.status === 401) {
      handleSessionExpired();
      return;
    }

    const data = await response.json();
    if (!data.ok || !data.topics) return;

    // Remplir le tableau des topics
    const tbody = document.querySelector('#admin-topics-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    data.topics.forEach(topic => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="display:flex;align-items:center;gap:7px">
            <div class="topic-icon ti-blue" style="width:24px;height:24px;border-radius:5px">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:11px;height:11px">
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
            <span style="font-size:13px">${topic.nom}</span>
          </div>
        </td>
        <td style="font-size:13px">${topic.postCount || 0}</td>
        <td style="font-size:13px">-</td>
        <td><span class="status-chip sc-active">Actif</span></td>
        <td>
          <div class="inline-actions">
            <button class="btn btn-outline btn-sm" onclick="editTopic(${topic.id}, '${topic.nom}', '${topic.description || ''}')">
              Éditer
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteTopic(${topic.id})">
              Supprimer
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Remplir aussi le sélecteur de topics dans le formulaire de création de post
    const topicSelect = document.getElementById('compose-topic');
    if (topicSelect) {
      topicSelect.innerHTML = '<option value="">Choisir un topic…</option>';
      data.topics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic.id;
        option.textContent = topic.nom;
        topicSelect.appendChild(option);
      });
    }

  } catch (err) {
    console.error('Erreur chargement topics:', err);
  }
}

// ═══════════════════════════════════════════════════════════
// CHARGER LES STATISTIQUES (Admin)
// ═══════════════════════════════════════════════════════════
async function loadRealStats() {
  const token = getToken();
  if (!token) return;

  try {
    // Charger les utilisateurs pour compter
    const usersRes = await fetch(`${API_BASE}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const usersData = await usersRes.json();

    // Charger les posts pour compter
    const postsRes = await fetch(`${API_BASE}/posts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const postsData = await postsRes.json();

    // Charger les topics pour compter
    const topicsRes = await fetch(`${API_BASE}/topics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const topicsData = await topicsRes.json();

    // Mettre à jour les statistiques
    const statCards = document.querySelectorAll('.stat-card-value');
    if (statCards[0]) statCards[0].textContent = usersData.users?.length || 0;
    if (statCards[1]) statCards[1].textContent = postsData.posts?.length || 0;
    if (statCards[2]) statCards[2].textContent = topicsData.topics?.length || 0;

  } catch (err) {
    console.error('Erreur chargement stats:', err);
  }
}

// ═══════════════════════════════════════════════════════════
// ACTIONS ADMIN
// ═══════════════════════════════════════════════════════════

// Changer le rôle d'un utilisateur
async function changeUserRole(userId, currentRole) {
  const token = getToken();
  if (!token) return;

  const newRole = currentRole === 'CLIENT' ? 'MODERATEUR' : 'CLIENT';
  const roleText = newRole === 'MODERATEUR' ? 'Modérateur' : 'Membre';

  if (!confirm(`Changer le rôle en ${roleText} ?`)) return;

  try {
    const response = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: newRole })
    });

    const data = await response.json();
    if (data.ok) {
      toast(`Rôle changé en ${roleText}`, 's');
      loadRealUsers(); // Recharger la liste
    } else {
      toast(data.message || 'Erreur', 'e');
    }
  } catch (err) {
    console.error('Erreur changement rôle:', err);
    toast('Erreur réseau', 'e');
  }
}

// Supprimer un utilisateur
async function deleteUserById(userId) {
  const token = getToken();
  if (!token) return;

  if (!confirm('Supprimer cet utilisateur ? Tous ses posts seront aussi supprimés.')) return;

  try {
    const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    if (data.ok) {
      toast('Utilisateur supprimé', 's');
      loadRealUsers(); // Recharger la liste
    } else {
      toast(data.message || 'Erreur', 'e');
    }
  } catch (err) {
    console.error('Erreur suppression utilisateur:', err);
    toast('Erreur réseau', 'e');
  }
}

// Supprimer un topic
async function deleteTopic(topicId) {
  const token = getToken();
  if (!token) return;

  if (!confirm('Supprimer ce topic ?')) return;

  try {
    const response = await fetch(`${API_BASE}/topics/${topicId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    if (data.ok) {
      toast('Topic supprimé', 's');
      loadRealTopics(); // Recharger la liste
    } else {
      toast(data.message || 'Erreur', 'e');
    }
  } catch (err) {
    console.error('Erreur suppression topic:', err);
    toast('Erreur réseau', 'e');
  }
}

// Éditer un topic
function editTopic(topicId, nom, description) {
  toast('Fonction édition topic à implémenter', 'i');
  // TODO: Ouvrir un modal pour éditer
}

// ═══════════════════════════════════════════════════════════
// INITIALISATION
// ═══════════════════════════════════════════════════════════
function initRealDataLoaders() {
  // Charger les données quand on va sur la page admin
  const originalSwAdmin = window.swAdmin;
  window.swAdmin = function(el, pid) {
    if (originalSwAdmin) originalSwAdmin(el, pid);
    
    // Charger les données selon l'onglet
    if (pid === 'au') loadRealUsers();
    if (pid === 'at') loadRealTopics();
    if (pid === 'as') loadRealStats();
  };

  // Charger les topics au démarrage pour le sélecteur
  const token = getToken();
  if (token) {
    loadRealTopics();
  }
}

// Initialiser au chargement de la page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRealDataLoaders);
} else {
  initRealDataLoaders();
}
