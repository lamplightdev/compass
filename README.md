# Compass

A simple HTML5 [compass web app](https://lamplightdev.github.io/compass) that's offline capable.

Makes use of the HTML5 Location, Device Orientation, Screen Orientation, Screen Lock and Fullscreen APIs.

## Browser support

The app should work on any modern standards compliant browser that implements the above APIs. This is currently Chrome for Android, Opera for Android, Firefox for Android, IE for Windows Phone and Safari for iOS (and therefore all browsers on iOS). Only Chrome on Android and Opera on Android support the latest version of the screen lock API and so screen lock is only available on these browsers. Webkit based browsers - iOS Safari-based browsers, default Android Browser etc. - do not implement the screen orientation API so will show incorrect results if the device is turned from portrait.
