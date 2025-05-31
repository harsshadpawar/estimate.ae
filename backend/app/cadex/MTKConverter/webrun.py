#!/usr/bin/env python3

# $Id$
# Copyright (C) ...
# [License remains unchanged]

import sys
from os.path import abspath, dirname
from pathlib import Path

from MTKConverter import main

def run_mtk_converter(source_path: str, process: str, target_path: str) -> int:
    return main(source_path, process, target_path)

def default_paths():
    base_dir = abspath(dirname(Path(__file__).resolve()))
    source_path = f"{base_dir}/../../models/Fresamento_CAM1_v3.stp"
    target_path = f"{base_dir}/machining_milling"
    print("Target Path",target_path)
    return source_path, "machining_milling", target_path

if __name__ == "__main__":
    source, process, target = default_paths()
    exit_code = run_mtk_converter(source, process, target)
    sys.exit(exit_code)
