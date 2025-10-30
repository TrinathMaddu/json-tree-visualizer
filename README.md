# JSON Tree Visualizer

Interactive web application for visualizing JSON data as an interactive tree structure. Built with React, TypeScript, and ReactFlow, which makes it easy to explore, navigate, and understand complex JSON structures.

## Features

- **Interactive Tree Visualization**: Transform JSON data into an intuitive, clickable tree structure
- **Smart Layout**: Automatic node positioning using Dagre algorithm for optimal readability
- **Path Search**: Find and highlight specific nodes using JSONPath notation
- **Node Interaction**:
  - Click nodes to focus on subtrees
  - Copy node paths to clipboard
  - Hover tooltips showing node path and value
- **Export Functionality**: Download the tree visualization as PNG image
- **JSON Validation**: JSON validation with error messages
- **Sample Data**: Sample JSON for quick testing

## Quick Start

### Prerequisites

- Node.js (version 22 or higher)
- yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/TrinathMaddu/json-tree-visualizer.git
cd json-tree-visualizer
```

2. Install dependencies:

```bash
yarn install
```

3. Start the development server:

```bash
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Basic Usage

1. **Input JSON Data**: Paste your JSON data into the text area
2. **Generate Tree**: Click "Generate Tree" to create the visualization
3. **Navigate**: Click on nodes to focus on specific subtrees
4. **Search**: Use the search bar to find specific nodes by path
5. **Export**: Click "Export as PNG" to download the visualization

### JSONPath Search

The application supports JSONPath notation for searching:

- `$.user.name` - Find the name property of the user object
- `$.items[0]` - Find the first item in an array
- `$.config.database.host` - Navigate nested objects

## Architecture

### Tech Stack

- **Frontend**: React 19 with TypeScript
- **Visualization**: ReactFlow (@xyflow/react)
- **Layout Algorithm**: Dagre.js
- **Build Tool**: Vite
- **Styling**: CSS
- **Image Export**: html-to-image

### Project Structure

```
src/
    components/
        JSONInput/          # JSON input and validation
        JSONTreeFlow/       # Main tree visualization component
        JSONNode/           # Individual node component
        JSONPathSearchBar/  # Search functionality
        DownloadImage/      # PNG export functionality
    pages/
        JSONTreeView/       # Main page component
    App.tsx                 # Root component
    main.tsx                # Application entry point
```

## References

- [ReactFlow](https://reactflow.dev/) for the powerful flow visualization library
- [ReactFlow examples](https://reactflow.dev/examples) for understanding what all functionalities it provides
- [Dagre](https://github.com/dagrejs/dagre) for the automatic layout algorithm
- [Vite](https://vitejs.dev/) for the fast build tooling

---
