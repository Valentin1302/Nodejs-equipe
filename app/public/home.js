let editingId = null;
let currentImage = null;

window.loadArticles = async function() {
  const userId = parseInt(localStorage.getItem('userId'));
  if (!userId) {
    window.location.href = '/login.html';
    return;
  }

  const container = document.getElementById('articlesContainer');
  container.innerHTML = '';

  const res = await fetch('/contents');
  const articles = await res.json();

  articles.forEach(article => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3><a href="article.html?id=${article.id}">${article.title}</a></h3>
      <p>${article.body}</p>
      ${article.image ? `<img src="${article.image}" style="max-width:200px">` : ''}
      <button onclick="editArticle(${article.id}, '${escapeQuotes(article.title)}', '${escapeQuotes(article.body)}', '${article.image || ''}')">Modifier</button>
      <button onclick="deleteArticle(${article.id})">Supprimer</button>
    `;
    container.appendChild(div);
  });
};

function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

window.editArticle = function(id, title, body, image) {
  editingId = id;
  currentImage = image;
  document.getElementById('editTitle').value = title;
  document.getElementById('editBody').value = body;
  document.getElementById('editImagePreview').src = image || '';
  document.getElementById('editFormContainer').style.display = 'block';
};

window.deleteArticle = async function(id) {
  const userId = parseInt(localStorage.getItem('userId'));
  const res = await fetch(`/contents/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId })
  });

  if (res.ok) window.loadArticles();
  else alert('Erreur lors de la suppression');
};

window.logout = function() {
  localStorage.removeItem('userId');
  window.location.href = '/login.html';
};

document.addEventListener('DOMContentLoaded', () => {
  const userId = parseInt(localStorage.getItem('userId'));
  if (!userId) {
    window.location.href = '/login.html';
    return;
  }

  // Création
  document.getElementById('createForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('user_id', userId);

    const res = await fetch('/contents', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      e.target.reset();
      window.loadArticles();
    } else alert('Erreur lors de la création');
  });

  // Édition
  document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('editTitle').value);
    formData.append('body', document.getElementById('editBody').value);
    formData.append('user_id', userId);

    const image = document.getElementById('editImage').files[0];
    if (image) formData.append('image', image);

    const res = await fetch(`/contents/${editingId}`, {
      method: 'PUT',
      body: formData
    });

    if (res.ok) {
      document.getElementById('editFormContainer').style.display = 'none';
      window.loadArticles();
    } else alert('Erreur lors de la modification');
  });

  document.getElementById('cancelEdit').addEventListener('click', () => {
    document.getElementById('editFormContainer').style.display = 'none';
  });

  window.loadArticles();
});
