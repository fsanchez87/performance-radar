/* Athlete Performance Radar — One Mile ATHLETE */
(() => {
  "use strict";

  // ---------- Config ----------
  const W = 1320;
  const H = 1210;
  const EXPORT_SCALE = 2;
  const STORAGE_PROFILES = "performanceRadar.profiles";
  const STORAGE_DRAFT = "performanceRadar.draft";

  const COLORS = {
    current: "#1a6fe0",
    target: "#e5333a",
    black: "#141414",
    text: "#2b2f33",
    muted: "#4a4f57",
    gold: "#b89a6a",
  };

  const FONT_HEAD = "Oswald, Impact, 'Arial Narrow', sans-serif";
  const FONT_BODY = "'Roboto Condensed', 'Arial Narrow', Arial, sans-serif";

  // Orden en el sentido de las agujas del reloj, empezando arriba.
  const DIMENSIONS = [
    { key: "strength", name: "Strength", color: "#e53935", icon: "dumbbell",
      desc: ["Fuerza máxima y relativa"],
      label: { ix: 582, iy: 145, tx: 628, ty: 133, align: "left" } },
    { key: "engine", name: "Engine", color: "#1fa35c", icon: "runner",
      desc: ["Resistencia", "cardiovascular"],
      label: { ix: 886, iy: 243, tx: 934, ty: 228, align: "left" } },
    { key: "gymnastics", name: "Gymnastics", color: "#f28c18", icon: "rings",
      desc: ["Control corporal", "y habilidades"],
      label: { ix: 967, iy: 446, tx: 1024, ty: 433, align: "left" } },
    { key: "weightlifting", name: "Weightlifting", color: "#f5b400", icon: "lifter",
      desc: ["Técnica y eficiencia", "con la barra"],
      label: { ix: 905, iy: 650, tx: 962, ty: 643, align: "left" } },
    { key: "skills", name: "Skills", color: "#15b2ad", icon: "skills",
      desc: ["Movimientos específicos", "(Double unders, HSPU, etc.)"],
      label: { ix: 575, iy: 750, tx: 628, ty: 733, align: "left" } },
    { key: "mobility", name: "Mobility", color: "#e8449a", icon: "lunge",
      desc: ["Rango de movimiento", "y posiciones"],
      label: { ix: 416, iy: 651, tx: 362, ty: 645, align: "right" } },
    { key: "consistency", name: "Consistency", color: "#1e7be0", icon: "calendar",
      desc: ["Regularidad y", "adherencia al plan"],
      label: { ix: 349, iy: 446, tx: 295, ty: 433, align: "right" } },
    { key: "mindset", name: "Mindset", color: "#8e59c9", icon: "brain",
      desc: ["Gestión del esfuerzo", "y resiliencia"],
      label: { ix: 430, iy: 233, tx: 382, ty: 228, align: "right" } },
  ];

  const EXAMPLE = {
    name: "",
    date: "",
    values: {
      strength: [6, 8], engine: [5, 8], gymnastics: [4, 7], weightlifting: [6, 8],
      skills: [5, 8], mobility: [4, 7], consistency: [7, 8], mindset: [6, 8],
    },
  };

  // ---------- Icons (dibujadas en una rejilla de 48x48 centrada en 0) ----------
  const ICONS = {
    dumbbell(c) {
      c.fillRect(-13, -2.2, 26, 4.4);
      c.fillRect(-21, -11, 5, 22);
      c.fillRect(16, -11, 5, 22);
      c.fillRect(-15.5, -7.5, 3.5, 15);
      c.fillRect(12, -7.5, 3.5, 15);
      c.fillRect(-24, -3.5, 3, 7);
      c.fillRect(21, -3.5, 3, 7);
    },
    runner(c) {
      dot(c, 5, -15, 4.2);
      poly(c, [[2, -8], [-3, 3]]);
      poly(c, [[1, -7], [8, -4], [12, -9]]);
      poly(c, [[1, -7], [-6, -4], [-11, 0]]);
      poly(c, [[-3, 3], [5, 8], [3, 17]]);
      poly(c, [[-3, 3], [-7, 11], [-15, 12]]);
      c.lineWidth = 2.2;
      poly(c, [[-22, -10], [-14, -10]]);
      poly(c, [[-22, -4], [-16, -4]]);
    },
    rings(c) {
      c.lineWidth = 2.6;
      poly(c, [[-13, -21], [13, -21]]);
      poly(c, [[-9, -21], [-9, -3]]);
      poly(c, [[9, -21], [9, -3]]);
      c.lineWidth = 3.6;
      ring(c, -9, 6, 7.5);
      ring(c, 9, 6, 7.5);
    },
    lifter(c) {
      c.lineWidth = 3;
      poly(c, [[-21, -15], [21, -15]]);
      c.fillRect(-22, -21, 4.5, 12);
      c.fillRect(17.5, -21, 4.5, 12);
      dot(c, 0, -6, 4.2);
      c.lineWidth = 4.2;
      poly(c, [[-11, -15], [-5, 1], [5, 1], [11, -15]]);
      poly(c, [[0, 0], [0, 9]]);
      poly(c, [[0, 9], [-7, 13], [-8, 21]]);
      poly(c, [[0, 9], [7, 13], [8, 21]]);
    },
    skills(c) {
      dot(c, 0, -15, 4.5);
      c.lineWidth = 4.6;
      poly(c, [[-12, -20], [0, -6], [12, -20]]);
      poly(c, [[0, -6], [0, 6]]);
      poly(c, [[0, 6], [-3, 20]]);
      poly(c, [[0, 6], [3, 20]]);
    },
    lunge(c) {
      dot(c, -1, -16, 4.2);
      poly(c, [[0, -9], [3, 3]]);
      poly(c, [[0, -7], [8, -2], [14, -8]]);
      poly(c, [[3, 3], [13, 8], [13, 19]]);
      poly(c, [[3, 3], [-7, 12], [-17, 18]]);
    },
    calendar(c) {
      c.lineWidth = 3;
      c.beginPath();
      roundRectPath(c, -17, -14, 34, 32, 4);
      c.stroke();
      c.fillRect(-17, -14, 34, 8);
      c.lineWidth = 3.4;
      poly(c, [[-9, -20], [-9, -11]]);
      poly(c, [[9, -20], [9, -11]]);
      for (let r = 0; r < 3; r++) {
        for (let k = 0; k < 4; k++) c.fillRect(-12.5 + k * 7, -1 + r * 6, 4, 4);
      }
    },
    brain(c) {
      c.lineWidth = 2.6;
      // contorno
      c.beginPath();
      c.moveTo(0, -16);
      c.bezierCurveTo(-6, -21, -14, -18, -14, -12);
      c.bezierCurveTo(-21, -11, -22, -2, -18, 1);
      c.bezierCurveTo(-22, 6, -17, 14, -11, 13);
      c.bezierCurveTo(-9, 19, -2, 20, 0, 16);
      c.bezierCurveTo(2, 20, 9, 19, 11, 13);
      c.bezierCurveTo(17, 14, 22, 6, 18, 1);
      c.bezierCurveTo(22, -2, 21, -11, 14, -12);
      c.bezierCurveTo(14, -18, 6, -21, 0, -16);
      c.closePath();
      c.stroke();
      poly(c, [[0, -16], [0, 16]]);
      // circunvoluciones
      c.lineWidth = 2.2;
      const curls = [
        [[-4, -10], [-9, -9], [-9, -4]], [[-14, -3], [-8, -1], [-8, 5]],
        [[-4, 4], [-9, 8], [-6, 12]], [[4, -10], [9, -9], [9, -4]],
        [[14, -3], [8, -1], [8, 5]], [[4, 4], [9, 8], [6, 12]],
      ];
      curls.forEach(([a, b, d]) => {
        c.beginPath(); c.moveTo(...a); c.quadraticCurveTo(...b, ...d); c.stroke();
      });
    },
  };

  function poly(c, pts) {
    c.beginPath();
    c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    c.stroke();
  }
  function dot(c, x, y, r) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); }
  function ring(c, x, y, r) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke(); }
  function roundRectPath(c, x, y, w, h, r) {
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  function drawIcon(c, type, cx, cy, size, color) {
    c.save();
    c.translate(cx, cy);
    c.scale(size / 48, size / 48);
    c.fillStyle = color;
    c.strokeStyle = color;
    c.lineWidth = 4.2;
    c.lineCap = "round";
    c.lineJoin = "round";
    ICONS[type](c);
    c.restore();
  }

  function iconBadge(c, d, cx, cy, r) {
    c.save();
    c.shadowColor = "rgba(0,0,0,0.18)";
    c.shadowBlur = 6;
    c.shadowOffsetY = 2;
    c.fillStyle = d.color;
    c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.fill();
    c.restore();
    drawIcon(c, d.icon, cx, cy, r * 1.35, "#fff");
  }

  // ---------- Helpers de texto ----------
  function text(c, str, x, y, { font, color = COLORS.text, align = "left", spacing = 0, baseline = "middle" }) {
    c.font = font;
    c.fillStyle = color;
    c.textAlign = align;
    c.textBaseline = baseline;
    if ("letterSpacing" in c) {
      c.letterSpacing = spacing + "px";
      c.fillText(str, x, y);
      c.letterSpacing = "0px";
    } else {
      c.fillText(str, x, y);
    }
  }

  function roundRect(c, x, y, w, h, r, fill, stroke) {
    c.beginPath();
    roundRectPath(c, x, y, w, h, r);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.stroke(); }
  }

  function fmt(v) {
    if (v === null || v === undefined || Number.isNaN(v)) return "–";
    return Number.isInteger(v) ? String(v) : v.toFixed(1).replace(".", ",");
  }

  function formatDate(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  }

  // ---------- Dibujo principal ----------
  function render(canvas, data, scale) {
    canvas.width = W * scale;
    canvas.height = H * scale;
    const c = canvas.getContext("2d");
    c.setTransform(scale, 0, 0, scale, 0, 0);

    c.fillStyle = "#fff";
    c.fillRect(0, 0, W, H);

    drawHeader(c, data);
    drawLegend(c);
    drawRadar(c, data);
    drawLabels(c);
    drawTable(c, data);
    drawInterpretation(c);
  }

  function drawHeader(c, data) {
    // Logo
    text(c, "ONE MILE", 228, 50, { font: `700 68px ${FONT_HEAD}`, color: COLORS.black, align: "center", spacing: 1 });
    text(c, "ATHLETE", 228, 87, { font: `600 18px ${FONT_HEAD}`, color: COLORS.black, align: "center", spacing: 9 });
    c.strokeStyle = COLORS.gold;
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(62, 90); c.lineTo(132, 90);
    c.moveTo(324, 90); c.lineTo(394, 90);
    c.stroke();

    // Bloque de título
    roundRect(c, 448, 8, 822, 86, 4, COLORS.black);
    text(c, "ATHLETE PERFORMANCE RADAR", 859, 38, { font: `700 46px ${FONT_HEAD}`, color: "#fff", align: "center", spacing: 1.5 });

    const parts = [];
    if (data.name.trim()) parts.push(data.name.trim().toUpperCase());
    if (data.date) parts.push(formatDate(data.date));
    const subtitle = parts.length ? parts.join("  ·  ") : "EJEMPLO DE RELLENO";
    text(c, subtitle, 859, 74, { font: `500 20px ${FONT_BODY}`, color: "#fff", align: "center", spacing: 8 });
  }

  function drawLegend(c) {
    c.lineWidth = 1.5;
    roundRect(c, 967, 114, 302, 74, 6, "#fff", "#cfd3d8");
    const items = [
      { y: 136, color: COLORS.current, label: "Nivel actual" },
      { y: 167, color: COLORS.target, label: "Nivel objetivo (8-12 semanas)" },
    ];
    items.forEach((it) => {
      c.strokeStyle = it.color;
      c.lineWidth = 3;
      c.beginPath(); c.moveTo(984, it.y); c.lineTo(1032, it.y); c.stroke();
      c.fillStyle = it.color;
      dot(c, 1008, it.y, 7);
      text(c, it.label, 1046, it.y, { font: `500 18px ${FONT_BODY}`, color: COLORS.black });
    });
  }

  const CX = 657, CY = 452, R = 268;
  const angle = (i) => -Math.PI / 2 + (i * Math.PI * 2) / DIMENSIONS.length;
  const point = (i, v) => {
    const r = (Math.max(0, Math.min(10, v)) / 10) * R;
    return [CX + Math.cos(angle(i)) * r, CY + Math.sin(angle(i)) * r];
  };

  function drawRadar(c, data) {
    // Fondo y anillos
    c.fillStyle = "#fff";
    c.beginPath(); c.arc(CX, CY, R, 0, Math.PI * 2); c.fill();

    c.strokeStyle = "#d9dadd";
    c.lineWidth = 1.4;
    for (let v = 2; v <= 8; v += 2) {
      c.beginPath(); c.arc(CX, CY, (v / 10) * R, 0, Math.PI * 2); c.stroke();
    }

    // Ejes
    DIMENSIONS.forEach((_, i) => {
      const a = angle(i);
      const cos = Math.cos(a), sin = Math.sin(a);
      c.strokeStyle = "#9a9da2";
      c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(CX, CY); c.lineTo(CX + cos * R, CY + sin * R); c.stroke();

      // El eje inferior es corto y sin flecha para no invadir la etiqueta de Skills.
      const isBottom = Math.abs(a - Math.PI / 2) < 1e-6;
      const end = isBottom ? R + 8 : R + 20;
      c.strokeStyle = COLORS.black;
      c.lineWidth = 1.6;
      c.beginPath(); c.moveTo(CX + cos * R, CY + sin * R); c.lineTo(CX + cos * end, CY + sin * end); c.stroke();
      if (isBottom) return;
      // flecha
      const tipX = CX + cos * (end + 6), tipY = CY + sin * (end + 6);
      c.save();
      c.translate(tipX, tipY);
      c.rotate(a);
      c.fillStyle = COLORS.black;
      c.beginPath(); c.moveTo(0, 0); c.lineTo(-12, -5.5); c.lineTo(-12, 5.5); c.closePath(); c.fill();
      c.restore();
    });

    // Círculo exterior
    c.strokeStyle = COLORS.black;
    c.lineWidth = 3;
    c.beginPath(); c.arc(CX, CY, R, 0, Math.PI * 2); c.stroke();

    // Escala sobre el eje vertical
    for (let v = 2; v <= 8; v += 2) {
      const y = CY - (v / 10) * R;
      c.strokeStyle = COLORS.black;
      c.lineWidth = 1.4;
      c.beginPath(); c.moveTo(CX - 5, y); c.lineTo(CX + 5, y); c.stroke();
      text(c, String(v), CX + 14, y, { font: `500 19px ${FONT_BODY}`, color: COLORS.black });
    }
    text(c, "10", CX + 10, CY - R - 4, { font: `500 20px ${FONT_BODY}`, color: COLORS.black });

    // Polígonos
    drawSeries(c, data, 1, COLORS.target, "rgba(229, 51, 58, 0.16)");
    drawSeries(c, data, 0, COLORS.current, "rgba(60, 80, 215, 0.20)");
  }

  function drawSeries(c, data, idx, stroke, fill) {
    const pts = DIMENSIONS.map((d, i) => {
      const v = data.values[d.key]?.[idx];
      return point(i, Number.isFinite(v) ? v : 0);
    });
    c.beginPath();
    pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.closePath();
    c.fillStyle = fill;
    c.fill();
    c.strokeStyle = stroke;
    c.lineWidth = 3;
    c.lineJoin = "round";
    c.stroke();

    DIMENSIONS.forEach((d, i) => {
      if (!Number.isFinite(data.values[d.key]?.[idx])) return;
      c.fillStyle = stroke;
      dot(c, pts[i][0], pts[i][1], 7);
    });
  }

  function drawLabels(c) {
    DIMENSIONS.forEach((d) => {
      const L = d.label;
      iconBadge(c, d, L.ix, L.iy, 34);
      text(c, d.name.toUpperCase(), L.tx, L.ty, { font: `700 28px ${FONT_HEAD}`, color: COLORS.black, align: L.align });
      d.desc.forEach((line, k) => {
        text(c, line, L.tx, L.ty + 27 + k * 23, { font: `400 19px ${FONT_BODY}`, color: COLORS.muted, align: L.align });
      });
    });
  }

  function drawTable(c, data) {
    const x = 22, y = 802, w = 626, h = 386;
    c.save();
    c.shadowColor = "rgba(0,0,0,0.12)";
    c.shadowBlur = 8;
    roundRect(c, x, y, w, h, 6, "#fff");
    c.restore();
    c.lineWidth = 1;
    roundRect(c, x, y, w, h, 6, null, "#dfe3e8");

    // Cabecera
    c.save();
    c.beginPath(); roundRectPath(c, x, y, w, h, 6); c.clip();
    const g = c.createLinearGradient(x, 0, x + w, 0);
    g.addColorStop(0, "#1f5fb8");
    g.addColorStop(1, "#4a8fe2");
    c.fillStyle = g;
    c.fillRect(x, y, w, 46);
    c.restore();
    text(c, "PUNTUACIONES DEL ATLETA", x + 24, y + 24, { font: `600 26px ${FONT_HEAD}`, color: "#fff", spacing: 0.5 });

    // Columnas
    const colA = 351, colB = 530;
    const headY = y + 66;
    text(c, "DIMENSIÓN", 66, headY, { font: `600 18px ${FONT_HEAD}`, color: COLORS.black });
    text(c, "NIVEL ACTUAL", colA, headY, { font: `600 18px ${FONT_HEAD}`, color: COLORS.black, align: "center" });
    text(c, "NIVEL OBJETIVO", colB, headY, { font: `600 18px ${FONT_HEAD}`, color: COLORS.black, align: "center" });
    c.strokeStyle = "#cfd8e6";
    c.lineWidth = 2;
    c.beginPath(); c.moveTo(x + 10, headY + 14); c.lineTo(x + w - 20, headY + 14); c.stroke();

    const rowH = 34;
    const startY = headY + 16;
    DIMENSIONS.forEach((d, i) => {
      const ry = startY + i * rowH;
      if (i % 2 === 0) { c.fillStyle = "#f7f8fa"; c.fillRect(x + 10, ry, w - 30, rowH); }
      c.strokeStyle = "#e6e8eb";
      c.lineWidth = 1;
      c.beginPath(); c.moveTo(x + 10, ry + rowH); c.lineTo(x + w - 20, ry + rowH); c.stroke();
      // separadores de columna
      c.beginPath();
      c.moveTo(265, ry); c.lineTo(265, ry + rowH);
      c.moveTo(441, ry); c.lineTo(441, ry + rowH);
      c.stroke();

      const my = ry + rowH / 2;
      drawIcon(c, d.icon, 70, my, 30, d.color);
      text(c, d.name, 110, my, { font: `500 19px ${FONT_BODY}`, color: COLORS.black });
      const [cur, tgt] = data.values[d.key] || [];
      text(c, fmt(cur), colA, my, { font: `500 19px ${FONT_BODY}`, color: COLORS.text, align: "center" });
      text(c, fmt(tgt), colB, my, { font: `500 19px ${FONT_BODY}`, color: COLORS.text, align: "center" });
    });
  }

  function drawInterpretation(c) {
    const x = 668, y = 802, w = 620, h = 386;
    c.save();
    c.shadowColor = "rgba(0,0,0,0.12)";
    c.shadowBlur = 8;
    roundRect(c, x, y, w, h, 6, "#fff");
    c.restore();
    c.lineWidth = 1;
    roundRect(c, x, y, w, h, 6, null, "#dfe3e8");

    c.save();
    c.beginPath(); roundRectPath(c, x, y, w, h, 6); c.clip();
    c.fillStyle = COLORS.muted;
    c.fillRect(x, y, w, 46);
    c.restore();
    text(c, "CÓMO INTERPRETAR EL RESULTADO", x + 20, y + 24, { font: `600 26px ${FONT_HEAD}`, color: "#fff", spacing: 0.5 });

    const items = [
      { n: "1", color: "#1565c0", title: "NIVEL ACTUAL", lines: ["Representa dónde te encuentras ahora en cada dimensión."] },
      { n: "2", color: "#e53935", title: "NIVEL OBJETIVO", lines: ["Representa dónde te gustaría estar en 8-12 semanas."] },
      { n: "3", color: "#3d434b", title: "EL GAP", lines: ["La distancia entre ambas líneas muestra tu margen de mejora", "en cada dimensión."] },
    ];
    items.forEach((it, i) => {
      const cy = y + 84 + i * 64;
      c.fillStyle = it.color;
      dot(c, 716, cy, 26);
      text(c, it.n, 716, cy + 1, { font: `700 30px ${FONT_HEAD}`, color: "#fff", align: "center" });
      text(c, it.title, 767, cy - 13, { font: `700 22px ${FONT_HEAD}`, color: it.color === "#3d434b" ? "#3d434b" : it.color });
      it.lines.forEach((ln, k) => {
        text(c, ln, 767, cy + 12 + k * 22, { font: `400 19px ${FONT_BODY}`, color: COLORS.muted });
      });
    });

    roundRect(c, 690, y + 270, 580, 100, 8, "#eef0f3");
    text(c, "IMPORTANTE", 710, y + 290, { font: `700 20px ${FONT_HEAD}`, color: COLORS.black });
    const imp = [
      "Este es solo un ejemplo. Tus puntuaciones pueden ser diferentes.",
      "Sé honesto contigo mismo y utiliza esta herramienta para identificar",
      "tus fortalezas, tus áreas de mejora y definir tus objetivos.",
    ];
    imp.forEach((ln, k) => {
      text(c, ln, 710, y + 314 + k * 21, { font: `400 17.5px ${FONT_BODY}`, color: COLORS.muted });
    });
  }

  // ---------- Estado y formulario ----------
  const $ = (id) => document.getElementById(id);
  const canvas = $("radar");
  const nameInput = $("athleteName");
  const dateInput = $("athleteDate");
  const body = $("scoresBody");
  const profileSelect = $("profileSelect");
  const statusEl = $("status");
  const downloadBtn = $("downloadBtn");

  const inputs = {}; // key -> [currentInput, targetInput]

  function buildForm() {
    DIMENSIONS.forEach((d) => {
      const tr = document.createElement("tr");
      const tdName = document.createElement("td");
      const wrap = document.createElement("div");
      wrap.className = "dim";
      const ic = document.createElement("canvas");
      ic.width = 44; ic.height = 44;
      const ictx = ic.getContext("2d");
      ictx.scale(2, 2);
      drawIcon(ictx, d.icon, 11, 11, 22, d.color);
      wrap.append(ic, document.createTextNode(d.name));
      tdName.append(wrap);
      tr.append(tdName);

      inputs[d.key] = ["current", "target"].map((kind) => {
        const td = document.createElement("td");
        const inp = document.createElement("input");
        inp.type = "number";
        inp.min = "0"; inp.max = "10"; inp.step = "0.5";
        inp.inputMode = "decimal";
        inp.className = kind;
        inp.setAttribute("aria-label", `${d.name} — nivel ${kind === "current" ? "actual" : "objetivo"}`);
        inp.addEventListener("input", onChange);
        td.append(inp);
        tr.append(td);
        return inp;
      });
      body.append(tr);
    });
  }

  function parseValue(inp) {
    if (inp.value.trim() === "") return null;
    const v = Number(inp.value.replace(",", "."));
    return Number.isFinite(v) ? v : NaN;
  }

  function readForm() {
    const values = {};
    DIMENSIONS.forEach((d) => {
      values[d.key] = inputs[d.key].map(parseValue);
    });
    return { name: nameInput.value, date: dateInput.value, values };
  }

  function writeForm(data) {
    nameInput.value = data.name || "";
    dateInput.value = data.date || "";
    DIMENSIONS.forEach((d) => {
      const vals = data.values?.[d.key] || [null, null];
      inputs[d.key].forEach((inp, i) => {
        inp.value = vals[i] === null || vals[i] === undefined ? "" : vals[i];
      });
    });
  }

  function validate(data) {
    let complete = true;
    let valid = true;
    DIMENSIONS.forEach((d) => {
      inputs[d.key].forEach((inp, i) => {
        const v = data.values[d.key][i];
        const bad = v !== null && (Number.isNaN(v) || v < 0 || v > 10);
        inp.classList.toggle("invalid", bad);
        if (bad) valid = false;
        if (v === null) complete = false;
      });
    });
    const hasName = data.name.trim().length > 0;
    return { valid, complete, hasName, ready: valid && complete && hasName };
  }

  function sanitized(data) {
    const values = {};
    DIMENSIONS.forEach((d) => {
      values[d.key] = data.values[d.key].map((v) =>
        v === null || Number.isNaN(v) ? null : Math.max(0, Math.min(10, v))
      );
    });
    return { ...data, values };
  }

  function setStatus(msg, kind = "") {
    statusEl.textContent = msg;
    statusEl.className = "status " + kind;
  }

  function refresh() {
    const data = readForm();
    const v = validate(data);
    render(canvas, sanitized(data), 1);
    downloadBtn.disabled = !v.ready;
    if (!v.valid) setStatus("Hay valores fuera de rango (0-10).", "err");
    else if (!v.hasName) setStatus("Introduce el nombre del atleta para poder descargar.", "");
    else if (!v.complete) setStatus("Completa todas las puntuaciones para poder descargar.", "");
    else setStatus("Listo para descargar.", "ok");
    return data;
  }

  function onChange() {
    const data = refresh();
    localStorage.setItem(STORAGE_DRAFT, JSON.stringify({ ...data, profileId: profileSelect.value }));
  }

  // ---------- Perfiles (localStorage) ----------
  function loadProfiles() {
    try { return JSON.parse(localStorage.getItem(STORAGE_PROFILES)) || {}; }
    catch { return {}; }
  }
  function saveProfiles(p) { localStorage.setItem(STORAGE_PROFILES, JSON.stringify(p)); }

  function renderProfileOptions(selectedId = "") {
    const profiles = loadProfiles();
    profileSelect.innerHTML = '<option value="">— Nuevo perfil —</option>';
    Object.entries(profiles)
      .sort((a, b) => a[1].name.localeCompare(b[1].name, "es"))
      .forEach(([id, p]) => {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = p.date ? `${p.name} (${formatDate(p.date)})` : p.name;
        profileSelect.append(opt);
      });
    profileSelect.value = profiles[selectedId] ? selectedId : "";
  }

  function saveProfile() {
    const data = readForm();
    const v = validate(data);
    if (!data.name.trim()) { setStatus("Introduce un nombre para guardar el perfil.", "err"); nameInput.focus(); return; }
    if (!v.valid) { setStatus("Corrige los valores fuera de rango antes de guardar.", "err"); return; }
    const profiles = loadProfiles();
    let id = profileSelect.value;
    if (!id || profiles[id]?.name !== data.name.trim()) {
      // Reutiliza un perfil con el mismo nombre y fecha, o crea uno nuevo.
      id = Object.keys(profiles).find((k) => profiles[k].name === data.name.trim() && profiles[k].date === data.date)
        || `p_${Date.now()}`;
    }
    profiles[id] = { ...sanitized(data), name: data.name.trim(), updatedAt: new Date().toISOString() };
    saveProfiles(profiles);
    renderProfileOptions(id);
    onChange();
    setStatus(`Perfil "${data.name.trim()}" guardado en este navegador.`, "ok");
  }

  function deleteProfile() {
    const id = profileSelect.value;
    if (!id) { setStatus("Selecciona un perfil guardado para eliminarlo.", "err"); return; }
    const profiles = loadProfiles();
    const name = profiles[id]?.name;
    if (!confirm(`¿Eliminar el perfil "${name}"?`)) return;
    delete profiles[id];
    saveProfiles(profiles);
    renderProfileOptions("");
    onChange();
    setStatus(`Perfil "${name}" eliminado.`, "ok");
  }

  function selectProfile() {
    const id = profileSelect.value;
    if (id) {
      const p = loadProfiles()[id];
      if (p) writeForm(p);
    }
    onChange();
  }

  // ---------- Descarga ----------
  function download() {
    const data = readForm();
    if (!validate(data).ready) { refresh(); return; }
    const out = document.createElement("canvas");
    render(out, sanitized(data), EXPORT_SCALE);
    const slug = data.name.trim().toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "atleta";
    out.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `performance-radar-${slug}${data.date ? "-" + data.date : ""}.png`;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  }

  // ---------- Init ----------
  function today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function init() {
    buildForm();
    let draft = null;
    try { draft = JSON.parse(localStorage.getItem(STORAGE_DRAFT)); } catch { /* ignore */ }
    renderProfileOptions(draft?.profileId || "");
    writeForm(draft || { ...EXAMPLE, date: today() });

    nameInput.addEventListener("input", onChange);
    dateInput.addEventListener("input", onChange);
    profileSelect.addEventListener("change", selectProfile);
    $("saveBtn").addEventListener("click", saveProfile);
    $("deleteBtn").addEventListener("click", deleteProfile);
    downloadBtn.addEventListener("click", download);
    $("exampleBtn").addEventListener("click", () => {
      writeForm({ ...EXAMPLE, name: nameInput.value, date: dateInput.value || today() });
      onChange();
    });
    $("clearBtn").addEventListener("click", () => {
      profileSelect.value = "";
      writeForm({ name: "", date: today(), values: {} });
      onChange();
    });

    refresh();
    // Redibuja cuando las fuentes web estén disponibles.
    if (document.fonts) {
      Promise.all([
        document.fonts.load(`700 40px Oswald`),
        document.fonts.load(`600 20px Oswald`),
        document.fonts.load(`400 20px "Roboto Condensed"`),
        document.fonts.load(`500 20px "Roboto Condensed"`),
      ]).then(refresh).catch(() => {});
    }
  }

  init();
})();
