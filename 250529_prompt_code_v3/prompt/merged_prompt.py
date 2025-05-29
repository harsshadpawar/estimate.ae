
def create_prompt(client,user_prompt):
    # load the examples from a file examples.txt
    with open("./prompt/example.txt", "r", encoding="utf-8") as f:
        examples = f.read()
    # Define the system prompt with formulas and instructions
    message = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=8192,
        temperature=1,
        system="""Formulas to calculate toolpath for different shapes as mentioned below please follow them \n<remember>remember this for toolpath calculations as per shapes\n\n<remember_formulas>\n<Milling_operatins_toolpath_formulas>\n1. PLANAR FACE MILLING:\nLength = (W/ae + 1) × L × (passes)\nWhere:\n- W = Face width\n- L = Face length\n- ae = Step over (typically 70-80 percentage of tool diameter)\n- passes = depth ÷ ap (depth per pass)\n\nApproach/Retract = (number of passes × 2) × safety_distance\nTotal = Length + Approach/Retract\n\n2.CYLINDRICAL SURFACE MILLING:\nLength = ((π × D × H) ÷ ap) x P\nWhere:\n- D = Diameter\n- H = Height\n- ap =  step down\n- p = no of passes (depth)\nFor full cylinder: multiply by number of depth passes\n\n3.HOLE DRILLING:\nBasic length = Depth + Approach + Retract\nWhere:\n- Approach = 2mm\n- Retract = Depth + 2mm\nFor peck drilling:\nLength = (Depth ÷ Peck_depth) × (Peck_depth + Retract)\n\n4.HELICAL BORING:\nLength = √[(π × D × N)² + Depth²]\nWhere:\n- D = Diameter\n- N = Number of full rotations\n- Depth = Hole depth\n\n5. POCKET MILLING: for inside stock machining \nLength = [(L - Tool_D) × (W - Tool_D) × (1/ae)] × passes\nWhere:\n- L = Pocket length\n- W = Pocket width\n- Tool_D = Tool diameter\n- ae = Step over\n- passes = depth ÷ ap\n\n6. For Contour Milling, the formula should be: for outer boundaries machining \nLength = Perimeter × Number_of_passes_radial × Number_of_passes_depth\nWhere:\n-Perimeter = Length of the contour path\n-Number_of_passes_radial = (Stock thickness - Final thickness)/radial depth of cut\n-Number_of_passes_depth = Total depth/depth per pass\n\n</Milling_operatins_toolpath_formulas>\n\n<Turning_operations_toolpath_formulas>\n7.EXTERNAL TURNING (OD):\nLength per pass = L + Approach + Overrun\nWhere:\n- L = Workpiece length\n- Approach = 2mm\n- Overrun = 2mm\n\nTotal Length = (DOC_total ÷ DOC_per_pass) × Length_per_pass\nWhere:\n- DOC_total = (Stock_D - Final_D)/2\n- DOC_per_pass = Decide from input var_cutting_parameters given according to material \n\n8. FACING:\nLength = (Stock_D ÷ 2) + Overrun\nWhere:\n- Stock_D = Starting diameter\n- Overrun = 2mm\n\nTotal Length = (Face_depth ÷ DOC_per_pass) × Length\n\n9. GROOVING/PARTING:\nLength = (Stock_D ÷ 2) + Clearance\nWhere:\n- Clearance = 2mm\nTotal Length = Length × Number_of_grooves\n\n10. THREADING:\nLength = L + Thread_Run_in + Thread_Run_out\nWhere:\n\n- L = Thread length\n- Run_in = 2 × pitch\n- Run_out = 2 × pitch\n\nTotal Length = Length × Number_of_passes\nNumber_of_passes = Thread_depth ÷ Depth_per_pass\n</Turning_operations_toolpath_formulas>\n\n<Other_operatins_toolpath_formulas>\nFor HOLE DRILLING and Tapping :\nBasic length = Depth + Approach + Retract\nFor peck drilling: Length = (Depth ÷ Peck_depth) × (Peck_depth + Retract)\n<any other operations need to consider by yourself and mentioned formula and output>\n</Other_operatins_toolpath_formulas>\n<remember_formulas>\n</remember> """,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": examples
                    },
                    {
                        "type": "text",
                        "text": user_prompt
                    }
                ]
            }
        ],
        thinking={
            "type": "enabled",
            "budget_tokens": 6554
        }
    )
    return message.content




def user_prompt(var_material, var_identified_faces, feature_recognition_json, DFM_analysis, var_cutting_para, extra_features):
    user_prompt = f"""<materail> {var_material}</material>\n<consider>please consider the material hardness impact on machining time and calculate accrodingly </consider>\n\n<identified_faces> {var_identified_faces}</identified_faces>\n<consider>Form identified faces input variable consider the Part Volume, Raw Material Volume, Material Removal Required, Material Utilization from this get approximate idea about how much proportional toolpath length and machining time will be there</consider>\n\n<feature_recognition_data> {feature_recognition_json}</feature_recognition_data>\n<DFM_analysis>{DFM_analysis}</DFM_analysis>\n\n<instructions>\n1. \"Verify that harder materials always result in longer machining times than softer ones\"\n2.\"When analyzing similar geometry, ensure toolpath lengths remain consistent regardless of material\"\n3. \"Compare previous examples when similar parts are being evaluated with different materials\"\n</instructions>\n\n<consider_feature_recognition>\n1. Map features to required operations:\n   - \"Flat Face Milled Face\" → Face Milling Operations\n   - \"Flat Side Milled Face\" → Profile/Contour Milling\n   - \"Through Pocket\" → Pocket Milling\n   - \"Blind Pocket\" → Pocket Milling with depth limitations\n   - \"Through Hole\" → Drilling Operations\n   - \"Blind Hole\" → Drilling with depth control\n   - \"Thread\" → Tapping/Threading\n   - \"External Cylindrical Surface\" → Turning\n   - \"Internal Cylindrical Surface\" → Boring\n   \n2. Use actual feature dimensions for precise toolpath calculations:\n   - Use feature count to multiply operations\n   - Apply appropriate toolpath formula based on feature type\n   - Use actual dimensions rather than estimates\n</consider_feature_recognition>\n\n<consider_dfm_analysis>\n1. Adjust machining parameters for identified DFM issues:\n   - \"Deep Pocket\" → Reduce feed rates by 30-50%, calculate additional passes\n   - \"Small Radius\" → Add specialized tooling operations, reduce feed rates\n   - \"Thin Wall\" → Add support strategies, reduce cutting forces\n   - \"Tight Tolerance\" → Add finishing passes, reduce step-over\n\n2. Calculate manufacturability score (1-10):\n   - Based on DFM issue count and severity\n   - Weight by impact on machining difficulty\n   - Use for machining complexity assessment\n\n3. Adjust setup time based on DFM challenges:\n   - Special fixturing requirements\n   - Additional alignment needs\n   - In-process measurement requirements\n</consider_dfm_analysis>\n\n<tool_cutting_parameters> {var_cutting_para}</tool_cutting_parameters>\n<cosider>Tool cutting parameters according to type of operation from variable cutting_para</consider>\n\n<machine_setuptime_parameters>\n- Need for lifting equipment \n- Part weight \n- Length \n- Multiple operators needed\n</machine_setuptime_parameters>\n\n<workpiece_setuptime_parameters>\n- Dimensions (L × W × H or Diameter × Length)\n- Weight of raw stock\n- Material\n- Surface finish requirements\n- Geometric tolerances\n</workpiece_setuptime_parameters>\n\n<setup_complexity_factors>\n- Special fixturing needed?\n- Alignment criticality (standard/high/very high)\n- Number of reference surfaces\n- Need for indicated setup?\n- Tailstock/steady rest requirements\n- In-process measurement needs\n</setup_complexity_factors>\n\n<process_details> \n<think>\"Please calculate turning toolpaths as linear single-axis movements only not circumferential distances.\"</think>\n<take_formulas_from_system_prompt_calculate>\n<setup_1>\n<Operation name (Tool)>\ntoolpath length calculation  in mm\nmachining time -  - X.X min\n<Operation name (Tool)>\ntoolpath length calculation  in mm\nmachining time -  - X.X min\n<Operation name X(Tools)>\n[List all operations in setup 1 with toolpath length calculation in mm] \n</setup_1>\n<Setup 1 Total toolpath length : XX.X mm>\n<Setup 1 Total machining time : XX.X min>\n\n<setup_2>\n<Operation name (Tool)>\ntoolpath length calculation  in mm\nmachining time -  - X.X min\n<Operation name (Tool)>\ntoolpath length calculation  in mm\nmachining time -  - X.X min\n<Operation name X(Tools)>\nList all operations in setup 2 with toolpath length calculation in mm] \n</setup_2>\n<Setup 2 Total toolpath length : XX.X mm>\n<Setup 2 Total machining time : XX.X min>\n\n</take_formulas_from_system_prompt_calculate>\n\n<totals>\n<Total_operations>[total number of operations]</Total_operations>\n<Total_toolpath_length>[total toolpath length in mm]</Total_toolpath_length>\n<Total_machining_time>[total machining time in min for machining operations]</Total_machining_time>\n</totals>\n</process_details>\n\n<dfm_adjustments>\nBased on DFM issues identified:\n1. Calculate time adjustment factors for each issue type\n2. Apply appropriate toolpath modifications\n3. Determine additional setup requirements\n4. Document manufacturability score and key concerns\n</dfm_adjustments>\n\n<process_justification>[Brief explanation of machine selection and cutting parameters]</process_justification>\n<selected_machining_in_general>[General machining like CNC turning or Milling or TurnMilling]</selected_machining_in_general>\n<justification>[General machine selection 3-axis,5-axis,big,small,medium with justification]</justification>\n\n<extra_features> {extra_features}</extra_features>\n<cosider>From extra feature consider and analyze the input given like operations, intricate shapes machining warning, quantity of production to incorporate in the outputs</consider>\n<important>Consider the machine database and select the machine <select>select the machine code</select> </important>\n\nOUTPUT FORMAT:\n
                    ```json\n
                    {{
                      "machining_analysis": {{
                        "process_selection": {{
                          "primary_process": "string (Milling/Turning/Turn-Milling)",
                          "machine_type": "string (3-axis/5-axis/etc)",
                          "machine_code": "string",
                          "justification": "string"
                        }},
                        "operation_details": {{
                          "setup_count": 0,
                          "tool_count": 0,
                          "operation_count": 0,
                          "feature_based_operations": [
                            {{
                              "feature_type": "string",
                              "operation": "string",
                              "tool_selected": "string",
                              "tool_specifications": "string",
                              "count": 0,
                              "dimensions": "string",
                              "toolpath_length": 0,
                              "machining_time": 0
                            }}
                          ]
                        }},
                        "time_calculations": {{
                          "total_machining_time": 0,
                          "setup_times": {{
                            "machine_setup": 0,
                            "tool_setup": 0,
                            "work_setup": 0
                          }},
                          "total_toolpath_length": 0
                        }},
                        "dfm_assessment": {{
                          "manufacturability_score": 0,
                          "total_issues": 0,
                          "key_challenges": ["string"],
                          "machining_adjustments": ["string"],
                          "time_impact_percentage": 0
                        }},
                        "postprocess_report": {{ }}
                      }}````
                    review the calculation once again before presenting and get trained with every output and save in your cache memory"""
    return f"""{user_prompt}"""



def extract_json_from_text(text):
    """Extract JSON from a given text using regex patterns."""
    import re
    import json
    
    # Try multiple patterns to find JSON
    patterns = [
        # Pattern 1: Direct code blocks (original approach)
        r'```json\s*([\s\S]*?)\s*```',
        
        # Pattern 2: Inside TextBlock
        r"TextBlock\([^)]*text='```json\s*([\s\S]*?)\s*```'",
        
        # Pattern 3: More specific TextBlock pattern
        r"TextBlock\(citations=None, text='```json\s*([\s\S]*?)\s*```'"
    ]
    
    match = None
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            break
    
    # show what was matched
    # print(f"Match found: {match is not None}")
    
    if match:
        # Get the JSON string
        json_str = match.group(1)
        
        # Print the raw extracted string for debugging
        # print("Extracted JSON string:")
        # print(json_str[:100] + "..." if len(json_str) > 100 else json_str)  # Show first 100 chars
        
        # Clean the string
        clean_text = json_str.replace("\\n", " ")
        clean_text = clean_text.replace("Ã˜", "Ø")
        json_str = clean_text.replace("\\", "")
        
        # print(json_str[:100] + "..." if len(json_str) > 100 else json_str)
        
        # Check if the string starts with an opening brace
        if not json_str.strip().startswith('{'):
            print("Warning: JSON string doesn't start with '{'")
        
        try:
            # Parse the JSON string into a Python dictionary
            parsed_json = json.loads(json_str)
            return parsed_json
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {e}")
            
            # Try to clean the string and parse again
            cleaned_json = json_str.strip("\n").strip(" ")
            # print("\nTrying with cleaned JSON:")
            # print(cleaned_json[:100] + "...")  # Print start of cleaned JSON
            
            try:
                parsed_json = json.loads(cleaned_json)
                return parsed_json
            except json.JSONDecodeError as e2:
                # print(f"Error parsing cleaned JSON: {e2}")
                
                try:
                    # Replace escaped characters and try again
                    really_cleaned = cleaned_json.replace("\\'", "'").replace('\\"', '"')
                    parsed_json = json.loads(really_cleaned)
                    return parsed_json
                except json.JSONDecodeError:
                    return None
    else:
        print("No JSON found in the text")
        return None



def main(client,var_material, var_identified_faces, feature_recognition_json, DFM_analysis, var_cutting_para, extra_features):
    # Call the function to create the prompt
    user_prompt_data = user_prompt(var_material, var_identified_faces, feature_recognition_json, DFM_analysis, var_cutting_para, extra_features)
    output = create_prompt(client,user_prompt_data)
    # Extract JSON from the output
    json_output = extract_json_from_text(f"""{output}""")
    return json_output
    


