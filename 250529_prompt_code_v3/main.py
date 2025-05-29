from CADEXAPI.machiningR01.dfm_analyzer_dir  import dfmRun
from CADEXAPI.machiningR01.feature_recognizer_dir import featureRun
from occ_extraction import Feature_extraction
from machining_para import cutting_para
from prompt import merged_prompt
from machining_para import cutting_para
import anthropic
import os
import json



var_material = "Aluminum"     
machining_process ="milling"        
step_file_name = "block.stp"      
step_file_path = "./models/" + step_file_name

var_cutting_para = cutting_para.main(var_material)  

with open("./machine_db/machine_data.json", "r") as f:
        extra_features = f.read()

dfm_analysis = dfmRun.main(step_file_path, machining_process)

feature_recognition_json = featureRun.main(step_file_path, machining_process)
  
var_identified_faces = Feature_extraction.main(step_file_path)
 

 

if __name__ == "__main__":
    # Initialize the Anthropics client
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    # Call the main function from the merged_prompt module
    output = merged_prompt.main(client=client,var_material=var_material, 
                                var_identified_faces=var_identified_faces, 
                                feature_recognition_json=feature_recognition_json,
                                DFM_analysis=dfm_analysis, 
                                var_cutting_para=var_cutting_para ,
                                extra_features=extra_features)
    with open(f"{step_file_name[:-4]}_machining_analysis.json", "w",encoding="utf-8") as f:
        json.dump(output,f, indent=2)