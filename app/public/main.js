document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;

  const res = await fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok) {
    alert('Compte créé avec succès !');
    localStorage.setItem('userId', data.userId || 'temp'); 
    window.location.href = '/home.html';
  } else {
    alert(data.message || 'Erreur');
  }
});


document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;

  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok) {
    alert('Connexion réussie');
    localStorage.setItem('userId', data.userId);
    window.location.href = '/home.html'; // Redirection après connexion
  } else {
    alert(data.message || 'Erreur de connexion');
  }
});
