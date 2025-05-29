import pandas as pd
import json
import os

def get_cutting_parameters(material):
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        print(f"\nCurrent script directory: {script_dir}")
        # Load the Excel file
        file_path = os.path.join(script_dir, 'cutting_parameters.xlsx')
        df = pd.read_excel(file_path)
        material_data = df[df['Material Type'] == material]
        
        if material_data.empty:
            print(f"\nNo data found for material: {material}")
            print("\nAvailable materials:")
            print("\n".join(sorted(df['Material Type'].unique())))
            return None
        
        # Create the prompt input format
        prompt_input = {
            "material": material,
            "cutting_parameters": {
                "operations": {}
            }
        }
        
        for _, row in material_data.iterrows():
            operation = row['Operation Type']
            tool_type = row['Tool Type']
            tool_material = row['Tool Material']
            
            if operation not in prompt_input["cutting_parameters"]["operations"]:
                prompt_input["cutting_parameters"]["operations"][operation] = {}
            
            if tool_type not in prompt_input["cutting_parameters"]["operations"][operation]:
                prompt_input["cutting_parameters"]["operations"][operation][tool_type] = {}
            
            prompt_input["cutting_parameters"]["operations"][operation][tool_type][tool_material] = {
                "cutting_speed_range": {
                    "min": float(row['Cutting Speed (m/min) Min']),
                    "max": float(row['Cutting Speed (m/min) Max'])
                },
                "feed_per_tooth_range": {
                    "min": float(row['Feed per Tooth/Rev (mm) Min']),
                    "max": float(row['Feed per Tooth/Rev (mm) Max'])
                },
                "depth_of_cut_range": {
                    "min": row['Depth of Cut (mm) Min'],
                    "max": row['Depth of Cut (mm) Max']
                },
                "coolant_requirement": row['Coolant Requirement'],
                "special_notes": row['Special Notes'] if pd.notna(row['Special Notes']) else ""
            }
        
        return prompt_input
    except FileNotFoundError:
        print("\nError: Excel file not found in the current directory.")
        print("Please ensure 'cutting_parameters.xlsx' is in the same folder as this script.")
        return None
    except Exception as e:
        print(f"\nError reading Excel file: {str(e)}")
        return None

def save_parameters_to_file(params, material):
    if params:
        # Create formatted JSON string
        json_str = json.dumps(params, indent=2)
        
        # Create filename with material name
        filename = f"cutting_params_{material.lower().replace(' ', '_')}.json"
        
        # Save to file
        # script_dir = os.path.dirname(os.path.abspath(__file__))
        script_dir = "./outputs/cut_para/"
        if not os.path.exists(script_dir):
            os.makedirs(script_dir)
            
        with open(f"{script_dir}/"+filename, 'w') as f:
            f.write(json_str)
            
        print(f"\nParameters saved to {filename}")
        
        # Also print the formatted input
        # print("\nPrompt Input Format:")
        # print("-------------------")
        # print(json_str)
        return json_str

def main(material):
    try:
        import pandas as pd
        import openpyxl
    except ImportError:
        print("\nRequired libraries not found. Please install them using:")
        print("pip install pandas openpyxl")
        return

    # print("\nCutting Parameters Prompt Generator")
    # print("----------------------------------")
    params = get_cutting_parameters(material)
    if params:
        json_op = save_parameters_to_file(params,material)
        return json_op

