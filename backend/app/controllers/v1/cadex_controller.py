from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.services.surface_treatment_service import get_all_surface_treatments
from app.models.surface_treatment_model import SurfaceTreatmentOut
from app.utils.response import success_response, error_response
from app.utils.role_checker import require_roles_from_token
from fastapi import UploadFile, File, Form
from tempfile import NamedTemporaryFile
import shutil
from app.cadex.machining.feature_recognizer.featureRun   import capture_and_process_output
from app.cadex.machining.dfm_analyzer.dfmRun import dfm_capture_and_process_output
from app.cadex.occ.occ_code_R01 import occ_calculation_main
from app.cadex.occ.feature_extraction import feature_extraction_main
from app.cadex.MTKConverter.webrun import run_mtk_converter
from os.path import abspath, dirname
from pathlib import Path
from fastapi.responses import FileResponse
import os
import zipfile
from app.cadex.claude_prompt.prompt import claude_prompt_main
import anthropic
import json
from app.services.machine_service import get_all_machines
from app.models.machine_model import MachineOut
from app.services.cutting_parameters_service import get_cutting_parameters_by_material
from app.models.cutting_parameters   import CuttingParameterResponse 
from app.config.settings import get_settings
settings = get_settings()

CLAUDE_API_KEY = settings.CLAUDE_API_KEY

router = APIRouter()

@router.post("/feature/upload-stp", response_model=dict)
def fetch_surface_treatments(
    operation: str = Form(..., description="Specify the operation type"),
    file: UploadFile = File(..., description="Upload a .stp file"),
    db: Session = Depends(get_db),
    user_payload=Depends(require_roles_from_token("super-admin", "editor", "admin","user"))
):
    try:
        if not file.filename.lower().endswith((".stp", ".step")):
            return error_response(
                message="Invalid file format. Only .stp files are allowed.",
                status_code=400
            )
        
        with NamedTemporaryFile(delete=False, suffix=".stp") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name
            
        user_id = user_payload.get("user_id")    
        print("user_id >>>",user_id) 
        

        resp = capture_and_process_output(temp_file_path, operation)    
                    
        # resp =capture_and_process_output(file,operation)
        # contents = file.file.read() 
    
        return success_response(
            data={
                "filename": file.filename,
                "resp": resp,
                # "size": len(contents),
                "operation": operation
            },
            message="STEP file uploaded successfully.",
            status_code=200
        )
    except Exception as e:
        return error_response(
            message="Error fetching API.",
            debug=str(e),
            status_code=500
        )


@router.post("/dfm/upload-stp", response_model=dict)
def fetch_surface_treatments(
    operation: str = Form(..., description="Specify the operation type"),
    file: UploadFile = File(..., description="Upload a .stp file"),
    db: Session = Depends(get_db),
    user_payload=Depends(require_roles_from_token("super-admin", "editor", "admin","user"))
):
    try:
        if not file.filename.lower().endswith((".stp", ".step")):
            return error_response(
                message="Invalid file format. Only .stp files are allowed.",
                status_code=400
            )
        
        with NamedTemporaryFile(delete=False, suffix=".stp") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name

        resp = dfm_capture_and_process_output(temp_file_path, operation)    
                    
        return success_response(
            data={
                "filename": file.filename,
                "resp": resp,
                "operation": operation
            },
            message="dfm operation successfully",
            status_code=200
        )
    except Exception as e:
        return error_response(
            message="Error fetching DFM API.",
            debug=str(e),
            status_code=500
        )



@router.post("/occ/upload-stp", response_model=dict)
def fetch_surface_treatments(
    file: UploadFile = File(..., description="Upload a .stp file"),
    db: Session = Depends(get_db),
    user_payload=Depends(require_roles_from_token("super-admin", "editor", "admin","user"))
):
    try:
        if not file.filename.lower().endswith((".stp", ".step")):
            return error_response(
                message="Invalid file format. Only .stp files are allowed.",
                status_code=400
            )
        
                    
        with NamedTemporaryFile(delete=False, suffix=".stp") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name

        # Call OCC processing logic
        response_data = feature_extraction_main(temp_file_path)    
        print("occ resp",response_data)         
    
        return success_response(
            data={
                "filename": file.filename,
                "resp": response_data,
                # "size": len(contents),
                # "operation": operation
            },
            message="OCC operation successfully.",
            status_code=200
        )
    except Exception as e:
        return error_response(
            message="Error fetching OCC API.",
            debug=str(e),
            status_code=500
        )

@router.post("/occ-calculation/upload-stp", response_model=dict)
def fetch_surface_treatments(
    file: UploadFile = File(..., description="Upload a .stp file"),
    db: Session = Depends(get_db),
    user_payload=Depends(require_roles_from_token("super-admin", "editor", "admin","user"))
):
    try:
        if not file.filename.lower().endswith((".stp", ".step")):
            return error_response(
                message="Invalid file format. Only .stp files are allowed.",
                status_code=400
            )
        
                    
        with NamedTemporaryFile(delete=False, suffix=".stp") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name

        
        response_data = occ_calculation_main(temp_file_path)      
    
        return success_response(
            data={
                "filename": file.filename,
                "resp": response_data,
                # "size": len(contents),
                # "operation": operation
            },
            message="OCC operation successfully.",
            status_code=200
        )
    except Exception as e:
        return error_response(
            message="Error fetching OCC API.",
            debug=str(e),
            status_code=500
        )


        
@router.post("/web/upload-stp", response_class=FileResponse)
def fetch_surface_treatments(
    background_tasks: BackgroundTasks,
    operation: str = Form(..., description="Specify the operation type"),
    file: UploadFile = File(..., description="Upload a .stp file"),
    db: Session = Depends(get_db),
    user_payload=Depends(require_roles_from_token("super-admin", "editor", "admin","user"))
):
    try:
        if not file.filename.lower().endswith((".stp", ".step")):
            return error_response(
                message="Invalid file format. Only .stp files are allowed.",
                status_code=400
            )
        
        with NamedTemporaryFile(delete=False, suffix=".stp") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name
            
    
        
         # Build paths
        base_dir = abspath(dirname(Path(__file__).resolve()))
        parent_dir = dirname(dirname(base_dir))
        user_id = user_payload.get("user_id")
        user_output_dir = os.path.join(parent_dir, "machining_milling_output", str(user_id))

        os.makedirs(user_output_dir, exist_ok=True)

        # Run converter
        run_mtk_converter(temp_file_path, operation, user_output_dir)

        # Create ZIP inside the user directory
        zip_filename = "output.zip"
        zip_path = os.path.join(user_output_dir, zip_filename)
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for root, _, files in os.walk(user_output_dir):
                for file_name in files:
                    file_path = os.path.join(root, file_name)
                    if file_path != zip_path:
                        arcname = os.path.relpath(file_path, start=user_output_dir)
                        zipf.write(file_path, arcname)

        # Schedule cleanup of temp input file and the output directory
        def cleanup_all(temp_input, output_folder):
            try:
                if os.path.exists(temp_input):
                    os.remove(temp_input)
                if os.path.exists(output_folder):
                    shutil.rmtree(output_folder)
            except Exception as e:
                print("Cleanup exception:", e)

        background_tasks.add_task(cleanup_all, temp_file_path, user_output_dir)

        return FileResponse(
            path=zip_path,
            filename=zip_filename,
            media_type="application/zip"
        )

        
    except Exception as e:
        return error_response(
            message="Error fetching API.",
            debug=str(e),
            status_code=500
        )



@router.post("/claude/resp", response_model=dict)
def fetch_surface_treatments(
    operation: str = Form(..., description="Specify the operation type"),
    material_name: str = Form(..., description="Name of the material (e.g., Aluminum)"),
    file: UploadFile = File(..., description="Upload a .stp file"),
    db: Session = Depends(get_db),
    user_payload=Depends(require_roles_from_token("super-admin", "editor", "admin","user"))
):
    try:
        if not file.filename.lower().endswith((".stp", ".step")):
            return error_response(
                message="Invalid file format. Only .stp files are allowed.",
                status_code=400
            )
        
        with NamedTemporaryFile(delete=False, suffix=".stp") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name
            

        dfm_resp = dfm_capture_and_process_output(temp_file_path, operation)  
        feature_resp = capture_and_process_output(temp_file_path, operation)        
        occ_resp = feature_extraction_main(temp_file_path)            
        client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)
       
       
        machines = get_all_machines(db)
        machine_resp = [
            MachineOut.from_orm(machine).dict() for machine in machines
        ]
        
        cutting_para = get_cutting_parameters_by_material(db,material_name)
        cutting_resp = [
            CuttingParameterResponse.from_orm(param).dict()
            for param in cutting_para
        ]
        
        # Call the main function from the merged_prompt module
        cluade_output = claude_prompt_main(client=client,
                                    var_material=material_name, 
                                    var_identified_faces=occ_resp, 
                                    feature_recognition_json=feature_resp,
                                    DFM_analysis=dfm_resp, 
                                    var_cutting_para=cutting_resp,
                                    extra_features=machine_resp)
                    
        return success_response(
            data={
                "filename": file.filename,
                "resp": cluade_output,
                "operation": operation
            },
            message="Claude API operation successfully",
            status_code=200
        )
    except Exception as e:
        return error_response(
            message="Error fetching Claude  API.",
            debug=str(e),
            status_code=500
        )