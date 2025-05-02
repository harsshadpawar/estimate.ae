#!/usr/bin/env python3

# Standard imports
import sys
import os
import json
import io
import re
from datetime import datetime
from contextlib import redirect_stdout
from pathlib import Path
from os.path import abspath, dirname

# Add the MTKConverter directory to the Python path (assuming similar structure to dfm_analyzer)
sys.path.append(abspath(dirname(Path(__file__).resolve()) + "/../../MTKConverter"))

# Import the mtk_license module needed for activation
import mtk_license as license

# Import the Manufacturing Toolkit SDK
import manufacturingtoolkit.CadExMTK as mtk

# Your other imports
from feature_recognizer import main

# Define file paths and operation types
aSource = abspath(dirname(Path(__file__).resolve()) + "/../../../models/Part2.stp")
anOperation = "milling"

def parse_feature_recognizer_output(output_text):
    """
    Parse the output from the feature_recognizer tool into a structured JSON format.
    Uses a state machine approach to handle the different levels of indentation.
    """
    # Create a result structure
    result = {
        "model_name": "",
        "parts": []
    }
    
    # Split into lines and remove empty lines
    lines = [line for line in output_text.split('\n') if line.strip()]
    
    # Initialize state variables
    current_part = None
    current_feature_type = None
    line_index = 0
    
    while line_index < len(lines):
        line = lines[line_index]
        
        # Extract model name
        if line.startswith("Model:"):
            result["model_name"] = line.replace("Model:", "").strip()
            line_index += 1
            continue
        
        # Extract part information
        part_match = re.match(r'Part #(\d+) \["([^"]+)"\] - solid #(\d+) has:', line)
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
        
        # Extract feature type and count (4 spaces indentation)
        feature_match = re.match(r'\s{4}([^(]+)\(s\): (\d+)', line)
        if feature_match and current_part:
            feature_type = feature_match.group(1).strip()
            feature_count = int(feature_match.group(2))
            
            current_feature_type = feature_type
            current_part["features"][feature_type] = []
            line_index += 1
            continue
        
        # Extract feature details (8 spaces indentation)
        detail_match = re.match(r'\s{8}(\d+)(.+?)(?:\(s\) with|$)', line)
        if detail_match and current_part and current_feature_type:
            count = int(detail_match.group(1))
            # Get the detail type and strip any extra whitespace
            detail_type = detail_match.group(2).strip() if detail_match.group(2) else ""
            
            # Initialize a new feature group
            feature_group = {
                "count": count,
                "properties": {}
            }
            
            # Add the detail_type if it's not empty
            if detail_type:
                feature_group["type"] = detail_type
            
            # Check if this has properties (contains "with") or not
            if "with" in line:
                # Process the properties for this feature group
                line_index += 1
                while line_index < len(lines):
                    next_line = lines[line_index]
                    
                    # If we've hit the next feature group or feature type, break
                    if re.match(r'\s{8}(\d+)', next_line) or re.match(r'\s{4}', next_line) and not re.match(r'\s{10}', next_line):
                        break
                    
                    # Extract properties (10+ spaces indentation)
                    prop_match = re.match(r'\s{10,}([^:]+): (.+)', next_line)
                    if prop_match:
                        prop_name = prop_match.group(1).strip()
                        prop_value = prop_match.group(2).strip()
                        
                        # Process property values based on their format
                        if prop_value.endswith(" mm"):
                            # Convert mm values to float
                            prop_value = float(prop_value.replace(" mm", ""))
                        elif prop_value.replace(".", "", 1).isdigit():
                            # Convert numeric values to float
                            prop_value = float(prop_value)
                        elif prop_match.group(1).strip() == "axis":
                            # Parse axis vectors like (0.00, -0.00, 1.00)
                            vector_match = re.match(r'\(([^,]+), ([^,]+), ([^)]+)\)', prop_value)
                            if vector_match:
                                x = float(vector_match.group(1))
                                y = float(vector_match.group(2))
                                z = float(vector_match.group(3))
                                prop_value = [x, y, z]
                        
                        feature_group["properties"][prop_name] = prop_value
                        line_index += 1
                    else:
                        # If not a property line, move to the next line
                        line_index += 1
            else:
                # No properties, just increment the line counter
                line_index += 1
            
            # Add the feature group to the current feature type
            current_part["features"][current_feature_type].append(feature_group)
            continue
        
        # Extract total features
        total_match = re.match(r'\s{4}Total features: (\d+)', line)
        if total_match and current_part:
            current_part["total_features"] = int(total_match.group(1))
            line_index += 1
            continue
        
        # If we couldn't match any of the above patterns, move to the next line
        line_index += 1
    
    return result

def capture_and_process_output(source_file, operation):
    """
    Run the feature recognizer, capture its output, and process it into a structured JSON format.
    """
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
    structured_data = parse_feature_recognizer_output(output_text)
    
    # Add metadata
    structured_data["timestamp"] = datetime.now().isoformat()
    structured_data["model_file"] = source_file
    structured_data["operation"] = operation
    
    # Post-process to fix specific issues:
    
    # 1. Remove "with" as a type for Through Pocket and Open Pocket
    for part in structured_data["parts"]:
        for feature_type in ["Through Pocket", "Open Pocket"]:
            if feature_type in part["features"]:
                for feature in part["features"][feature_type]:
                    if "type" in feature and feature["type"] == "with":
                        # Remove the "with" type
                        del feature["type"]
        
        # 2. Add entries for empty feature arrays (features without detailed properties)
        # Extract the feature counts from the output text
        feature_counts = {}
        for line in output_text.split('\n'):
            match = re.match(r'\s{4}([^(]+)\(s\): (\d+)', line)
            if match:
                feature_type = match.group(1).strip()
                count = int(match.group(2))
                feature_counts[feature_type] = count
        
        # Fill in empty feature arrays with their counts
        for feature_type, count in feature_counts.items():
            if feature_type in part["features"] and not part["features"][feature_type]:
                part["features"][feature_type] = [{
                    "count": count,
                    "properties": {}
                }]
    
    # Write to a JSON file
    json_file_path = "feature_recognition.json"
    with open(json_file_path, "w") as f:
        json.dump(structured_data, f, indent=2)
    
    print(f"Structured output saved to {json_file_path}")
    
    # Print the JSON to verify
    print(json.dumps(structured_data, indent=2))
    
    return structured_data

if __name__ == "__main__":
    # Run with output capture and processing
    structured_data = capture_and_process_output(aSource, anOperation)
    sys.exit(0)