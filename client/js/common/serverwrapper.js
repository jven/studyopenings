class ServerWrapper {
  constructor(authManager) {
    this.authManager_ = authManager;
  }

  loadRepertoire() {
    const accessToken = this.authManager_.getSessionAccessToken();
    if (!accessToken) {
      return Promise.reject('Not logged in.');
    }
    const options = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + accessToken}
    };
    return fetch('/loadrepertoire', options)
        .then(res => res.json())
        .catch(err => {
          console.error('Error loading repertoire from server:');
          console.error(err);
        });
  }

  saveRepertoire(repertoire) {
    const accessToken = this.authManager_.getSessionAccessToken();
    if (!accessToken) {
      return Promise.reject('Not logged in.');
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
      body: JSON.stringify(repertoire)
    };
    return fetch('/saverepertoire', options)
        .then(res => res.json())
        .catch(err => {
          console.error('Error saving repertoire to server:');
          console.error(err);
        });
  }
}