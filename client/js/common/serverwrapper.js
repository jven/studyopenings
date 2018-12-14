class ServerWrapper {
  constructor(authManager) {
    this.authManager_ = authManager;
  }

  getAllRepertoireMetadata() {
    const accessToken = this.authManager_.getAccessToken();
    if (!accessToken) {
      return Promise.resolve([]);
    }
    return this.post_('/metadata', accessToken, {} /* body */)
        .then(res => res.json());
  }

  loadRepertoire() {
    const accessToken = this.authManager_.getAccessToken();
    if (!accessToken) {
      return Promise.resolve(
          JSON.parse(localStorage.getItem('anonymous_repertoire')) || {});
    }
    const options = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + accessToken}
    };
    return this.post_('/loadrepertoire', accessToken, {} /* body */)
        .then(res => res.json());
  }

  saveRepertoire(repertoireJson) {
    const accessToken = this.authManager_.getAccessToken();
    if (!accessToken) {
      localStorage.setItem(
          'anonymous_repertoire', JSON.stringify(repertoireJson));
      return Promise.resolve();
    }
    this.post_(
        '/saverepertoire',
        accessToken,
        {repertoireJson: repertoireJson});
  }

  post_(endpoint, accessToken, body) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
      body: JSON.stringify(body)
    };
    return fetch(endpoint, options)
        .then(res => {
          if (res.status != 200) {
            this.showAuthError_();
            throw new Error('Server returned status ' + res.status + '.');
          }
          return res;
        })
        .catch(err => {
          this.showAuthError_();
          console.error('Error reaching server:');
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