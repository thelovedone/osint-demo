(async () => {
  const output = document.getElementById("output");

  const section = (title) => {
    const h = document.createElement("h2");
    h.textContent = title;
    output.appendChild(h);
  };

  const row = (key, value) => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${key}:</strong> ${value}`;
    output.appendChild(p);
  };

  const hr = () => output.appendChild(document.createElement("hr"));

  // =========================
  // HTTP / CONTEXT
  // =========================
  section("HTTP & Bezoekcontext");
  row("Huidige URL", window.location.href);
  row("Pad", window.location.pathname);
  row("Query parameters", window.location.search || "Geen");
  row("Referrer (waar je vandaan kwam)", document.referrer || "Geen");
  row("Protocol", window.location.protocol);
  row("Host", window.location.host);
  hr();

  // =========================
  // BROWSER & SYSTEEM
  // =========================
  section("Browser & Systeem");
  row("User-Agent", navigator.userAgent);
  row("Platform", navigator.platform);
  row("Talen", navigator.languages.join(", "));
  row("Tijdzone", Intl.DateTimeFormat().resolvedOptions().timeZone);
  row("Do Not Track", navigator.doNotTrack);
  row("Cookies ingeschakeld", navigator.cookieEnabled);
  row("Online status", navigator.onLine);
  hr();

  // =========================
  // HARDWARE & DEVICE
  // =========================
  section("Hardware & Device");
  row("Schermresolutie", `${screen.width} × ${screen.height}`);
  row("Beschikbaar scherm", `${screen.availWidth} × ${screen.availHeight}`);
  row("Pixel ratio", window.devicePixelRatio);
  row("Color depth", screen.colorDepth);
  row("CPU cores", navigator.hardwareConcurrency || "Onbekend");
  row("RAM (GB)", navigator.deviceMemory || "Onbekend");
  row("Touch points", navigator.maxTouchPoints);
  row("Mobiel apparaat", /Mobi|Android/i.test(navigator.userAgent));
  row("Schermoriëntatie", screen.orientation?.type || "Onbekend");
  hr();

  // =========================
  // NETWERK
  // =========================
  section("Netwerk");
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    row("Type", connection.effectiveType);
    row("Downlink (Mb/s)", connection.downlink);
    row("RTT (ms)", connection.rtt);
    row("Save-Data modus", connection.saveData);
  } else {
    row("Netwerkinfo", "Niet beschikbaar");
  }
  hr();

  // =========================
  // IP & LOCATIE (EXTERN)
  // =========================
  section("Publiek IP & Locatie");
  try {
    const ipRes = await fetch("https://ipinfo.io/json");
    const ipData = await ipRes.json();
    row("IP-adres", ipData.ip);
    row("ISP / Organisatie", ipData.org);
    row("Land", ipData.country);
    row("Regio", ipData.region);
    row("Stad", ipData.city);
    row("Locatie (lat,long)", ipData.loc);
  } catch {
    row("IP-informatie", "Niet beschikbaar");
  }
  hr();

  // =========================
  // OPSLAG & SPOREN
  // =========================
  section("Opslag & Browser-sporen");
  row("LocalStorage beschikbaar", !!window.localStorage);
  row("SessionStorage beschikbaar", !!window.sessionStorage);
  row("IndexedDB beschikbaar", !!window.indexedDB);
  if (navigator.storage?.estimate) {
    const storage = await navigator.storage.estimate();
    row("Opslag gebruikt (MB)", (storage.usage / 1024 / 1024).toFixed(2));
    row("Opslag totaal (MB)", (storage.quota / 1024 / 1024).toFixed(2));
  }
  hr();

  // =========================
  // EXTENSIES & PLUGINS
  // =========================
  section("Browser extensies & plugins");
  row("Aantal plugins", navigator.plugins.length);
  row("Mime types", navigator.mimeTypes.length);
  row("Adblock gedetecteerd", (() => {
    const bait = document.createElement("div");
    bait.className = "adsbox";
    document.body.appendChild(bait);
    const blocked = bait.offsetHeight === 0;
    bait.remove();
    return blocked ? "Ja" : "Nee";
  })());
  hr();

  // =========================
  // SOCIAL & TRACKING SIGNALEN
  // =========================
  section("Social & Tracking signalen");
  row("Facebook bereikbaar", await fetch("https://www.facebook.com/favicon.ico", { mode: "no-cors" }).then(() => "Ja").catch(() => "Nee"));
  row("LinkedIn bereikbaar", await fetch("https://www.linkedin.com/favicon.ico", { mode: "no-cors" }).then(() => "Ja").catch(() => "Nee"));
  row("Instagram bereikbaar", await fetch("https://www.instagram.com/favicon.ico", { mode: "no-cors" }).then(() => "Ja").catch(() => "Nee"));
  hr();

  // =========================
  // FINGERPRINTING
  // =========================
  section("Fingerprinting");

  // Canvas fingerprint
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "top";
  ctx.font = "14px Arial";
  ctx.fillText("OSINT-Fingerprint-Test", 2, 2);
  const canvasFingerprint = canvas.toDataURL();
  row("Canvas fingerprint", canvasFingerprint.slice(0, 60) + "...");

  // Audio fingerprint
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const analyser = audioCtx.createAnalyser();
  oscillator.connect(analyser);
  oscillator.start(0);
  const audioFingerprint = analyser.frequencyBinCount;
  row("Audio fingerprint", audioFingerprint);
  audioCtx.close();

  hr();

  // =========================
  // WEBGL
  // =========================
  section("WebGL");
  const glCanvas = document.createElement("canvas");
  const gl = glCanvas.getContext("webgl");
  if (gl) {
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    row("Vendor", gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
    row("Renderer", gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
  } else {
    row("WebGL", "Niet ondersteund");
  }

  hr();

  // =========================
  // MEDIA & TOEGANKELIJKHEID
  // =========================
  section("Media & Toegankelijkheid");
  row("Camera's beschikbaar", navigator.mediaDevices ? "Ja" : "Nee");
  row("Voorkeur kleurenschema", window.matchMedia("(prefers-color-scheme: dark)").matches ? "Donker" : "Licht");
  row("Reduced motion", window.matchMedia("(prefers-reduced-motion: reduce)").matches);
})();
