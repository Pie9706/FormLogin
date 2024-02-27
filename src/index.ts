import { Persona } from './app';

document.addEventListener('DOMContentLoaded', function () {
  const usernameInput = document.getElementById('usernameInput') as HTMLInputElement | null;
  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');
  const userInfoDiv = document.getElementById('userInfo');
  const allUsersInfoDiv = document.getElementById('allUsersInfo');

  const persona = new Persona('');

  function disableUsernameInput(disabled: boolean) {
    if (usernameInput) {
      usernameInput.disabled = disabled;
    }
  }

  if (loginButton) {
    loginButton.addEventListener('click', function () {
      if (usernameInput) {
        const username = usernameInput.value.trim();
        if (username !== '') {
          persona.username = username;
          persona.login();
          if (userInfoDiv) userInfoDiv.style.display = 'block';
          loadAllUsersInfo();
          if (allUsersInfoDiv) allUsersInfoDiv.style.display = 'block';
          disableUsernameInput(true); // Disabilita il campo di input durante il login

          // Aggiornamento o creazione del record utente
          let userRecords = localStorage.getItem('userRecords');
          if (userRecords) {
            const records = JSON.parse(userRecords);
            if (username in records) {
              records[username].accessCount++;
              records[username].lastAccess = new Date().toISOString();
            } else {
              records[username] = {
                accessCount: 1,
                lastAccess: new Date().toISOString(),
              };
            }
            localStorage.setItem('userRecords', JSON.stringify(records));
          } else {
            const records = {
              [username]: {
                accessCount: 1,
                lastAccess: new Date().toISOString(),
              },
            };
            localStorage.setItem('userRecords', JSON.stringify(records));
          }
        } else {
          alert('Please enter a valid username.');
        }
      }
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', function () {
      persona.logout();
      if (userInfoDiv) userInfoDiv.style.display = 'none';
      if (allUsersInfoDiv) allUsersInfoDiv.style.display = 'none';
      disableUsernameInput(false); // Abilita il campo di input durante il logout
    });
  }

  function loadAllUsersInfo() {
    const userRecords = localStorage.getItem('userRecords');
    if (userRecords && allUsersInfoDiv) {
      const records = JSON.parse(userRecords);
      let allUsersInfoHTML = '<h2>All Users Info</h2>';
      for (const username in records) {
        const accessCount = records[username].accessCount;
        const lastAccess = new Date(records[username].lastAccess).toLocaleString();
        allUsersInfoHTML += `
                    <div>
                        <p>Username: ${username}</p>
                        <p>Access Count: ${accessCount}</p>
                        <p>Last Access: ${lastAccess}</p>
                    </div>
                `;
      }
      allUsersInfoDiv.innerHTML = allUsersInfoHTML;
    }
  }
});
