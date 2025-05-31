from OCC.Core.STEPControl import STEPControl_Reader
from OCC.Core.TopAbs import TopAbs_FACE, TopAbs_EDGE, TopAbs_VERTEX 
from OCC.Core.TopExp import TopExp_Explorer
from OCC.Core.BRepAdaptor import BRepAdaptor_Surface, BRepAdaptor_Curve
from OCC.Core.GeomAbs import (
    GeomAbs_Plane, GeomAbs_Cylinder, GeomAbs_Cone,
    GeomAbs_Sphere, GeomAbs_Torus, GeomAbs_BezierSurface,
    GeomAbs_BSplineSurface
)
from OCC.Core.GProp import GProp_GProps
from OCC.Core.BRepGProp import brepgprop
from OCC.Core.Bnd import Bnd_Box
from OCC.Core.BRepBndLib import brepbndlib
from OCC.Core.BRepPrimAPI import BRepPrimAPI_MakeBox
from OCC.Core.gp import gp_Pnt
import json
import logging
import os
# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def identify_surface_type(surface):
    """Identify the type of surface with improved error handling"""
    try:
        surface_type = surface.GetType()
        surface_types = {
            GeomAbs_Plane: "Plane",
            GeomAbs_Cylinder: "Cylinder",
            GeomAbs_Cone: "Cone",
            GeomAbs_Sphere: "Sphere",
            GeomAbs_Torus: "Torus",
            GeomAbs_BezierSurface: "Bezier",
            GeomAbs_BSplineSurface: "BSpline"
        }
        return surface_types.get(surface_type, "Other")
    except Exception as e:
        logger.warning(f"Error identifying surface type: {str(e)}")
        return "Unknown"

def get_spline_parameters(spline, is_bspline=True):
    """Extract parameters for spline surfaces with enhanced error handling"""
    try:
        params = {}
        if is_bspline:
            params["u_degree"] = spline.UDegree()
            params["v_degree"] = spline.VDegree()
            params["u_knots"] = spline.NbUKnots()
            params["v_knots"] = spline.NbVKnots()
            params["u_poles"] = spline.NbUPoles()
            params["v_poles"] = spline.NbVPoles()
            params["is_u_periodic"] = spline.IsUPeriodic()
            params["is_v_periodic"] = spline.IsVPeriodic()
            
            # Get control points information
            try:
                u_poles = spline.NbUPoles()
                v_poles = spline.NbVPoles()
                params["control_points_count"] = u_poles * v_poles
            except Exception as e:
                logger.warning(f"Error getting control points: {str(e)}")
        else:
            params["u_degree"] = spline.UDegree()
            params["v_degree"] = spline.VDegree()
            
        return params
    except Exception as e:
        logger.warning(f"Error extracting spline parameters: {str(e)}")
        return {}

def get_surface_parameters(surface, surface_type):
    """Extract parameters for different surface types with improved error handling"""
    params = {}
    try:
        if surface_type == "Cylinder":
            cylinder = surface.Cylinder()
            params["radius"] = cylinder.Radius()
            params["axis"] = list(cylinder.Axis().Direction().Coord())
            params["location"] = list(cylinder.Location().Coord())
            
        elif surface_type == "Cone":
            cone = surface.Cone()
            params["semi_angle"] = cone.SemiAngle()
            params["radius"] = cone.RefRadius()
            params["axis"] = list(cone.Axis().Direction().Coord())
            
        elif surface_type == "Sphere":
            sphere = surface.Sphere()
            params["radius"] = sphere.Radius()
            params["center"] = list(sphere.Location().Coord())
            
        elif surface_type == "Torus":
            torus = surface.Torus()
            params["major_radius"] = torus.MajorRadius()
            params["minor_radius"] = torus.MinorRadius()
            params["axis"] = list(torus.Axis().Direction().Coord())
            
        elif surface_type == "BSpline":
            params = get_spline_parameters(surface.BSpline(), True)
            
        elif surface_type == "Bezier":
            params = get_spline_parameters(surface.Bezier(), False)
            
    except Exception as e:
        logger.warning(f"Error getting surface parameters for {surface_type}: {str(e)}")
    
    return params

def get_bounding_box(shape, extra_margin=2.0):
    """Calculate bounding box dimensions with extra margin"""
    try:
        bbox = Bnd_Box()
        bbox.SetGap(0.0)
        
        # Use updated static method
        brepbndlib.Add(shape, bbox)
        
        xmin, ymin, zmin, xmax, ymax, zmax = bbox.Get()
        
        margin_vector = (extra_margin, extra_margin, extra_margin)
        xmin -= margin_vector[0]
        ymin -= margin_vector[1]
        zmin -= margin_vector[2]
        xmax += margin_vector[0]
        ymax += margin_vector[1]
        zmax += margin_vector[2]
        
        min_point = gp_Pnt(xmin, ymin, zmin)
        max_point = gp_Pnt(xmax, ymax, zmax)
        
        dimensions = {
            "dimensions": {
                "length": abs(xmax - xmin),
                "width": abs(ymax - ymin),
                "height": abs(zmax - zmin)
            },
            "coords": {
                "min": (xmin, ymin, zmin),
                "max": (xmax, ymax, zmax)
            }
        }
        
        box_shape = BRepPrimAPI_MakeBox(min_point, max_point).Shape()
        
        return dimensions, box_shape
        
    except Exception as e:
        logger.error(f"Error calculating bounding box: {str(e)}")
        raise

def calculate_volume(shape):
    """Calculate volume of a shape using updated static method"""
    props = GProp_GProps()
    brepgprop.VolumeProperties(shape, props)
    return props.Mass()

def calculate_surface_area(shape):
    """Calculate total surface area of a shape using updated static method"""
    props = GProp_GProps()
    brepgprop.SurfaceProperties(shape, props)
    return props.Mass()

def extract_geometry_data(step_file_path):
    """Extract geometric data from STEP file with improved surface handling"""
    reader = STEPControl_Reader()
    status = reader.ReadFile(step_file_path)
    if status != 1:
        raise Exception("Error reading STEP file")
    
    status = reader.TransferRoots()
    if status != 1:
        raise Exception("Error transferring roots")
    
    shape = reader.OneShape()
    
    geometry_data = {
        "faces": [],
        "volume": 0,
        "surface_area": 0,
        "bounding_box": {},
        "material_analysis": {},
        "feature_counts": {
            "planes": 0,
            "cylinders": 0,
            "cones": 0,
            "spheres": 0,
            "torus": 0,
            "bezier": 0,
            "bspline": 0,
            "other": 0,
            "unknown": 0
        },
        "surface_analysis": {
            "total_count": 0,
            "spline_details": []
        }
    }
    
    try:
        geometry_data["volume"] = calculate_volume(shape)
        geometry_data["surface_area"] = calculate_surface_area(shape)
        
        bbox_data, box_shape = get_bounding_box(shape, 2.0)
        if bbox_data and box_shape:
            geometry_data["bounding_box"] = bbox_data["dimensions"]
            
            raw_material_volume = calculate_volume(box_shape)
            volume_difference = raw_material_volume - geometry_data["volume"]
            
            geometry_data["material_analysis"] = {
                "raw_material_volume": raw_material_volume,
                "part_volume": geometry_data["volume"],
                "volume_difference": volume_difference,
                "material_utilization_percentage": (geometry_data["volume"] / raw_material_volume * 100) if raw_material_volume > 0 else 0
            }
        
        face_explorer = TopExp_Explorer(shape, TopAbs_FACE)
        while face_explorer.More():
            try:
                face = face_explorer.Current()
                surface_props = GProp_GProps()
                brepgprop.SurfaceProperties(face, surface_props)
                
                surface = BRepAdaptor_Surface(face)
                surface_type = identify_surface_type(surface)
                
                # Update feature counts with proper key mapping
                count_key_mapping = {
                    "Plane": "planes",
                    "Cylinder": "cylinders",
                    "Cone": "cones",
                    "Sphere": "spheres",
                    "Torus": "torus",
                    "Bezier": "bezier",
                    "BSpline": "bspline",
                    "Other": "other",
                    "Unknown": "unknown"
                }
                count_key = count_key_mapping.get(surface_type, "unknown")
                geometry_data["feature_counts"][count_key] += 1
                
                face_data = {
                    "type": surface_type,
                    "area": surface_props.Mass(),
                    "center_of_mass": list(surface_props.CentreOfMass().Coord())
                }
                
                params = get_surface_parameters(surface, surface_type)
                face_data.update(params)
                
                geometry_data["faces"].append(face_data)
                
            except Exception as e:
                logger.error(f"Error processing face: {str(e)}")
                
            face_explorer.Next()
        
    except Exception as e:
        logger.error(f"Error in geometry extraction: {str(e)}")
        raise
    
    return geometry_data

def format_for_prompt(geometry_data):
    """Format geometry data for prompt with improved formatting"""
    prompt = f"""Part Analysis:
        Volume and Material Usage:
        - Part Volume: {geometry_data['volume']:.2f} cubic units
        - Total Surface Area: {geometry_data['surface_area']:.2f} square units
        - Raw Material Block Size (with 2mm margin):
        * Length: {geometry_data['bounding_box'].get('length', 0):.2f} units
        * Width: {geometry_data['bounding_box'].get('width', 0):.2f} units
        * Height: {geometry_data['bounding_box'].get('height', 0):.2f} units
        - Raw Material Volume: {geometry_data['material_analysis'].get('raw_material_volume', 0):.2f} cubic units
        - Material Removal Required: {geometry_data['material_analysis'].get('volume_difference', 0):.2f} cubic units
        - Material Utilization: {geometry_data['material_analysis'].get('material_utilization_percentage', 0):.1f}%

        Feature Summary:
        Total Faces: {sum(geometry_data['feature_counts'].values())}
        Basic Surfaces:
        - {geometry_data['feature_counts']['planes']} planar faces
        - {geometry_data['feature_counts']['cylinders']} cylindrical faces
        - {geometry_data['feature_counts']['cones']} conical faces
        - {geometry_data['feature_counts']['spheres']} spherical faces
        - {geometry_data['feature_counts']['torus']} toroidal faces

        Advanced Surfaces:
        - {geometry_data['feature_counts']['bezier']} Bezier surfaces
        - {geometry_data['feature_counts']['bspline']} B-Spline surfaces
        - {geometry_data['feature_counts']['other']} other surface types
        - {geometry_data['feature_counts']['unknown']} unidentified surfaces
        """
        
    prompt += "\nDetailed Surface Analysis:"
    for i, face in enumerate(geometry_data['faces'], 1):
        prompt += f"\nSurface {i}:"
        prompt += f"\n  Type: {face['type']}"
        prompt += f"\n  Area: {face['area']:.2f}"
            
        if "radius" in face:
                prompt += f"\n  Radius: {face['radius']:.2f}"
        if "semi_angle" in face:
                prompt += f"\n  Semi-Angle: {face['semi_angle']:.2f}"
        if "major_radius" in face:
                prompt += f"\n  Major Radius: {face['major_radius']:.2f}"
        if "minor_radius" in face:
                prompt += f"\n  Minor Radius: {face['minor_radius']:.2f}"
        if "u_degree" in face:
                prompt += f"\n  U Degree: {face['u_degree']}"
        if "v_degree" in face:
                prompt += f"\n  V Degree: {face['v_degree']}"
        if "control_points_count" in face:
                prompt += f"\n  Control Points: {face['control_points_count']}"
        
    return prompt

def feature_extraction_main(step_file_path):
    """Main function to process STEP file and generate analysis"""
    try:
        geometry_data = extract_geometry_data(step_file_path)
        script_dir = "./outputs/OCC_extrac/"
        if not os.path.exists(script_dir):
            os.makedirs(script_dir)
        with open(f"{script_dir}/"+"geometry_data.json", "w") as f:
            json.dump(geometry_data, f, indent=2)
        
        prompt = format_for_prompt(geometry_data)
        
        with open(f"{script_dir}/"+"geometry_data.txt", "w") as f:
            f.write(prompt)
        
        return geometry_data
        
    except Exception as e:
        logger.error(f"Error processing STEP file: {str(e)}")
        raise

# if __name__ == "__main__":
#     step_file = "./stepfiles/allstepfiles/camlock.stp"
#     try:
#         result = main(step_file)
#         print("Analysis completed successfully!")
#         print("\nGenerated Prompt:")
#         print(result)
#     except Exception as e:
#         print(f"Error: {str(e)}")


