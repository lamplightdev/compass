(function () {
  "use strict";

  var rose = document.getElementById("rose");
  var positionLat = document.getElementById("lat");
  var positionLng = document.getElementById("lng");
  var btnLockOrientation = document.getElementById("btn-lock-orientation");

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

  function lockOrientationRequest(doLock) {
    if (doLock) {
      screen.orientation.lock("portrait").then(function () {
        lockOrientation(true);
      }).catch(function (error) {
        console.log("Screen lock orientation error:", error);
        lockOrientation(false);
      });
    } else {
      screen.orientation.unlock();
      lockOrientation(false);
    }
  }

  function lockOrientation(locked) {
    isOrientationLocked = locked;
    btnLockOrientation.textContent = "Lock: ";
    btnLockOrientation.textContent += isOrientationLocked ? "on" : "off";
  }

  function toggleOrientationLock() {
    lockOrientationRequest(!isOrientationLocked);
  }

  function locationUpdate(position) {
    console.log("location update: ", position);

    positionLat.textContent = position.coords.latitude;
    positionLng.textContent = position.coords.longitude;
  }

  function locationUpdateFail(error) {
    console.log("location fail: ", error);
  }


  window.addEventListener("deviceorientation", onOrientationChange);
  btnLockOrientation.addEventListener("click", toggleOrientationLock);

  navigator.geolocation.watchPosition(locationUpdate, locationUpdateFail, {
    enableHighAccuracy: false,
    maximumAge: 30000,
    timeout: 27000
  });

  if (screen.orientation) {
    lockOrientationRequest(true);
  }

}());
