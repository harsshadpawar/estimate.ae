# $Id$
#
# Copyright (C) 2008-2014, Roman Lygin. All rights reserved.
# Copyright (C) 2014-2025, CADEX. All rights reserved.
#
# This file is part of the Manufacturing Toolkit software.
#
# You may use this file under the terms of the BSD license as follows:
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
# * Redistributions of source code must retain the above copyright notice,
#   this list of conditions and the following disclaimer.
# * Redistributions in binary form must reproduce the above copyright notice,
#   this list of conditions and the following disclaimer in the documentation
#   and/or other materials provided with the distribution.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
# LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
# CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
# SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
# INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
# CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
# ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE.

import os
import sys

from pathlib import Path

import manufacturingtoolkit.CadExMTK as mtk

sys.path.append(os.path.abspath(os.path.dirname(Path(__file__).resolve()) + "/../../"))

import mtk_license as license

def PrintFlatPatternInfo(theFlatPattern: mtk.SheetMetal_FlatPattern):
    if theFlatPattern.IsNull():
        print("    Failed to create flat pattern.")
        return
    
    print("    Flat Pattern with:")
    print("          length: ",    theFlatPattern.Length(),    " mm", sep="")
    print("          width: ",     theFlatPattern.Width(),     " mm", sep="")
    print("          thickness: ", theFlatPattern.Thickness(), " mm", sep="")
    print("          perimeter: ", theFlatPattern.Perimeter(), " mm", sep="")

class PartProcessor(mtk.ModelData_ModelElementVoidVisitor):
    def __init__(self, theDrawingFolderPath: str):
        super().__init__()
        self.myPartIndex = 0
        self.myUnfolder = mtk.SheetMetal_Unfolder()
        self.myDrawingFolderPath = theDrawingFolderPath

    def ProcessSolid(self, theSolid: mtk.ModelData_Solid, thePartName: str, theShapeIndex: int):
        aFlatPattern = self.myUnfolder.Perform(theSolid)
        PrintFlatPatternInfo(aFlatPattern)

    def ProcessShell(self, theShell: mtk.ModelData_Shell, thePartName: str, theShapeIndex: int):
        aFlatPattern = self.myUnfolder.Perform(theShell)
        PrintFlatPatternInfo(aFlatPattern)

    def VisitPart(self, thePart: mtk.ModelData_Part):
        aPartName = "noname" if thePart.Name().IsEmpty() else str(thePart.Name())
        aBodyList = thePart.Bodies()
        i = 0
        for aBody in aBodyList:
            aShapeIt = mtk.ModelData_ShapeIterator(aBody)
            for aShape in aShapeIt:
                if aShape.Type() == mtk.ShapeType_Solid:
                    print("Part #", self.myPartIndex, " [\"", aPartName, "\"] - solid #", i, " has:", sep="")
                    self.ProcessSolid(mtk.ModelData_Solid.Cast(aShape), aPartName, i)
                    i += 1
                elif aShape.Type() == mtk.ShapeType_Shell:
                    print("Part #", self.myPartIndex, " [\"", aPartName, "\"] - shell #", i, " has:", sep="")
                    self.ProcessShell(mtk.ModelData_Shell.Cast (aShape), aPartName, i)
                    i += 1
        self.myPartIndex += 1

def main(theSource: str, theDrawingPath: str):
    aKey = license.Value()

    if not mtk.LicenseManager.Activate(aKey):
        print("Failed to activate Manufacturing Toolkit license.")
        return 1

    aModel = mtk.ModelData_Model()
    aReader = mtk.ModelData_ModelReader()

    # Reading the file
    if not aReader.Read(mtk.UTF16String(theSource), aModel):
        print("Failed to open and convert the file " + theSource)
        return 1

    print("Model: ", aModel.Name(), "\n", sep="")

    aPartProcessor = PartProcessor(theDrawingPath)
    aVisitor = mtk.ModelData_ModelElementUniqueVisitor(aPartProcessor)
    aModel.Accept(aVisitor)

    return 0

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: <input_file> <output_folder>, where:")
        print("    <input_file> is a name of the file to be read")
        print("    <output_folder> is a name of the folder where DXF files with drawing to be written")
        sys.exit()

    aSource = os.path.abspath(sys.argv[1])
    aRes = os.path.abspath(sys.argv[2])

    sys.exit(main(aSource, aRes))
