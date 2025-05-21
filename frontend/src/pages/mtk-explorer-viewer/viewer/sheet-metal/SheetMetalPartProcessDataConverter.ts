// ****************************************************************************
//
// Copyright (C) 2008-2014, Roman Lygin. All rights reserved.
// Copyright (C) 2014-2025, CADEX. All rights reserved.
//
// This file is part of the Manufacturing Toolkit software.
//
// You may use this file under the terms of the BSD license as follows:
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
// * Redistributions of source code must retain the above copyright notice,
//   this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
//
// ****************************************************************************

import {
  BaseProduct,
  PartWithVisualRepresentation,
} from '../base/BaseProduct';
import {
  BasePartData,
  BasePartProcessDataConverter,
} from '../base/BasePartProcessDataConverter';
import {
  FeatureRecognitionUnfoldedData,
  SheetMetalPartProcessData,
} from './SheetMetalProcessData';
import { TreeNode } from 'shared/features/common/tree/TreeNode';
import { ProductFeaturesTreeNodeData } from '../ProductFeaturesStructureManager';
import { SheetMetalProduct } from './SheetMetalProduct';

export interface SheetMetalPartData extends BasePartData {
  unfoldedPart?: PartWithVisualRepresentation;
}

export class SheetMetalPartProcessDataConverter extends BasePartProcessDataConverter {
  private unfoldedPartDFMIssuesData?: TreeNode<ProductFeaturesTreeNodeData> | string;
  private unfoldedPartFeatureRecognitionData?: FeatureRecognitionUnfoldedData;

  constructor(protected partData: SheetMetalPartData) {
    super(partData);
    if (partData.unfoldedPart) {
      this.fillIdToShapeMap(partData.unfoldedPart.part);
    }
  }

  protected override createProduct(): BaseProduct {
    const originPart = this.partData.originPart;
    const unfoldedPart = this.partData.unfoldedPart;
    return new SheetMetalProduct(originPart, unfoldedPart);
  }

  protected addProcessDataToProduct(product: BaseProduct) {
    super.addProcessDataToProduct(product);
    const smProduct = product as SheetMetalProduct;
    this.addUnfoldedPartFeatureRecognitionData(smProduct);
    this.addUnfoldedPartDFMIssuesRootNode(smProduct);
  }

  protected override convertProcessData(partName: string) {
    super.convertProcessData(partName);
    const smPartProcessData = this.partData.processData as SheetMetalPartProcessData;
    this.unfoldedPartFeatureRecognitionData = smPartProcessData.featureRecognitionUnfolded;
    if (smPartProcessData.dfmUnfolded) {
      this.unfoldedPartDFMIssuesData = this.convertFeaturesData(partName, smPartProcessData.dfmUnfolded);
    } else {
      this.unfoldedPartDFMIssuesData = this.unfoldedPartFeatureRecognitionData?.message
        ? this.unfoldedPartFeatureRecognitionData?.message
        : 'DFM Analysis data not found.';
    }
  }

  private addUnfoldedPartFeatureRecognitionData(product: SheetMetalProduct) {
    const data = this.unfoldedPartFeatureRecognitionData;
    if (data) {
      product.addUnfoldedFeatureRecognitionData(data);
    }
  }

  private addUnfoldedPartDFMIssuesRootNode(product: SheetMetalProduct) {
    const data = this.unfoldedPartDFMIssuesData;
    if (!data) {
      return;
    }
    if (data instanceof TreeNode && data.children.length > 0) {
      product.addUnfoldedDFMIssuesRootNode(data);
    } else if (typeof data === 'string') {
      product.addUnfoldedDFMAnalysisMessage(data);
    }
  }
}
