let editingId = null;

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

  function escapeQuotes(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
  }

articles.forEach(article => {
  const div = document.createElement('div');
  div.innerHTML = `
    <h3><a href="article.html?id=${article.id}">${article.title}</a></h3>
    <p>${article.body}</p>
    <button onclick="editArticle(${article.id}, '${escapeQuotes(article.title)}', '${escapeQuotes(article.body)}')">Modifier</button>
    <button onclick="deleteArticle(${article.id})">Supprimer</button>
  `;
  container.appendChild(div);
});

};

window.editArticle = function(id, currentTitle, currentBody) {
  editingId = id;
  document.getElementById('editTitle').value = currentTitle;
  document.getElementById('editBody').value = currentBody;
  document.getElementById('editFormContainer').style.display = 'block';
};

window.deleteArticle = async function(id) {
  const userId = parseInt(localStorage.getItem('userId'));
  if (!userId) {
    window.location.href = '/login.html';
    return;
  }

  const res = await fetch(`/contents/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId })
  });

  if (res.ok) {
    window.loadArticles();
  } else {
    const data = await res.json();
    alert(data.message || 'Erreur lors de la suppression');
  }
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

  document.getElementById('createForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const body = e.target.body.value;

    const res = await fetch('/contents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, user_id: userId })
    });

    if (res.ok) {
      e.target.reset();
      window.loadArticles();
    } else {
      const data = await res.json();
      alert(data.message || 'Erreur lors de la création');
    }
  });

  document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('editTitle').value;
    const body = document.getElementById('editBody').value;

    const res = await fetch(`/contents/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, user_id: userId })
    });

    if (res.ok) {
      document.getElementById('editFormContainer').style.display = 'none';
      window.loadArticles();
    } else {
      const data = await res.json();
      alert(data.message || 'Erreur lors de la modification');
    }
  });

  document.getElementById('cancelEdit').addEventListener('click', () => {
    document.getElementById('editFormContainer').style.display = 'none';
  });

  window.loadArticles();
});
