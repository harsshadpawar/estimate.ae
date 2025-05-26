from CADEXAPI.machiningR01.dfm_analyzer_dir  import mtk_license,dfmRun,dfm_analyzer
from CADEXAPI.machiningR01.feature_recognizer_dir import mtk_license,featureRun
from occ_extraction import Feature_extraction
from machining_para import cutting_para
import prompt.prompt as prompt 
from prompt.prompt_content import system_prompt
from machining_para import cutting_para
from prompt.prompt_content import user_prompt
import anthropic
import os
import json

system_prompt = system_prompt()
# print(system_prompt)
print("\n inputpara1")

var_material = "Aluminum"     
# print(var_material)
print("inputpara2")

var_cutting_para = cutting_para.main(var_material)  
# print(var_cutting_para)          #input("Enter the material: ")
print("inputpara3")

machining_process ="milling"        
# print(machining_process)      #input("Enter the machining process: milling or turning: ")
print("\n inputpara4")

step_file_name = "block.stp"      
step_file_path = "./models/" + step_file_name
# print(step_file_path)
print("\n inputpara5")      


with open("./machine_db/machine_data.json", "r") as f:
        extra_features = f.read()

# print(extra_features)
print("\n inputpara6")      

dfm_analysis = dfmRun.main(step_file_path, machining_process)
# print(dfm_analysis)
feature_recognition_json = featureRun.main(step_file_path, machining_process)
# print(feature_recognition_json)
print("\n inputpara7 & 8")     


var_identified_faces = Feature_extraction.main(step_file_path)
# print(var_identified_faces)
print("\n inputpara9")     



user_prompt1 = user_prompt(var_material, var_identified_faces,var_cutting_para=var_cutting_para,DFM_analysis=dfm_analysis,feature_recognition_json=feature_recognition_json,extra_features=extra_features)  # for user prompt we need var_material and GFI, FR,DFM,Cutting_para , extra feature
print(user_prompt)
with open("user_prompt.txt", "w",encoding="utf-8") as f:
    f.write(user_prompt1)
print("\n inputpara10")     

with open("./prompt/example.txt", "r") as f:
        examples = f.read()
# print(examples)
print("\n inputpara11")    

if __name__ == "__main__":
    with open("user_prompt.txt", "r") as f:
        user_prompt = f.read()

    # Initialize the Anthropics client
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    # Load the system prompt

    system_prompt = system_prompt.content
    # Call the main function with the provided parameters
    output = prompt.main(client=client, examples=examples, system_prompt=system_prompt, user_prompt=user_prompt)
    with open(f"{step_file_name[:-4]}_machining_analysis.json", "w",encoding="utf-8") as f:
        json.dump(output,f, indent=2)
    