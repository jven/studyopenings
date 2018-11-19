function main() {
  const studyMode = new StudyMode();
  const buildMode = new BuildMode();
  var buildModeSelected = true;

  document.body.onkeydown = function(e) {
    if (buildModeSelected) {
      buildMode.onKeyDown(e);
    }
  }

  document.getElementById('studyButton').onclick = function() {
    buildModeSelected = false;
    studyMode.switchTo();
  };

  document.getElementById('buildButton').onclick = function() {
    buildModeSelected = true;
    buildMode.switchTo();
  };

  buildMode.switchTo();
};

window.onload = main;