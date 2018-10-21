const isWebKitBrowser = () => !!navigator.userAgent.match(/WebKit/i);

const isStandaloneWebApp = () => ('standalone' in navigator && navigator.standalone);

const PLATFORMS = [
  ['windows', /Windows/i],
  ['linux', /Linux|X11/i],
  ['macos', /Macintosh|Mac OS/i]
];

const getPlatform = () => {
  for (let i = 0; i < PLATFORMS.length; i++) {
    let [platform, regexp] = PLATFORMS[i];
    if (navigator.userAgent.match(regexp)) {
      return platform;
    }
  }
  return null;
};

const BROWSERS = [
  ['ie', /IEMobile|Trident/i],
  ['firefox', /Firefox|FxiOS/i],
  ['baidu', /bdbrowser/i],
  ['maxthon', /MxBrowser/i],
  ['cheetah', /ACHEETAHI/i],
  ['yandex', /YaBrowser/i],
  ['opera', /Opera|OPR|OPiOS|Coast/i],
  ['chrome', /Chrome|CriOS/i],
  ['safari', /iPhone|iPad|iPod/i]
];

const getBrowser = () => {
  for (let i = 0; i < BROWSERS.length; i++) {
    let [browser, regexp] = BROWSERS[i];
    if (navigator.userAgent.match(regexp)) {
      return browser;
    }
  }
  return null;
}