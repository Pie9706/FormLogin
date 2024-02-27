export class Persona {
  username: string;
  accessCount: number;
  lastAccess: Date;

  constructor(username: string) {
    this.username = username;
    this.accessCount = 0;
    this.lastAccess = new Date();
  }

  login() {
    this.accessCount++;
    this.lastAccess = new Date();
    this.saveToLocalStorage();
    this.toggleButtons();
  }

  logout() {
    localStorage.removeItem('userInfo');
    location.reload(); // Reload the page
  }

  saveToLocalStorage() {
    let userRecords = localStorage.getItem('userRecords');
    let records: { [key: string]: { accessCount: number; lastAccess: string } } = userRecords
      ? JSON.parse(userRecords)
      : {};

    if (!records[this.username]) {
      records[this.username] = { accessCount: 0, lastAccess: new Date().toISOString() };
    }

    records[this.username].accessCount++;
    records[this.username].lastAccess = new Date().toISOString();

    localStorage.setItem('userRecords', JSON.stringify(records));
  }

  retrieveFromLocalStorage() {
    const userRecords = localStorage.getItem('userRecords');
    if (userRecords) {
      const records = JSON.parse(userRecords);
      if (records[this.username]) {
        this.accessCount = records[this.username].accessCount;
        this.lastAccess = new Date(records[this.username].lastAccess);
        this.renderUserInfo();
        this.toggleButtons();
      }
    }
  }

  renderUserInfo() {
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement) {
      userInfoElement.innerHTML = `
                <p>Username: ${this.username}</p>
                <p>Access Count: ${this.accessCount}</p>
                <p>Last Access: ${this.lastAccess}</p>
            `;
    }
  }

  toggleButtons() {
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    if (loginButton && logoutButton) {
      loginButton.style.display = 'none';
      logoutButton.style.display = 'block';
    }
  }
}
