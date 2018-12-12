class ServerWrapper {
  constructor(authManager) {
    this.authManager_ = authManager;
  }

  loadRepertoire() {
    const sessionInfo = this.authManager_.getSessionInfo();
    if (!sessionInfo) {
      return Promise.resolve(
          JSON.parse(localStorage.getItem('anonymous_repertoire')) || {});
    }
    const options = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + sessionInfo.accessToken}
    };
    return fetch('/loadrepertoire', options)
        .then(res => {
          if (res.status != 200) {
            this.showAuthError_();
            throw new Error('Server returned status ' + res.status + '.');
          }
          return res;
        })
        .then(res => res.json())
        .catch(err => {
          this.showAuthError_();
          console.error('Error loading repertoire from server:');
          console.error(err);
        });
  }

  saveRepertoire(repertoire) {
    const sessionInfo = this.authManager_.getSessionInfo();
    if (!sessionInfo) {
      localStorage.setItem(
          'anonymous_repertoire', JSON.stringify(repertoire));
      return Promise.resolve();
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
        .then(res => {
          if (res.status != 200) {
            this.showAuthError_();
            throw new Error('Server returned status ' + res.status + '.');
          }
          return res;
        })
        .catch(err => {
          this.showAuthError_();
          console.error('Error saving repertoire to server:');
          console.error(err);
        });
  }

  showAuthError_() {
    Toasts.error(
        'Something went wrong.',
        'There was a problem reaching the server. Please refresh the page and '
            + 'try again.');
  }
}