# Manufacturing Toolkit Web Examples

A comprehensive collection of web-based examples showcasing the capabilities of CAD Exchanger's Manufacturing Toolkit (MTK) using TypeScript API.

[![License](https://img.shields.io/badge/License-BSD-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2025.2.0-green.svg)]()

## Overview

This repository provides a boilerplate for working with the Manufacturing Toolkit (MTK) in a web environment. It demonstrates various features including model viewing, product structure exploration, manufacturing analysis, and more. The codebase is organized as a monorepo using npm workspaces.

![MTK Web Examples](https://cadexsoft.com/assets/img/mtk-web-examples.png)

## Features

- 3D model viewing with Three.js integration
- Product structure exploration
- Selection handling and part identification
- Manufacturing feature recognition
- Measurements and analysis tools
- MTK Explorer for importing and visualizing models

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Modern web browser with WebGL support
- Internet connection (for initial package installation)

## Installation

### Cloning the Repository

```bash
# Clone the repository
git clone https://github.com/cadexsoft/mtk-web-examples.git
cd mtk-web-examples

# Install dependencies
npm install
```

### Project Structure

The project is organized as a monorepo with the following workspaces:

```
├── shared/           # Shared code between client and server
├── server/           # Express.js server implementation
├── react/            # React frontend application
├── assets/           # Static assets and MTK converter
│   ├── MTKConverter/ # MTK conversion tools
└── ...               # Configuration files
```

## Development

### Starting the Development Server

To start both the frontend and backend in development mode:

```bash
npm run dev-server:react
```

This will concurrently start:
- React frontend on http://localhost:5173
- Express server on http://localhost:3000

### Frontend Development Only

If you only want to develop the frontend (with mock data):

```bash
npm run dev:react
```

### Building for Production

To build the application for production deployment:

```bash
npm run build:react
```

The build artifacts will be available in the `react/dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview-server:react
```

## API Documentation

The MTK Web API provides access to CAD Exchanger's Manufacturing Toolkit capabilities. The API allows you to:

- Load and visualize 3D models in various formats
- Extract product structure and metadata
- Analyze models for manufacturability
- Perform measurements and dimensional analysis
- Transform and convert models

Refer to the [CAD Exchanger SDK Documentation](https://docs.cadexchanger.com/) for detailed API reference.

## Examples

The repository includes several examples demonstrating different aspects of the MTK:

- **Basic Viewer**: Simple 3D model viewer
- **Product Structure**: Exploring model hierarchies
- **Model Explorer**: Detailed model information
- **Selection Handling**: Interacting with model parts
- **Measurements**: Dimensional analysis tools
- **MTK Explorer**: Comprehensive manufacturing analysis

Each example is accessible through the main application navigation.

## License

This project is licensed under the Modified BSD License - see the [LICENSE](LICENSE) file for details.

You may use this code in your own applications, with appropriate attribution as specified in the license.

## Support

For questions, feedback, or support related to this toolkit, please visit the [CAD Exchanger website](https://cadexsoft.com) or contact support@cadexsoft.com.

---

© 2025 CADEXSOFT. All rights reserved.

## System Requirements

* Node.js 18.x or later
* npm 9.x or later
* At least 4GB of RAM
* Modern browser with WebGL support (Chrome, Firefox, Edge, Safari)
* MTK Web package (see installation guide below)

## MTKConverter Setup

To fully utilize the MTKExplorer examples, you'll need to set up the MTKConverter:

1. Obtain the MTKConverter binaries from CAD Exchanger (contact support@cadexsoft.com if needed)
2. Copy the MTKConverter files to the `assets/MTKConverter` folder
3. Ensure the `mtk_license.py` file is properly configured with your license information

## Troubleshooting

### Common Issues

**Q: The 3D viewer is not displaying models correctly**  
A: Ensure your browser supports WebGL and that it's enabled. Try updating your graphics drivers.

**Q: The MTKConverter fails to process models**  
A: Verify that you've correctly installed MTKConverter binaries and that the license file is properly configured.

**Q: Backend server isn't starting**  
A: Check if port 3000 is already in use. You can modify the port in `shared/src/server-interaction/base/ServerInteraction.ts`.

### Getting Help

If you encounter issues not covered in the troubleshooting section:

1. Check the console logs for error messages
2. Review the documentation for potential configuration issues
3. Contact CAD Exchanger support at support@cadexsoft.com

## Contributing

We welcome contributions that improve the examples or documentation. Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request with a clear description of the improvements

## Learn More

- [CAD Exchanger Website](https://cadexsoft.com)
- [Manufacturing Toolkit Documentation](https://docs.cadexchanger.com/mtk/)
- [CAD Exchanger SDK](https://cadexchanger.com/products/sdk/)
- [Contact Support](mailto:support@cadexsoft.com)
