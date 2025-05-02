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
  Group,
  Intersection,
  Object3D,
} from 'three';
import {
  Shape,
  ShapePrimitivesGroup,
} from '@mtk/web/brep';
import {
  TreeChangedEvent,
  TreeNodeChangedEvent,
} from 'shared/features/common/tree/TreeEvents';
import {
  changeObject3dMaterial,
  changeObject3dMaterialColor,
} from 'shared/features/common/viewer/ThreeJsHelper';

import { Color } from '@mtk/web/materials';
import { Style } from 'shared/features/common/viewer/Style';
import { Tree } from 'shared/features/common/tree/Tree';
import { TreeNode } from 'shared/features/common/tree/TreeNode';

export interface ProductFeaturesTreeNodeData {
  color?: Color;
  visualRepresentation?: Object3D[];
  shapes?: Shape[];
}

export class ProductFeaturesStructureManager extends Tree<ProductFeaturesTreeNodeData> {
  message?: string;

  private object3dToNodeMap: Map<Object3D, Set<TreeNode<ProductFeaturesTreeNodeData>>> = new Map();
  private object3dToUsedColorMap: Map<Object3D, Color> = new Map();

  constructor() {
    super();

    this.addEventListener('inserted', (event: TreeNodeChangedEvent<ProductFeaturesTreeNodeData>) => {
      this.applyForEachNode(event.node, (node: TreeNode<ProductFeaturesTreeNodeData>) => {
        const visualRep = node.data().visualRepresentation;
        if (!visualRep) {
          return;
        }
        for (const object3d of visualRep) {
          const features = this.object3dToNodeMap.get(object3d);
          if (!features) {
            this.object3dToNodeMap.set(object3d, new Set([node]));
          } else {
            features.add(node);
          }
        }
      });
    });

    this.addEventListener('removed', (event: TreeNodeChangedEvent<ProductFeaturesTreeNodeData>) => {
      this.applyForEachNode(event.node, (node: TreeNode<ProductFeaturesTreeNodeData>) => {
        const visualRep = node.data().visualRepresentation;
        if (!visualRep) {
          return;
        }
        for (const object3d of visualRep) {
          const features = this.object3dToNodeMap.get(object3d);
          if (features) {
            features.delete(node);
            if (features.size === 0) {
              this.object3dToNodeMap.delete(object3d);
            }
          }
        }
      });
    });

    this.addEventListener('selectionChanged', this.onSelectionChanged);
    this.addEventListener('breakSelection', (event) => {
      this.resetNodesMaterial(event.nodes);
    });
  }

  getFeaturesVisualRepresentation(featureName?: string): Group {
    const visualRep = new Group();
    if (!featureName) {
      for (const [key, value] of this.object3dToNodeMap) {
        const color = Array.from(value)[0].data().color;
        if (color) {
          changeObject3dMaterialColor(key, color);
          this.object3dToUsedColorMap.set(key, color);
        }
        visualRep.add(key);
      }
    } else {
      const uniqueObjects3d = new Set<Object3D>();
      for (const root of this.rootsNodes) {
        for (const featureGroup of root.children) {
          if (featureGroup.text === featureName) {
            this.applyForEachNode(featureGroup, (node: TreeNode<ProductFeaturesTreeNodeData>) => {
              const featureVisualRep = node.data().visualRepresentation;
              if (!featureVisualRep) {
                return;
              }
              for (const object3d of featureVisualRep) {
                const color = node.data().color;
                if (color) {
                  changeObject3dMaterialColor(object3d, color);
                  this.object3dToUsedColorMap.set(object3d, color);
                }
                uniqueObjects3d.add(object3d);
              }
            });
          }
        }
      }
      for (const object3d of uniqueObjects3d) {
        visualRep.add(object3d);
      }
    }
    return visualRep;
  }

  expandAllBeforeFeatureNodes(node: TreeNode<ProductFeaturesTreeNodeData>) {
    this.applyForEachNode(node, (childNode: TreeNode<ProductFeaturesTreeNodeData>) => {
      if (childNode.children.length === 0) {
        return;
      } else {
        this.expandToNode(childNode);
      }
    });
  }

  private applyForEachNode(parent: TreeNode<ProductFeaturesTreeNodeData>, action: (node: TreeNode<ProductFeaturesTreeNodeData>) => void) {
    action(parent);
    parent.children.forEach((child) => this.applyForEachNode(child, action));
  }

  private onSelectionChanged(event: TreeChangedEvent<ProductFeaturesTreeNodeData>) {
    this.resetNodesMaterial(event.nodes, false);
    this.changeSelectedNodesMaterial();
    this.dispatchEvent(new Event('needUpdateViewer'));
  }

  selectFromViewer(intersections: Intersection<Object3D>[] | null, isMultipleSelectionModifiersUsed?: boolean) {
    const findMatchedTreeNodes = (object3d: Object3D) => {
      const matchedNodes = this.object3dToNodeMap.get(object3d);
      if (matchedNodes) {
        return matchedNodes;
      } else if (object3d.parent) {
        return findMatchedTreeNodes(object3d.parent);
      }
      return null;
    };

    const checkNodeIntersection = (intersection: Intersection<Object3D>, nodeShapes?: Shape[]) => {
      if (!nodeShapes) {
        return false;
      }

      const intersectedObject = intersection.object;
      const userData = intersectedObject.userData as ShapePrimitivesGroup[];
      const triangleIndex = intersection.faceIndex;
      const lineIndex = intersection.index;
      const primitiveIndex = triangleIndex != null
        ? triangleIndex
        : lineIndex != null ? lineIndex : -1;
      let shapeId: bigint = BigInt(-1);
      for (const primitivesGroup of userData) {
        if (primitiveIndex >= primitivesGroup.start && primitiveIndex < primitivesGroup.start + primitivesGroup.count) {
          shapeId = primitivesGroup.shapeId;
          break;
        }
      }
      if (shapeId < BigInt(0)) {
        return false;
      }
      for (const shape of nodeShapes) {
        if (shapeId === shape.id) {
          return true;
        }
      }
      return false;
    };

    if (!isMultipleSelectionModifiersUsed) {
      this.deselectAllNodes();
    }
    if (intersections !== null) {
      for (const intersection of intersections) {
        const matchedNodes = findMatchedTreeNodes(intersection.object);

        let isNodesFound = false;
        if (matchedNodes) {
          let shouldBeUnselected = false;
          if (isMultipleSelectionModifiersUsed) {
            for (const node of matchedNodes) {
              if (this._selectedNodes.has(node)) {
                shouldBeUnselected = true;
                break;
              }
            }
          }
          for (const node of matchedNodes) {
            if (!isNodesFound) {
              isNodesFound = checkNodeIntersection(intersection, node.data().shapes);
              if (!isNodesFound) {
                break;
              }
            }
            if (shouldBeUnselected) {
              this.deselectNode(node);
            } else {
              this.selectNode(node, false);
              this.expandToNode(node);
            }
          }
          if (isNodesFound) {
            break;
          }
        }
      }
    }
  }

  private changeSelectedNodesMaterial() {
    const style = new Style();
    for (const node of this._selectedNodes) {
      this.applyForEachNode(node, (treeNode: TreeNode<ProductFeaturesTreeNodeData>) => {
        const featureVisualRep = treeNode.data().visualRepresentation;
        if (!featureVisualRep) {
          return;
        }
        for (const object3d of featureVisualRep) {
          const faceMaterial = style.selectedMaterial;
          const edgeMaterial = style.selectedLineMaterial;
          changeObject3dMaterial(object3d, faceMaterial, edgeMaterial);
        }
      });
    }
  }

  private resetNodesMaterial(nodes: TreeNode<ProductFeaturesTreeNodeData>[], isNeedToUpdateViewer: boolean = true) {
    for (const node of nodes) {
      this.applyForEachNode(node, (treeNode: TreeNode<ProductFeaturesTreeNodeData>) => {
        const featureVisualRep = treeNode.data().visualRepresentation;
        if (!featureVisualRep) {
          return;
        }
        for (const object3d of featureVisualRep) {
          const color = this.object3dToUsedColorMap.get(object3d);
          const faceMaterial = Style.defaultMaterial.clone();
          const edgeMaterial = Style.defaultLineMaterial.clone();
          if (color) {
            faceMaterial.diffuseColor.copy(color);
            edgeMaterial.color.copy(color);
          }
          changeObject3dMaterial(object3d, faceMaterial, edgeMaterial);
        }
      });
    }
    if (isNeedToUpdateViewer) {
      this.dispatchEvent(new Event('needUpdateViewer'));
    }
  }
}
