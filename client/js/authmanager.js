class AuthManager {
  constructor(
      logInButtonElement,
      logOutButtonElement,
      helloElement) {
    this.logInButtonElement_ = logInButtonElement;
    this.logOutButtonElement_ = logOutButtonElement;
    this.helloElement_ = helloElement;

    this.auth_ = new auth0.WebAuth({
      domain: Config.AUTH0_DOMAIN,
      clientID: Config.AUTH0_CLIENT_ID,
      redirectUri: Config.AUTH0_REDIRECT_URI,
      responseType: 'token id_token',
      scope: 'openid profile',
      leeway: 60
    });

    this.logInButtonElement_.onclick = this.logIn_.bind(this);
    this.logOutButtonElement_.onclick = this.logOut_.bind(this);
  }

  detectSessionFromUrlHash() {
    this.auth_.parseHash(this.handleAuthResult_.bind(this));
  }

  handleAuthResult_(err, authResult) {
    window.location.hash = '';
    if (authResult && authResult.accessToken && authResult.idToken) {
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      this.auth_.client.userInfo(
          authResult.accessToken, this.handleUserProfile_.bind(this));
    } else {
      if (err) {
        console.error('Auth error:');
        console.error(err);
      }
      this.showLogInButton_();
    }
  }

  handleUserProfile_(err, profile) {
    if (err) {
      console.error('Auth error:');
      console.error(err);
      this.showLogInButton_();
      return;
    }
    this.showLoggedInUser_(profile.nickname || 'anonymous');
  }

  logIn_() {
    this.auth_.authorize();
  }

  logOut_() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    // Refresh the page.
    location.reload();
  }

  showLogInButton_() {
    this.logInButtonElement_.classList.toggle("hidden", false);
    this.logOutButtonElement_.classList.toggle("hidden", true);
    this.helloElement_.classList.toggle("hidden", true);
  }

  showLoggedInUser_(userName) {
    this.logInButtonElement_.classList.toggle("hidden", true);
    this.logOutButtonElement_.classList.toggle("hidden", false);
    this.helloElement_.classList.toggle("hidden", false);
    this.helloElement_.innerText = 'Hi, ' + userName + '!';
  }
}