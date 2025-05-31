#!/usr/bin/env python3

# Standard imports
import sys
import os
from pathlib import Path
from os.path import abspath, dirname

# Add the MTKConverter directory to the Python path
sys.path.append(abspath(dirname(Path(__file__).resolve()) + "/../../MTKConverter"))

# Import the mtk_license module needed for activation
import mtk_license as license

# Import the Manufacturing Toolkit SDK
import manufacturingtoolkit.CadExMTK as mtk

# Your other imports
from dfm_analyzer import main

# Define file paths and operation types
aSource = abspath(dirname(Path(__file__).resolve()) + "/../../../models/PIPE.stp")
anOperation = "milling"

# Example of how you could use mtk directly
def use_mtk_directly():
    # Activate the license
    aKey = license.Value()
    if not mtk.LicenseManager.Activate(aKey):
        print("Failed to activate Manufacturing Toolkit license.")
        return 1
    
    # Create a model object
    aModel = mtk.ModelData_Model()
    
    # Load a CAD model
    aReader = mtk.ModelData_ModelReader()
    if not aReader.Read(mtk.UTF16String(aSource), aModel):
        print("Failed to read the model.")
        return 1
    
    # Example of accessing model properties
    print(f"Model name: {aModel.Name()}")
    
    # You could perform other operations with mtk here
    # ...
    
    return 0

# Uncomment to use mtk directly
# use_mtk_directly()

# Or use the existing main function which already uses mtk internally
sys.exit(main(aSource, anOperation))