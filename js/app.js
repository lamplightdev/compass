(function () {
  "use strict";

  var rose = document.getElementById("rose");
  var positionCurrent = {
    lat: null,
    lng: null
  };
  var positionLat = document.getElementById("lat");
  var positionLng = document.getElementById("lng");
  var overlay = document.getElementById("overlay");
  var popup = document.getElementById("popup");

  var btnLockOrientation = document.getElementById("btn-lock-orientation");
  var btnNightmode = document.getElementById("btn-nightmode");
  var btnMap = document.getElementById("btn-map");
  var btnInfo = document.getElementById("btn-info");

  var headingPrevious = 0;
  var rotations = 0;
  var isOrientationLocked;
  var isNightMode;

  var defaultOrientation;

  function onOrientationChange(event) {
    var heading = event.alpha;

    var diff = Math.abs(heading - headingPrevious);

    if(diff > 300) {
      if(heading - headingPrevious < 0) {
        rotations++;
      } else {
        rotations--;
      }
    }

    var orientation;
    if (screen.orientation) {
      orientation = screen.orientation.type;
    } else {
      orientation = screen.mozOrientation || screen.msOrientation;
    }

    var adjustment = 0;
    var currentOrientation = orientation.split("-");

    if (defaultOrientation === "landscape") {
      adjustment -= 90;
    }

    if (defaultOrientation !== currentOrientation[0]) {
      if (defaultOrientation === "landscape") {
        adjustment += 90;
      } else {
        adjustment -= 90;
      }
    }

    if (currentOrientation[1] === "secondary") {
      adjustment += 180;
    }

    headingPrevious = heading;

    rose.style.transform = "rotateZ(" + (heading + adjustment + rotations*360) + "deg)";
  }

  function lockOrientationRequest(doLock) {
    if (doLock) {
      screen.orientation.lock(screen.orientation.type).then(function () {
        lockOrientation(true);
      }).catch(function (error) {
        console.log("Screen lock orientation error:", error);
        lockOrientation(false);
        btnLockOrientation.classList.remove("show");
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
    positionCurrent = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    positionLat.textContent = positionCurrent.lat;
    positionLng.textContent = positionCurrent.lng;
  }

  function locationUpdateFail(error) {
    console.log("location fail: ", error);
  }

  function setNightmode(on) {
    if (on) {
      document.documentElement.classList.add("nightmode");
    } else {
      document.documentElement.classList.remove("nightmode");
    }

    btnNightmode.textContent = "Night mode: ";
    btnNightmode.textContent += on ? "on" : "off";

    isNightMode = on;
  }

  function toggleNightmode() {
    setNightmode(!isNightMode);
  }

  function openMap() {
    window.open("https://www.google.com/maps/place/@" + positionCurrent.lat + "," + positionCurrent.lng + ",16z", "_blank");
  }

  function openPopup() {
    overlay.classList.add("show");
  }

  function closePopup() {
    overlay.classList.remove("show");
  }

  function popupClick(event) {
    event.stopPropagation();
  }

  if (screen.width > screen.height) {
    defaultOrientation = "landscape";
  } else {
    defaultOrientation = "portrait";
  }

  window.addEventListener("deviceorientation", onOrientationChange);

  btnLockOrientation.addEventListener("click", toggleOrientationLock);
  btnNightmode.addEventListener("click", toggleNightmode);
  btnMap.addEventListener("click", openMap);
  btnInfo.addEventListener("click", openPopup);
  overlay.addEventListener("click", closePopup);
  popup.addEventListener("click", popupClick);

  navigator.geolocation.watchPosition(locationUpdate, locationUpdateFail, {
    enableHighAccuracy: false,
    maximumAge: 30000,
    timeout: 27000
  });

  if (screen.orientation) {
    btnLockOrientation.classList.add("show");
    lockOrientationRequest(true);
  }
  setNightmode(false);

}());
