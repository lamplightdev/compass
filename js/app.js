var rose = document.getElementById("rose");

var headingPrevious = 0;
var rotations = 0;

window.addEventListener('deviceorientation', onOrientationChange);

function onOrientationChange(event) {
  console.log('orientation', event);

  var heading = event.alpha;

  var diff = Math.abs(heading - headingPrevious);

  if(diff > 300) {
    if(heading - headingPrevious < 0) {
      rotations++;
    } else {
      rotations--;
    }
  }

  rose.style.transform = "rotateZ(" + (heading + rotations*360) + "deg)";
}
