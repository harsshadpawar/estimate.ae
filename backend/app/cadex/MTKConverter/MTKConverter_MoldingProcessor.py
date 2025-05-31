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

import manufacturingtoolkit.CadExMTK as mtk

import MTKConverter_PartProcessor as part_proc

class MTKConverter_MoldingData(part_proc.MTKConverter_ProcessData):
    def __init__(self, thePart: mtk.ModelData_Part):
        super().__init__(thePart)
        self.myFeatureList = mtk.MTKBase_FeatureList()
        self.myIssueList = mtk.MTKBase_FeatureList()

class MTKConverter_MoldingProcessor(part_proc.MTKConverter_VoidPartProcessor):
    def __init__(self):
        super().__init__()

    @staticmethod
    def __ReservedNameForAuxData():
        return mtk.UTF16String("CADEX_AUX_DATA")
    
    @staticmethod
    def __AppendAuxData(theShape  : mtk.ModelData_Shape, theBodies : mtk.Collections_BodyList):
        aBody = mtk.ModelData_Body.Cast(theShape)
        aBody.SetName(aBody, MTKConverter_MoldingProcessor.__ReservedNameForAuxData())
        theBodies.Add(aBody)
    
    @staticmethod
    def __CheckShapeId(theShape : mtk.ModelData_Shape, thePart : mtk.ModelData_Part):
        aShapeIt = mtk.ShapeIterator(theShape, mtk.ShapeType_Face)
        for aShape in aShapeIt:
            if aShape.Id() == 0:
                MTKConverter_MoldingProcessor.__AppendAuxData(theShape, thePart.Bodies())
                return

    @staticmethod
    def __CheckShapesId(theFeatureList : mtk.MTKBase_FeatureList, thePart : mtk.ModelData_Part):
        for aFeature in theFeatureList:
            aShapeFeature = mtk.MTKBase_ShapeFeature.Cast(aFeature)
            aShape = aShapeFeature.Shape()
            MTKConverter_MoldingProcessor.__CheckShapeId(aShape, thePart)  

    def ProcessSolid (self, thePart: mtk.ModelData_Part, theSolid: mtk.ModelData_Solid):
        aMoldingData = MTKConverter_MoldingData(thePart)
        self.myData.append(aMoldingData)

        aParams = mtk.Molding_FeatureRecognizerParameters()
        aFeatureRecognizer = mtk.Molding_FeatureRecognizer(aParams)
        anAnalyzer = mtk.Molding_Analyzer()
        anAnalyzer.AddTool(aFeatureRecognizer)
        aData = anAnalyzer.Perform(theSolid)
        if aData.IsEmpty():
            return

        # Features
        for i in aData.FeatureList():
            aMoldingData.myFeatureList.Append(i)
        MTKConverter_MoldingProcessor.__CheckShapesId(aMoldingData.myFeatureList, thePart)

        # Issues
        aParameters = mtk.DFMMolding_AnalyzerParameters()
        aAnalyzer = mtk.DFMMolding_Analyzer(aParameters)
        aMoldingData.myIssueList = aAnalyzer.Perform(aData) 