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
  BasicMaterial,
  Color,
  PhongMaterial,
  VisualMaterial,
} from '@mtk/web/materials';
import {
  Body,
  Part,
  PolyBody,
  SheetBody,
  SolidBody,
  WireframeBody,
} from '@mtk/web/model-data';
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  FrontSide,
  Group,
  LineBasicMaterial,
  LineSegments,
  Material,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Object3D,
  Points,
  PointsMaterial,
  Color as ThreeJsColor,
} from 'three';
import {
  IndexedTriangleSet,
  PointSet,
  PolyShape,
  PolyShapePrimitivesGroup,
  PolylineSet,
} from '@mtk/web/poly';
import {
  ShapeCompoundTriangulation,
  ShapePrimitivesGroup,
} from '@mtk/web/brep';

import { Style } from './Style';
import { Transformation } from '@mtk/web/geom';

export function convertTransformation(transformation: Transformation): Matrix4 {
  const rotation = transformation.rotation;
  const translation = transformation.translation;
  const scale = transformation.scaleFactor;

  const matrix = new Matrix4(
    rotation.value(0, 0), rotation.value(0, 1), rotation.value(0, 2), translation.x,
    rotation.value(1, 0), rotation.value(1, 1), rotation.value(1, 2), translation.y,
    rotation.value(2, 0), rotation.value(2, 1), rotation.value(2, 2), translation.z,
    0, 0, 0, scale,
  );
  // Make matrix homogeneous (the last element should be 1)
  matrix.multiplyScalar(1 / scale);

  return matrix;
}

export function convertColor(color: Color): ThreeJsColor {
  const threejsColor = new ThreeJsColor(color.r, color.g, color.b);
  return threejsColor;
}

export function convertMeshMaterial(material: VisualMaterial, isMeshClosed?: boolean): Material {
  let threejsMaterial: Material;
  if (material instanceof BasicMaterial) {
    const threejsBasicMaterial = new MeshBasicMaterial();
    threejsBasicMaterial.color = convertColor(material.color);
    threejsMaterial = threejsBasicMaterial;
  } else if (material instanceof PhongMaterial) {
    // ambientColor is not used in three.js
    const threejsPhongMaterial = new MeshPhongMaterial();
    threejsPhongMaterial.color = convertColor(material.diffuseColor);
    threejsPhongMaterial.specular = convertColor(material.specularColor);
    threejsPhongMaterial.emissive = convertColor(material.emissionColor);
    threejsPhongMaterial.shininess = material.shininess;
    threejsMaterial = threejsPhongMaterial;
  } else {
    // just assign default material
    threejsMaterial = convertMeshMaterial(Style.defaultMaterial, isMeshClosed);
  }

  threejsMaterial.side = isMeshClosed ? FrontSide : DoubleSide;
  threejsMaterial.opacity = material.opacity;
  threejsMaterial.transparent = (1 - threejsMaterial.opacity) > 1e-3;

  return threejsMaterial;
}

export function convertLineMaterial(material: VisualMaterial): LineBasicMaterial {
  let threejsMaterial = new LineBasicMaterial();
  if (material instanceof BasicMaterial) {
    threejsMaterial.color = convertColor(material.color);
  } else if (material instanceof PhongMaterial) {
    threejsMaterial.color = convertColor(material.diffuseColor);
  } else {
    // just assign default material
    threejsMaterial = convertLineMaterial(Style.defaultLineMaterial);
  }

  threejsMaterial.opacity = material.opacity;
  threejsMaterial.transparent = (1 - threejsMaterial.opacity) > 1e-3;

  return threejsMaterial;
}

export function convertPointsMaterial(material: VisualMaterial): PointsMaterial {
  let threejsMaterial = new PointsMaterial();
  if (material instanceof BasicMaterial) {
    threejsMaterial.color = convertColor(material.color);
  } else if (material instanceof PhongMaterial) {
    threejsMaterial.color = convertColor(material.diffuseColor);
  } else {
    // just assign default material
    threejsMaterial = convertPointsMaterial(Style.defaultMaterial);
  }

  threejsMaterial.opacity = material.opacity;
  threejsMaterial.transparent = (1 - threejsMaterial.opacity) > 1e-3;

  return threejsMaterial;
}

export function changeObject3dMaterial(object3d: Object3D, meshMaterial: VisualMaterial, lineMaterial: VisualMaterial) {
  const getNewMaterial = (object3d: Object3D) => {
    if (object3d instanceof Mesh) {
      return convertMeshMaterial(meshMaterial);
    } else if (object3d instanceof LineSegments) {
      return convertLineMaterial(lineMaterial);
    }
  };
  applyForEachChild(object3d, (object3d: Object3D) => {
    if (object3d instanceof Mesh || object3d instanceof LineSegments) {
      const material = object3d.material;
      const newMaterial = getNewMaterial(object3d);
      if (newMaterial) {
        if (Array.isArray(material)) {
          object3d.material = material.map((mat: Material) => {
            newMaterial.side = mat.side;
            return newMaterial;
          });
        } else {
          newMaterial.side = material.side;
          object3d.material = newMaterial;
        }
      }
    }
  });
}

export function changeObject3dMaterialColor(object3d: Object3D, color: Color) {
  applyForEachChild(object3d, (object3d: Object3D) => {
    if (object3d instanceof Mesh || object3d instanceof Points || object3d instanceof LineSegments) {
      const material = object3d.material;
      if (Array.isArray(material)) {
        material.forEach((mat) => {
          changeMaterialColor(mat, color);
        });
      } else {
        changeMaterialColor(material, color);
      }
    }
  });
}

function applyForEachChild(object3d: Object3D, action: (object3d: Object3D) => void) {
  action(object3d);
  object3d.children.forEach((child) => applyForEachChild(child, action));
}

function changeMaterialColor(material: Material, color: Color) {
  if (material instanceof MeshBasicMaterial || material instanceof MeshPhongMaterial
    || material instanceof LineBasicMaterial
    || material instanceof PointsMaterial) {
    material.color = convertColor(color);
    material.needsUpdate = true;
  }
}

export class ModelDataConverter {
  isDepthTestEnabled = true;
  showFaceEdges = true;
  lineMaterial: BasicMaterial = ModelDataConverter.baseLineMaterial;

  private static baseLineMaterial = new BasicMaterial(new Color(0, 0, 0), 1);

  convertPolyShape(polyShape: PolyShape, material?: VisualMaterial): Object3D | null {
    if (polyShape instanceof IndexedTriangleSet) {
      const shapeMaterial = convertMeshMaterial(material || Style.defaultMaterial);
      shapeMaterial.depthTest = this.isDepthTestEnabled;
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new BufferAttribute(polyShape.vertices, 3));
      geometry.setIndex(new BufferAttribute(polyShape.vertexIndices, 1));
      if (polyShape.normals.length) {
        geometry.setAttribute('normal', new BufferAttribute(polyShape.normals, 3));
      }
      if (polyShape.colors.length) {
        geometry.setAttribute('colors', new BufferAttribute(polyShape.colors, 3));
      }
      if (polyShape.uvCoordinates.length) {
        geometry.setAttribute('uv', new BufferAttribute(polyShape.uvCoordinates, 2));
      }
      const mesh = new Mesh(geometry, shapeMaterial);
      mesh.castShadow = true;
      mesh.renderOrder = 0;
      return mesh;
    } else if (polyShape instanceof PolylineSet) {
      const shapeMaterial = convertLineMaterial(material || Style.defaultLineMaterial);
      shapeMaterial.depthTest = this.isDepthTestEnabled;
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new BufferAttribute(polyShape.vertices, 3));
      if (polyShape.colors) {
        geometry.setAttribute('colors', new BufferAttribute(polyShape.colors, 3));
      }
      const indexes = [] as number[];
      let totalNumberOfVertexes = 0;
      for (let i = 0; i < polyShape.numberOfPolylines; i++) {
        for (let j = 0; j < polyShape.polyline(i).numberOfPoints - 1; j++) {
          indexes.push(totalNumberOfVertexes);
          indexes.push(++totalNumberOfVertexes);
        }
        totalNumberOfVertexes++;
      }
      geometry.setIndex(indexes);
      const lines = new LineSegments(geometry, shapeMaterial);
      lines.renderOrder = 1;
      return lines;
    } else if (polyShape instanceof PointSet) {
      const shapeMaterial = convertPointsMaterial(material || Style.defaultMaterial);
      shapeMaterial.depthTest = this.isDepthTestEnabled;
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new BufferAttribute(polyShape.vertices, 3));
      if (polyShape.colors) {
        geometry.setAttribute('colors', new BufferAttribute(polyShape.colors, 3));
      }
      const points = new Points(geometry, shapeMaterial);
      points.renderOrder = 2;
      return points;
    }

    return null;
  }

  convertBody(body: Body, material?: VisualMaterial): Group {
    const bodySceneObject = new Group();
    if (body instanceof PolyBody) {
      const bodyMaterial = body.material || material;
      for (const polyShape of body.shapes) {
        const obj = this.convertPolyShape(polyShape, bodyMaterial);
        if (obj) {
          bodySceneObject.add(obj);
        }
      }
    } else {
      let closed = false;
      let prs: ShapeCompoundTriangulation<false> | null = null;
      if (body instanceof WireframeBody) {
        prs = body.computeCompoundTriangulation(material || Style.defaultLineMaterial);
      } else if (body instanceof SheetBody) {
        prs = body.computeCompoundTriangulation(material || Style.defaultMaterial);
      } else if (body instanceof SolidBody) {
        closed = true;
        prs = body.computeCompoundTriangulation(material || Style.defaultMaterial);
      }
      if (prs !== null) {
        for (const [pvs, groups] of prs.faces) {
          const materials = [] as VisualMaterial[];
          const materialGroups = [] as BufferGeometry['groups'];
          const shapePrimitives = [] as ShapePrimitivesGroup[];
          for (const group of groups) {
            let materialIndex = materials.indexOf(group.material);
            if (materialIndex === -1) {
              materialIndex = materials.length;
              materials.push(group.material);
            }
            materialGroups.push({
              start: group.start,
              count: group.count,
              materialIndex,
            });
            shapePrimitives.push(...group.shapesPrimitives);
          }
          const threejsMaterials = materials.map((m) => convertMeshMaterial(m, closed));
          const obj = this.convertPolyShape(pvs);
          if (obj && obj instanceof Mesh) {
            obj.material = threejsMaterials;
            obj.geometry.groups = materialGroups;
            obj.userData = shapePrimitives;
            bodySceneObject.add(obj);
          }
        }
        if (this.showFaceEdges || body instanceof WireframeBody) {
          for (const [pvs, groups] of prs.edges) {
            const materials = [] as VisualMaterial[];
            const materialGroups = [] as BufferGeometry['groups'];
            const shapePrimitives = [] as ShapePrimitivesGroup[];
            let currentLineStart = 0;
            const linesVertexRanges: PolyShapePrimitivesGroup[] = [];
            for (let i = 0; i < pvs.numberOfPolylines; i++) {
              const count = pvs.polyline(i).numberOfPoints;
              linesVertexRanges.push({
                start: currentLineStart,
                count,
              });
              currentLineStart += count;
            }
            // Convert lines groups into indexes groups
            for (const group of groups) {
              let materialIndex = materials.indexOf(group.material);
              if (materialIndex === -1) {
                materialIndex = materials.length;
                materials.push(group.material);
              }
              const startVertex = linesVertexRanges[group.start].start;
              const endVertex = linesVertexRanges[group.start + group.count - 1].start + linesVertexRanges[group.start + group.count - 1].count;
              const count = 2 * (endVertex - startVertex - group.count);
              const start = 2 * (startVertex - group.start);
              materialGroups.push({
                start,
                count,
                materialIndex: 0,
              });
              shapePrimitives.push(...group.shapesPrimitives);
            }
            const obj = this.convertPolyShape(pvs);
            const threejsMaterials = (body instanceof WireframeBody)
              ? materials.map((m) => convertLineMaterial(m))
              : [convertLineMaterial(this.lineMaterial)];
            if (obj && obj instanceof LineSegments) {
              obj.material = threejsMaterials;
              obj.geometry.groups = materialGroups;
              obj.userData = shapePrimitives;
              bodySceneObject.add(obj);
            }
          }
        }
      }
    }

    return bodySceneObject;
  }

  convertPart(part: Part, material?: VisualMaterial): Group {
    const partSceneObject = new Group();
    for (const body of part.bodies) {
      partSceneObject.add(this.convertBody(body, part.material || material));
    }
    return partSceneObject;
  }
}
