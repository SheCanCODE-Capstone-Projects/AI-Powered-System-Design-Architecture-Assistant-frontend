import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MarkerType, useNodesState, useEdgesState } from "@xyflow/react";
import ArchitectureCanvas from "../components/architecture/ArchitectureCanvas";
import {
  getArchitecture,
  saveArchitecture,
} from "../services/architectureService";

// ========================================
// COMPONENT PALETTE DATA
// ========================================

const componentGroups = [
  {
    title: "Client / Frontend",
    items: ["Web Client", "Mobile Client"],
  },
  {
    title: "Backend Services",
    items: ["Monolith", "Microservice", "API Gateway", "Worker"],
  },
  {
    title: "Data Stores",
    items: ["Relational Database", "NoSQL Database", "Cache", "Object Storage"],
  },
  {
    title: "External Integrations",
    items: ["Third-party API", "Auth Provider", "Message Broker"],
  },
];

// ========================================
// ARCHITECTURE NODE STYLE
// ========================================

const nodeStyle = {
  background: "var(--surface-secondary)",
  color: "var(--text)",
  border: "1px solid var(--accent)",
  borderRadius: "10px",
  padding: "14px",
  width: 180,
  fontWeight: 600,
};

// ========================================
// INPUT VALIDATION
// ========================================

const MAX_NODE_LABEL_LENGTH = 60;
const MAX_EDGE_DESCRIPTION_LENGTH = 300;

function sanitizeText(value, maxLength) {
  return Array.from(String(value))
    .filter((char) => {
      const code = char.codePointAt(0);
      return code > 31 && code !== 127;
    })
    .join("")
    .slice(0, maxLength);
}
// ========================================
// GET COMPONENT CATEGORY
// ========================================

function getCategory(label) {
  if (["Web Client", "Mobile Client"].includes(label)) {
    return "Client / Frontend";
  }

  if (
    [
      "Relational Database",
      "NoSQL Database",
      "Cache",
      "Object Storage",
    ].includes(label)
  ) {
    return "Data Stores";
  }

  if (
    [
      "Third-party API",
      "Payment Provider",
      "Auth Provider",
      "Message Broker",
    ].includes(label)
  ) {
    return "External Integrations";
  }

  return "Backend Services";
}

// ========================================
// ARCHITECTURE PAGE
// ========================================

function ArchitecturePage() {
  const { projectId } = useParams();

  // Project state
  const [project, setProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Selection state
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);

  // Save feedback
  const [saveMessage, setSaveMessage] = useState("");

  // ========================================
  // LOAD PROJECT AND SAVED ARCHITECTURE
  // ========================================

  useEffect(() => {
    try {
      const savedProjects = JSON.parse(
        localStorage.getItem("archpilot-projects") || "[]",
      );

      const selectedProject = savedProjects.find(
        (item) => String(item.id) === String(projectId),
      );

      setProject(selectedProject || null);

      if (selectedProject) {
        const architecture = getArchitecture(projectId);

        setNodes(architecture?.nodes || []);
        setEdges(architecture?.edges || []);
      }
    } catch (error) {
      console.error("Unable to load project:", error);
      setProject(null);
    } finally {
      setProjectLoading(false);
    }
  }, [projectId, setNodes, setEdges]);

  // ========================================
  // ADD COMPONENT
  // ========================================

  function addComponent(label, category) {
    const index = nodes.length;

    const newNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,

      type: "default",

      position: {
        x: 100 + (index % 3) * 220,
        y: 100 + Math.floor(index / 3) * 150,
      },

      data: {
        label,
        category,
      },

      style: { ...nodeStyle },
    };

    setNodes((currentNodes) => [...currentNodes, newNode]);

    setSelectedNodeId(newNode.id);
    setSelectedEdgeId(null);
  }

  // ========================================
  // DRAG COMPONENT FROM PALETTE
  // ========================================

  function handlePaletteDragStart(event, label, category) {
    event.dataTransfer.setData(
      "application/archpilot",
      JSON.stringify({ label, category }),
    );

    event.dataTransfer.effectAllowed = "move";
  }

  // ========================================
  // GENERATE ARCHITECTURE
  // ========================================

  function generateArchitecture() {
    if (!project) return;

    const requirements = project.requirements || {};

    const requirementText = JSON.stringify(requirements).toLowerCase();

    const hasPayment = requirementText.includes("payment");

    const hasNotifications = requirementText.includes("notification");

    const hasHighTraffic =
      requirementText.includes("large") ||
      requirementText.includes("high") ||
      requirementText.includes("10000") ||
      requirementText.includes("10,000");

    const components = [
      {
        id: "web",
        label: "Web Client",
        x: 100,
        y: 50,
      },
      {
        id: "mobile",
        label: "Mobile Client",
        x: 450,
        y: 50,
      },
      {
        id: "gateway",
        label: "API Gateway",
        x: 275,
        y: 180,
      },
      {
        id: "auth",
        label: "Auth Service",
        x: 50,
        y: 340,
      },
      {
        id: "product",
        label: "Product Service",
        x: 275,
        y: 340,
      },
      {
        id: "order",
        label: "Order Service",
        x: 500,
        y: 340,
      },
      {
        id: "database",
        label: "Relational Database",
        x: 275,
        y: 550,
      },
    ];

    if (hasPayment) {
      components.push(
        {
          id: "payment",
          label: "Payment Service",
          x: 725,
          y: 340,
        },
        {
          id: "provider",
          label: "Payment Provider",
          x: 950,
          y: 340,
        },
      );
    }

    if (hasHighTraffic) {
      components.push({
        id: "cache",
        label: "Cache",
        x: 50,
        y: 550,
      });
    }

    if (hasNotifications) {
      components.push(
        {
          id: "broker",
          label: "Message Broker",
          x: 725,
          y: 550,
        },
        {
          id: "worker",
          label: "Notification Worker",
          x: 950,
          y: 550,
        },
      );
    }

    const generatedNodes = components.map((component) => ({
      id: component.id,
      type: "default",

      position: {
        x: component.x,
        y: component.y,
      },

      data: {
        label: component.label,
        category: getCategory(component.label),
      },

      style: { ...nodeStyle },
    }));

    // Create directional connections
    const createEdge = (
      id,
      source,
      target,
      label = "REST API",
      protocol = "REST",
      interaction = "Read / Write",
    ) => ({
      id,
      source,
      target,
      label,
      type: "smoothstep",
      animated: true,

      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "var(--accent)",
      },

      data: {
        protocol,
        interaction,
        description: "",
      },

      style: {
        stroke: "var(--accent)",
        strokeWidth: 2,
      },

      labelStyle: {
        fill: "var(--text)",
        fontSize: 11,
      },

      labelBgStyle: {
        fill: "var(--surface)",
      },
    });

    const generatedEdges = [
      createEdge("e1", "web", "gateway", "HTTPS"),
      createEdge("e2", "mobile", "gateway", "HTTPS"),
      createEdge("e3", "gateway", "auth"),
      createEdge("e4", "gateway", "product"),
      createEdge("e5", "gateway", "order"),

      createEdge(
        "e6",
        "product",
        "database",
        "Read / Write",
        "REST",
        "Read / Write",
      ),

      createEdge(
        "e7",
        "order",
        "database",
        "Read / Write",
        "REST",
        "Read / Write",
      ),
    ];

    if (hasPayment) {
      generatedEdges.push(
        createEdge("e8", "order", "payment"),
        createEdge("e9", "payment", "provider", "Payment API"),
      );
    }

    if (hasHighTraffic) {
      generatedEdges.push(createEdge("e10", "product", "cache", "Cache data"));
    }

    if (hasNotifications) {
      generatedEdges.push(
        createEdge("e11", "order", "broker", "Events", "Async Events"),

        createEdge("e12", "broker", "worker", "Async events", "Async Events"),
      );
    }

    setNodes(generatedNodes);
    setEdges(generatedEdges);

    setSelectedNodeId(null);
    setSelectedEdgeId(null);

    requestAnimationFrame(() => {
      reactFlowInstance?.fitView({ padding: 0.2 });
    });
  }

  // ========================================
  // SELECT COMPONENTS AND CONNECTIONS
  // ========================================

  function handleNodeClick(event, node) {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
  }

  function handleEdgeClick(event, edge) {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
  }

  function clearSelection() {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }

  // ========================================
  // UPDATE SELECTED COMPONENT
  // ========================================

  function updateSelectedNode(field, value) {
    const safeValue =
      field === "label" ? sanitizeText(value, MAX_NODE_LABEL_LENGTH) : value;

    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id !== selectedNodeId) {
          return node;
        }

        return {
          ...node,
          data: {
            ...node.data,
            [field]: safeValue,
          },
        };
      }),
    );
  }

  // ========================================
  // UPDATE SELECTED CONNECTION
  // ========================================

  function updateSelectedEdge(field, value) {
    const safeValue =
      field === "description"
        ? sanitizeText(value, MAX_EDGE_DESCRIPTION_LENGTH)
        : value;

    setEdges((currentEdges) =>
      currentEdges.map((edge) => {
        if (edge.id !== selectedEdgeId) {
          return edge;
        }

        const updatedData = {
          ...(edge.data || {}),
          [field]: safeValue,
        };

        return {
          ...edge,
          data: updatedData,

          label:
            field === "protocol" || field === "interaction"
              ? safeValue
              : edge.label,
        };
      }),
    );
  }

  // ========================================
  // DELETE COMPONENT
  // ========================================

  function deleteSelectedNode() {
    if (!selectedNodeId) return;

    setNodes((currentNodes) =>
      currentNodes.filter((node) => node.id !== selectedNodeId),
    );

    setEdges((currentEdges) =>
      currentEdges.filter(
        (edge) =>
          edge.source !== selectedNodeId && edge.target !== selectedNodeId,
      ),
    );

    clearSelection();
  }

  // ========================================
  // DELETE CONNECTION
  // ========================================

  function deleteSelectedEdge() {
    if (!selectedEdgeId) return;

    setEdges((currentEdges) =>
      currentEdges.filter((edge) => edge.id !== selectedEdgeId),
    );

    clearSelection();
  }

  // ========================================
  // SAVE ARCHITECTURE
  // ========================================

  function handleSaveArchitecture() {
    const invalidNode = nodes.find((node) => !node.data?.label?.trim());

    if (invalidNode) {
      setSaveMessage("Every component must have a name before saving.");
      return;
    }

    try {
      saveArchitecture(projectId, {
        nodes,
        edges,
      });

      setSaveMessage("Architecture saved successfully!");

      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } catch (error) {
      console.error("Unable to save architecture:", error);
      setSaveMessage("Unable to save architecture.");
    }
  }

  // ========================================
  // RESTORE ARCHITECTURE
  // ========================================

  function handleRestoreArchitecture() {
    try {
      const architecture = getArchitecture(projectId);

      setNodes(architecture?.nodes || []);
      setEdges(architecture?.edges || []);

      clearSelection();

      requestAnimationFrame(() => {
        reactFlowInstance?.fitView({ padding: 0.2 });
      });

      setSaveMessage("Saved architecture restored.");
    } catch (error) {
      console.error("Unable to restore architecture:", error);
      setSaveMessage("Unable to restore architecture.");
    }
  }

  // ========================================
  // SELECTED ITEMS
  // ========================================

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId);

  if (projectLoading) {
    return (
      <main className="architecture-page">
        <p>Loading architecture workspace...</p>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="architecture-page">
        <h2>Project not found</h2>

        <Link to="/dashboard">Back to Dashboard</Link>
      </main>
    );
  }

  const requirements = project.requirements || {};

  return (
    <main
      className="architecture-page"
      data-theme={localStorage.getItem("archpilot-theme") || "dark"}
    >
      {/* TOP TOOLBAR */}

      <header className="architecture-topbar">
        <div className="architecture-brand">
          <Link to="/dashboard" className="architecture-back-link">
            <span>←</span> Projects
          </Link>

          <div className="architecture-title-group">
            <h1>Architecture Designer</h1>
            <p>{project.name}</p>
          </div>
        </div>

        <div className="architecture-header-actions">
          <button
            type="button"
            onClick={generateArchitecture}
            className="generate-architecture-button"
          >
            Generate
          </button>

          <button type="button" onClick={handleRestoreArchitecture}>
            Restore
          </button>

          <button
            type="button"
            onClick={handleSaveArchitecture}
            className="save-architecture-button"
          >
            Save Architecture
          </button>
        </div>
      </header>

      {/* SAVE FEEDBACK */}

      {saveMessage && (
        <p className="architecture-save-message" role="status">
          {saveMessage}
        </p>
      )}

      {/* PROJECT REQUIREMENTS */}

      <section className="requirements-strip">
        <div className="requirements-strip-heading">
          <div>
            <span className="section-eyebrow">PROJECT OVERVIEW</span>

            <h2>System Requirements</h2>
          </div>

          <Link
            to={`/projects/${projectId}/requirements`}
            className="edit-requirements-link"
          >
            Edit requirements →
          </Link>
        </div>

        <div className="requirements-strip-grid">
          <div className="requirement-item">
            <span>Expected traffic</span>
            <strong>{requirements.expectedTraffic || "Not specified"}</strong>
          </div>

          <div className="requirement-item">
            <span>Latency</span>
            <strong>{requirements.latency || "Not specified"}</strong>
          </div>

          <div className="requirement-item">
            <span>Availability</span>
            <strong>{requirements.availability || "Not specified"}</strong>
          </div>

          <div className="requirement-item">
            <span>Scalability</span>
            <strong>{requirements.scalability || "Not specified"}</strong>
          </div>
        </div>
      </section>

      {/* MAIN ARCHITECTURE WORKSPACE */}

      <section className="architecture-workspace">
        {/* LEFT COMPONENT PALETTE */}

        <aside className="component-palette">
          <div className="palette-header">
            <div>
              <span className="section-eyebrow">BUILD YOUR SYSTEM</span>

              <h2>Components</h2>
            </div>

            <span className="component-count">
              {componentGroups.reduce(
                (total, group) => total + group.items.length,
                0,
              )}
            </span>
          </div>

          <p className="palette-intro">
            Drag components onto the canvas or click to add them.
          </p>

          {componentGroups.map((group, index) => (
            <section className="palette-group" key={group.title}>
              <div className="palette-group-header">
                <h3>{group.title}</h3>

                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>

              <div className="palette-items">
                {group.items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="palette-item"
                    draggable
                    onDragStart={(event) =>
                      handlePaletteDragStart(event, item, group.title)
                    }
                    onClick={() => addComponent(item, group.title)}
                  >
                    <span className="palette-item-icon">+</span>

                    <span>{item}</span>

                    <span className="palette-drag-indicator">⠿</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </aside>

        {/* CENTER CANVAS */}

        <section className="architecture-canvas-panel">
          <div className="canvas-toolbar">
            <div>
              <span className="section-eyebrow">DESIGN AREA</span>

              <h2>System Architecture</h2>

              <p>
                {nodes.length} components · {edges.length} connections
              </p>
            </div>

            <div className="canvas-toolbar-actions">
              <span className="canvas-status">
                <span className="canvas-status-dot"></span>
                Workspace
              </span>
            </div>
          </div>

          <div className="canvas-instructions">
            <span>Drag to move</span>
            <span>Connect handles to create relationships</span>
            <span>Select an item to edit</span>
          </div>

          <ArchitectureCanvas
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            onPaneClick={clearSelection}
            onInit={setReactFlowInstance}
          />
        </section>

        {/* RIGHT PROPERTIES PANEL */}

        <aside className="properties-panel">
          <div className="properties-header">
            <span className="section-eyebrow">CONFIGURATION</span>

            <h2>Properties</h2>

            <p>Inspect and configure your architecture.</p>
          </div>

          {/* SELECTED COMPONENT */}

          {selectedNode ? (
            <div className="property-editor">
              <span className="property-type">COMPONENT</span>

              <label htmlFor="node-label">Component name</label>

              <input
                id="node-label"
                type="text"
                value={selectedNode.data.label || ""}
                maxLength={MAX_NODE_LABEL_LENGTH}
                required
                onChange={(event) =>
                  updateSelectedNode("label", event.target.value)
                }
              />

              <label htmlFor="node-category">Category</label>

              <select
                id="node-category"
                value={selectedNode.data.category || ""}
                onChange={(event) =>
                  updateSelectedNode("category", event.target.value)
                }
              >
                {componentGroups.map((group) => (
                  <option key={group.title} value={group.title}>
                    {group.title}
                  </option>
                ))}
              </select>

              <div className="property-id">
                <span>Component ID</span>

                <p>{selectedNode.id}</p>
              </div>

              <button
                type="button"
                className="delete-component-button"
                onClick={deleteSelectedNode}
              >
                Delete Component
              </button>
            </div>
          ) : selectedEdge ? (
            /* SELECTED CONNECTION */

            <div className="property-editor">
              <span className="property-type">CONNECTION</span>

              <label htmlFor="edge-protocol">Protocol</label>

              <select
                id="edge-protocol"
                value={selectedEdge.data?.protocol || "REST"}
                onChange={(event) =>
                  updateSelectedEdge("protocol", event.target.value)
                }
              >
                <option value="REST">REST</option>
                <option value="GraphQL">GraphQL</option>
                <option value="gRPC">gRPC</option>
                <option value="Async Events">Async Events</option>
              </select>

              <label htmlFor="edge-interaction">Interaction</label>

              <select
                id="edge-interaction"
                value={selectedEdge.data?.interaction || "Read / Write"}
                onChange={(event) =>
                  updateSelectedEdge("interaction", event.target.value)
                }
              >
                <option value="Read">Read</option>
                <option value="Write">Write</option>
                <option value="Read / Write">Read / Write</option>
                <option value="Event">Event</option>
              </select>

              <label htmlFor="edge-description">Description</label>

              <textarea
                id="edge-description"
                rows={4}
                maxLength={MAX_EDGE_DESCRIPTION_LENGTH}
                value={selectedEdge.data?.description || ""}
                onChange={(event) =>
                  updateSelectedEdge("description", event.target.value)
                }
                placeholder="Describe this connection..."
              />

              <div className="property-id">
                <span>Source</span>

                <p>{selectedEdge.source}</p>
              </div>

              <div className="property-id">
                <span>Target</span>

                <p>{selectedEdge.target}</p>
              </div>

              <button
                type="button"
                className="delete-component-button"
                onClick={deleteSelectedEdge}
              >
                Delete Connection
              </button>
            </div>
          ) : (
            /* NOTHING SELECTED */

            <div className="empty-properties">
              <div className="empty-properties-icon">⌖</div>

              <h3>Nothing selected</h3>

              <p>
                Select a component or connection on the canvas to view and edit
                its properties.
              </p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

export default ArchitecturePage;
