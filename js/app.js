(function () {
  "use strict";

  var rose = document.getElementById("rose");

  var headingPrevious = 0;
  var rotations = 0;
  var isOrientationLocked;

  function onOrientationChange(event) {
    console.log("orientation", event);

    var heading = event.alpha;

    var diff = Math.abs(heading - headingPrevious);

    if(diff > 300) {
      if(heading - headingPrevious < 0) {
        rotations++;
      } else {
        rotations--;
      }
    }

    headingPrevious = heading;

    rose.style.transform = "rotateZ(" + (heading + rotations*360) + "deg)";
  }

  function lockOrientation(doLock) {
    if (doLock) {
      screen.orientation.lock("portrait").then(function () {

      }).catch(function (error) {
        console.log("Screen lock orientation error:", error);
      });
    } else {
      screen.orientation.unlock();
    }

    isOrientationLocked = doLock;
  }


  window.addEventListener("deviceorientation", onOrientationChange);

  if (screen.orientation) {
    lockOrientation(true);
  }

}());
