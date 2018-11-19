function main() {
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
    });
  };

  document.getElementById('studyButton').onclick = function() {
    toggleBuildModeSelected(false);
  };

  document.getElementById('buildButton').onclick = function() {
    toggleBuildModeSelected(true);
  };

  toggleBuildModeSelected(true);
};

function toggleBuildModeSelected(buildModeSelected) {
  document.getElementById('studyMode').classList.toggle(
      'hidden', buildModeSelected);
  document.getElementById('studyButton').classList.toggle(
      'selectedButton', buildModeSelected);

  document.getElementById('buildMode').classList.toggle(
      'hidden', !buildModeSelected);
  document.getElementById('buildButton').classList.toggle(
      'selectedButton', !buildModeSelected);
};

window.onload = main;