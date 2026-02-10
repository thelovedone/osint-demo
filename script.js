function canvasFingerprint() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "top";
  ctx.font = "14px Arial";
  ctx.fillText("OSINT Canvas Fingerprint", 2, 2);
  return canvas.toDataURL();
}

function webGLInfo() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return "Niet beschikbaar";
    const vendor = gl.getParameter(gl.VENDOR);
    const renderer = gl.getParameter(gl.RENDERER);
    return `${vendor} / ${renderer}`;
  } catch {
    return "Fout bij uitlezen";
  }
}

function showData() {
  const output = document.getElementById("output");

  const data = {
    "User-Agent": navigator.userAgent,
    "Taal": navigator.language,
    "Tijdzone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    "Schermresolutie": `${screen.width} × ${screen.height}`,
    "Pixelratio": window.devicePixelRatio,
    "CPU cores": navigator.hardwareConcurrency || "Onbekend",
    "Touch ondersteuning": navigator.maxTouchPoints > 0 ? "Ja" : "Nee",
    "Canvas fingerprint": canvasFingerprint(),
    "WebGL info": webGLInfo()
  };

  for (const key in data) {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `<strong>${key}</strong>: ${data[key]}`;
    output.appendChild(div);
  }
}

showData();
