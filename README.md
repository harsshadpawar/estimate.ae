# CNC Machining Analysis Guide

This guide explains how to use our CAD model analysis tools for CNC machining. These tools help you analyze 3D models for manufacturability and identify features for machining operations.

## Table of Contents

1. [Setup](#setup)
2. [Feature Recognition](#feature-recognition)
3. [Design for Manufacturing Analysis](#design-for-manufacturing-analysis)
4. [Understanding the Output](#understanding-the-output)
5. [Troubleshooting](#troubleshooting)

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

## Troubleshooting

If you encounter issues:

1. **Path errors**: Ensure the model file path is correct
2. **Empty results**: Verify the model contains features the tools can recognize
3. **JSON parsing errors**: Check if the terminal output format changed
4. **License errors**: Verify the MTK license is activated

For more assistance, contact the development team.
