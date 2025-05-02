#!/usr/bin/env python3  # $Id$
# Copyright (C) 2008-2014, Roman Lygin. All rights reserved.
# Copyright (C) 2014-2025, CADEX. All rights reserved.

# This file is part of the Manufacturing Toolkit software.

# You may use this file under the terms of the BSD license as follows:

# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
# * Redistributions of source code must retain the above copyright notice,
#   this list of conditions and the following disclaimer.
# * Redistributions in binary form must reproduce the above copyright notice,
#   this list of conditions and the following disclaimer in the documentation
#   and/or other materials provided with the distribution.

# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
# LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
# CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
# SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
# INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
# CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
# ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE. 

import sys
import os
import json
import io
from contextlib import redirect_stdout
from pathlib import Path
from os.path import abspath, dirname

# Add the MTKConverter directory to the Python path
sys.path.append(abspath(dirname(Path(__file__).resolve()) + "/../../MTKConverter"))

# Import the MTK SDK and license
import manufacturingtoolkit.CadExMTK as mtk
import mtk_license as license

# Import the main function from feature_recognizer
from feature_recognizer import main

# Define the source file and operation
aSource = abspath(dirname(Path(__file__).resolve()) + "/../../../models/PIPE.stp")
anOperation = "milling"

# Function to capture the terminal output and save it as JSON
def capture_output_to_json(source_file, operation):
    # Create a buffer to capture stdout
    buffer = io.StringIO()
    
    # Redirect stdout to our buffer
    with redirect_stdout(buffer):
        # Run the main function that does the feature recognition
        # We're not calling sys.exit here so our program continues
        main(source_file, operation)
    
    # Get the captured output
    output_text = buffer.getvalue()
    
    # Convert the output to a JSON structure
    json_output = {
        "timestamp": "",  # You could add a timestamp here if needed
        "model_file": source_file,
        "operation": operation,
        "output": output_text,
        # Parse the text output into a more structured format if desired
    }
    
    # Write to a JSON file
    json_file_path = "features.json"
    with open(json_file_path, "w") as f:
        json.dump(json_output, f, indent=2)
    
    # Print the original output to the terminal
    print(output_text)
    
    print(f"Output also saved to {json_file_path}")
    
    return json_output

# Example function to show direct use of the MTK SDK
def direct_mtk_usage(theFilePath):
    # Activate the license
    aKey = license.Value()
    if not mtk.LicenseManager.Activate(aKey):
        print("Failed to activate Manufacturing Toolkit license.")
        return False
        
    # Create a model and reader
    aModel = mtk.ModelData_Model()
    aReader = mtk.ModelData_ModelReader()
        
    # Read the CAD model
    print(f"Loading model: {theFilePath}")
    if not aReader.Read(mtk.UTF16String(theFilePath), aModel):
        print("Failed to read the model.")
        return False
        
    # Example: Get basic model information
    print(f"Model name: {aModel.Name()}")
        
    # Example: Create a feature recognizer 
    # Note: You may need to modify this based on your specific SDK version
    # If the code below gives an error, use the approach with parameters:
    try:
        if anOperation == "milling":
            aRecognizer = mtk.Machining_FeatureRecognizer(mtk.Machining_OT_Milling)
        elif anOperation == "turning":
            aRecognizer = mtk.Machining_FeatureRecognizer(mtk.Machining_OT_LatheMilling)
        else:
            print(f"Unknown operation: {anOperation}")
            return False
    except Exception as e:
        print(f"Error creating recognizer directly: {e}")
        print("Using alternative approach with parameters...")
        # Alternative approach using parameters
        aRecognizer = mtk.Machining_FeatureRecognizer()
        aParams = mtk.Machining_FeatureRecognizerParameters()
        if anOperation == "milling":
            aParams.SetOperationType(mtk.Machining_OT_Milling)
        elif anOperation == "turning":
            aParams.SetOperationType(mtk.Machining_OT_LatheMilling)
        aRecognizer.SetParameters(aParams)
        
    return True

# Main execution
if __name__ == "__main__":
    # Uncomment to run the direct SDK usage example
    # direct_mtk_usage(aSource)
    
    # Run the main function with output capture
    captured_data = capture_output_to_json(aSource, anOperation)
    
    # No need for sys.exit here since we're at the end of the script