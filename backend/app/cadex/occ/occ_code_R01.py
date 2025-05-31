#!/usr/bin/env python

from OCC.Core.STEPControl import STEPControl_Reader
from OCC.Core.IFSelect import IFSelect_RetDone, IFSelect_ItemsByEntity
from OCC.Core.BRepBndLib import brepbndlib_Add
from OCC.Core.Bnd import Bnd_Box
from OCC.Core.GProp import GProp_GProps
from OCC.Core.BRepGProp import brepgprop_VolumeProperties, brepgprop_SurfaceProperties
from OCC.Core.TopoDS import topods_Solid, TopoDS_Iterator
from OCC.Core.TopAbs import TopAbs_SOLID
from OCC.Core.TopExp import TopExp_Explorer
from OCC.Core.BRepPrimAPI import BRepPrimAPI_MakeBox
from OCC.Core.gp import gp_Pnt

import os
import sys
import math
import json
import datetime


def load_step_file(file_path):
    """Load a STEP file and return the shape."""
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    # Create a STEP reader
    step_reader = STEPControl_Reader()
    
    # Read the STEP file
    status = step_reader.ReadFile(file_path)
    
    if status != IFSelect_RetDone:
        raise Exception("Error reading STEP file")
    
    # Transfer file contents to memory
    step_reader.TransferRoot()
    num_shapes = step_reader.NbShapes()
    
    if num_shapes == 0:
        raise Exception("No shapes found in STEP file")
    
    # Get the shape
    return step_reader.Shape()


def extract_main_solid(shape):
    """Extract the main solid from the shape."""
    # Create an explorer to find solids
    explorer = TopExp_Explorer(shape, TopAbs_SOLID)
    solids = []
    
    # Collect all solids
    while explorer.More():
        solid = topods_Solid(explorer.Current())
        solids.append(solid)
        explorer.Next()
    
    if not solids:
        raise Exception("No solids found in the shape.")
    elif len(solids) > 1:
        print(f"Warning: {len(solids)} solids found. Using the first one.")
    
    return solids[0]


def get_bounding_box(shape):
    """Calculate the bounding box of the shape."""
    bbox = Bnd_Box()
    brepbndlib_Add(shape, bbox)
    
    return {
        "XMin": bbox.CornerMin().X(),
        "YMin": bbox.CornerMin().Y(),
        "ZMin": bbox.CornerMin().Z(),
        "XMax": bbox.CornerMax().X(),
        "YMax": bbox.CornerMax().Y(),
        "ZMax": bbox.CornerMax().Z()
    }


def get_volume_and_surface_area(shape):
    """Calculate the volume and surface area of the shape."""
    # Create properties objects
    volume_props = GProp_GProps()
    surface_props = GProp_GProps()
    
    # Calculate volume properties
    brepgprop_VolumeProperties(shape, volume_props)
    
    # Calculate surface properties
    brepgprop_SurfaceProperties(shape, surface_props)
    
    return {
        "volume": volume_props.Mass(),  # Volume in mm³ (or the unit used in the STEP file)
        "surface_area": surface_props.Mass()  # Surface area in mm²
    }


def calculate_surface_area(length, width, height):
    """Calculate the surface area of a cuboid."""
    return 2 * (length * width + width * height + length * height)  # in mm²


def calculate_mass(volume_mm3, density_kg_m3):
    """Calculate the mass of the shape in kilograms and grams."""
    # Convert volume from mm³ to m³
    volume_m3 = volume_mm3 * 1e-9  # 1 mm³ = 1e-9 m³
    
    # Calculate mass in kg
    mass_kg = density_kg_m3 * volume_m3
    
    # Convert mass to grams
    mass_g = mass_kg * 1000  # 1 kg = 1000 g
    
    return mass_kg, mass_g


def create_raw_material_box(XMin, YMin, ZMin, XMax, YMax, ZMax, offset=2.0):
    """Create a box that represents the raw material with a given offset."""
    XMin_new = XMin - offset
    YMin_new = YMin - offset
    ZMin_new = ZMin - offset
    XMax_new = XMax + offset
    YMax_new = YMax + offset
    ZMax_new = ZMax + offset
    
    # Create points for the box corners
    min_point = gp_Pnt(XMin_new, YMin_new, ZMin_new)
    max_point = gp_Pnt(XMax_new, YMax_new, ZMax_new)
    
    # Create the box
    raw_box = BRepPrimAPI_MakeBox(min_point, max_point).Shape()
    
    # Calculate dimensions
    raw_length = XMax_new - XMin_new
    raw_width = YMax_new - YMin_new
    raw_height = ZMax_new - ZMin_new
    
    # Calculate volume
    raw_volume = raw_length * raw_width * raw_height
    
    # Calculate surface area
    raw_surface_area = calculate_surface_area(raw_length, raw_width, raw_height)
    
    return {
        "box": raw_box,
        "coords": {
            "XMin": XMin_new,
            "YMin": YMin_new,
            "ZMin": ZMin_new,
            "XMax": XMax_new,
            "YMax": YMax_new,
            "ZMax": ZMax_new
        },
        "dimensions": {
            "length": raw_length,
            "width": raw_width,
            "height": raw_height
        },
        "volume": raw_volume,
        "surface_area": raw_surface_area
    }


def occ_calculation_main(file_path: str, operation: str = "") -> dict:
    import os, sys, json, shutil, datetime
    # Import your actual OCC helpers here:
    # from your_occ_utils import load_step_file, extract_main_solid, ...

    # Default output path
    base_name = os.path.splitext(os.path.basename(file_path))[0]
    output_path = f"{base_name}_analysis.json"
    
    materials = [
        {"name": "Metal Steel", "density": 7.87}
    ]
    
    results = {
        "analysis_timestamp": datetime.datetime.now().isoformat(),
        "file_info": {
            "file_path": os.path.abspath(file_path),
            "file_name": os.path.basename(file_path)
        },
        "bounding_box": {},
        "adjusted_bounding_box": {},
        "actual_dimensions": {},
        "raw_material": {},
        "scrap_material": {},
        "materials_analysis": []
    }
    
    try:
        shape = load_step_file(file_path)
        main_solid = extract_main_solid(shape)

        bbox = get_bounding_box(main_solid)
        XMin, XMax = bbox["XMin"], bbox["XMax"]
        YMin, YMax = bbox["YMin"], bbox["YMax"]
        ZMin, ZMax = bbox["ZMin"], bbox["ZMax"]

        length = XMax - XMin
        width = YMax - YMin
        height = ZMax - ZMin

        props = get_volume_and_surface_area(main_solid)
        actual_volume_mm3 = props["volume"]
        actual_surface_area_mm2 = props["surface_area"]

        raw_material = create_raw_material_box(XMin, YMin, ZMin, XMax, YMax, ZMax, offset=2)

        raw_length = raw_material["dimensions"]["length"]
        raw_width = raw_material["dimensions"]["width"]
        raw_height = raw_material["dimensions"]["height"]
        raw_volume_mm3 = raw_material["volume"]
        raw_surface_area_mm2 = raw_material["surface_area"]

        scrap_volume_mm3 = raw_volume_mm3 - actual_volume_mm3
        scrap_surface_area_mm2 = raw_surface_area_mm2 - actual_surface_area_mm2

        results["bounding_box"] = bbox
        results["adjusted_bounding_box"] = raw_material["coords"]
        results["actual_dimensions"] = {
            "length": length, "width": width, "height": height,
            "volume": actual_volume_mm3, "surface_area": actual_surface_area_mm2
        }
        results["raw_material"] = {
            "length": raw_length, "width": raw_width, "height": raw_height,
            "volume": raw_volume_mm3, "surface_area": raw_surface_area_mm2
        }
        results["scrap_material"] = {
            "volume": scrap_volume_mm3,
            "surface_area": scrap_surface_area_mm2
        }

        for material in materials:
            density_g_cm3 = material["density"]
            density_kg_m3 = density_g_cm3 * 1000

            actual_mass_kg, actual_mass_g = calculate_mass(actual_volume_mm3, density_kg_m3)
            raw_mass_kg, raw_mass_g = calculate_mass(raw_volume_mm3, density_kg_m3)
            scrap_mass_kg, scrap_mass_g = calculate_mass(scrap_volume_mm3, density_kg_m3)

            material_results = {
                "name": material["name"],
                "density_g_cm3": density_g_cm3,
                "density_kg_m3": density_kg_m3,
                "actual_part": {"mass_kg": actual_mass_kg, "mass_g": actual_mass_g},
                "raw_material": {"mass_kg": raw_mass_kg, "mass_g": raw_mass_g},
                "scrap_material": {"mass_kg": scrap_mass_kg, "mass_g": scrap_mass_g}
            }

            results["materials_analysis"].append(material_results)

        return results

    except Exception as e:
        return {
            "error": True,
            "message": str(e),
            "timestamp": datetime.datetime.now().isoformat()
        }



if __name__ == "__main__":
    main()