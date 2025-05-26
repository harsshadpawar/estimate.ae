from fastapi import APIRouter, Depends
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
from app.cadex.occ.occ_code_R01 import occ_main

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
            message="STEP file uploaded successfully.",
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
        
        # with NamedTemporaryFile(delete=False, suffix=".stp") as temp_file:
        #     shutil.copyfileobj(file.file, temp_file)
        #     temp_file_path = temp_file.name
            
        # resp = occ_main(temp_file_path, operation)    
                    
        with NamedTemporaryFile(delete=False, suffix=".stp") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name

        # Call OCC processing logic
        response_data = occ_main(file_path=temp_file_path, operation=operation)             
    
        return success_response(
            data={
                "filename": file.filename,
                "resp": response_data,
                # "size": len(contents),
                "operation": operation
            },
            message="STEP file uploaded successfully.",
            status_code=200
        )
    except Exception as e:
        return error_response(
            message="Error fetching OCC API.",
            debug=str(e),
            status_code=500
        )