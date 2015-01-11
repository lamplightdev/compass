var rose = document.getElementById("rose");

window.addEventListener('deviceorientation', onOrientationChange);

function onOrientationChange(event) {
  console.log('orientation', event);

  rose.style.transform = "rotateZ(" + (event.alpha) + "deg)";
}
