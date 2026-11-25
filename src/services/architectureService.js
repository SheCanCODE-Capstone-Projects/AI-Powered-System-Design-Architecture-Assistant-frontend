const STORAGE_KEY = "archpilot-architectures";

// ========================================
// EMPTY ARCHITECTURE
// ========================================

function createEmptyArchitecture() {
  return {
    nodes: [],
    edges: [],
  };
}

// ========================================
// READ LOCAL STORAGE SAFELY
// ========================================

function getSavedArchitectures() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return {};
    }

    const parsedData = JSON.parse(savedData);

    if (
      typeof parsedData !== "object" ||
      parsedData === null ||
      Array.isArray(parsedData)
    ) {
      return {};
    }

    return parsedData;
  } catch (error) {
    console.error("Unable to read architectures:", error);
    return {};
  }
}

// ========================================
// VALIDATE ARCHITECTURE
// ========================================

function validateArchitecture(architecture) {
  if (
    !architecture ||
    typeof architecture !== "object" ||
    Array.isArray(architecture)
  ) {
    return createEmptyArchitecture();
  }

  // Validate components
  const nodes = Array.isArray(architecture.nodes)
    ? architecture.nodes.filter((node) => {
        return (
          node &&
          typeof node === "object" &&
          typeof node.id === "string" &&
          node.id.trim() !== "" &&
          node.position &&
          Number.isFinite(node.position.x) &&
          Number.isFinite(node.position.y) &&
          node.data &&
          typeof node.data === "object" &&
          !Array.isArray(node.data) &&
          typeof node.data.label === "string" &&
          node.data.label.trim() !== ""
        );
      })
    : [];

  // Collect valid component IDs
  const validNodeIds = new Set(nodes.map((node) => node.id));

  // Validate connections
  const edges = Array.isArray(architecture.edges)
    ? architecture.edges.filter((edge) => {
        return (
          edge &&
          typeof edge === "object" &&
          typeof edge.id === "string" &&
          edge.id.trim() !== "" &&
          typeof edge.source === "string" &&
          typeof edge.target === "string" &&
          validNodeIds.has(edge.source) &&
          validNodeIds.has(edge.target)
        );
      })
    : [];

  return {
    nodes,
    edges,
  };
}

// ========================================
// GET ARCHITECTURE
// ========================================

export function getArchitecture(projectId) {
  if (typeof projectId !== "string" || !projectId.trim()) {
    return createEmptyArchitecture();
  }

  const savedArchitectures = getSavedArchitectures();

  const architecture = savedArchitectures[projectId];

  if (!architecture) {
    return createEmptyArchitecture();
  }

  return validateArchitecture(architecture);
}

// ========================================
// SAVE ARCHITECTURE
// ========================================

export function saveArchitecture(projectId, architecture) {
  if (typeof projectId !== "string" || !projectId.trim()) {
    throw new Error("A valid project ID is required.");
  }

  if (
    !architecture ||
    !Array.isArray(architecture.nodes) ||
    !Array.isArray(architecture.edges)
  ) {
    throw new Error("Invalid architecture data.");
  }

  const savedArchitectures = getSavedArchitectures();

  savedArchitectures[projectId] = validateArchitecture(architecture);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedArchitectures));
  } catch (error) {
    console.error("Unable to save architecture:", error);

    throw new Error(
      "Unable to save architecture. Browser storage may be unavailable or full.",
    );
  }
}

// ========================================
// DELETE ARCHITECTURE
// ========================================

export function deleteArchitecture(projectId) {
  if (typeof projectId !== "string" || !projectId.trim()) {
    throw new Error("A valid project ID is required.");
  }

  const savedArchitectures = getSavedArchitectures();

  delete savedArchitectures[projectId];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedArchitectures));
  } catch (error) {
    console.error("Unable to delete architecture:", error);

    throw new Error("Unable to delete architecture.");
  }
}
