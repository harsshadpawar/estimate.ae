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
  BasePartProcessData,
  DFMData,
  FeatureGroupsData,
  FeatureRecognitionData,
  FeatureSubGroupData,
  FeaturesData,
  ShapeIdData,
} from './BasePartProcessData';
import {
  BaseProduct,
  PartWithVisualRepresentation,
} from './BaseProduct';
import {
  Edge,
  Face,
  Shape,
  ShapeIterator,
  ShapeType,
} from '@mtk/web/brep';
import {
  Group,
  Object3D,
} from 'three';
import {
  Part,
  SheetBody,
  SolidBody,
  WireframeBody,
} from '@mtk/web/model-data';

import { Color } from '@mtk/web/materials';
import { ModelDataConverter } from 'shared/features/common/viewer/ThreeJsHelper';
import { ProductFeaturesTreeNodeData } from '../ProductFeaturesStructureManager';
import { TreeNode } from 'shared/features/common/tree/TreeNode';

type TreeNodeToIdsMap = Map<TreeNode<ProductFeaturesTreeNodeData>, bigint[]>;
type IdToTreeNodesMap = Map<bigint, TreeNode<ProductFeaturesTreeNodeData>[]>;

type IdToShapeMap = Map<bigint, Shape>;
type IdToObject3D = Map<bigint, Object3D>;

interface VisualRepresentationWithShapeReference {
  shapes: Shape[];
  objects3d: Object3D[];
}

export interface BasePartData {
  originPart: PartWithVisualRepresentation;
  processData: BasePartProcessData;
}

export abstract class BasePartProcessDataConverter {
  protected shapes: IdToShapeMap = new Map();

  protected partFeaturesData?: TreeNode<ProductFeaturesTreeNodeData> | string;
  protected partDFMIssuesData?: TreeNode<ProductFeaturesTreeNodeData> | string;

  protected shapeIdToFeaturesMap: IdToTreeNodesMap = new Map();
  protected featureToShapeIdsMap: TreeNodeToIdsMap = new Map();

  constructor(protected partData: BasePartData) {
    this.fillIdToShapeMap(partData.originPart.part);
  }

  convert(): BaseProduct {
    const part = this.partData.originPart.part;
    const partName = part.name ? part.name : 'Unnamed part';
    this.convertProcessData(partName);
    this.setFeaturesVisualRepresentation();

    const product = this.createProduct();
    this.addProcessDataToProduct(product);
    return product;
  }

  protected abstract createProduct(): BaseProduct;

  protected addProcessDataToProduct(product: BaseProduct) {
    this.addPartFeaturesRootNode(product);
    this.addPartDFMIssuesRootNode(product);
  }

  protected convertProcessData(partName: string) {
    const partProcessData = this.partData.processData;
    if (partProcessData.featureRecognition) {
      this.partFeaturesData = this.convertFeaturesData(partName, partProcessData.featureRecognition);
    }
    if (partProcessData.dfm) {
      this.partDFMIssuesData = this.convertFeaturesData(partName, partProcessData.dfm);
    }
  }

  protected addPartFeaturesRootNode(product: BaseProduct) {
    const data = this.partFeaturesData;
    if (!data) {
      return;
    }
    if (data instanceof TreeNode && data.children.length > 0) {
      product.addFeaturesRootNode(data);
    } else if (typeof data === 'string') {
      product.addFeatureRecognitionMessage(data);
    }
  }

  protected addPartDFMIssuesRootNode(product: BaseProduct) {
    const data = this.partDFMIssuesData;
    if (!data) {
      return;
    }
    if (data instanceof TreeNode && data.children.length > 0) {
      product.addDFMIssuesRootNode(data);
    } else if (typeof data === 'string') {
      product.addDFMAnalysisMessage(data);
    }
  }

  protected convertFeaturesData(partName: string, data: FeatureRecognitionData | DFMData): TreeNode<ProductFeaturesTreeNodeData> | string {
    const featureGroups = data.featureGroups;
    const message = data.message;
    if (featureGroups) {
      const root = new TreeNode<ProductFeaturesTreeNodeData>(partName, 'root', {});
      for (const group of featureGroups) {
        const groupNode = this.convertFeatureGroup(group);
        root.addNode(groupNode);
      }
      return root;
    } else {
      return message ? message : 'Can not find appropriate process data.';
    }
  }

  private convertFeatureGroup(group: FeatureGroupsData): TreeNode<ProductFeaturesTreeNodeData> {
    const groupName = group.name;
    const groupNode = new TreeNode<ProductFeaturesTreeNodeData>(groupName, 'group', { color: group.color });
    if (group.subGroups) {
      for (const subGroup of group.subGroups) {
        const subGroupNode = this.convertFeatureSubGroups(subGroup, groupName, group.color);
        groupNode.addNode(subGroupNode);
      }
    } else if (group.features) {
      const regex = /\(([^()]+)\)$/;
      const leafName = groupName.replace(regex, '');
      for (const feature of group.features) {
        const featureNode = this.convertFeature(feature, leafName, group.color);
        groupNode.addNode(featureNode);
      }
    }
    return groupNode;
  }

  private convertFeatureSubGroups(subGroup: FeatureSubGroupData, groupName: string, color: Color): TreeNode<ProductFeaturesTreeNodeData> {
    const regex = /\(([^()]+)\)$/;
    let subGroupName = groupName.replace(regex, '') + ' (';
    let leafName = '';
    for (const parameter of subGroup.parameters) {
      subGroupName += `${parameter.value.toString()}, `;
      leafName += `${parameter.name} - ${parameter.value.toString()}` + (parameter.units ? ` ${parameter.units}` : '') + ', ';
    }
    // remove last ', '
    subGroupName = subGroupName.slice(0, -2);
    subGroupName += ')';
    // remove last ', '
    leafName = leafName.slice(0, -2);

    const subGroupNode = new TreeNode<ProductFeaturesTreeNodeData>(subGroupName, 'sub-group', { color: color });
    for (const feature of subGroup.features) {
      const featureNode = this.convertFeature(feature, leafName, color);
      subGroupNode.addNode(featureNode);
    }
    return subGroupNode;
  }

  private convertFeature(feature: FeaturesData, name: string, color: Color): TreeNode<ProductFeaturesTreeNodeData> {
    const featureNode = new TreeNode<ProductFeaturesTreeNodeData>(name, 'feature', { color: color });
    for (const shapeId of feature.shapeIDs) {
      this.convertShapeId(shapeId, featureNode);
    }
    return featureNode;
  }

  private convertShapeId(idData: ShapeIdData, featureNode: TreeNode<ProductFeaturesTreeNodeData>) {
    const id = idData.id;

    const nodes = this.shapeIdToFeaturesMap.get(id);
    if (!nodes) {
      this.shapeIdToFeaturesMap.set(id, [featureNode]);
    } else {
      nodes.push(featureNode);
    }

    const ids = this.featureToShapeIdsMap.get(featureNode);
    if (!ids) {
      this.featureToShapeIdsMap.set(featureNode, [id]);
    } else {
      ids.push(id);
    }
  }

  private setFeaturesVisualRepresentation() {
    const shapeIdToObject3dMap: IdToObject3D = new Map();
    for (const [key, value] of this.featureToShapeIdsMap) {
      let isShapePresentsInMultipleFeatures = false;
      for (const id of value) {
        const features = this.shapeIdToFeaturesMap.get(id);
        if (features && features.length > 1) {
          isShapePresentsInMultipleFeatures = true;
          break;
        }
      }
      const visualRepWithRef = this.createFeatureVisualRepresentation(value, isShapePresentsInMultipleFeatures, shapeIdToObject3dMap);
      if (visualRepWithRef.objects3d.length > 0) {
        key.data().visualRepresentation = visualRepWithRef.objects3d;
      }
      if (visualRepWithRef.shapes.length > 0) {
        key.data().shapes = visualRepWithRef.shapes;
      }
    }
  }

  private createFeatureVisualRepresentation(
    shapeIds: bigint[],
    isShapePresentsInMultipleFeatures: boolean,
    shapeIdToObject3dMap: IdToObject3D): VisualRepresentationWithShapeReference {
    const visualRep = isShapePresentsInMultipleFeatures
      ? this.createObject3DForEachShapeInFeature(shapeIds, shapeIdToObject3dMap)
      : this.createSingleObject3DForFeature(shapeIds);
    return visualRep;
  }

  private createObject3DForEachShapeInFeature(shapeIds: bigint[], shapeIdToObject3dMap: IdToObject3D): VisualRepresentationWithShapeReference {
    const modelDataConvertor = new ModelDataConverter();
    modelDataConvertor.showFaceEdges = false;
    const visualRep: Object3D[] = [];
    const shapes: Shape[] = [];
    for (const id of shapeIds) {
      const shape = this.shapes.get(id);
      if (shape) {
        shapes.push(shape);
      }
      let object3d = shapeIdToObject3dMap.get(id);
      if (!object3d) {
        let renderOrder = 3;
        let body: SheetBody | WireframeBody | null = null;
        if (shape instanceof Face) {
          body = new SheetBody(shape);
        } else if (shape instanceof Edge) {
          body = new WireframeBody(shape);
          renderOrder = 4;
        }
        if (body) {
          object3d = modelDataConvertor.convertBody(body);
          object3d.renderOrder = renderOrder;
          shapeIdToObject3dMap.set(id, object3d);
        }
      }
      if (object3d) {
        visualRep.push(object3d);
      }
    }
    return { shapes: shapes, objects3d: visualRep };
  }

  private createSingleObject3DForFeature(shapeIds: bigint[]): VisualRepresentationWithShapeReference {
    const modelDataConvertor = new ModelDataConverter();
    modelDataConvertor.showFaceEdges = false;
    const shapes: Shape[] = [];
    const sheetBody = new SheetBody();
    const wireframeBody = new WireframeBody();
    for (const id of shapeIds) {
      const shape = this.shapes.get(id);
      if (shape) {
        shapes.push(shape);
      }
      if (shape instanceof Face) {
        sheetBody.append(shape);
      } else if (shape instanceof Edge) {
        wireframeBody.append(shape);
      }
    }
    const visualRep = new Group();
    if (sheetBody.shapes.size > 0) {
      const object3d = modelDataConvertor.convertBody(sheetBody);
      object3d.renderOrder = 3;
      visualRep.add(object3d);
    }
    if (wireframeBody.shapes.size > 0) {
      const object3d = modelDataConvertor.convertBody(wireframeBody);
      object3d.renderOrder = 4;
      visualRep.add(object3d);
    }
    if (visualRep.children.length > 0) {
      return { shapes: shapes, objects3d: [visualRep] };
    }
    return { shapes: shapes, objects3d: [] };
  }

  protected fillIdToShapeMap(part: Part) {
    for (const body of part.bodies) {
      if (!(body instanceof SolidBody
        || body instanceof SheetBody
        || body instanceof WireframeBody)) {
        continue;
      }

      const faceIt = new ShapeIterator(body, ShapeType.FACE);
      for (const face of faceIt) {
        this.shapes.set(face.id, face);

        const edgeIt = new ShapeIterator(face, ShapeType.EDGE);
        for (const edge of edgeIt) {
          this.shapes.set(edge.id, edge);
        }
      }
    }
  }
}
