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
    studyMode.switchTo().then(() => {
      toggleBuildModeVisibility(false);
    });
  };

  document.getElementById('buildButton').onclick = function() {
    buildModeSelected = true;
    buildMode.switchTo().then(() => {
      toggleBuildModeVisibility(true);
    });
  };

  buildMode.switchTo();
};

function toggleBuildModeVisibility(buildModeVisible) {
  document.getElementById('studyMode').classList.toggle(
      'hidden', buildModeVisible);
  document.getElementById('buildMode').classList.toggle(
      'hidden', !buildModeVisible);
};

window.onload = main;