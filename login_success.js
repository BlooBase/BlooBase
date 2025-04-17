const signout = document.getElementById('signOutButton');

signout.addEventListener('click', (e) => {
  e.preventDefault(); // Prevent default link behavior
  alert('Signout successful!');
  window.location.href = '/index.html';
});
