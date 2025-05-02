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

# Add the MTKConverter directory to the Python path
sys.path.append(abspath(dirname(Path(__file__).resolve()) + "/../../MTKConverter"))

# Import the mtk_license module needed for activation
import mtk_license as license

# Import the Manufacturing Toolkit SDK
import manufacturingtoolkit.CadExMTK as mtk

# Your other imports
from dfm_analyzer import main

# Define file paths and operation types
aSource = abspath(dirname(Path(__file__).resolve()) + "/../../../models/Part2.stp")
anOperation = "milling"

def parse_terminal_output(output_text):
    # Create a parser using a state machine approach
    result = {
        "model_name": "",
        "parts": []
    }
    
    # Split into lines and remove empty lines
    lines = [line for line in output_text.split('\n') if line.strip()]
    
    # Initialize state variables
    current_part = None
    current_issue_type = None
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
        part_match = re.match(r'Part #(\d+) \["([^"]+)"\] - solid #(\d+) has:', line)
        if part_match:
            part_num = int(part_match.group(1))
            part_name = part_match.group(2)
            solid_num = int(part_match.group(3))
            
            current_part = {
                "part_number": part_num,
                "part_name": part_name,
                "solid_number": solid_num,
                "issues": {},
                "total_issues": 0
            }
            result["parts"].append(current_part)
            line_index += 1
            continue
        
        # Extract issue type and count (4 spaces indentation)
        issue_match = re.match(r'\s{4}([^(]+) Issue\(s\): (\d+)', line)
        if issue_match and current_part:
            issue_type = issue_match.group(1).strip()  # Remove trailing spaces
            issue_count = int(issue_match.group(2))
            
            # Remove the word "Issue" from the key
            issue_key = issue_type
            
            current_issue_type = issue_key
            current_part["issues"][issue_key] = {
                "count": issue_count,
                "details": []
            }
            line_index += 1
            continue
        
        # Extract issue details (8 spaces indentation)
        detail_match = re.match(r'\s{8}(\d+) ([^(]+)\(s\) with', line)
        if detail_match and current_part and current_issue_type:
            count = int(detail_match.group(1))
            detail_type = detail_match.group(2).strip()
            
            current_group = {
                "count": count,
                "type": detail_type,
                "properties": {}
            }
            current_part["issues"][current_issue_type]["details"].append(current_group)
            line_index += 1
            continue
        
        # Extract properties (10+ spaces indentation)
        prop_match = re.match(r'\s{10}([^:]+): (.+)', line)
        if prop_match and current_group:
            prop_name = prop_match.group(1).strip()
            prop_value = prop_match.group(2).strip()
            
            # Convert mm values to float
            if prop_value.endswith(" mm"):
                prop_value = float(prop_value.replace(" mm", ""))
            elif prop_value.replace(".", "", 1).isdigit():
                prop_value = float(prop_value)
                
            current_group["properties"][prop_name] = prop_value
            line_index += 1
            continue
        
        # Extract total issues
        total_match = re.match(r'\s{4}Total issues: (\d+)', line)
        if total_match and current_part:
            current_part["total_issues"] = int(total_match.group(1))
            line_index += 1
            continue
            
        line_index += 1
    
    return result

def capture_and_process_output(source_file, operation):
    # Create a buffer to capture stdout
    buffer = io.StringIO()
    
    # Redirect stdout to our buffer
    with redirect_stdout(buffer):
        # Run the main function that does the analysis
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
    json_file_path = "dfm_analysis.json"
    with open(json_file_path, "w") as f:
        json.dump(structured_data, f, indent=2)
    
    print(f"Structured output saved to {json_file_path}")
    
    return structured_data

if __name__ == "__main__":
    # Run with output capture and processing
    structured_data = capture_and_process_output(aSource, anOperation)
    sys.exit(0)