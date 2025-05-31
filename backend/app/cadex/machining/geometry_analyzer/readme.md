# README

A Python tool that uses the Open CASCADE Technology (OCCT) library to extract geometric features from STEP files. This tool analyzes 3D CAD models, identifying different surface types, calculating volumes, surface areas, and generating a comprehensive analysis report.
Features

Extract geometric data from STEP files (.stp, .step)
Identify surface types (planes, cylinders, cones, spheres, tori, BSplines, etc.)
Calculate part volume and surface area
Generate bounding box dimensions
Analyze material usage and removal requirements
Export results to JSON and formatted text reports

Prerequisites
This tool requires Python 3.6+ and the PythonOCC package, which provides Python bindings for the Open CASCADE Technology library.
Installation
Windows

Install Python:

Download and install Python 3.6+ from python.org
Ensure you check "Add Python to PATH" during installation

Install PythonOCC using Conda (recommended):

# Install Miniconda

# Download from: https://docs.conda.io/en/latest/miniconda.html

# Create a new environment

conda create -n occt-env python=3.8
conda activate occt-env

# Install PythonOCC

conda install -c conda-forge pythonocc-core

Alternative: Install using pip (may be less reliable on Windows):
pip install OCC-Core

Clone or download this repository:
git clone <repository-url>
cd step-feature-extractor

macOS

Install Python:

# Using Homebrew

brew install python

Install PythonOCC using Conda (recommended):

# Install Miniconda

# Download from: https://docs.conda.io/en/latest/miniconda.html

# Or using Homebrew:

brew install --cask miniconda

# Create a new environment

conda create -n occt-env python=3.8
conda activate occt-env

# Install PythonOCC

conda install -c conda-forge pythonocc-core

Alternative: Install using pip:
pip install OCC-Core

Clone or download this repository:
git clone <repository-url>
cd step-feature-extractor

Project Structure
Create the following directory structure:
step-feature-extractor/
├── geo_Feature_extraction_stepfile_code.py # Main script (the code you provided)
├── stepfiles/ # Directory for your STEP files
│ ├── SHAFTx.step # Example STEP file
│ └── ... # Other STEP files
├── README.md
└── requirements.txt # Optional: list dependencies
Usage

Activate your conda environment (if using conda):
conda activate occt-env

Place your STEP files in the stepfiles directory
Run the script:
python feature_extractor.py

# Modify the script to process your specific STEP file by changing:

pythonif **name** == "**main**": # Change this line to point to your STEP file
step_file = "./stepfiles/your_file.step"
try:
result = main(step_file)
print("Analysis completed successfully!")
print("\nGenerated Prompt:")
print(result)
except Exception as e:
print(f"Error: {str(e)}")

# Check the output files:

geometry_data.json: Contains the full extracted geometry data in JSON format
analysis_prompt.txt: Contains a formatted text summary of the analysis

workign command in your conda environment

To install this package run one of the following:
conda install conda-forge::pythonocc-core
conda install conda-forge/label/cf202003::pythonocc-core
