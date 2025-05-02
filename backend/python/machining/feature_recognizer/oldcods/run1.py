
#!/usr/bin/env python3

# $Id$

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
    
    # Example: Create a feature recognizer directly
    # (This is for demonstration - the main() function already does this)
    if anOperation == "milling":
        aRecognizer = mtk.Machining_FeatureRecognizer(mtk.Machining_OT_Milling)
    elif anOperation == "turning":
        aRecognizer = mtk.Machining_FeatureRecognizer(mtk.Machining_OT_LatheMilling)
    else:
        print(f"Unknown operation: {anOperation}")
        return False
    
    # We could apply the recognizer to the model here
    # aRecognizer.Perform(aModel)
    # But the main() function will do this for us
    
    return True

# Uncomment to run the direct SDK usage example
# direct_mtk_usage(aSource)

# Run the main feature recognition function
sys.exit(main(aSource, anOperation))