from input_para import var_material, var_identified_faces, var_cutting_para, extra_features







system_prompt = """Formulas to calculate toolpath for different shapes as mentioned below please follow them 
                \n<remember>remember this for toolpath calculations as per shapes\n\n<remember_formulas>\n<Milling_operatins_toolpath_formulas>\n1. PLANAR FACE MILLING:\nLength = (W/ae + 1) × L × (passes)\n
                Where:\n- W = Face width\n- L = Face length\n- ae = Step over (typically 70-80% of tool diameter)\n- passes = depth ÷ ap (depth per pass)\n
                \nApproach/Retract = (number of passes × 2) × safety_distance\nTotal = Length + Approach/Retract\n\n2.CYLINDRICAL SURFACE MILLING:\nLength = ((π × D × H) ÷ ap) x P\n
                Where:\n- D = Diameter\n- H = Height\n- ap =  step down\n- p = no of passes (depth)\nFor full cylinder: multiply by number of depth passes\n\n3.HOLE DRILLING:\nBasic length = Depth + Approach + Retract\n
                Where:\n- Approach = 2mm\n- Retract = Depth + 2mm\nFor peck drilling:\nLength = (Depth ÷ Peck_depth) × (Peck_depth + Retract)\n\n4.HELICAL BORING:\nLength = √[(π × D × N)² + Depth²]\n
                Where:\n- D = Diameter\n- N = Number of full rotations\n- Depth = Hole depth\n\n5. POCKET MILLING: for inside stock machining \nLength = [(L - Tool_D) × (W - Tool_D) × (1/ae)] × passes\nWhere:\n- L = Pocket length\n- W = Pocket width\n
                - Tool_D = Tool diameter\n
                - ae = Step over\n- passes = depth ÷ ap\n\n6. For Contour Milling, the formula should be: for outer boundaries machining \n
                Length = Perimeter × Number_of_passes_radial × Number_of_passes_depth\nWhere:\n-Perimeter = Length of the contour path\n-Number_of_passes_radial = (Stock thickness - Final thickness)/radial depth of cut\n-Number_of_passes_depth = Total depth/depth per pass\n
                \n</Milling_operatins_toolpath_formulas>\n\n<Turning_operations_toolpath_formulas>\n7.EXTERNAL TURNING (OD):\nLength per pass = L + Approach + Overrun\nWhere:\n- L = Workpiece length\n- Approach = 2mm\n- Overrun = 2mm\n
                \nTotal Length = (DOC_total ÷ DOC_per_pass) × Length_per_pass\nWhere:\n- DOC_total = (Stock_D - Final_D)/2\n- DOC_per_pass = Decide from input var_cutting_parameters given according to material \n
                \n8. FACING:\nLength = (Stock_D ÷ 2) + Overrun\nWhere:\n- Stock_D = Starting diameter\n- Overrun = 2mm\n
                \nTotal Length = (Face_depth ÷ DOC_per_pass) × Length\n\n9. GROOVING/PARTING:\nLength = (Stock_D ÷ 2) + Clearance
                \nWhere:\n- Clearance = 2mm\nTotal Length = Length × Number_of_grooves\n\n10. THREADING:\n
                Length = L + Thread_Run_in + Thread_Run_out\nWhere:\n\n- L = Thread length\n- Run_in = 2 × pitch\n
                - Run_out = 2 × pitch\n\nTotal Length = Length × Number_of_passes\nNumber_of_passes = Thread_depth ÷ Depth_per_pass\n</Turning_operations_toolpath_formulas>\n\n<Other_operatins_toolpath_formulas>\nFor HOLE DRILLING and Tapping :\n
                Basic length = Depth + Approach + Retract\nFor peck drilling: Length = (Depth ÷ Peck_depth) × (Peck_depth + Retract)\n<any other operations need to consider by yourself and mentioned formula and output>\n</Other_operatins_toolpath_formulas>\n<remember_formulas>\n</remember> """





prompt = f"""<materail> {var_material}</material>\n\n<identified_faces> {var_identified_faces}</identified_faces>\n<consider>form identified faces input variable consider the Part Volume, Raw Material Volume, Material Removal Required, Material Utilization from this get approximate idea about how much proportional toolpath length and machining time will be there</consider>\n\n\n\n<tool_cutting_parameters> {var_cutting_para}</tool_cutting_parameters>\n<cosider>tool cutting parameters according to type of operation from variable cutting_para</consider>\n\n consider feature extracted data from open cascade, please:\n\n1. Extract and list all geometric features with their exact dimensions:\n   - Identify all cylindrical surfaces (using CYLINDRICAL_SURFACE entities)\n   - Extract radii/diameters from CIRCLE entities\n   - Note length dimensions from CARTESIAN_POINT coordinates\n   - Identify any holes or circular features from FACE_BOUND entities\n\n2. For each feature found:\n   - Report exact numerical dimensions in millimeters\n   - Specify the position relative to the origin\n   - Note any geometric relationships between features\n\nPlease consider below parameters to calculate setup time \n<machine_setuptime_parameters>\n- Need for lifting equipment \n- Part weight \n- Length \n- Multiple operators needed\n</machine_setuptime_parameters>\n\n<workpiece_setuptime_parameters>\n- Dimensions (L × W × H or Diameter × Length)\n- Weight of raw stock\n- Material\n- Surface finish requirements\n- Geometric tolerances\n</workpiece_setuptime_parameters>\n\n<setup_complexity_factors>\n- Special fixturing needed?\n- Alignment criticality (standard/high/very high)\n- Number of reference surfaces\n- Need for indicated setup?\n- Tailstock/steady rest requirements\n- In-process measurement needs\n</setup_complexity_factors>\n\n<process_details> \n<think>\"Please calculate turning toolpaths as linear Z-axis movements only, not circumferential distances.\"<think>\n<take_formulas_from_system_prompt_calculate>\n<setup_1>\n<Operation name (Tool)>\ntoolpath length calculation  in mm\nmachining time -  - X.X min\n<Operation name (Tool)>\ntoolpath length calculation  in mm\nmachining time -  - X.X min\n<Operation name X(Tools)>\n[List all operations in setup 1 with toolpath length calculation in mm] \n</setup_1>\n<Setup 1 Total toolpath length : XX.X mm>\n<Setup 1 Total machining time : XX.X min>\n\n\n<setup_2>\n<Operation name (Tool)>\ntoolpath length calculation  in mm\nmachining time -  - X.X min\n<Operation name (Tool)>\ntoolpath length calculation  in mm\nmachining time -  - X.X min\n<Operation name X(Tools)>\nList all operations in setup 1 with toolpath length calculation in mm] \n</setup_2>\n<Setup 2 Total toolpath length : XX.X mm>\n<Setup 2 Total machining time : XX.X min>\n\n</take_formulas_from_system_prompt_calculate>\n\n<totals>\n<Total_operations>[total number of operations]</Total_operations>\n<Total_toolpath_length>[total toolpath length in mm]<Total_toolpath_length>\n<Total_machining_time>[total machining time in min for machining operations]</Total_operations>\n\n</totals>\n</process_details>\n<process_justification>[Brief explanation of machine selection and cutting parameters]</process_justification>\n<selected_machining_in_general>[General machining like CNC turning or Milling or TurnMilling]</selected_machining_in_general>\n<justification>[General machine selection 3-axis,5-axis,big,small,medium with justification]</justification>\n\nOUTPUT FORMAT:
```json
{{
  "machining_analysis": {{
    "machining process selected": Milling/Turning/Turn-milling,
    "setup_count": 0,
    "tool_count": 0,
    "operation_count": 0,
    "machining_time": "0 min" (STRING),
    "toolpath_length": "0 mm" (STRING),
    "setup_times": {{
      "machine_setup": "0 min"(STRING),
      "tool_setup": "0 min"(STRING),
      "work_setup": "0 min"(STRING)
    }},
    "selected_machine": "machine name",
    "selected_machine": "machine_code"
  }}
}}   <extra_features>{extra_features}</extra_features>
<cosider>from extra feature consider and analyze the input given like operations, intricate shapes machining warning, quantity of production to incorporate in the outputs</consider>
<important>consider the machine database and select the machine <select>select the machine code</select></important>
review the calculation once again before presenting and get trained with every output and save in your cache memory"""






