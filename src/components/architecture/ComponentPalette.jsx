const componentGroups = [
  {
    title: "Frontend",
    description: "User-facing applications",
    components: [
      { label: "Web Client", category: "Frontend" },
      { label: "Mobile Client", category: "Frontend" },
    ],
  },
  {
    title: "Backend",
    description: "Application processing services",
    components: [
      { label: "Monolith", category: "Backend" },
      { label: "Microservice", category: "Backend" },
      { label: "API Gateway", category: "Backend" },
      { label: "Worker", category: "Backend" },
    ],
  },
  {
    title: "Database",
    description: "Data storage components",
    components: [
      { label: "Relational Database", category: "Database" },
      { label: "NoSQL Database", category: "Database" },
      { label: "Cache", category: "Database" },
      { label: "Object Storage", category: "Database" },
    ],
  },
  {
    title: "External API",
    description: "External integrations",
    components: [
      { label: "Third-party API", category: "External API" },
      { label: "Authentication Provider", category: "External API" },
      { label: "Message Broker", category: "External API" },
    ],
  },
];

function ComponentPalette() {
  const handleDragStart = (event, component) => {
    event.dataTransfer.setData(
      "application/archpilot",
      JSON.stringify(component),
    );

    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="component-palette">
      <div className="palette-header">
        <h3>Components</h3>
        <p>Drag components into your workspace</p>
      </div>

      {componentGroups.map((group) => (
        <section className="palette-group" key={group.title}>
          <div className="palette-group-header">
            <h4>{group.title}</h4>
            <span>{group.components.length}</span>
          </div>

          <p className="palette-description">{group.description}</p>

          <div className="palette-items">
            {group.components.map((component) => (
              <div
                key={component.label}
                className="palette-item"
                draggable
                onDragStart={(event) => handleDragStart(event, component)}
              >
                <span className="drag-handle">⠿</span>
                <span>{component.label}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </aside>
  );
}

export default ComponentPalette;
