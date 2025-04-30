
import json
def clean_json_with_escapes(raw_json_text):
    # Remove the triple backticks at the end if present
    if raw_json_text.strip().endswith("```"):
        raw_json_text = raw_json_text[:raw_json_text.rfind("```")].strip()
    
    # Replace all \n with actual spaces
    clean_text = raw_json_text.replace("\\n", " ")
    
    # Fix Unicode characters
    clean_text = clean_text.replace("Ã˜", "Ø")
    
    # Remove any remaining escape characters
    clean_text = clean_text.replace("\\", "")
    
    try:
        # Parse the cleaned JSON
        parsed_json = json.loads(clean_text)
        return parsed_json
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return None

# Your text from the example
# raw_json = """{\n  "machining_analysis": {\n    "machining_process_selected": "Milling",\n    "setup_count": 2,\n    "tool_count": 3,\n    "operation_count": 4,\n    "machining_time": 24.6,\n    "toolpath_length": 4400,\n    "process_details": {\n      "setup_1": {\n        "operations": [\n          {\n            "name": "Face milling",\n            "tool": "Face Mill Ã˜80mm",\n            "length": 1200,\n            "machining_time": 6.4\n          },\n          {\n            "name": "Perimeter milling",\n            "tool": "End Mill Ã˜20mm",\n            "length": 1600,\n            "machining_time": 8.2\n          }\n        ],\n        "total_toolpath_length": 2800,\n        "total_machining_time": 14.6\n      },\n      "setup_2": {\n        "operations": [\n          {\n            "name": "Face milling opposite side",\n            "tool": "Face Mill Ã˜80mm",\n            "length": 1200,\n            "machining_time": 6.4\n          },\n          {\n            "name": "Profile finishing",\n            "tool": "End Mill Ã˜16mm",\n            "length": 400,\n            "machining_time": 3.6\n          }\n        ],\n        "total_toolpath_length": 1600,\n        "total_machining_time": 10.0\n      }\n    },\n    "setup_times": {\n      "machine_setup": 20,\n      "tool_setup": 15,\n      "work_setup": 15\n    },\n    "selected_machine": "CNC_3AXIS_STANDARD"\n  },\n  "justification": {\n    "machine_selection": "3-axis CNC mill selected due to simple prismatic geometry",\n    "machine_size": "Standard size sufficient for 104mm cube",\n    "tool_selection": [\n      "Face mill for large flat surfaces",\n      "End mills for perimeter and finish operations"\n    ],\n    "setup_considerations": {\n      "part_weight": "~2.7kg aluminum",\n      "reference_surfaces": "Simple orthogonal surfaces",\n      "alignment_requirements": "Basic",\n      "fixturing_needs": "Standard vise sufficient"\n    }\n  }\n}\n```"""
with open('output.txt', 'r') as file:
    raw_json = file.read()

    

# Process the raw JSON
parsed_json = clean_json_with_escapes(raw_json)

if parsed_json:
    # Success! Print the clean JSON
    print(json.dumps(parsed_json, indent=2))