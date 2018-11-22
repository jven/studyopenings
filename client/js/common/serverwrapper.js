class ServerWrapper {
  constructor(authManager) {
    this.authManager_ = authManager;
  }

  loadRepertoire() {
    const sessionInfo = this.authManager_.getSessionInfo();
    if (!sessionInfo) {
      return Promise.reject('Not logged in.');
    }
    const options = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + sessionInfo.accessToken}
    };
    return fetch('/loadrepertoire', options)
        .then(res => res.json())
        .catch(err => {
          console.error('Error loading repertoire from server:');
          console.error(err);
        });
  }

  saveRepertoire(repertoire) {
    const sessionInfo = this.authManager_.getSessionInfo();
    if (!sessionInfo) {
      return Promise.reject('Not logged in.');
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionInfo.accessToken
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