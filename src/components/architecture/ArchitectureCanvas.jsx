import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  MarkerType,
  addEdge,
  useReactFlow,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

function ArchitectureCanvasContent({
  nodes,
  setNodes,
  edges,
  setEdges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  onEdgeClick,
  onPaneClick,
  onInit,
}) {
  const { screenToFlowPosition } = useReactFlow();

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const componentData = event.dataTransfer.getData("application/archpilot");

    if (!componentData) return;

    try {
      const component = JSON.parse(componentData);

      if (!component.label || !component.category) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: "default",
        position,
        data: {
          label: component.label,
          category: component.category,
        },
        style: {
          background: "#252B40",
          color: "#FFFFFF",
          border: "1px solid #7865E8",
          borderRadius: "10px",
          padding: "12px",
          width: 180,
        },
      };

      setNodes((previousNodes) => [...previousNodes, newNode]);
    } catch (error) {
      console.error("Unable to add architecture component:", error);
    }
  };

  const handleConnect = (connection) => {
    setEdges((previousEdges) =>
      addEdge(
        {
          ...connection,
          id: `edge-${Date.now()}`,
          type: "smoothstep",
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#7865E8",
          },
          data: {
            protocol: "REST",
            interaction: "Read / Write",
            description: "",
          },
          style: {
            stroke: "#7865E8",
            strokeWidth: 2,
          },
        },
        previousEdges,
      ),
    );
  };

  return (
    <div
      className="architecture-canvas"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onInit={onInit}
        nodesDraggable
        nodesConnectable
        elementsSelectable
        deleteKeyCode={["Backspace", "Delete"]}
        fitView
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#8790A7"
        />

        <Controls />

        <MiniMap nodeColor="#7865E8" maskColor="rgba(15, 20, 35, 0.65)" />
      </ReactFlow>
    </div>
  );
}

function ArchitectureCanvas(props) {
  return (
    <ReactFlowProvider>
      <ArchitectureCanvasContent {...props} />
    </ReactFlowProvider>
  );
}

export default ArchitectureCanvas;
