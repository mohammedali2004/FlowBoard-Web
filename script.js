// Init High-Definition Cosmic Galaxy Stars
function initStarsCanvas() {
  const canvas = document.getElementById("stars-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw high-density star field (2500 stars)
  drawStars(ctx, canvas.width, canvas.height);
}

// Enhanced drawStars function for cosmic galaxy effect
function drawStars(ctx, width, height) {
  const starCount = 3000; // High-density galactic field

  for (let i = 0; i < starCount; i++) {
    let x, y;
    const isInBand = Math.random() < 0.75; // Most stars cluster in the galactic stream

    if (isInBand) {
      // Cluster stars along a diagonal band (Milky Way effect)
      const progress = Math.random();
      const lineX = progress * width;
      const lineY = progress * height;

      // Add "thickness" to the band using a spread effect
      const spread = (Math.random() + Math.random() + Math.random() - 1.5) * (width * 0.3);
      x = lineX + spread;
      y = lineY - (spread * 0.5);
    } else {
      x = Math.random() * width;
      y = Math.random() * height;
    }

    // Varying star sizes for depth perception
    let radius, opacity, glowRadius;
    const starType = Math.random();

    // Larger stars are more frequent in the galactic band
    const sizeMod = isInBand ? 1.15 : 0.85;

    if (starType < 0.15) {
      // Large bright stars (Cluster hubs)
      radius = (Math.random() * 1.6 + 1.2) * sizeMod;
      opacity = Math.random() * 0.6 + 0.4;
      glowRadius = radius * 7;
    } else if (starType < 0.4) {
      // Medium stars
      radius = (Math.random() * 0.8 + 0.6) * sizeMod;
      opacity = Math.random() * 0.5 + 0.3;
      glowRadius = radius * 4;
    } else {
      // Small pinpoint background stars
      radius = (Math.random() * 0.3 + 0.1) * sizeMod;
      opacity = Math.random() * 0.7 + 0.2;
      glowRadius = radius * 1.5;
    }

    // Star colors: Crisp white, cinematic blue, and soft golden/peach
    let r, g, b;
    const colorType = Math.random();
    if (colorType < 0.55) {
      r = g = b = 255;
    } else if (colorType < 0.8) {
      r = 190 + Math.random() * 65;
      g = 210 + Math.random() * 45;
      b = 255;
    } else {
      r = 255;
      g = 225 + Math.random() * 30;
      b = 160 + Math.random() * 95;
    }

    // Draw high-definition glowing effect for bright stars
    if (radius > 0.6) {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.85})`);
      gradient.addColorStop(0.25, `rgba(${r}, ${g}, ${b}, ${opacity * 0.3})`);
      gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${opacity * 0.05})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw star core
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(opacity + 0.2, 1)})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Extra sparkles along the band for the "diamond dust" look
  for (let i = 0; i < 80; i++) {
    const t = Math.random();
    const x = t * width + (Math.random() - 0.5) * (width * 0.2);
    const y = t * height + (Math.random() - 0.5) * (height * 0.1);
    const radius = Math.random() * 0.5 + 0.2;
    const opacity = Math.random() * 0.9 + 0.1;

    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Initialize stars on load
window.addEventListener("load", initStarsCanvas);
window.addEventListener("resize", initStarsCanvas);

const STORAGE_KEY = "flowboard-state-v1";

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cloneState()));
  } catch (error) {
    // Silently handle save errors
  }
}

function applyModeAppearance(mode) {
  if (mode === "branching") {
    document.body.classList.add("mode-branching");
    document.body.classList.remove("mode-flow");
    applyConstellationBackground();
    sidebar.classList.add("open");
  } else {
    document.body.classList.add("mode-flow");
    document.body.classList.remove("mode-branching");
    board.style.backgroundImage = "";
    const beamCanvas = document.getElementById("beam-canvas");
    if (beamCanvas) beamCanvas.remove();
    window.beamAnimationRunning = false;
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const snapshot = JSON.parse(raw);
    if (!snapshot || !Array.isArray(snapshot.maps)) return false;

    applyState(snapshot);
    applyModeAppearance(snapshot.currentAppMode || "flow");

    if (snapshot.isViewMode) {
      isViewMode = true;
      enterViewMode();
    }

    return true;
  } catch (error) {
    // Silently handle load errors
    return false;
  }
}

// Get DOM elements
const board = document.getElementById("board");
const edgesGroup = document.getElementById("edges-group");
const nodesLayer = document.getElementById("nodes-layer");
const canvasContent = document.getElementById("canvas-content");
const edgesLayer = document.getElementById("edges-layer");
const leftToolbar = document.getElementById("left-toolbar");
const topbar = document.getElementById("topbar");
const toggleModeBtn = document.getElementById("toggle-mode-btn");
const hideToolsBtn = document.getElementById("hide-tools-btn");
const hint = document.getElementById("hint");
const zoomLevel = document.getElementById("zoom-level");
const zoomInBtn = document.getElementById("zoom-in-btn");
const zoomOutBtn = document.getElementById("zoom-out-btn");
const viewNavControls = document.getElementById("view-nav-controls");
const prevStepBtn = document.getElementById("prev-step-btn");
const nextStepBtn = document.getElementById("next-step-btn");
const stepIndicator = document.getElementById("step-indicator");

const toolButtons = Array.from(document.querySelectorAll(".tool-btn"));
const connectOptions = Array.from(document.querySelectorAll(".connect-option"));
const connectMenu = document.getElementById("connect-menu");
const newMapBtn = document.getElementById("new-map-btn");
const saveMapBtn = document.getElementById("save-map-btn");
const mapNameInput = document.getElementById("map-name");
const sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");
const sidebarCloseBtn = document.getElementById("sidebar-close-btn");
const sidebar = document.getElementById("sidebar");
const mapsList = document.getElementById("maps-list");
const mapsCount = document.getElementById("maps-count");
const landingScreen = document.getElementById("landing-screen");
const modeCards = Array.from(document.querySelectorAll(".landing-mode-card"));
const appShell = document.getElementById("app-shell");
const undoBtn = document.getElementById("undo-btn");
const redoBtn = document.getElementById("redo-btn");

// Node Properties Elements
const propertiesSidebar = document.getElementById("properties-sidebar");
const propertiesCloseBtn = document.getElementById("properties-close-btn");
const nodeTitleInput = document.getElementById("node-title-input");
const nodeOrderInput = document.getElementById("node-order-input");
const nodeDescInput = document.getElementById("node-desc-input");

// Media upload elements
const nodeImageInput = document.getElementById("node-image-input");
const mediaUploadArea = document.getElementById("media-upload-area");
const mediaPlaceholder = document.getElementById("media-placeholder");
const mediaPreview = document.getElementById("media-preview");
const mediaRemoveBtn = document.getElementById("media-remove-btn");
const mediaScaleRow = document.getElementById("media-scale-row");
const imageScaleInput = document.getElementById("image-scale-input");

// View Mode Elements
// Context Menu Elements
const contextMenu = document.getElementById("context-menu");
const editTextBtn = document.getElementById("edit-text-btn");
const deleteNodeBtn = document.getElementById("delete-node-btn");

let nodeCounter = 0;
let edgeCounter = 0;
let junctionCounter = 0;
let isDragging = false;
let dragNode = null;
let isPanning = false;
let isViewMode = false;
let currentStepIndex = 0;
let sortedNodes = [];
let toolsHidden = false;
let activeTool = "move";
let connectStyle = "solid";
let pendingSource = null;
let zoom = 1;
let panX = 0;
let panY = 0;
let dragMoved = false;
let isSpacePressed = false;
let dragType = null;
let offsetX = 0;
let offsetY = 0;

// Multi-selection variables (simplified)
let isSelecting = false;
let selectedNodes = [];
let selectionStartX = 0;
let selectionStartY = 0;
let selectionBox = null;

// Context Menu State
let contextMenuTargetNode = null;

// Toggle Mode State
let toggleMode = false;

// Resize state (Select tool · Flow mode)
let isResizing = false;
let resizeNodeId = null;
let resizeDir = "";
let resizeStartClientX = 0;
let resizeStartClientY = 0;
let resizeStartWidth = 0;
let resizeStartHeight = 0;
let resizeStartNodeX = 0;
let resizeStartNodeY = 0;

const maps = [];
let currentMapId = "";
const undoStack = [];
const redoStack = [];

function cloneState() {
  return {
    maps: JSON.parse(JSON.stringify(maps)),
    currentMapId,
    currentAppMode,
    isViewMode,
    nodeCounter,
    edgeCounter,
    junctionCounter
  };
}

function updateHistoryButtons() {
  undoBtn.disabled = undoStack.length === 0;
  redoBtn.disabled = redoStack.length === 0;
}

function pushHistorySnapshot(snapshot) {
  undoStack.push(snapshot);
  if (undoStack.length > 100) undoStack.shift();
  redoStack.length = 0;
  updateHistoryButtons();
}

function recordHistory() {
  pushHistorySnapshot(cloneState());
}

function applyState(snapshot) {
  maps.length = 0;
  snapshot.maps.forEach((map) => maps.push(map));
  currentMapId = snapshot.currentMapId;
  currentAppMode = snapshot.currentAppMode || "flow";
  isViewMode = snapshot.isViewMode || false;
  nodeCounter = snapshot.nodeCounter;
  edgeCounter = snapshot.edgeCounter;
  junctionCounter = snapshot.junctionCounter;
  pendingSource = null;
  clearSourceSelection();
  mapNameInput.value = getCurrentMap()?.name || "Map";
  renderCurrentMap();
  renderMapsList();
  updateHistoryButtons();
}

function createInitialMap(name) {
  nodeCounter += 1;
  return {
    id: `map-${Date.now()}`,
    name,
    nodes: [{
      id: `node-${nodeCounter}`,
      x: 260,
      y: 190,
      text: "Scene 1",
      isSubNode: false,
      parentId: null,
      collapsed: false,
      imageData: null,
      imageScale: 1,
      width: null,
      height: null
    }],
    junctions: [],
    edges: []
  };
}

function getCurrentMap() {
  return maps.find((map) => map.id === currentMapId);
}

let currentAppMode = "flow";

const modeHandlers = {
  flow: initializeFlowMode,
  branching: initializeBranchingMode
};

function initializeFlowMode() {
  currentAppMode = "flow";
  document.body.classList.add("mode-flow");
  document.body.classList.remove("mode-branching");

  // Clean up branching beam canvas
  const beamCanvas = document.getElementById("beam-canvas");
  if (beamCanvas) beamCanvas.remove();
  window.beamAnimationRunning = false;

  // Remove board background image set by branching mode
  board.style.backgroundImage = "";
}

function initializeBranchingMode() {
  if (typeof branchingModeInit === "function") {
    branchingModeInit();
  }
}

function applyConstellationBackground() {
  if (typeof branchingApplyConstellationBackground === "function") {
    branchingApplyConstellationBackground();
  }
}

// Update core node position on window resize
function updateCoreNodePosition() {
  if (currentAppMode === "branching") {
    const map = getCurrentMap();
    if (map) {
      const coreNode = map.nodes.find(node => node.isCoreNode);
      if (coreNode) {
        coreNode.x = window.innerWidth / 2 - 100;
        coreNode.y = window.innerHeight / 2 - 100;
        renderCurrentMap();
      }
    }
  }
}

function hideLandingScreen() {
  landingScreen.classList.add("fade-out");
  setTimeout(() => {
    landingScreen.classList.add("hidden");
    landingScreen.classList.remove("fade-out");
  }, 260);
}

function showAppShell() {
  appShell.classList.remove("shell-hidden");
  requestAnimationFrame(() => appShell.classList.add("visible"));
}

function wrapText(text, maxWidth, maxHeight = null, fontSize = 14, fontFamily = "'Space Grotesk', 'Segoe UI', Arial, sans-serif") {
  // Use 90% of node width for text wrapping
  const actualMaxWidth = maxWidth * 0.9;
  
  // Create a temporary canvas to measure text width
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `${fontSize}px ${fontFamily}`;
  
  const lineHeight = fontSize * 1.4; // Line height based on font size
  const lines = [];
  let currentLine = '';
  let totalHeight = 0;
  
  // Character-by-character wrapping for better Arabic support
  const characters = text.split('');
  
  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > actualMaxWidth && currentLine) {
      // Add current line to lines array and start new line
      lines.push(currentLine);
      totalHeight += lineHeight;
      
      // Check if we've exceeded max height
      if (maxHeight && totalHeight > maxHeight) {
        // Remove the last line and add ellipsis to the previous line
        lines.pop();
        if (lines.length > 0) {
          const lastLine = lines[lines.length - 1];
          // Trim last line to fit ellipsis
          let ellipsisLine = lastLine;
          while (ctx.measureText(ellipsisLine + '...').width > actualMaxWidth && ellipsisLine.length > 0) {
            ellipsisLine = ellipsisLine.slice(0, -1);
          }
          lines[lines.length - 1] = ellipsisLine + '...';
        }
        return lines;
      }
      
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  
  // Add the last line and check height
  if (currentLine) {
    lines.push(currentLine);
    totalHeight += lineHeight;
    
    // Check if final line exceeds max height
    if (maxHeight && totalHeight > maxHeight) {
      lines.pop();
      if (lines.length > 0) {
        const lastLine = lines[lines.length - 1];
        let ellipsisLine = lastLine;
        while (ctx.measureText(ellipsisLine + '...').width > actualMaxWidth && ellipsisLine.length > 0) {
          ellipsisLine = ellipsisLine.slice(0, -1);
        }
        lines[lines.length - 1] = ellipsisLine + '...';
      }
    }
  }
  
  return lines;
}

function enterMode(mode) {
  hideLandingScreen();
  showAppShell();
  sidebar.classList.remove("open");
  modeHandlers[mode]();
  renderCurrentMap();
  renderMapsList();
  setTool("move");
}

function applyCanvasTransform() {
  canvasContent.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
  zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
}

function setZoomAtClient(nextZoom, clientX, clientY) {
  const clamped = Math.min(2.5, Math.max(0.3, nextZoom));
  if (clamped === zoom) return;
  const oldZoom = zoom;
  const rect = board.getBoundingClientRect();
  const pointerX = clientX - rect.left;
  const pointerY = clientY - rect.top;
  const worldX = (pointerX - panX) / oldZoom;
  const worldY = (pointerY - panY) / oldZoom;
  zoom = clamped;
  panX = pointerX - worldX * zoom;
  panY = pointerY - worldY * zoom;
  applyCanvasTransform();
}

function worldFromClient(clientX, clientY) {
  const rect = board.getBoundingClientRect();
  return {
    x: (clientX - rect.left - panX) / zoom,
    y: (clientY - rect.top - panY) / zoom
  };
}

function getConnectorCenterById(map, connectorId) {
  const nodeEl = nodesLayer.querySelector(`[data-node-id="${connectorId}"]`);
  if (nodeEl) {
    const x = Number(nodeEl.style.left.replace("px", ""));
    const y = Number(nodeEl.style.top.replace("px", ""));
    return { x: x + nodeEl.offsetWidth / 2, y: y + nodeEl.offsetHeight / 2 };
  }

  const junction = map.junctions.find((point) => point.id === connectorId);
  if (junction) {
    return { x: junction.x, y: junction.y };
  }
  return null;
}

function clearSourceSelection() {
  nodesLayer.querySelectorAll(".node").forEach((node) => node.classList.remove("selected"));
  edgesGroup.querySelectorAll(".junction-dot").forEach((dot) => dot.classList.remove("selected-delete"));
}

function markSourceSelection(connectorId) {
  clearSourceSelection();
  const node = nodesLayer.querySelector(`[data-node-id="${connectorId}"]`);
  if (node) {
    node.classList.add("selected");
    return;
  }
  const dot = edgesGroup.querySelector(`[data-junction-id="${connectorId}"]`);
  if (dot) dot.classList.add("selected-delete");
}

function findNearestJunctionId(worldX, worldY, threshold = 14) {
  const map = getCurrentMap();
  if (!map || map.junctions.length === 0) return "";
  let nearestId = "";
  let nearestDist = Number.POSITIVE_INFINITY;
  map.junctions.forEach((point) => {
    const dx = point.x - worldX;
    const dy = point.y - worldY;
    const dist = Math.hypot(dx, dy);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearestId = point.id;
    }
  });
  return nearestDist <= threshold ? nearestId : "";
}

function redrawConnections() {
  edgesGroup.innerHTML = "";
  const map = getCurrentMap();
  if (!map) return;

  // For Story Branching mode, use enhanced beam rendering
  if (currentAppMode === "branching") {
    renderEnhancedBeams(map);
  } else {
    // Original SVG rendering for Flow mode
    renderSVGConnections(map);
  }
}

// Enhanced beam rendering for Story Branching mode
function renderEnhancedBeams(map) {
  // Create canvas for beam rendering if it doesn't exist
  let beamCanvas = document.getElementById("beam-canvas");
  if (!beamCanvas) {
    beamCanvas = document.createElement("canvas");
    beamCanvas.id = "beam-canvas";
    beamCanvas.style.position = "absolute";
    beamCanvas.style.top = "0";
    beamCanvas.style.left = "0";
    beamCanvas.style.width = "100%";
    beamCanvas.style.height = "100%";
    beamCanvas.style.pointerEvents = "none";
    beamCanvas.style.zIndex = "0";
    // Insert inside canvas-content so it inherits the pan/zoom transform
    canvasContent.insertBefore(beamCanvas, canvasContent.firstChild);
  }

  // Size canvas to the logical canvas-content space (large enough for any pan)
  const canvasSize = 8000;
  if (beamCanvas.width !== canvasSize) {
    beamCanvas.width = canvasSize;
    beamCanvas.height = canvasSize;
    beamCanvas.style.width = canvasSize + "px";
    beamCanvas.style.height = canvasSize + "px";
    beamCanvas.style.top = (-canvasSize / 2) + "px";
    beamCanvas.style.left = (-canvasSize / 2) + "px";
  }

  const ctx = beamCanvas.getContext("2d");
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // Offset so (0,0) in node-space maps to center of canvas
  const offset = canvasSize / 2;

  // Draw enhanced beams
  map.edges.forEach((edge) => {
    const from = getConnectorCenterById(map, edge.from);
    const to = getConnectorCenterById(map, edge.to);
    if (!from || !to) return;

    // Convert from node-space to beam-canvas-space
    drawEnhancedBeam(ctx,
      { x: from.x + offset, y: from.y + offset },
      { x: to.x + offset, y: to.y + offset }
    );
  });

  // Start animation loop for particles
  if (!window.beamAnimationRunning) {
    window.beamAnimationRunning = true;
    animateBeams();
  }
}

// Draw single enhanced beam with 3-layer strokes
function drawEnhancedBeam(ctx, from, to) {
  ctx.save();

  // Calculate bezier curve for branching mode
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  let c1x = from.x;
  let c1y = from.y;
  let c2x = to.x;
  let c2y = to.y;

  if (absDx >= absDy) {
    const curve = Math.max(40, Math.min(160, absDx * 0.45));
    const dir = dx >= 0 ? 1 : -1;
    c1x = from.x + curve * dir;
    c1y = from.y;
    c2x = to.x - curve * dir;
    c2y = to.y;
  } else {
    const curve = Math.max(40, Math.min(160, absDy * 0.45));
    const dir = dy >= 0 ? 1 : -1;
    c1x = from.x;
    c1y = from.y + curve * dir;
    c2x = to.x;
    c2y = to.y - curve * dir;
  }

  // Draw the same path three times with different styles
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.bezierCurveTo(c1x, c1y, c2x, c2y, to.x, to.y);

  // First stroke: wide, transparent glow
  ctx.lineWidth = 14;
  ctx.strokeStyle = 'rgba(15,150,156,0.06)';
  ctx.shadowColor = '#0F969C';
  ctx.shadowBlur = 20;
  ctx.stroke();

  // Second stroke: medium glow
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.bezierCurveTo(c1x, c1y, c2x, c2y, to.x, to.y);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(15,150,156,0.25)';
  ctx.shadowBlur = 12;
  ctx.stroke();

  // Third stroke: core line
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.bezierCurveTo(c1x, c1y, c2x, c2y, to.x, to.y);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(15,150,156,0.8)';
  ctx.shadowBlur = 5;
  ctx.stroke();

  // Draw moving particle
  const t = (Date.now() * 0.0004) % 1;
  const particleX = from.x + (to.x - from.x) * t;
  const particleY = from.y + (to.y - from.y) * t;

  ctx.beginPath();
  ctx.arc(particleX, particleY, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#0F969C';
  ctx.shadowBlur = 10;
  ctx.fill();

  ctx.restore();
}

// Animation loop for beam particles
function animateBeams() {
  if (currentAppMode !== "branching") {
    window.beamAnimationRunning = false;
    return;
  }

  const map = getCurrentMap();
  const beamCanvas = document.getElementById("beam-canvas");
  if (map && beamCanvas) {
    const canvasSize = beamCanvas.width;
    const offset = canvasSize / 2;
    const ctx = beamCanvas.getContext("2d");
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    map.edges.forEach((edge) => {
      const from = getConnectorCenterById(map, edge.from);
      const to = getConnectorCenterById(map, edge.to);
      if (!from || !to) return;
      drawEnhancedBeam(ctx,
        { x: from.x + offset, y: from.y + offset },
        { x: to.x + offset, y: to.y + offset }
      );
    });
  }

  requestAnimationFrame(animateBeams);
}

// Original SVG rendering for Flow mode
function renderSVGConnections(map) {
  map.edges.forEach((edge) => {
    const from = getConnectorCenterById(map, edge.from);
    const to = getConnectorCenterById(map, edge.to);
    if (!from || !to) return;

    // Adaptive bezier controls for cleaner, less jagged links.
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    let c1x = from.x;
    let c1y = from.y;
    let c2x = to.x;
    let c2y = to.y;

    if (absDx >= absDy) {
      const curve = Math.max(40, Math.min(160, absDx * 0.45));
      const dir = dx >= 0 ? 1 : -1;
      c1x = from.x + curve * dir;
      c1y = from.y;
      c2x = to.x - curve * dir;
      c2y = to.y;
    } else {
      const curve = Math.max(40, Math.min(160, absDy * 0.45));
      const dir = dy >= 0 ? 1 : -1;
      c1x = from.x;
      c1y = from.y + curve * dir;
      c2x = to.x;
      c2y = to.y - curve * dir;
    }

    const pathD = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

    const hitPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    hitPath.setAttribute("d", pathD);
    hitPath.setAttribute("class", "edge-hit");
    hitPath.dataset.edgeId = edge.id;
    edgesGroup.appendChild(hitPath);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathD);
    path.setAttribute("class", `edge ${edge.style === "dashed" ? "edge-dashed" : ""}`);
    path.dataset.edgeId = edge.id;

    // Mark sub-node edges for hiding in view mode
    if (edge.isSubEdge) {
      path.setAttribute("data-sub-edge", "true");
    }

    edgesGroup.appendChild(path);
  });

  map.junctions.forEach((point) => {
    const hitCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    hitCircle.setAttribute("class", "junction-hit");
    hitCircle.setAttribute("cx", String(point.x));
    hitCircle.setAttribute("cy", String(point.y));
    hitCircle.setAttribute("r", "12");
    hitCircle.dataset.junctionId = point.id;
    edgesGroup.appendChild(hitCircle);

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("class", "junction-dot");
    circle.setAttribute("cx", String(point.x));
    circle.setAttribute("cy", String(point.y));
    circle.setAttribute("r", "6");
    circle.dataset.junctionId = point.id;
    edgesGroup.appendChild(circle);
  });
}

function renderMapsList() {
  mapsList.innerHTML = "";
  mapsCount.textContent = String(maps.length);
  maps.forEach((map, index) => {
    const mapItem = document.createElement("div");
    mapItem.className = "map-item";
    if (map.id === currentMapId) {
      mapItem.classList.add("active");
    }

    mapItem.innerHTML = `
      <span class="map-item-label">
        <span class="map-icon">🗺</span>
        <span class="map-name" onclick="switchToMap('${map.id}')">${map.name}</span>
      </span>
      <button class="delete-map-btn" onclick="deleteMap('${map.id}')" title="Delete map">✕</button>
    `;

    mapsList.appendChild(mapItem);
  });
}

function deleteMap(mapId) {
  if (maps.length <= 1) {
    alert("Cannot delete the last map!");
    return;
  }

  if (confirm("Are you sure you want to delete this map?")) {
    // Remove map from array
    const mapIndex = maps.findIndex(m => m.id === mapId);
    if (mapIndex > -1) {
      maps.splice(mapIndex, 1);

      // If deleting current map, switch to first map
      if (currentMapId === mapId) {
        currentMapId = maps[0].id;
        renderCurrentMap();
      }

      // Update maps list
      renderMapsList();
      saveState();
    }
  }
}

function switchToMap(mapId) {
  currentMapId = mapId;
  renderCurrentMap();
  renderMapsList();
  mapNameInput.value = getCurrentMap()?.name || "Map";
}

// --- Dynamic Depth-of-Field Logic ---
function updateBranchingFocus() {
  if (typeof currentAppMode === 'undefined' || currentAppMode !== "branching") {
    document.querySelectorAll(".node").forEach(n => {
      n.classList.remove("node-active", "node-past", "node-future");
    });
    return;
  }

  if (selectedNodes.length !== 1) {
    document.querySelectorAll(".node").forEach(n => {
      n.classList.remove("node-active", "node-past", "node-future");
    });
    return;
  }

  const map = getCurrentMap();
  if (!map) return;
  const activeId = selectedNodes[0];

  const pastNodeSet = new Set();
  const getAncestors = (childId) => {
    map.edges.forEach(e => {
      if (e.to === childId && !pastNodeSet.has(e.from)) {
        pastNodeSet.add(e.from);
        getAncestors(e.from);
      }
    });
    const childData = map.nodes.find(n => n.id === childId);
    if (childData && childData.parentId && !pastNodeSet.has(childData.parentId)) {
      pastNodeSet.add(childData.parentId);
      getAncestors(childData.parentId);
    }
  };
  getAncestors(activeId);

  const futureNodeSet = new Set();
  const getDescendants = (parentId) => {
    map.edges.forEach(e => {
      if (e.from === parentId && !futureNodeSet.has(e.to)) {
        futureNodeSet.add(e.to);
        getDescendants(e.to);
      }
    });
    map.nodes.forEach(n => {
      if (n.parentId === parentId && !futureNodeSet.has(n.id)) {
        futureNodeSet.add(n.id);
        getDescendants(n.id);
      }
    });
  };
  getDescendants(activeId);

  document.querySelectorAll(".node").forEach(nodeEl => {
    const id = nodeEl.dataset.nodeId;
    nodeEl.classList.remove("node-active", "node-past", "node-future");
    if (id === activeId) {
      nodeEl.classList.add("node-active");
    } else if (pastNodeSet.has(id)) {
      nodeEl.classList.add("node-past");
    } else if (futureNodeSet.has(id)) {
      nodeEl.classList.add("node-future");
    } else {
      nodeEl.classList.add("node-past");
    }
  });
}

function renderCurrentMap() {
  nodesLayer.innerHTML = "";
  const map = getCurrentMap();
  if (!map) return;

  mapNameInput.value = map.name;

  map.nodes.forEach((nodeData) => {
    // Skip sub-nodes if parent is collapsed (in edit mode)
    if (nodeData.isSubNode) {
      const parent = map.nodes.find(n => n.id === nodeData.parentId);
      if (parent && parent.collapsed && !isViewMode) {
        return;
      }
    }

    const node = document.createElement("div");
    node.className = "node";
    if (nodeData.isSubNode) {
      node.classList.add("sub-node");
    }
    if (nodeData.isCoreNode) {
      node.classList.add("core-node");
    }
    node.dataset.nodeId = nodeData.id;
    // Apply selected class if in selectedNodes
    if (selectedNodes.includes(nodeData.id)) node.classList.add("selected");
    node.style.left = `${nodeData.x}px`;
    node.style.top = `${nodeData.y}px`;

    // Custom size (Flow mode resize)
    if (currentAppMode === "flow" && nodeData.width) { node.style.width = nodeData.width + "px"; node.style.minWidth = "unset"; }
    if (currentAppMode === "flow" && nodeData.height) { node.style.height = nodeData.height + "px"; node.style.minHeight = "unset"; }

    // Image rendering
    if (nodeData.imageData) {
      const img = document.createElement("img");
      img.className = "node-image";
      img.src = nodeData.imageData;
      if (currentAppMode === "branching") {
        img.style.transform = `scale(${nodeData.imageScale || 1})`;
      }
      node.appendChild(img);
      node.classList.add("has-image");
    }

    if (nodeData.order !== undefined) {
      const orderBadge = document.createElement("span");
      orderBadge.className = "node-order-badge";
      orderBadge.textContent = nodeData.order;
      node.appendChild(orderBadge);
    }
    const textEl = document.createElement("div");
    textEl.className = "node-text";
    
    // Calculate available width for text (node width - padding)
    const nodeWidth = nodeData.width || (nodeData.isSubNode ? 120 : 170);
    const padding = 20; // 10px padding on each side
    const maxTextWidth = nodeWidth - padding;
    
    // Get font size based on node type
    const fontSize = nodeData.isSubNode ? 12 : (nodeData.isCoreNode ? 18 : 14);
    
    // Calculate available height for text (node height - padding)
    const nodeHeight = nodeData.height || (nodeData.isSubNode ? 60 : 80);
    const heightPadding = 24; // 12px padding on top and bottom
    const maxTextHeight = nodeHeight - heightPadding;
    
    // Apply character limits
    const titleText = (nodeData.text || "Untitled Scene").substring(0, 60);
    
    // Apply text wrapping with height constraint
    const lines = wrapText(titleText, maxTextWidth, maxTextHeight, fontSize);
    textEl.innerHTML = lines.join('<br>');
    
    node.appendChild(textEl);

    // Corner resize handles (Select tool · Flow mode · selected node)
    if (activeTool === "select" && selectedNodes.includes(nodeData.id) && currentAppMode === "flow") {
      ["nw", "ne", "sw", "se"].forEach(dir => {
        const h = document.createElement("div");
        h.className = `resize-handle resize-${dir}`;
        h.dataset.resizeDir = dir;
        node.appendChild(h);
      });
    }

    nodesLayer.appendChild(node);
  });

  // Add sub-node indicators and collapse functionality
  map.nodes.forEach((nodeData) => {
    if (!nodeData.isSubNode) {
      const hasSubNodes = map.nodes.some(n => n.parentId === nodeData.id);
      if (hasSubNodes) {
        const nodeEl = nodesLayer.querySelector(`[data-node-id="${nodeData.id}"]`);
        if (nodeEl) {
          nodeEl.classList.add("has-sub-nodes");
          if (nodeData.collapsed) {
            nodeEl.classList.add("collapsed");
          }

          // Add collapse indicator click handler
          if (!isViewMode) {
            nodeEl.addEventListener("click", function (e) {
              // Only collapse/expand if clicking on arrow area
              const rect = nodeEl.getBoundingClientRect();
              const arrowSize = 25 * zoom; // Scale arrow area with zoom
              const arrowArea = {
                left: rect.right - arrowSize,
                right: rect.right,
                top: rect.bottom - arrowSize,
                bottom: rect.bottom
              };

              if (e.clientX >= arrowArea.left && e.clientX <= arrowArea.right &&
                e.clientY >= arrowArea.top && e.clientY <= arrowArea.bottom) {
                e.stopPropagation();
                toggleSubNodes(nodeData.id);
              }
            });
          }
        }
      }
    }
  });

  redrawConnections();
  updateBranchingFocus();
}

function createSubNode(x, y, parentNodeId) {
  const map = getCurrentMap();
  if (!map) return;

  recordHistory();

  // Get parent node data for positioning
  const parentData = map.nodes.find(n => n.id === parentNodeId);
  if (!parentData) return;

  // Calculate existing sub-nodes for positioning
  const existingSubNodes = map.nodes.filter(n => n.parentId === parentNodeId);
  const subNodeIndex = existingSubNodes.length;

  // Position sub-node in organized layout
  const subNodeX = parentData.x + 150; // Fixed horizontal offset
  const subNodeY = parentData.y + 80 + (subNodeIndex * 60); // Vertical stacking with spacing

  nodeCounter += 1;
  const subNode = {
    id: `node-${nodeCounter}`,
    x: subNodeX,
    y: subNodeY,
    text: "Sub Node",
    isSubNode: true,
    parentId: parentNodeId,
    collapsed: false,
    imageData: null,
    imageScale: 1,
    width: null,
    height: null
  };

  map.nodes.push(subNode);

  // Create edge from parent to sub-node
  edgeCounter += 1;
  map.edges.push({
    id: `edge-${edgeCounter}`,
    from: parentNodeId,
    to: subNode.id,
    style: "solid",
    isSubEdge: true
  });

  // Update parent node to show it has sub-nodes
  const parentEl = nodesLayer.querySelector(`[data-node-id="${parentNodeId}"]`);
  if (parentEl) {
    parentEl.classList.add("has-sub-nodes");
  }

  renderCurrentMap();
  saveState();
}

function createNode(x, y, text = "New Scene", isSubNode = false) {
  recordHistory();
  nodeCounter += 1;
  const map = getCurrentMap();
  if (!map) return;
  map.nodes.push({
    id: `node-${nodeCounter}`,
    x,
    y,
    text,
    isSubNode,
    parentId: null,
    collapsed: false,
    imageData: null,
    imageScale: 1,
    width: null,
    height: null
  });
  renderCurrentMap();
  saveState();
}

function createJunction(x, y) {
  const map = getCurrentMap();
  if (!map) return;
  recordHistory();
  junctionCounter += 1;
  map.junctions.push({ id: `junction-${junctionCounter}`, x, y });
  redrawConnections();
  saveState();
}

function setHintByTool() {
  if (activeTool === "move") hint.textContent = "Move tool: pan the screen, double-click text to edit. Hold Space or use middle mouse to pan.";
  if (activeTool === "select") hint.textContent = "Select tool: click nodes to select multiple, drag to move selected nodes. Hold Space or use middle mouse to pan.";
  if (activeTool === "add") hint.textContent = "Add tool: click empty space to add a node. Hold Space or use middle mouse to pan.";
  if (activeTool === "add-sub") hint.textContent = "Sub-node tool: click a node to add a sub-node. Hold Space or use middle mouse to pan.";
  if (activeTool === "connect") {
    if (connectStyle === "junction") hint.textContent = "Connect/Junction: click canvas to place a joint dot. Hold Space or use middle mouse to pan.";
    if (connectStyle === "solid") hint.textContent = "Connect Solid: click source then target (node or junction). Hold Space or use middle mouse to pan.";
    if (connectStyle === "dashed") hint.textContent = "Connect Dashed: click source then target (node or junction). Hold Space or use middle mouse to pan.";
  }
  if (activeTool === "delete") hint.textContent = "Delete tool: remove nodes, lines, and junction dots. Hold Space or use middle mouse to pan.";
}

function setTool(toolName) {
  activeTool = toolName;
  pendingSource = null;
  clearSourceSelection();
  toolButtons.forEach((button) => button.classList.toggle("active", button.dataset.tool === toolName));
  connectMenu.classList.toggle("hidden", toolName !== "connect");
  setHintByTool();
}

function setConnectStyle(style) {
  connectStyle = style;
  pendingSource = null;
  clearSourceSelection();
  connectOptions.forEach((btn) => btn.classList.toggle("active", btn.dataset.connectStyle === style));
  setHintByTool();
}

function connectPoints(fromId, toId) {
  if (fromId === toId) return;
  const map = getCurrentMap();
  if (!map) return;

  const samePair = (edge) =>
    (edge.from === fromId && edge.to === toId) ||
    (edge.from === toId && edge.to === fromId);

  const existingSameStyle = map.edges.find((edge) => samePair(edge) && edge.style === connectStyle);
  if (existingSameStyle) return;

  recordHistory();
  // Only remove edges with the same style, not all edges between the nodes
  map.edges = map.edges.filter((edge) => !samePair(edge) || edge.style !== connectStyle);
  edgeCounter += 1;
  map.edges.push({ id: `edge-${edgeCounter}`, from: fromId, to: toId, style: connectStyle });
  redrawConnections();
  saveState();
}

function createEdge(fromId, toId, style = "solid") {
  const originalStyle = connectStyle;
  connectStyle = style;
  connectPoints(fromId, toId);
  connectStyle = originalStyle;
}

function toggleSubNodes(parentNodeId) {
  const map = getCurrentMap();
  if (!map) return;

  recordHistory();

  const parentNode = map.nodes.find(n => n.id === parentNodeId);
  if (parentNode) {
    parentNode.collapsed = !parentNode.collapsed;

    // Update arrow indicator
    const nodeEl = nodesLayer.querySelector(`[data-node-id="${parentNodeId}"]`);
    if (nodeEl) {
      const arrow = nodeEl.querySelector('::after');
      if (parentNode.collapsed) {
        nodeEl.classList.add("collapsed");
      } else {
        nodeEl.classList.remove("collapsed");
      }
    }

    renderCurrentMap();
    saveState();
  }
}

function deleteNodeById(nodeId) {
  const map = getCurrentMap();
  if (!map) return;

  const nodeToDelete = map.nodes.find(n => n.id === nodeId);
  if (!nodeToDelete) return;

  // Delete the node
  map.nodes = map.nodes.filter((node) => node.id !== nodeId);

  // Delete all connected edges
  map.edges = map.edges.filter((edge) => edge.from !== nodeId && edge.to !== nodeId);

  // If this is a sub-node, check parent's status
  if (nodeToDelete.isSubNode && nodeToDelete.parentId) {
    const parent = map.nodes.find(n => n.id === nodeToDelete.parentId);
    if (parent) {
      const hasSubNodes = map.nodes.some(n => n.parentId === parent.id);
      if (!hasSubNodes) {
        // Parent no longer has sub-nodes
        parent.collapsed = false;
      }
    }
  }

  // If this is a main node, delete all its sub-nodes too
  if (!nodeToDelete.isSubNode) {
    const subNodesToDelete = map.nodes.filter(n => n.parentId === nodeId);
    subNodesToDelete.forEach(subNode => {
      deleteNodeById(subNode.id);
    });
  }
}

function deleteNode(nodeEl) {
  const nodeId = nodeEl.dataset.nodeId;
  recordHistory();
  deleteNodeById(nodeId);
  renderCurrentMap();
  saveState();
}

function deleteSelectedNodes() {
  if (selectedNodes.length === 0) return;

  if (confirm(`Delete ${selectedNodes.length} selected nodes?`)) {
    recordHistory();

    selectedNodes.forEach(nodeId => {
      deleteNodeById(nodeId);
    });

    clearSelection();
    renderCurrentMap();
    saveState();
  }
}

function deleteEdge(edgeId) {
  const map = getCurrentMap();
  if (!map) return;
  recordHistory();
  map.edges = map.edges.filter((edge) => edge.id !== edgeId);
  redrawConnections();
  saveState();
}

function deleteJunction(junctionId) {
  const map = getCurrentMap();
  if (!map) return;
  recordHistory();
  map.junctions = map.junctions.filter((j) => j.id !== junctionId);
  map.edges = map.edges.filter((edge) => edge.from !== junctionId && edge.to !== junctionId);
  redrawConnections();
  saveState();
}

function createNewMap() {
  recordHistory();
  nodeCounter += 1;
  const map = {
    id: `map-${Date.now()}`,
    name: `Map ${maps.length + 1}`,
    nodes: [{
      id: `node-${nodeCounter}`,
      x: 260,
      y: 190,
      text: "Scene 1",
      isSubNode: false,
      parentId: null,
      collapsed: false
    }],
    junctions: [],
    edges: []
  };
  maps.push(map);
  currentMapId = map.id;
  mapNameInput.value = map.name;
  renderCurrentMap();
  renderMapsList();
  setTool("move");
  saveState();
}

function saveNodePosition(nodeId, x, y) {
  const map = getCurrentMap();
  if (!map) return;
  const node = map.nodes.find((item) => item.id === nodeId);
  if (node) {
    node.x = x;
    node.y = y;
    saveState();
  }
}

function saveJunctionPosition(junctionId, x, y) {
  const map = getCurrentMap();
  if (!map) return;
  const point = map.junctions.find((item) => item.id === junctionId);
  if (point) {
    point.x = x;
    point.y = y;
    saveState();
  }
}

function saveNodeText(nodeId, text) {
  const map = getCurrentMap();
  if (!map) return;
  const node = map.nodes.find((item) => item.id === nodeId);
  if (node) {
    node.text = text.trim() || "Untitled Scene";
    saveState();
  }
}

toolButtons.forEach((button) => {
  button.addEventListener("click", () => setTool(button.dataset.tool));
});

connectOptions.forEach((button) => {
  button.addEventListener("click", () => setConnectStyle(button.dataset.connectStyle));
});

newMapBtn.addEventListener("click", createNewMap);
saveMapBtn.addEventListener("click", () => {
  saveState();
  hint.textContent = "Saved!";
  setTimeout(setHintByTool, 1200);
});
sidebarToggleBtn.addEventListener("click", () => sidebar.classList.toggle("open"));
sidebarCloseBtn.addEventListener("click", () => sidebar.classList.remove("open"));

modeCards.forEach((card) => {
  card.addEventListener("click", () => enterMode(card.dataset.mode));
});

// Launch Workspace button - transitions from pre-landing to landing screen
const launchWorkspaceBtn = document.getElementById("launch-workspace-btn");
if (launchWorkspaceBtn) {
  launchWorkspaceBtn.addEventListener("click", () => {
    const preLandingScreen = document.getElementById("pre-landing-screen");
    const landingScreen = document.getElementById("landing-screen");

    if (preLandingScreen && landingScreen) {
      // Fade out pre-landing screen
      preLandingScreen.style.opacity = "0";
      preLandingScreen.style.pointerEvents = "none";
      preLandingScreen.style.transition = "opacity 0.6s ease";

      // Show landing screen
      setTimeout(() => {
        preLandingScreen.style.display = "none";
        landingScreen.style.display = "flex";
      }, 600);
    }
  });
}

mapNameInput.addEventListener("change", () => {
  const map = getCurrentMap();
  if (!map) return;
  if (map.name === (mapNameInput.value.trim() || "Untitled Map")) return;
  recordHistory();
  map.name = mapNameInput.value.trim() || "Untitled Map";
  mapNameInput.value = map.name;
  renderMapsList();
  saveState();
});

undoBtn.addEventListener("click", () => {
  if (undoStack.length === 0) return;
  redoStack.push(cloneState());
  const previous = undoStack.pop();
  applyState(previous);
});

redoBtn.addEventListener("click", () => {
  if (redoStack.length === 0) return;
  undoStack.push(cloneState());
  const next = redoStack.pop();
  applyState(next);
});

zoomInBtn.addEventListener("click", () => {
  const rect = board.getBoundingClientRect();
  setZoomAtClient(zoom * 1.1, rect.left + rect.width / 2, rect.top + rect.height / 2);
});

zoomOutBtn.addEventListener("click", () => {
  const rect = board.getBoundingClientRect();
  setZoomAtClient(zoom * 0.9, rect.left + rect.width / 2, rect.top + rect.height / 2);
});

board.addEventListener("contextmenu", (event) => {
  event.preventDefault(); // Prevent default browser context menu
});

// --- Toast Notification System ---
function showToast(message, duration = 3000) {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  toastContainer.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Remove toast after duration
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

// --- Node Properties Sidebar Logic ---
let activePropertiesNodeId = null;

function openPropertiesSidebar(nodeId) {
  const map = getCurrentMap();
  if (!map) return;
  const nodeData = map.nodes.find(n => n.id === nodeId);
  if (!nodeData) return;

  activePropertiesNodeId = nodeId;
  nodeTitleInput.value = nodeData.text || "";
  nodeOrderInput.value = nodeData.order !== undefined ? nodeData.order : "";
  nodeDescInput.value = nodeData.description || "";
  updateMediaUploadUI(nodeData);
  
  // Initialize character counters
  const titleLength = (nodeData.text || "").length;
  const descLength = (nodeData.description || "").length;
  
  const titleCounter = document.getElementById('title-char-counter');
  const descCounter = document.getElementById('desc-char-counter');
  
  titleCounter.textContent = `${titleLength}/60`;
  descCounter.textContent = `${descLength}/500`;
  
  // Update counter colors
  titleCounter.classList.remove('warning', 'danger');
  if (titleLength >= 60 * 0.9) {
    titleCounter.classList.add('danger');
  } else if (titleLength >= 60 * 0.7) {
    titleCounter.classList.add('warning');
  }
  
  descCounter.classList.remove('warning', 'danger');
  if (descLength >= 500 * 0.9) {
    descCounter.classList.add('danger');
  } else if (descLength >= 500 * 0.7) {
    descCounter.classList.add('warning');
  }
  
  propertiesSidebar.classList.add("open");
}

function closePropertiesSidebar() {
  propertiesSidebar.classList.remove("open");
  activePropertiesNodeId = null;
}

propertiesCloseBtn.addEventListener("click", closePropertiesSidebar);

nodeTitleInput.addEventListener("input", (e) => {
  if (!activePropertiesNodeId) return;
  const map = getCurrentMap();
  if (!map) return;
  const nodeData = map.nodes.find(n => n.id === activePropertiesNodeId);
  if (!nodeData) return;

  // Update character counter
  const currentLength = e.target.value.length;
  const maxLength = 60;
  const titleCounter = document.getElementById('title-char-counter');
  titleCounter.textContent = `${currentLength}/${maxLength}`;
  
  // Update counter color based on length
  titleCounter.classList.remove('warning', 'danger');
  if (currentLength >= maxLength * 0.9) {
    titleCounter.classList.add('danger');
  } else if (currentLength >= maxLength * 0.7) {
    titleCounter.classList.add('warning');
  }

  // Apply character limit
  const newText = (e.target.value.trim() || "Untitled").substring(0, maxLength);
  nodeData.text = newText;

  const nodeEl = document.querySelector(`[data-node-id="${activePropertiesNodeId}"]`);
  if (nodeEl) {
    const textEl = nodeEl.querySelector(".node-text");
    if (textEl) {
      // Calculate available width for text (node width - padding)
      const nodeWidth = nodeData.width || (nodeData.isSubNode ? 120 : 170);
      const padding = 20; // 10px padding on each side
      const maxTextWidth = nodeWidth - padding;
      
      // Calculate available height for text (node height - padding)
      const nodeHeight = nodeData.height || (nodeData.isSubNode ? 60 : 80);
      const heightPadding = 24; // 12px padding on top and bottom
      const maxTextHeight = nodeHeight - heightPadding;
      
      // Get font size based on node type
      const fontSize = nodeData.isSubNode ? 12 : (nodeData.isCoreNode ? 18 : 14);
      
      // Apply text wrapping with height constraint
      const lines = wrapText(newText, maxTextWidth, maxTextHeight, fontSize);
      textEl.innerHTML = lines.join('<br>');
    }
  }
});

nodeTitleInput.addEventListener("change", (e) => {
  recordHistory();
  saveState();
});

nodeOrderInput.addEventListener("input", (e) => {
  if (!activePropertiesNodeId) return;
  const map = getCurrentMap();
  if (!map) return;
  const nodeData = map.nodes.find(n => n.id === activePropertiesNodeId);
  if (!nodeData) return;

  const rawValue = e.target.value.trim();
  const parsed = parseInt(rawValue, 10);

  if (rawValue === "") {
    delete nodeData.order;
  } else if (!Number.isNaN(parsed) && parsed > 0) {
    nodeData.order = parsed;
  }

  const nodeEl = document.querySelector(`[data-node-id="${activePropertiesNodeId}"]`);
  if (nodeEl) {
    let badge = nodeEl.querySelector(".node-order-badge");
    if (nodeData.order !== undefined) {
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "node-order-badge";
        nodeEl.appendChild(badge);
      }
      badge.textContent = nodeData.order;
    } else if (badge) {
      badge.remove();
    }
  }
  saveState();
});

nodeOrderInput.addEventListener("change", (e) => {
  recordHistory();
  saveState();
});

nodeDescInput.addEventListener("input", (e) => {
  if (!activePropertiesNodeId) return;
  const map = getCurrentMap();
  if (!map) return;
  const nodeData = map.nodes.find(n => n.id === activePropertiesNodeId);
  if (!nodeData) return;

  // Update character counter
  const currentLength = e.target.value.length;
  const maxLength = 500;
  const descCounter = document.getElementById('desc-char-counter');
  descCounter.textContent = `${currentLength}/${maxLength}`;
  
  // Update counter color based on length
  descCounter.classList.remove('warning', 'danger');
  if (currentLength >= maxLength * 0.9) {
    descCounter.classList.add('danger');
  } else if (currentLength >= maxLength * 0.7) {
    descCounter.classList.add('warning');
  }

  // Apply character limit
  nodeData.description = e.target.value.substring(0, maxLength);
  saveState();
});

nodeDescInput.addEventListener("change", (e) => {
  recordHistory();
  saveState();
});

board.addEventListener("dblclick", (event) => {
  const nodeEl = event.target.closest(".node");
  if (nodeEl) {
    const nodeId = nodeEl.dataset.nodeId;
    openPropertiesSidebar(nodeId);
  }
});

board.addEventListener("mousedown", (event) => {
  // ── Resize handle detection (must be first) ──
  const resizeHandle = event.target.closest(".resize-handle");
  if (resizeHandle && activeTool === "select" && currentAppMode === "flow") {
    const nodeEl = resizeHandle.closest(".node");
    if (nodeEl) {
      const map = getCurrentMap();
      const nodeData = map?.nodes.find(n => n.id === nodeEl.dataset.nodeId);
      if (nodeData) {
        isResizing = true;
        resizeNodeId = nodeEl.dataset.nodeId;
        resizeDir = resizeHandle.dataset.resizeDir;
        resizeStartClientX = event.clientX;
        resizeStartClientY = event.clientY;
        resizeStartWidth = nodeData.width || nodeEl.offsetWidth;
        resizeStartHeight = nodeData.height || nodeEl.offsetHeight;
        resizeStartNodeX = nodeData.x;
        resizeStartNodeY = nodeData.y;
        event.stopPropagation();
        return;
      }
    }
  }

  if (!event.target.closest(".node") && propertiesSidebar.classList.contains("open")) {
    closePropertiesSidebar();
  }
  // Handle right-click for context menu
  if (event.button === 2) { // Right mouse button
    const nodeEl = event.target.closest(".node");
    if (nodeEl) {
      showContextMenu(event.clientX, event.clientY, nodeEl);
    }
    return;
  }

  // Handle panning with Space key or middle mouse button
  if (isSpacePressed || event.button === 1) { // Middle mouse button
    isDragging = true;
    dragType = "pan";
    offsetX = event.clientX - panX;
    offsetY = event.clientY - panY;
    board.style.cursor = "grabbing";
    return;
  }

  // Start selection if in select tool and clicking on empty space
  if (activeTool === "select" && !event.target.closest(".node") && !isViewMode) {
    startSelection(event);
    return;
  }

  // Simple tool handling (back to basics)
  if (activeTool === "add") {
    // Clear any pending connections when switching to add tool
    if (pendingSource) {
      pendingSource = null;
      clearSourceSelection();
    }

    if (event.target.closest(".node")) return;
    const world = worldFromClient(event.clientX, event.clientY);
    createNode(world.x, world.y);
    return; // Prevent click event
  } else if (activeTool === "add-sub") {
    // Clear any pending connections when switching to sub-node tool
    if (pendingSource) {
      pendingSource = null;
      clearSourceSelection();
    }

    const nodeEl = event.target.closest(".node:not(.sub-node)");
    if (nodeEl) {
      const nodeId = nodeEl.dataset.nodeId;
      const world = worldFromClient(event.clientX, event.clientY);
      createSubNode(world.x, world.y, nodeId);
    }
    return; // Prevent click event
  } else if (activeTool === "connect") {
    // Only connect if clicking on a node, not empty space
    const nodeEl = event.target.closest(".node");
    if (!nodeEl) return;
    const nodeId = nodeEl.dataset.nodeId;
    if (!pendingSource) {
      pendingSource = nodeId;
      nodeEl.classList.add("selected");
    } else {
      if (pendingSource !== nodeId) {
        const world = worldFromClient(event.clientX, event.clientY);
        if (connectStyle === "junction") {
          createJunction(world.x, world.y);
          // Then connect the junction to the nodes
          const junctionId = `junction-${junctionCounter}`;
          setTimeout(() => {
            connectPoints(pendingSource, junctionId);
            connectPoints(junctionId, nodeId);
          }, 10);
        } else {
          createEdge(pendingSource, nodeId, connectStyle);
        }
      }
      document.querySelector(`[data-node-id="${pendingSource}"]`).classList.remove("selected");
      pendingSource = null;
    }
    return; // Prevent click event
  } else if (activeTool === "delete") {
    // Clear any pending connections when switching to delete tool
    if (pendingSource) {
      pendingSource = null;
      clearSourceSelection();
    }

    const nodeEl = event.target.closest(".node");
    const edgeHit = event.target.closest(".edge-hit");
    const junctionHit = event.target.closest(".junction-hit");

    if (nodeEl) {
      deleteNode(nodeEl);
    } else if (edgeHit) {
      deleteEdge(edgeHit.dataset.edgeId);
    } else if (junctionHit) {
      deleteJunction(junctionHit.dataset.junctionId);
    }
    return; // Prevent click event
  } else if (activeTool === "select") {
    // Clear any pending connections when switching to select tool
    if (pendingSource) {
      pendingSource = null;
      clearSourceSelection();
    }

    const nodeEl = event.target.closest(".node");
    if (nodeEl) {
      // Toggle node selection
      const nodeId = nodeEl.dataset.nodeId;
      const index = selectedNodes.indexOf(nodeId);

      if (event.ctrlKey || event.metaKey) {
        // Multi-select with Ctrl/Cmd
        if (index === -1) {
          selectedNodes.push(nodeId);
          nodeEl.classList.add("selected");
        } else {
          selectedNodes.splice(index, 1);
          nodeEl.classList.remove("selected");
        }
      } else {
        // Single select or drag
        if (index === -1) {
          // Clear previous selection and select new node
          clearSelection();
          selectedNodes.push(nodeId);
          nodeEl.classList.add("selected");
          renderCurrentMap(); // Refresh so resize handles appear immediately
        }

        dragNode = nodeEl;
        isDragging = true;
        dragMoved = false;
      }
    }
  } else if (activeTool === "move") {
    // Clear any pending connections when switching to move tool
    if (pendingSource) {
      pendingSource = null;
      clearSourceSelection();
    }

    // In move tool, always pan the screen regardless of where clicked
    isDragging = true;
    dragType = "pan";
    offsetX = event.clientX - panX;
    offsetY = event.clientY - panY;
    board.style.cursor = "grabbing";
  }

  if (typeof updateBranchingFocus === 'function') updateBranchingFocus();
});

document.addEventListener("mousemove", (event) => {
  // Handle active resize
  if (isResizing) { handleResize(event); return; }

  if (isDragging && dragNode) {
    if (!dragMoved) {
      recordHistory(); // Record state before movement starts
      dragMoved = true;
    }

    const world = worldFromClient(event.clientX, event.clientY);
    const map = getCurrentMap();
    if (!map) return;

    if (activeTool === "select" && selectedNodes.length > 0) {
      // Move all selected nodes
      const draggedNodeData = map.nodes.find(n => n.id === dragNode.dataset.nodeId);
      if (!draggedNodeData) return;

      const deltaX = world.x - draggedNodeData.x;
      const deltaY = world.y - draggedNodeData.y;

      selectedNodes.forEach(nodeId => {
        const nodeData = map.nodes.find(n => n.id === nodeId);
        if (nodeData) {
          nodeData.x += deltaX;
          nodeData.y += deltaY;
        }
      });
    } else {
      // Move single node (move tool or single select)
      const nodeData = map.nodes.find(n => n.id === dragNode.dataset.nodeId);
      if (!nodeData) return;

      nodeData.x = world.x;
      nodeData.y = world.y;
    }

    renderCurrentMap();
  }

  if (isDragging && dragType === "pan") {
    panX = event.clientX - offsetX;
    panY = event.clientY - offsetY;
    applyCanvasTransform();
  }

  // Update selection box
  if (isSelecting) {
    updateSelection(event);
  }
});

document.addEventListener("mouseup", () => {
  // End resize
  if (isResizing) {
    isResizing = false;
    resizeNodeId = null;
    resizeDir = "";
    recordHistory();
    saveState();
    renderCurrentMap(); // Refresh handles at final size
    return;
  }

  isDragging = false;
  dragNode = null;
  dragType = null;
  board.style.cursor = "";
  dragMoved = false;

  // End selection if it was active
  if (isSelecting) {
    endSelection();
  }
});

// Junction creation handled in mousedown - removing duplicate click handler

board.addEventListener("dblclick", (event) => {
  if (activeTool !== "move") return;
  const textEl = event.target.closest(".node-text");
  if (!textEl) return;
  textEl.contentEditable = "true";
  textEl.focus();
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(textEl);
  selection.removeAllRanges();
  selection.addRange(range);
});

board.addEventListener("focusout", (event) => {
  const textEl = event.target.closest(".node-text");
  if (!textEl) return;
  textEl.contentEditable = "false";
  const node = textEl.closest(".node");
  if (node) {
    const nodeId = node.dataset.nodeId;
    const newText = (textEl.textContent || "").trim() || "Untitled Scene";
    saveNodeText(nodeId, newText);
    
    // Reapply text wrapping after editing
    const map = getCurrentMap();
    const nodeData = map.nodes.find(n => n.id === nodeId);
    if (nodeData) {
      // Calculate available width for text (node width - padding)
      const nodeWidth = nodeData.width || (nodeData.isSubNode ? 120 : 170);
      const padding = 20; // 10px padding on each side
      const maxTextWidth = nodeWidth - padding;
      
      // Get font size based on node type
      const fontSize = nodeData.isSubNode ? 12 : (nodeData.isCoreNode ? 18 : 14);
      
      // Apply text wrapping
      const lines = wrapText(newText, maxTextWidth, fontSize);
      textEl.innerHTML = lines.join('<br>');
    }
  }
});

board.addEventListener("wheel", (event) => {
  event.preventDefault();
  const factor = event.deltaY < 0 ? 1.08 : 0.92;
  setZoomAtClient(zoom * factor, event.clientX, event.clientY);
}, { passive: false });

// Handle keyboard events
document.addEventListener("keydown", (event) => {
  const target = event.target;
  const inTextInput =
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement && target.isContentEditable);

  // 1. Space for panning
  if (event.code === "Space") {
    isSpacePressed = true;
    if (!inTextInput) event.preventDefault();
  }

  // 2. Escape to clear selection
  if (event.key === "Escape") {
    clearSelection();
    if (pendingSource) {
      pendingSource = null;
      clearSourceSelection();
    }
    hideContextMenu();
    return;
  }

  // 3. Delete for selected nodes
  if (event.key === "Delete" && !inTextInput) {
    if (selectedNodes.length > 0) {
      deleteSelectedNodes();
    }
    return;
  }

  // 3.5 View mode navigation
  if (isViewMode && !inTextInput) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      navigateStep("next");
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigateStep("prev");
      return;
    }
  }

  // 4. Enter to finish text editing
  if (event.key === "Enter" && inTextInput) {
    const textEl = target.closest(".node-text");
    if (textEl) {
      event.preventDefault();
      textEl.blur();
    }
    return;
  }

  // 5. Shortcuts (Undo/Redo)
  const ctrlOrCmd = event.ctrlKey || event.metaKey;
  const key = event.key.toLowerCase();

  if (ctrlOrCmd && !inTextInput) {
    if (key === "z") {
      event.preventDefault();
      if (event.shiftKey) {
        redoBtn.click();
      } else {
        undoBtn.click();
      }
    } else if (key === "y") {
      event.preventDefault();
      redoBtn.click();
    }
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "Space") isSpacePressed = false;
});

// Context Menu Functions
function showContextMenu(clientX, clientY, node) {
  contextMenuTargetNode = node;

  contextMenu.classList.remove("hidden");

  // Get dimensions
  const menuWidth = contextMenu.offsetWidth;
  const menuHeight = contextMenu.offsetHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate position (stay within viewport)
  let left = clientX;
  let top = clientY;

  if (left + menuWidth > viewportWidth) {
    left = viewportWidth - menuWidth - 10;
  }
  if (top + menuHeight > viewportHeight) {
    top = viewportHeight - menuHeight - 10;
  }

  contextMenu.style.left = `${left}px`;
  contextMenu.style.top = `${top}px`;
}

function hideContextMenu() {
  contextMenu.classList.add("hidden");
  contextMenuTargetNode = null;
}

function editNodeText() {
  if (!contextMenuTargetNode) return;

  const nodeEl = document.querySelector(`[data-node-id="${contextMenuTargetNode.id}"]`);
  const textEl = nodeEl.querySelector(".node-text");

  textEl.contentEditable = "true";
  textEl.focus();

  // Select all text
  const range = document.createRange();
  range.selectNodeContents(textEl);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  hideContextMenu();
}

function deleteNodeFromContext() {
  if (!contextMenuTargetNode) return;

  const nodeEl = document.querySelector(`[data-node-id="${contextMenuTargetNode.dataset.nodeId}"]`);
  if (nodeEl) {
    deleteNode(nodeEl);
  }

  hideContextMenu();
}

// Multi-selection functions
function startSelection(e) {
  if (activeTool !== "select" || isViewMode) return;

  isSelecting = true;
  selectionStartX = e.clientX;
  selectionStartY = e.clientY;

  // Clear previous selection
  clearSelection();

  // Create selection box
  selectionBox = document.createElement("div");
  selectionBox.className = "selection-box";
  selectionBox.style.left = selectionStartX + "px";
  selectionBox.style.top = selectionStartY + "px";
  selectionBox.style.width = "0px";
  selectionBox.style.height = "0px";
  document.body.appendChild(selectionBox);
}

function updateSelection(e) {
  if (!isSelecting || !selectionBox) return;

  const currentX = e.clientX;
  const currentY = e.clientY;

  const left = Math.min(selectionStartX, currentX);
  const top = Math.min(selectionStartY, currentY);
  const width = Math.abs(currentX - selectionStartX);
  const height = Math.abs(currentY - selectionStartY);

  selectionBox.style.left = left + "px";
  selectionBox.style.top = top + "px";
  selectionBox.style.width = width + "px";
  selectionBox.style.height = height + "px";

  // Update selected nodes
  selectNodesInBox(left, top, width, height);
}

function endSelection() {
  if (!isSelecting) return;

  isSelecting = false;

  if (selectionBox) {
    selectionBox.remove();
    selectionBox = null;
  }
}

function selectNodesInBox(left, top, width, height) {
  const map = getCurrentMap();
  if (!map) return;

  // Clear previous selection
  clearSelection();

  // Check each node
  map.nodes.forEach(nodeData => {
    const nodeEl = document.querySelector(`[data-node-id="${nodeData.id}"]`);
    if (!nodeEl) return;

    const rect = nodeEl.getBoundingClientRect();

    // Check if node intersects with selection box
    if (rect.left < left + width &&
      rect.right > left &&
      rect.top < top + height &&
      rect.bottom > top) {

      selectedNodes.push(nodeData.id);
      nodeEl.classList.add("selected");
    }
  });
}

function clearSelection() {
  selectedNodes = [];
  document.querySelectorAll(".node.selected").forEach(node => {
    node.classList.remove("selected");
  });
}


// Context Menu Event Listeners
editTextBtn.addEventListener("click", editNodeText);
deleteNodeBtn.addEventListener("click", deleteNodeFromContext);

// User Account Buttons Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Profile button
  const profileBtn = document.querySelector('.account-action:has(.account-icon.\\ud83d\\udc64)');
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      showToast("Profile section coming soon! This will allow you to manage your account details.");
    });
  }
  
  // Theme button
  const themeBtn = document.querySelector('.account-action:has(.account-icon.\\ud83c\\udf19)');
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      showToast("Theme customization coming soon! Switch between light and dark modes.");
    });
  }
  
  // Settings button
  const settingsBtn = document.querySelector('.account-action:has(.account-icon.\\u2699\\ufe0f)');
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      showToast("Settings panel coming soon! Configure your FlowBoard preferences.");
    });
  }
  
  // Fallback method for browsers that don't support :has()
  const accountButtons = document.querySelectorAll('.account-action');
  accountButtons.forEach((btn, index) => {
    if (!btn.hasAttribute('data-toast-added')) {
      btn.setAttribute('data-toast-added', 'true');
      btn.addEventListener("click", (e) => {
        const icon = btn.querySelector('.account-icon');
        if (icon) {
          if (icon.textContent.includes('Profile') || icon.textContent.includes('profile') || index === 0) {
            showToast("Profile section coming soon! This will allow you to manage your account details.");
          } else if (icon.textContent.includes('Theme') || icon.textContent.includes('theme') || index === 1) {
            showToast("Theme customization coming soon! Switch between light and dark modes.");
          } else if (icon.textContent.includes('Settings') || icon.textContent.includes('settings') || index === 2) {
            showToast("Settings panel coming soon! Configure your FlowBoard preferences.");
          }
        }
      });
    }
  });
});

// Toggle Mode Function
function toggleToolsVisibility() {
  toolsHidden = !toolsHidden;

  // Toggle button state
  hideToolsBtn.classList.toggle("active", toolsHidden);

  // Hide/show connect tools AND actual connections
  const connectBtn = document.querySelector('[data-tool="connect"]');
  const connectMenu = document.getElementById("connect-menu");
  const allEdges = document.querySelectorAll('.edge');
  const allJunctions = document.querySelectorAll('.junction-dot');

  if (toolsHidden) {
    // Hide connect tools AND actual connections
    connectBtn.style.display = "none";
    connectMenu.style.display = "none";

    // Hide all edges and junctions
    allEdges.forEach(edge => {
      edge.style.display = "none";
    });
    allJunctions.forEach(junction => {
      junction.style.display = "none";
    });
  } else {
    // Show connect tools AND actual connections
    connectBtn.style.display = "flex";

    // Show all edges and junctions
    allEdges.forEach(edge => {
      edge.style.display = "block";
    });
    allJunctions.forEach(junction => {
      junction.style.display = "block";
    });

    // Only show connect menu if connect tool is active
    if (activeTool === "connect") {
      connectMenu.style.display = "flex";
    }
  }
}

function toggleModeFunction() {
  isViewMode = !isViewMode;
  toggleModeBtn.classList.toggle("active");

  const label = toggleModeBtn.querySelector(".label");
  if (isViewMode) {
    // Switch to View Mode
    label.textContent = "View";
    enterViewMode();
  } else {
    // Switch to Edit Mode
    label.textContent = "Edit";
    exitViewMode();
  }
}

function sortNodesByConnections() {
  const map = getCurrentMap();
  if (!map || map.nodes.length === 0) return [];

  // Build adjacency list
  const adjacency = {};
  const inDegree = {};
  const nodeSet = new Set();

  // Initialize
  map.nodes.forEach(node => {
    adjacency[node.id] = [];
    inDegree[node.id] = 0;
    nodeSet.add(node.id);
  });

  // Build graph from edges
  map.edges.forEach(edge => {
    if (nodeSet.has(edge.from) && nodeSet.has(edge.to)) {
      adjacency[edge.from].push(edge.to);
      inDegree[edge.to]++;
    }
  });

  // Topological sort with BFS (Kahn's algorithm)
  const queue = [];
  const topological = [];

  // Find nodes with no incoming edges
  Object.keys(inDegree).forEach(nodeId => {
    if (inDegree[nodeId] === 0) {
      queue.push(nodeId);
    }
  });

  const sortQueue = () => {
    queue.sort((aId, bId) => {
      const aNode = map.nodes.find(n => n.id === aId);
      const bNode = map.nodes.find(n => n.id === bId);
      const aOrder = typeof aNode?.order === "number" ? aNode.order : Infinity;
      const bOrder = typeof bNode?.order === "number" ? bNode.order : Infinity;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return aId.localeCompare(bId);
    });
  };

  sortQueue();

  while (queue.length > 0) {
    const current = queue.shift();
    topological.push(current);

    adjacency[current].forEach(neighbor => {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    });
    sortQueue();
  }

  // If there are remaining nodes (cycle), add them in original order
  const remaining = map.nodes.filter(n => !topological.includes(n.id));
  remaining.forEach(node => topological.push(node.id));

  const topoIndex = topological.reduce((acc, nodeId, index) => {
    acc[nodeId] = index;
    return acc;
  }, {});

  const mainNodes = map.nodes.filter(n => !n.isSubNode).slice().sort((a, b) => {
    const aOrder = typeof a.order === "number" ? a.order : Infinity;
    const bOrder = typeof b.order === "number" ? b.order : Infinity;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return (topoIndex[a.id] || 0) - (topoIndex[b.id] || 0);
  });

  const result = [];
  const processed = new Set();

  mainNodes.forEach(node => {
    if (!processed.has(node.id)) {
      result.push(node);
      processed.add(node.id);

      const subNodes = map.nodes.filter(n => n.parentId === node.id).slice().sort((a, b) => {
        const aOrder = typeof a.order === "number" ? a.order : Infinity;
        const bOrder = typeof b.order === "number" ? b.order : Infinity;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return (topoIndex[a.id] || 0) - (topoIndex[b.id] || 0);
      });
      subNodes.forEach(subNode => {
        result.push(subNode);
        processed.add(subNode.id);
      });
    }
  });

  return result;
}

function enterViewMode() {
  // Hide toolbars
  document.getElementById("left-toolbar").classList.add("hidden");

  // Show navigation controls
  viewNavControls.classList.remove("hidden");

  // Add view-mode class to body
  document.body.classList.add("view-mode");

  // Update toggle button state
  toggleModeBtn.classList.add("active");
  const label = toggleModeBtn.querySelector(".label");
  if (label) label.textContent = "View";

  // Save original collapsed state and expand all main nodes in view mode
  const map = getCurrentMap();
  if (map) {
    map.nodes.forEach(node => {
      if (!node.isSubNode) {
        // Save original state
        node.originalCollapsed = node.collapsed;
        // Expand for view mode
        node.collapsed = false;
      }
    });
  }

  renderCurrentMap();

  // Sort nodes by connections (topological order)
  sortedNodes = sortNodesByConnections();

  currentStepIndex = 0;
  updateViewMode();
}

function exitViewMode() {
  // Show toolbars
  document.getElementById("left-toolbar").classList.remove("hidden");

  // Hide navigation controls
  viewNavControls.classList.add("hidden");

  // Remove view-mode class from body
  document.body.classList.remove("view-mode");

  // Update toggle button state
  toggleModeBtn.classList.remove("active");
  const label = toggleModeBtn.querySelector(".label");
  if (label) label.textContent = "Edit";

  // Restore original collapsed state (hide sub-nodes again)
  const map = getCurrentMap();
  if (map) {
    map.nodes.forEach(node => {
      if (!node.isSubNode) {
        // Keep original collapsed state from edit mode
        // If node was collapsed before entering view mode, keep it collapsed
        if (node.originalCollapsed !== undefined) {
          node.collapsed = node.originalCollapsed;
        } else {
          // Default to collapsed if no original state
          node.collapsed = true;
        }
      }
    });
  }

  // Remove view mode classes from nodes
  document.querySelectorAll(".node").forEach(node => {
    node.classList.remove("past", "present", "future", "current");
  });

  renderCurrentMap();
}

function updateViewMode() {
  if (!isViewMode || sortedNodes.length === 0) return;

  // Remove all view mode classes
  document.querySelectorAll(".node").forEach(node => {
    node.classList.remove("past", "present", "future", "current");
  });

  // Apply classes based on current step
  sortedNodes.forEach((node, index) => {
    const nodeEl = document.querySelector(`[data-node-id="${node.id}"]`);
    if (!nodeEl) return;

    if (index <= currentStepIndex) {
      // Keep all previous nodes visible
      nodeEl.classList.add("present");

      // Apply blur effect only to the immediate previous node
      if (index === currentStepIndex - 1) {
        nodeEl.classList.add("past");
      }

      // Special zoom and highlight for current node only
      if (index === currentStepIndex) {
        nodeEl.classList.add("current");
        centerCameraOnNode(node, 1.2);
      }

      // If this is a sub-node, make sure parent is expanded
      if (node.isSubNode) {
        const map = getCurrentMap();
        if (map) {
          const parentNode = map.nodes.find(n => n.id === node.parentId);
          if (parentNode) {
            const parentEl = document.querySelector(`[data-node-id="${parentNode.id}"]`);
            if (parentEl) {
              parentEl.classList.remove("collapsed");
            }
          }
        }
      }

      // Show connected edge
      const map = getCurrentMap();
      if (map) {
        const edgeData = map.edges.find(e => e.to === node.id && e.isSubEdge);
        if (edgeData) {
          const edge = document.querySelector(`.edge[data-edge-id="${edgeData.id}"]`);
          if (edge) {
            edge.classList.add("present");
          }
        }
      }
    } else {
      nodeEl.classList.add("future");
    }
  });

  // Add blur to all visible nodes except the current one
  const currentNodeId = sortedNodes[currentStepIndex]?.id;
  document.querySelectorAll(".node.view-blur").forEach(node => node.classList.remove("view-blur"));
  document.querySelectorAll(".node.present, .node.past").forEach((nodeEl) => {
    if (nodeEl.dataset.nodeId !== currentNodeId) {
      nodeEl.classList.add("view-blur");
    }
  });

  // Update step indicator (count all nodes now)
  stepIndicator.textContent = `${currentStepIndex + 1} / ${sortedNodes.length}`;

  // Update navigation buttons
  prevStepBtn.disabled = currentStepIndex === 0;
  nextStepBtn.disabled = currentStepIndex === sortedNodes.length - 1;
}

function centerCameraOnNode(node, targetZoom = 1.0) {
  const nodeEl = document.querySelector(`[data-node-id="${node.id}"]`);
  const nodeWidth = nodeEl ? nodeEl.offsetWidth : 170;
  const nodeHeight = nodeEl ? nodeEl.offsetHeight : 80;

  const targetPanX = (window.innerWidth / 2) - (node.x * targetZoom) - ((nodeWidth / 2) * targetZoom);
  const targetPanY = (window.innerHeight / 2) - (node.y * targetZoom) - ((nodeHeight / 2) * targetZoom);

  const startPanX = panX;
  const startPanY = panY;
  const startZoom = zoom;
  const duration = 500;
  const startTime = performance.now();

  function animateCamera(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

    panX = startPanX + (targetPanX - startPanX) * easeProgress;
    panY = startPanY + (targetPanY - startPanY) * easeProgress;
    zoom = startZoom + (targetZoom - startZoom) * easeProgress;

    applyCanvasTransform();

    if (progress < 1) {
      requestAnimationFrame(animateCamera);
    }
  }

  requestAnimationFrame(animateCamera);
}

function centerCameraOnNodeWithDelay(node, delay = 0, targetZoom = 1.0) {
  if (delay > 0) {
    setTimeout(() => {
      centerCameraOnNode(node, targetZoom);
    }, delay);
  } else {
    centerCameraOnNode(node, targetZoom);
  }
}

function navigateStep(direction) {
  if (!isViewMode || sortedNodes.length === 0) return;

  const allNodes = sortedNodes; // Include sub-nodes in navigation

  if (direction === "next" && currentStepIndex < allNodes.length - 1) {
    currentStepIndex++;
  } else if (direction === "prev" && currentStepIndex > 0) {
    currentStepIndex--;
  } else {
    return;
  }

  updateViewMode();
}

toggleModeBtn.addEventListener("click", toggleModeFunction);
hideToolsBtn.addEventListener("click", toggleToolsVisibility);

// View Mode Navigation Event Listeners
prevStepBtn.addEventListener("click", () => navigateStep("prev"));
nextStepBtn.addEventListener("click", () => navigateStep("next"));

// Hide context menu and sidebar when clicking elsewhere
document.addEventListener("click", (event) => {
  if (!contextMenu.contains(event.target)) {
    hideContextMenu();
  }

  if (!sidebar.contains(event.target) && !sidebarToggleBtn.contains(event.target)) {
    sidebar.classList.remove("open");
  }
  if (!connectMenu.contains(event.target) && !event.target.closest('[data-tool="connect"]')) {
    connectMenu.classList.add("hidden");
  }
});

// ── handleResize: live node resize during drag ──────────────────────────
function handleResize(event) {
  if (!isResizing || !resizeNodeId) return;
  const map = getCurrentMap();
  if (!map) return;
  const nd = map.nodes.find(n => n.id === resizeNodeId);
  if (!nd) return;

  const dx = (event.clientX - resizeStartClientX) / zoom;
  const dy = (event.clientY - resizeStartClientY) / zoom;
  const minW = 100, minH = 60;

  let nW = resizeStartWidth, nH = resizeStartHeight;
  let nX = resizeStartNodeX, nY = resizeStartNodeY;

  switch (resizeDir) {
    case "se": nW = Math.max(minW, resizeStartWidth + dx); nH = Math.max(minH, resizeStartHeight + dy); break;
    case "sw": nW = Math.max(minW, resizeStartWidth - dx); nH = Math.max(minH, resizeStartHeight + dy); nX = resizeStartNodeX + (resizeStartWidth - nW); break;
    case "ne": nW = Math.max(minW, resizeStartWidth + dx); nH = Math.max(minH, resizeStartHeight - dy); nY = resizeStartNodeY + (resizeStartHeight - nH); break;
    case "nw": nW = Math.max(minW, resizeStartWidth - dx); nH = Math.max(minH, resizeStartHeight - dy); nX = resizeStartNodeX + (resizeStartWidth - nW); nY = resizeStartNodeY + (resizeStartHeight - nH); break;
  }

  nd.width = nW; nd.height = nH; nd.x = nX; nd.y = nY;

  const el = nodesLayer.querySelector(`[data-node-id="${resizeNodeId}"]`);
  if (el) {
    el.style.width = nW + "px"; el.style.minWidth = "unset";
    el.style.height = nH + "px"; el.style.minHeight = "unset";
    el.style.left = nX + "px";
    el.style.top = nY + "px";
  }
  redrawConnections();
}

// ── updateMediaUploadUI: sync sidebar UI with node image state ───────────
function updateMediaUploadUI(nodeData) {
  if (!nodeData) return;
  if (nodeData.imageData) {
    mediaPreview.src = nodeData.imageData;
    mediaPreview.classList.remove("hidden");
    mediaPlaceholder.classList.add("hidden");
    mediaRemoveBtn.classList.remove("hidden");
  } else {
    mediaPreview.classList.add("hidden");
    mediaPlaceholder.classList.remove("hidden");
    mediaRemoveBtn.classList.add("hidden");
  }
  // Scale slider only in branching mode
  if (currentAppMode === "branching") {
    mediaScaleRow.classList.remove("hidden");
    imageScaleInput.value = nodeData.imageScale || 1;
  } else {
    mediaScaleRow.classList.add("hidden");
  }
}

// ── Media upload area click → open file picker ───────────────────────────
mediaUploadArea.addEventListener("click", () => {
  if (activePropertiesNodeId) nodeImageInput.click();
});

// File chosen → read as base64 → store → render
nodeImageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file || !activePropertiesNodeId) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const map = getCurrentMap();
    if (!map) return;
    const nd = map.nodes.find(n => n.id === activePropertiesNodeId);
    if (!nd) return;
    recordHistory();
    nd.imageData = ev.target.result;
    // Give image nodes a generous default frame the first time
    if (!nd.width) nd.width = 240;
    if (!nd.height) nd.height = 180;
    updateMediaUploadUI(nd);
    renderCurrentMap();
    saveState();
  };
  reader.readAsDataURL(file);
  e.target.value = ""; // allow re-selecting same file
});

// Remove image button
mediaRemoveBtn.addEventListener("click", () => {
  if (!activePropertiesNodeId) return;
  const map = getCurrentMap();
  if (!map) return;
  const nd = map.nodes.find(n => n.id === activePropertiesNodeId);
  if (!nd) return;
  recordHistory();
  nd.imageData = null;
  nd.imageScale = 1;
  nd.width = null;
  nd.height = null;
  updateMediaUploadUI(nd);
  renderCurrentMap();
  saveState();
});

// Profile zoom slider (branching mode — live update, no re-render)
imageScaleInput.addEventListener("input", (e) => {
  if (!activePropertiesNodeId || currentAppMode !== "branching") return;
  const map = getCurrentMap();
  if (!map) return;
  const nd = map.nodes.find(n => n.id === activePropertiesNodeId);
  if (!nd) return;
  nd.imageScale = parseFloat(e.target.value);
  const img = document.querySelector(`[data-node-id="${activePropertiesNodeId}"] .node-image`);
  if (img) img.style.transform = `scale(${nd.imageScale})`;
  saveState();
});
imageScaleInput.addEventListener("change", () => { recordHistory(); saveState(); });

// Initialize app with a fresh state or load saved state
if (!loadState()) {
  const firstMap = createInitialMap("Map 1");
  maps.push(firstMap);
  currentMapId = firstMap.id;
  mapNameInput.value = firstMap.name;
  renderCurrentMap();
  renderMapsList();
}

setTool("move");
setConnectStyle("solid");
applyCanvasTransform();
updateHistoryButtons();

// Add window resize listener for core node positioning in branching mode
window.addEventListener("resize", updateCoreNodePosition);
