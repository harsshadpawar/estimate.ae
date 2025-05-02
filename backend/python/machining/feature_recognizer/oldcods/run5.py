#!/usr/bin/env python3  # $Id$
# Copyright (C) 2008-2014, Roman Lygin. All rights reserved.
# Copyright (C) 2014-2025, CADEX. All rights reserved.
# Json parser for feature_recognizer.py updated 2nd may 2025 by Harsshad Pawar.

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
import re
from datetime import datetime
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
aSource = abspath(dirname(Path(__file__).resolve()) + "/../../../models/Part2.stp")
anOperation = "milling"

def parse_terminal_output(output_text):
    # Create a more robust parser using a state machine approach
    result = {
        "model_name": "",
        "parts": []
    }
    
    # Split into lines and remove empty lines
    lines = [line for line in output_text.split('\n') if line.strip()]
    
    # Initialize state variables
    current_part = None
    current_feature_type = None
    current_group = None
    line_index = 0
    
    while line_index < len(lines):
        line = lines[line_index]
        
        # Extract model name
        if line.startswith("Model:"):
            result["model_name"] = line.replace("Model:", "").strip()
            line_index += 1
            continue
        
        # Extract part information
        part_match = re.match(r"Part #(\d+) \[\"([^\"]+)\"\] - solid #(\d+) has:", line)
        if part_match:
            part_num = int(part_match.group(1))
            part_name = part_match.group(2)
            solid_num = int(part_match.group(3))
            
            current_part = {
                "part_number": part_num,
                "part_name": part_name,
                "solid_number": solid_num,
                "features": {},
                "total_features": 0
            }
            result["parts"].append(current_part)
            line_index += 1
            continue
        
        # Extract total features count
        total_match = re.match(r"\s*Total features: (\d+)", line)
        if total_match and current_part:
            current_part["total_features"] = int(total_match.group(1))
            line_index += 1
            continue
        
        # Extract feature type (4 spaces indentation)
        feature_match = re.match(r"\s{4}([^(]+)\(s\): (\d+)", line)
        if feature_match and current_part:
            feature_type = feature_match.group(1).strip()
            feature_count = int(feature_match.group(2))
            
            # Initialize feature type in the part
            if feature_type not in current_part["features"]:
                current_part["features"][feature_type] = []
            
            current_feature_type = feature_type
            
            # If next line doesn't have indented group info, this feature has no details
            if line_index + 1 < len(lines) and not re.match(r"\s{8}\d+ ", lines[line_index + 1]):
                # Empty feature with just a count
                current_part["features"][feature_type].append({
                    "count": feature_count,
                    "properties": {}
                })
            
            line_index += 1
            continue
        
        # Extract feature group (8 spaces indentation)
        group_match = re.match(r"\s{8}(\d+) ([^(]+)\(s\) with", line)
        if group_match and current_part and current_feature_type:
            group_count = int(group_match.group(1))
            
            current_group = {
                "count": group_count,
                "properties": {}
            }
            current_part["features"][current_feature_type].append(current_group)
            line_index += 1
            continue
        
        # Extract property (10+ spaces indentation)
        prop_match = re.match(r"\s{10,}([^:]+): (.+)", line)
        if prop_match and current_part and current_feature_type and current_group:
            prop_name = prop_match.group(1).strip()
            prop_value = prop_match.group(2).strip()
            
            # Process value based on type
            if prop_value.endswith(" mm"):
                # Handle numeric value with mm unit
                prop_value = float(prop_value.replace(" mm", ""))
            elif re.match(r"\([-0-9., ]+\)", prop_value):
                # Handle axis vector
                vector_str = prop_value.strip("()")
                vector_values = [float(x) for x in vector_str.split(", ")]
                prop_value = vector_values
            elif prop_value.replace(".", "", 1).replace("-", "", 1).isdigit():
                # Handle other numeric values
                prop_value = float(prop_value)
            
            current_group["properties"][prop_name] = prop_value
            line_index += 1
            continue
        
        # If we get here, we didn't match any pattern, move to next line
        line_index += 1
    
    return result

# Function to capture the terminal output, parse it, and save as JSON
def capture_and_process_output(source_file, operation):
    # Create a buffer to capture stdout
    buffer = io.StringIO()
    
    # Redirect stdout to our buffer
    with redirect_stdout(buffer):
        # Run the main function that does the feature recognition
        main(source_file, operation)
    
    # Get the captured output
    output_text = buffer.getvalue()
    
    # Print the original output to the terminal
    print(output_text)
    
    # Parse the text into structured data
    structured_data = parse_terminal_output(output_text)
    
    # Add metadata
    structured_data["timestamp"] = datetime.now().isoformat()
    structured_data["model_file"] = source_file
    structured_data["operation"] = operation
    
    # Write to a JSON file
    json_file_path = "features.json"
    with open(json_file_path, "w") as f:
        json.dump(structured_data, f, indent=2)
    
    print(f"Structured output saved to {json_file_path}")
    
    return structured_data

# Main execution
if __name__ == "__main__":
    # Run with output capture and processing
    structured_data = capture_and_process_output(aSource, anOperation)