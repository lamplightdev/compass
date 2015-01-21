(function () {
  "use strict";

  var rose = document.getElementById("rose");
  var positionCurrent = {
    lat: null,
    lng: null,
    hng: null
  };
  var positionLat = document.getElementById("position-lat");
  var positionLng = document.getElementById("position-lng");
  var positionHng = document.getElementById("position-hng");
  var infoPopup = document.getElementById("info-popup");
  var infoPopupContent = document.getElementById("info-popup-content");

  var btnLockOrientation = document.getElementById("btn-lock-orientation");
  var btnNightmode = document.getElementById("btn-nightmode");
  var btnMap = document.getElementById("btn-map");
  var btnInfo = document.getElementById("btn-info");

  var headingPrevious = 0;
  var rotations = 0;
  var isOrientationLocked;
  var isNightMode;
  var isOrientationChangePossible = false;

  var defaultOrientation;


  function getBrowserOrientation() {
    var orientation;
    if (screen.orientation && screen.orientation.type) {
      orientation = screen.orientation.type;
    } else {
      orientation = screen.orientation ||
                    screen.mozOrientation ||
                    screen.msOrientation;
    }

    return orientation;
  }

  function browserUnlockOrientation() {
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
    } else if (screen.unlockOrientation) {
      screen.unlockOrientation();
    } else if (screen.mozUnlockOrientation) {
      screen.mozUnlockOrientation();
    } else if (screen.msUnlockOrientation) {
      screen.msUnlockOrientation();
    }
  }

  function getBrowserFullscreenElement() {
    if (typeof document.fullscreenElement !== "undefined") {
      return document.fullscreenElement;
    } else if (typeof document.webkitFullscreenElement !== "undefined") {
      return document.webkitFullscreenElement;
    } else if (typeof document.mozFullScreenElement !== "undefined") {
      return document.mozFullScreenElement;
    } else if (typeof document.msFullscreenElement !== "undefined") {
      return document.msFullscreenElement;
    }
  }

  function browserRequestFullscreen() {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  }

  function browserExitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  function onOrientationChange(event) {
    if (!isOrientationChangePossible && event.alpha) {
      toggleOrientationChangePossible(true);
    }

    var heading = event.alpha;

    var diff = Math.abs(heading - headingPrevious);

    if(diff > 300) {
      if(heading - headingPrevious < 0) {
        rotations++;
      } else {
        rotations--;
      }
    }

    var orientation = getBrowserOrientation();
    var adjustment = 0;
    var currentOrientation = orientation.split("-");

    if (defaultOrientation === "landscape") {
      adjustment -= 90;
    }

    if (defaultOrientation !== currentOrientation[0]) {
      if (defaultOrientation === "landscape") {
        adjustment -= 270;
      } else {
        adjustment -= 90;
      }
    }

    if (currentOrientation[1] === "secondary") {
      adjustment -= 180;
    }

    headingPrevious = heading;

    positionCurrent.hng = heading + adjustment;

    var phase = positionCurrent.hng < 0 ? 360 + positionCurrent.hng : positionCurrent.hng;
    positionHng.textContent = (360 - phase | 0) + "°";

    rose.style.transform = "rotateZ(" + (positionCurrent.hng + rotations*360) + "deg)";
  }

  function onFullscreenChange() {
    if (getBrowserFullscreenElement()) {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock(getBrowserOrientation()).then(function () {
        }).catch(function () {
        });
      } else {
        var lock = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
        lock(getBrowserOrientation());
      }
    } else {
      lockOrientationRequest(false);
    }
  }

  function checkOrientationChangePossible() {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock(getBrowserOrientation()).then(function () {
        toggleOrientationChangePossible(true);
        browserUnlockOrientation();
      }).catch(function (event) {
        if (event.code === 18) { // The page needs to be fullscreen in order to call lockOrientation()
          toggleOrientationChangePossible(true);
        } else {  // lockOrientation() is not available on this device (or other error)
          toggleOrientationChangePossible(false);
        }
      });
    } else {
      var lock = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;

      browserRequestFullscreen();
      if (lock.call(getBrowserOrientation())) {
        toggleOrientationChangePossible(true);
      } else {
        toggleOrientationChangePossible(false);
      }
      browserExitFullscreen();
    }
  }

  function toggleOrientationChangePossible(possible) {
    isOrientationChangePossible = possible;

    if (possible) {
      btnLockOrientation.classList.add("show");

      btnNightmode.classList.add("column-25");
      btnNightmode.classList.remove("column-33");
      btnMap.classList.add("column-25");
      btnMap.classList.remove("column-33");
      btnInfo.classList.add("column-25");
      btnInfo.classList.remove("column-33");
    }
  }

  function lockOrientationRequest(doLock) {
    if (isOrientationChangePossible && doLock !== isOrientationLocked) {
      if (doLock) {
        browserRequestFullscreen();
        lockOrientation(true);
        /*
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock(getBrowserOrientation()).then(function () {
            //lockOrientation(true);  // this will instead be called from onFullscreenChange()
          }).catch(function () {
            //shouldn't get here as we've already checked in checkOrientationChangePossible if this will fail
          });
        } else {
          var lock = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
          lock(getBrowserOrientation());
          //lockOrientation(true);
        }
        */

      } else {
        browserUnlockOrientation();
        browserExitFullscreen();
        lockOrientation(false);
      }
    }
  }

  function lockOrientation(locked) {
    if (locked) {
      btnLockOrientation.classList.add("active");
    } else {
      btnLockOrientation.classList.remove("active");
    }

    isOrientationLocked = locked;
  }

  function toggleOrientationLock() {
    lockOrientationRequest(!isOrientationLocked);
  }

  function locationUpdate(position) {
    positionCurrent.lat = position.coords.latitude;
    positionCurrent.lng = position.coords.longitude;

    positionLat.textContent = decimalToSexagesimal(positionCurrent.lat, "lat");
    positionLng.textContent = decimalToSexagesimal(positionCurrent.lng, "lng");
  }

  function locationUpdateFail(error) {
    console.log("location fail: ", error);
  }

  function setNightmode(on) {

    if (on) {
      btnNightmode.classList.add("active");
    } else {
      btnNightmode.classList.remove("active");
    }

    window.setTimeout(function() {
      if (on) {
        document.documentElement.classList.add("nightmode");
      } else {
        document.documentElement.classList.remove("nightmode");
      }
    }, 1);


    isNightMode = on;
  }

  function toggleNightmode() {
    setNightmode(!isNightMode);
  }

  function openMap() {
    window.open("https://www.google.com/maps/place/@" + positionCurrent.lat + "," + positionCurrent.lng + ",16z", "_blank");
  }

  function openInfoPopup() {
    infoPopup.classList.add("show");
  }

  function closeInfoPopup() {
    infoPopup.classList.remove("show");
  }

  function infoPopupContentClick(event) {
    event.stopPropagation();
  }

  function decimalToSexagesimal(decimal, type) {
    var degrees = decimal | 0;
    var fraction = Math.abs(decimal - degrees);
    var minutes = (fraction * 60) | 0;
    var seconds = (fraction * 3600 - minutes * 60) | 0;

    var direction = "";
    var positive = degrees > 0;
    degrees = Math.abs(degrees);
    switch (type) {
      case "lat":
        direction = positive ? "N" : "S";
        break;
      case "lng":
        direction = positive ? "E" : "W";
        break;
    }

    return degrees + "° " + minutes + "' " + seconds + "\" " + direction;
  }

  if (screen.width > screen.height) {
    defaultOrientation = "landscape";
  } else {
    defaultOrientation = "portrait";
  }

  window.addEventListener("deviceorientation", onOrientationChange);

  document.addEventListener("fullscreenchange", onFullscreenChange);
  document.addEventListener("webkitfullscreenchange", onFullscreenChange);
  document.addEventListener("mozfullscreenchange", onFullscreenChange);
  document.addEventListener("MSFullscreenChange", onFullscreenChange);

  btnLockOrientation.addEventListener("click", toggleOrientationLock);
  btnNightmode.addEventListener("click", toggleNightmode);
  btnMap.addEventListener("click", openMap);
  btnInfo.addEventListener("click", openInfoPopup);
  infoPopup.addEventListener("click", closeInfoPopup);
  infoPopupContent.addEventListener("click", infoPopupContentClick);

  navigator.geolocation.watchPosition(locationUpdate, locationUpdateFail, {
    enableHighAccuracy: false,
    maximumAge: 30000,
    timeout: 27000
  });

  setNightmode(false);
  //checkOrientationChangePossible();

}());
