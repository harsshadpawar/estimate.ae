# CNC Machining Analysis Guide

This guide explains how to use our CAD model analysis tools for CNC machining. These tools help you analyze 3D models for manufacturability and identify features for machining operations.

## Table of Contents

1. [Setup](#setup)
2. [Feature Recognition](#feature-recognition)
3. [Design for Manufacturing Analysis](#design-for-manufacturing-analysis)
4. [Geometry Analysis](#geometry-analysis)
5. [Cutting Parameters](#cutting-parameters)
6. [Understanding the Output](#understanding-the-output)
7. [Troubleshooting](#troubleshooting)

## Setup

Before running the tools, ensure you have:

1. **Python 3.10.16** installed (this specific version is required)
2. The Manufacturing Toolkit SDK activated
3. Required Python dependencies installed
4. STEP (.stp) CAD model files to analyze

### Prerequisites

1. **Add your STEP files to the models folder**:

   ```
   /backend/models/
   ```

   Place all your .stp files in this directory to make them accessible to the analysis tools.

2. **Add the MTK license file**:
   - Create or obtain the `mtk_license.py` file
   - Place it in the `python/MTKConverter` folder:
   ```
   /backend/python/MTKConverter/mtk_license.py
   ```
   This file is required for activating the Manufacturing Toolkit SDK.

## Feature Recognition

The Feature Recognizer identifies machining features in your CAD model, such as holes, pockets, bosses, and faces.

### Running the Feature Recognizer

```bash
# Navigate to the feature_recognizer directory
cd backend/python/machining/feature_recognizer

# Run the feature recognition tool
python featureRun.py
```

By default, this analyzes the PIPE.stp model. To analyze a different model, modify the `aSource` variable in the `featureRun.py` file:

```python
# Example: Change the model path
aSource = abspath(dirname(Path(__file__).resolve()) + "/../../../models/YOUR_MODEL.stp")
```

### Feature Recognition Output

The tool produces two outputs:

1. **Terminal output**: Shows identified features with their properties
2. **JSON file**: Located at `feature_recognition.json` in the same directory

## Design for Manufacturing Analysis

The DFM Analyzer checks your model for manufacturability issues that could affect CNC machining.

### Running the DFM Analyzer

```bash
# Navigate to the dfm_analyzer directory
cd backend/python/machining/dfm_analyzer

# Run the DFM analysis tool
python dfmRun.py
```

By default, this analyzes the PIPE.stp model. To analyze a different model, modify the `aSource` variable in the `dfmRun.py` file:

```python
# Example: Change the model path
aSource = abspath(dirname(Path(__file__).resolve()) + "/../../../models/YOUR_MODEL.stp")
```

You can also change the machining operation by modifying the `anOperation` variable. Only two operations are supported:

```python
# For milling operations
anOperation = "milling"

# For turning operations
anOperation = "turning"
```

Select the appropriate operation based on your manufacturing process.

### DFM Analysis Output

The tool produces two outputs:

1. **Terminal output**: Shows identified manufacturability issues
2. **JSON file**: Located at `dfm_analysis.json` in the same directory

## Understanding the Output

### Feature Recognition JSON Structure

The feature recognition JSON output has this structure:

```json
{
  "model_name": "Model Name",
  "parts": [
    {
      "part_number": 0,
      "part_name": "Part Name",
      "features": {
        "Feature Type 1": [
          {
            "count": 3,
            "properties": {
              "property1": value,
              "property2": value
            },
            "type": "Subtype"
          }
        ],
        "Feature Type 2": [...]
      },
      "total_features": 27
    }
  ],
  "timestamp": "ISO Date",
  "model_file": "File Path",
  "operation": "milling"
}
```

Common feature types include:

- Through Hole
- Flat Bottom Hole
- Through Pocket
- Open Pocket
- Boss
- Curved Milled Face
- Flat Face Milled Face
- Flat Side Milled Face

### DFM Analysis JSON Structure

The DFM analysis JSON output has this structure:

```json
{
  "model_name": "Model Name",
  "parts": [
    {
      "part_number": 0,
      "part_name": "Part Name",
      "issues": {
        "Issue Type 1": {
          "count": 3,
          "details": [
            {
              "count": 3,
              "type": "Issue Subtype",
              "properties": {
                "property1": value,
                "property2": value
              }
            }
          ]
        },
        "Issue Type 2": {...}
      },
      "total_issues": 5
    }
  ],
  "timestamp": "ISO Date",
  "model_file": "File Path",
  "operation": "milling"
}
```

Common issue types include:

- Non Standard Diameter Hole
- Deep Pocket
- Small Radius Milled Part Internal Corner
- Milled Part External Edge Fillet

## Geometry Analysis

The Geometry Analyzer examines the geometric properties of your CAD models and provides insights about surfaces, volumes, and material usage.

### Running the Geometry Analyzer

```bash
# Navigate to the geometry_analyzer directory
cd backend/python/machining/geometry_analyzer

# Run the geometry analysis tool
python geometryRun.py
```

By default, the tool analyzes the BLOCK.stp model. To analyze a different model, modify the `step_file` variable in the `geometryRun.py` file:

```python
# Example: Change the model path
step_file = abspath(dirname(Path(__file__).resolve()) + "/../../../models/YOUR_MODEL.stp")
```

### Geometry Analyzer Features

The Geometry Analyzer provides comprehensive analysis of your 3D models:

1. **Surface Identification**: Detects different surface types:

   - Planar faces
   - Cylindrical faces
   - Conical faces
   - Spherical faces
   - Toroidal faces
   - Advanced surfaces (B-Splines, Bezier)

2. **Volume and Material Analysis**:

   - Calculates part volume
   - Determines the minimum raw material block size
   - Estimates material removal needed
   - Calculates material utilization percentage

3. **Detailed Surface Data**:
   - Surface areas
   - Dimensional parameters (radii, angles, etc.)
   - Centers of mass

### Geometry Analysis Output

The tool produces three outputs:

1. **Terminal output**: Shows a summary of the analysis
2. **JSON file**: Located at `geometry_data.json` in the same directory
3. **Text prompt**: Located at `analysis_prompt.txt` with formatted results

### Required Packages

The Geometry Analyzer requires Python with the Open CASCADE Technology (OCCT) library. It's recommended to install it via Conda:

```bash
# Create a conda environment
conda create -n occt-env python=3.8
conda activate occt-env

# Install PythonOCC
conda install -c conda-forge pythonocc-core
```

## Cutting Parameters

The Cutting Parameters tool helps determine optimal machining parameters based on material type.

### Using the Cutting Parameters Tool

```bash
# Navigate to the cutting_parameters directory
cd backend/python/machining/cutting_parameters

# Run the cutting parameters tool
python cutting_para.py
```

When prompted, enter the material name for which you need cutting parameters. The tool will generate a JSON file with the recommended cutting parameters.

### Features of Cutting Parameters Tool

The tool provides the following information for various material types:

1. **Cutting Speed Ranges**: Minimum and maximum recommended cutting speeds in m/min
2. **Feed Rates**: Recommended feed per tooth/revolution in mm
3. **Depth of Cut**: Minimum and maximum recommended depth of cut
4. **Coolant Requirements**: Whether coolant is required
5. **Special Notes**: Additional information for specific material/tool combinations

### Available Materials

The tool uses a comprehensive database of materials stored in `cutting_parameters.xlsx`. It supports common engineering materials including:

- Various grades of aluminum
- Steel alloys
- Stainless steel
- Titanium
- Plastics

### Output Format

The parameters are output as structured JSON files, for example `cutting_params_aluminum.json`, with organized information by:

- Operation type (e.g., drilling, milling, turning)
- Tool type (e.g., end mill, drill bit, insert)
- Tool material (e.g., carbide, HSS)

These parameters can be integrated with other components like feature recognition for process planning.

### Required Packages

The cutting_parameters requires
pandas (version 2.2.3) and openpyxl (version 3.1.5)

A library for reading and writing Excel 2010+ (.xlsx) files
Allows you to manipulate Excel spreadsheets programmatically

```bash
conda install -c conda-forge openpyxl=3.1.5
conda install -c conda-forge pandas=2.2.3
```

## Troubleshooting

If you encounter issues:

1. **Path errors**: Ensure the model file path is correct
2. **Empty results**: Verify the model contains features the tools can recognize
3. **JSON parsing errors**: Check if the terminal output format changed
4. **License errors**: Verify the MTK license is activated
5. **Missing dependencies**: Ensure all required packages are installed
6. **Conda environment**: Make sure you've activated the correct environment (mtk-env for main tools, occt-env for geometry analyzer)

For more assistance, contact the development team.
