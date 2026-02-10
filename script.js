function addSection(title, data) {
  const output = document.getElementById("output");
  const section = document.createElement("div");
  section.className = "section";

  const h2 = document.createElement("h2");
  h2.textContent = title;
  section.appendChild(h2);

  for (const key in data) {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `<strong>${key}</strong>: ${data[key]}`;
    section.appendChild(div);
  }

  output.appendChild(section);
}

// Canvas fingerprint
function canvasFP() {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  ctx.textBaseline = "top";
  ctx.font = "16px Arial";
  ctx.fillText("OSINT Fingerprint", 2, 2);
  return c.toDataURL().slice(-50);
}

// Audio fingerprint
function audioFP() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const analyser = ctx.createAnalyser();
    osc.connect(analyser);
    osc.start(0);
    const data = analyser.frequencyBinCount;
    osc.stop();
    return data;
  } catch {
    return "Niet beschikbaar";
  }
}

// WebGL info
function webglInfo() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl");
    if (!gl) return "Niet beschikbaar";
    return {
      Vendor: gl.getParameter(gl.VENDOR),
      Renderer: gl.getParameter(gl.RENDERER),
      Extensies: gl.getSupportedExtensions().length
    };
  } catch {
    return "Fout";
  }
}

// Detect adblock
function adblockDetected() {
  const bait = document.createElement("div");
  bait.className = "adsbox";
  document.body.appendChild(bait);
  const detected = window.getComputedStyle(bait).display === "none";
  document.body.removeChild(bait);
  return detected ? "Waarschijnlijk" : "Niet gedetecteerd";
}

// Sections
addSection("Browser & Systeem", {
  "User-Agent": navigator.userAgent,
  "Platform": navigator.platform,
  "Talen": navigator.languages.join(", "),
  "Tijdzone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  "Do Not Track": navigator.doNotTrack,
  "Cookies ingeschakeld": navigator.cookieEnabled
});

addSection("Hardware & Device", {
  "Scherm": `${screen.width} × ${screen.height}`,
  "Beschikbaar scherm": `${screen.availWidth} × ${screen.availHeight}`,
  "Pixelratio": window.devicePixelRatio,
  "CPU cores": navigator.hardwareConcurrency || "Onbekend",
  "RAM (GB)": navigator.deviceMemory || "Onbekend",
  "Touch points": navigator.maxTouchPoints,
  "Mobiel apparaat": /Mobi/i.test(navigator.userAgent)
});

if (navigator.connection) {
  addSection("Netwerk", {
    "Type": navigator.connection.effectiveType,
    "Downlink (Mb/s)": navigator.connection.downlink,
    "RTT (ms)": navigator.connection.rtt
  });
}

addSection("Fingerprinting", {
  "Canvas fingerprint": canvasFP(),
  "Audio fingerprint": audioFP(),
  "Adblock": adblockDetected()
});

const gl = webglInfo();
if (typeof gl === "object") {
  addSection("WebGL", gl);
}

