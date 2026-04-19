// Branching Mode Logic
// Cosmic storytelling interface with constellation background and core node

function branchingModeInit() {
  currentAppMode = "branching";
  document.body.classList.add("mode-branching");
  document.body.classList.remove("mode-flow");

  // Clear existing maps and create fresh branching setup
  maps.length = 0;
  nodeCounter = 0;
  edgeCounter = 0;
  junctionCounter = 0;

  // Create the core branching map
  const branchingMap = {
    id: `branching-${Date.now()}`,
    name: "Your Story Title",
    nodes: [{
      id: "core-node",
      x: window.innerWidth / 2 - 100,
      y: window.innerHeight / 2 - 100,
      text: "Start: Your Story Title",
      isCoreNode: true,
      order: 1
    }],
    junctions: [],
    edges: []
  };

  maps.push(branchingMap);
  currentMapId = branchingMap.id;
  mapNameInput.value = branchingMap.name;

  branchingApplyConstellationBackground();
  sidebar.classList.add("open");
  renderCurrentMap();

  console.log("Story Branching Mode active - Cosmic atmosphere initialized with Node Order system");
}

function branchingApplyConstellationBackground() {
  board.style.backgroundImage = "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')";
  board.style.backgroundSize = "cover";
  board.style.backgroundPosition = "center";
  board.style.backgroundRepeat = "no-repeat";
  board.style.backgroundAttachment = "fixed";
}
/* ─── FOCUS CARD ─── */
function openBranchingFocusCard(nodeId) {
  const map = getCurrentMap();
  if (!map) return;
  const nodeData = map.nodes.find(n => n.id === nodeId);
  if (!nodeData) return;

  const overlay = document.getElementById("branching-focus-overlay");
  const tag = document.getElementById("branching-focus-tag");
  const title = document.getElementById("branching-focus-title");
  const body = document.getElementById("branching-focus-body");

  tag.textContent = nodeData.isCoreNode ? "النود الأساسية" : "نود فرعية";
  title.textContent = nodeData.text || "بدون عنوان";
  body.textContent = nodeData.description || "Double-tap to add details";

  overlay.classList.remove("branching-focus-hidden");
  document.body.classList.add("branching-focused");
}

function closeBranchingFocusCard() {
  const overlay = document.getElementById("branching-focus-overlay");
  overlay.classList.add("branching-focus-hidden");
  document.body.classList.remove("branching-focused");
}

// Wire up close button + overlay click
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("branching-focus-close");
  const overlay = document.getElementById("branching-focus-overlay");
  const card = document.getElementById("branching-focus-card");

  if (closeBtn) closeBtn.addEventListener("click", closeBranchingFocusCard);
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (!card.contains(e.target)) closeBranchingFocusCard();
    });
  }
});

// Focus card — Move tool only
document.addEventListener("click", (e) => {
  if (currentAppMode !== "branching") return;
  if (activeTool !== "move") return;
  const nodeEl = e.target.closest(".node");
  if (!nodeEl) return;
  if (e.detail >= 2) return;
  if (window._branchingDragMoved) return;
  openBranchingFocusCard(nodeEl.dataset.nodeId);
}, true);

// Track drag to avoid opening card after drag
document.addEventListener("mousedown", () => { window._branchingDragMoved = false; });
document.addEventListener("mousemove", (e) => { if (e.buttons) window._branchingDragMoved = true; });