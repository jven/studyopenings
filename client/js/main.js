function main() {
  // Parse auth information in the URL hash when redirected from Auth0.
  const authManager = new AuthManager(
      document.getElementById('login'),
      document.getElementById('logout'),
      document.getElementById('hello'));
  authManager.detectSessionFromUrlHash();

  const studyMode = new StudyMode();
  const buildMode = new BuildMode();

  document.body.onkeydown = function(e) {
    if (buildModeSelected) {
      buildMode.onKeyDown(e);
    }
  }

  var buildModeSelected = false;
  function toggleBuildModeSelected(selected) {
    var mode = selected ? buildMode : studyMode;
    mode.switchTo().then(() => {
      buildModeSelected = selected;
      document.getElementById('studyMode').classList.toggle(
          'hidden', selected);
      document.getElementById('studyButton').classList.toggle(
          'selectedButton', !selected);

      document.getElementById('buildMode').classList.toggle(
          'hidden', !selected);
      document.getElementById('buildButton').classList.toggle(
          'selectedButton', selected);

      mode.resetBoardSize();
    });
  };

  document.getElementById('studyButton').onclick = function() {
    toggleBuildModeSelected(false);
  };

  document.getElementById('buildButton').onclick = function() {
    toggleBuildModeSelected(true);
  };

  // Select the build mode initially.
  toggleBuildModeSelected(true);
};

window.onload = main;