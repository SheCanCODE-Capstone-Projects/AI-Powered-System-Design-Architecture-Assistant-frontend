
# ArchPilot - Interactive System Design & Architecture Visualizer

The **ArchPilot** is a React-based web application that empowers developers to model software system architectures, preview live auto-generated Mermaid.js diagrams, export vector graphics, and inspect AI-powered architectural review findings.

This repository contains the client-side user interface and connects to the **ArchPilot Spring Boot REST API**.

## Table of Contents

- [Frontend Features](#frontend-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend API Integration](#backend-api-integration)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [Available Scripts](#available-scripts)
- [Contributing (Fork & Pull Request)](#contributing-fork--pull-request)
- [Disclaimer](#disclaimer)

---

## Frontend Features

### 1. System Design Workspace

- **Project Dashboard:** View, search, and manage all saved system architecture projects.
- **Project Creation Form:** Create new projects with a name, description, and detailed system requirements.
- **Component & Connection Editor:** Interactive forms on the project detail page to add, edit, and delete architectural components (Frontend, Backend, Database, External API, etc.) and define directional connections between them.
- **Authenticated Access:** Manages user login sessions and attaches authentication tokens to API requests.

### 2. Automatic Diagram Generation (Mermaid.js)

- **Live Diagram Preview:** Renders Mermaid syntax fetched from the backend into clean, interactive architecture diagrams.
- **Real-Time Synchronization:** Automatically refreshes the diagram view whenever components or connections are added, modified, or removed.
- **SVG Export:** One-click export functionality to download rendered architecture diagrams as scalable `.svg` files.

### 3. AI-Powered Architecture Review UI

- **On-Demand Analysis:** Trigger architecture evaluations via the "Review Architecture" action button with clear loading state indicators.
- **Structured Finding Cards:** Displays AI and rule-based findings separated by severity badges (High, Medium, Low).
- **Actionable Insights:** Each finding card clearly highlights the Affected Component, Problem, Explanation, and Recommended Fix.
- **Built-in Safety Notice:** Displays a persistent disclaimer informing users that AI insights are advisory and do not replace formal security audits.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18+ (Create React App) |
| Diagramming Engine | Mermaid.js (`mermaid`) |
| HTTP Client | Axios / Native Fetch API |
| Routing | React Router DOM |
| Styling | CSS3 / Tailwind CSS |

---

## Project Structure

```text
frontend/
├── public/                 # Static assets
├── src/
│   ├── api/                # Axios instances and API service modules
│   ├── components/         # Reusable UI components
│   │   ├── workspace/      # ComponentForm, ConnectionForm, ProjectCard
│   │   ├── diagram/        # MermaidRenderer, ExportSvgButton
│   │   └── review/         # ReviewButton, FindingCard, SeverityBadge
│   ├── context/            # Authentication & global project state
│   ├── pages/              # Dashboard, Login/Register, ProjectDetailPage
│   ├── App.jsx             # Root component and route definitions
│   └── main.jsx            # Application entry point
├── .env.example            # Environment variable template
├── package.json            # Dependencies and npm scripts
└── README.md               # Project documentation
```

---

## Backend API Integration

This frontend communicates with the **ArchPilot** over REST.

Ensure the backend server is running before testing full end-to-end workflows.

### Key Consumed Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET / POST / PUT / DELETE | `/api/projects` | Project CRUD operations |
| POST / PUT / DELETE | `/api/projects/:id/components` | Component management |
| POST / DELETE | `/api/projects/:id/connections` | Relationship management |
| GET | `/api/projects/:id/diagram` | Fetch generated Mermaid diagram definition |
| POST / GET | `/api/projects/:id/reviews` | Trigger and retrieve AI review reports |

### Example AI Review JSON Consumed by the UI

```json
{
  "component": "Database",
  "severity": "Medium",
  "issue": "Possible performance bottleneck",
  "explanation": "High traffic may overload the database.",
  "recommendation": "Consider indexing and caching."
}
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v18.x or higher recommended)
- **npm** (v9.x or higher)
- Running instance of the **ArchPilot Backend API** (default: `http://localhost:8080`)

### Installation & Setup

#### 1. Clone the  Repository

```bash
git clone https://github.com/<your-username>/<frontend-repo-name>.git
cd <frontend-repo-name>
```

#### 2. Install Dependencies

Run the following command to install React, Mermaid, and all required packages:

```bash
npm install
```

If you are initializing core libraries manually:

```bash
npm install mermaid axios react-router-dom
```

#### 3. Configure Environment Variables

Create a `.env` file in the root of the frontend project and point it to your backend API URL.

```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

#### 4. Start the Development Server

**Run this command:**

```bash
npm start
```

#### 5. Open in Your Browser

Navigate to:

- **Create React App:** http://localhost:3000

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Starts the local development server with hot-reload |
| `npm run build` | Bundles the React app into static files for production |
| `npm run lint` | Runs ESLint to catch syntax and style issues |
| `npm test` | Runs unit and component tests |

> **Note:** Available commands depend on the scripts defined in `package.json`.

---

## Contributing (Fork & Pull Request)

Contributions to the UI/UX, diagram rendering, or frontend architecture are welcome!

Follow these steps to contribute:

### 1. Fork the Repository

Click the **Fork** button at the top-right corner of this GitHub repository to create your own copy.

### 2. Clone Your Fork Locally

```bash
git clone https://github.com/<your-username>/<frontend-repo-name>.git
cd <frontend-repo-name>
```

### 3. Connect the Upstream Repository

```bash
git remote add upstream https://github.com/<original-owner>/<frontend-repo-name>.git
```

### 4. Create a New Feature Branch

```bash
git checkout -b feature/your-ui-feature
```

### 5. Develop & Verify Your Changes

- Test component creation, Mermaid SVG exports, and AI review rendering locally.
- Verify there are no build errors:

```bash
npm run build
```

### 6. Commit and Push to Your Fork

```bash
git add .
git commit -m "feat: describe your frontend improvement"
git push origin feature/your-ui-feature
```

Recommended commit prefixes:

| Prefix | Purpose |
|--------|---------|
| `feat:` | New functionality |
| `fix:` | Bug fix |
| `refactor:` | Code restructuring |
| `test:` | Adding or updating tests |
| `docs:` | Documentation changes |
| `chore:` | Maintenance and configuration |

### 7. Submit a Pull Request (PR)

1. Go to your forked repository on GitHub.
2. Click **Compare & pull request**.
3. Select the corresponding  branch from the original repository as the base branch.
4. Include a clear description of your changes.

---

## Disclaimer

> **Note:** AI-generated architecture reviews displayed in this application are designed to assist developers during early system planning. They do not represent a formal security audit or guarantee production readiness.
