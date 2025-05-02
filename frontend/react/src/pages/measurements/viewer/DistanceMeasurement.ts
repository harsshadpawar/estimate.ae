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

import { Measurement } from './Measurement';
import { ValueWithAnchorPoints } from '@mtk/web/measurements';
import { IndexedTriangleSet, PolylineSet } from '@mtk/web/poly';
import { Box, Matrix3d, Point, Polyline, Transformation, Vector } from '@mtk/web/geom';
import { convertMeshMaterial, convertTransformation, ModelDataConverter } from 'shared/features/common/viewer/ThreeJsHelper';
import { Text } from 'troika-three-text';
import { BasicMaterial, Color } from '@mtk/web/materials';
import { Quaternion, Vector3 } from 'three';

type MeasurementParameters = {
  indentSize: number;
  isInternal: boolean;
  textWidth: number;
  textHeight: number;
  margin: number;
  arrowWidth: number;
  arrowHeight: number;
};

export class DistanceMeasurement extends Measurement {
  private converter = new ModelDataConverter();
  private parameters: MeasurementParameters;

  constructor(public readonly distance: ValueWithAnchorPoints, sceneBBox: Box) {
    super(sceneBBox);
    this.converter.isDepthTestEnabled = this.isDepthTestEnabled;
    const textWidth = this.fontSize * 7;
    const textHeight = this.fontSize * 2;
    const arrowWidth = textHeight / 2;
    const indentSize = this.getIndentLineLength();
    const margin = arrowWidth / 2;
    this.parameters = {
      indentSize: indentSize + (indentSize >= 0 ? textHeight : -textHeight),
      textWidth: textWidth,
      textHeight: textHeight,
      arrowWidth: arrowWidth,
      arrowHeight: arrowWidth / 2,
      margin: margin,
      isInternal: this.distance.value >= textWidth + margin * 2 + arrowWidth * 2,
    };
  }

  override async createObject3D(isDepthTestEnabled?: boolean, fontSize?: number) {
    if (fontSize) {
      this.fontSize = fontSize;
    }
    if (isDepthTestEnabled) {
      this.isDepthTestEnabled = isDepthTestEnabled;
      this.converter.isDepthTestEnabled = this.isDepthTestEnabled;
    }
    if (this.distance.value < 1e-7) {
      return;
    }
    const indentSize = this.parameters.indentSize;
    const textObject = await this.createTextObject(indentSize >= 0 ? 'bottom' : 'top');
    this.object3d.add(textObject);
    this.createNonTextObjects();
    this.object3d.matrix = convertTransformation(this.getTransformation());
    // manually decompose matrix into components to actualize the object state
    this.object3d.matrix.decompose(this.object3d.position, this.object3d.quaternion, this.object3d.scale);
    this.object3d.matrixWorldNeedsUpdate = true;
  }

  private computeParameters(textMesh: Text) {
    const renderInfo = textMesh.textRenderInfo;
    if (!renderInfo) {
      return;
    }
    const textWidth = renderInfo.blockBounds[2] - renderInfo.blockBounds[0];
    const textHeight = renderInfo.blockBounds[3] - renderInfo.blockBounds[1];
    const arrowWidth = textHeight / 2;
    const indentSize = this.getIndentLineLength();
    const margin = arrowWidth / 2;
    this.parameters = {
      indentSize: indentSize + (indentSize >= 0 ? textHeight : -textHeight),
      textWidth: textWidth,
      textHeight: textHeight,
      arrowWidth: arrowWidth,
      arrowHeight: arrowWidth / 2,
      margin: margin,
      isInternal: this.distance.value >= textWidth + margin * 2 + arrowWidth * 2,
    };
  }

  private async createTextObject(anchorY: string): Promise<Text> {
    const material = convertMeshMaterial(new BasicMaterial(new Color(0, 0, 0)));
    material.depthTest = this.isDepthTestEnabled;
    return new Promise((resolve) => {
      const textMesh = new Text();
      textMesh.text = this.distance.value.toFixed(2) + ' mm';
      textMesh.fontSize = this.fontSize;
      textMesh.material = material;
      textMesh.anchorX = 'center';
      textMesh.anchorY = anchorY;
      textMesh.rotation.setFromQuaternion(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2));
      /* textMesh.onAfterRender = (_renderer: WebGLRenderer, _scene: Scene, camera: Camera) => {
            const cameraQuaternion = camera.quaternion;
            if (!textMesh.quaternion.equals(cameraQuaternion)) {
              textMesh.quaternion.rotateTowards(cameraQuaternion, 0.2);
            }
          }; */
      textMesh.sync(() => {
        this.computeParameters(textMesh);
        const distance = this.distance.value;
        textMesh.position.set(
          this.parameters.isInternal
            ? distance / 2
            : distance + this.parameters.arrowWidth + (this.parameters.margin * 2 + this.parameters.textWidth) / 2,
          0,
          this.parameters.indentSize,
        );
        resolve(textMesh);
      });
    });
  }

  private createNonTextObjects() {
    this.createSegmentsObject();
    this.createArrowsObject();
  }

  private createSegmentsObject() {
    const firstPoint = new Point(0, 0, 0);
    const secondPoint = new Point(this.distance.value, 0, 0);
    const indentSize = this.parameters.indentSize;
    const margin = this.parameters.margin;
    const extIndentSize = indentSize >= 0 ? margin : -margin;
    const pls = new PolylineSet();
    const leftLine = new Polyline([firstPoint, firstPoint.clone().setZ(firstPoint.z + indentSize + extIndentSize)]);
    const rightLine = new Polyline([secondPoint, secondPoint.clone().setZ(secondPoint.z + indentSize + extIndentSize)]);
    const middleLine = new Polyline([firstPoint.clone().setZ(firstPoint.z + indentSize), secondPoint.clone().setZ(secondPoint.z + indentSize)]);
    pls.addPolylines([leftLine, rightLine, middleLine]);
    if (!this.parameters.isInternal) {
      const arrowWidth = this.parameters.arrowWidth;
      const leftPoint = middleLine.point(0);
      const leftExtLine = new Polyline([
        leftPoint.clone().setX(leftPoint.x - (arrowWidth + margin)),
        leftPoint.clone().setX(leftPoint.x - arrowWidth),
      ]);
      const rightPoint = middleLine.point(1);
      const rightExtLine = new Polyline([
        rightPoint.clone().setX(rightPoint.x + arrowWidth),
        rightPoint.clone().setX(rightPoint.x + arrowWidth + margin * 2 + this.parameters.textWidth),
      ]);
      pls.addPolylines([leftExtLine, rightExtLine]);
    }
    const lineSegments = this.converter.convertPolyShape(pls);
    if (lineSegments) {
      this.object3d.add(lineSegments);
    }
  }

  private createArrowsObject() {
    const its = new IndexedTriangleSet();
    const distance = this.distance.value;
    const width = this.parameters.arrowWidth;
    const height = this.parameters.arrowHeight;
    const indentSize = this.parameters.indentSize;
    const isInternal = this.parameters.isInternal;
    const firstTrianglePoints: Point[] = [
      new Point(0, 0, indentSize),
      new Point(isInternal ? width : -width, 0, indentSize + height / 2),
      new Point(isInternal ? width : -width, 0, indentSize - height / 2),
    ];
    const firstTriangleIndices = isInternal ? [0, 2, 1] : [0, 1, 2];
    its.addTriangles(firstTrianglePoints, firstTriangleIndices);
    const secondTrianglePoints: Point[] = [
      new Point(distance, 0, indentSize),
      new Point(distance + (isInternal ? -width : width), 0, indentSize + height / 2),
      new Point(distance + (isInternal ? -width : width), 0, indentSize - height / 2),
    ];
    const secondTriangleIndices = isInternal ? [0, 1, 2] : [0, 2, 1];
    its.addTriangles(secondTrianglePoints, secondTriangleIndices);
    const arrows = this.converter.convertPolyShape(its, new BasicMaterial(new Color(0, 0, 0)));
    if (arrows) {
      this.object3d.add(arrows);
    }
  }

  private getTransformation(): Transformation {
    const trsf = new Transformation();

    const initVec = new Vector(1, 0, 0);
    trsf.setTranslation(Vector.fromXYZ(this.distance.points[0]));

    const targetVec = Vector.fromPoints(this.distance.points[0], this.distance.points[1]).normalize();
    const rotationVec = initVec.crossed(targetVec).normalize();
    const angle = initVec.angle(targetVec);
    if (rotationVec.length() < 1e-7 && Math.abs(angle - Math.PI) < 1e-7) {
      trsf.setRotation(new Matrix3d().setDiagonal(-1, 1, 1));
    } else {
      trsf.setRotation(rotationVec, angle);
    }

    return trsf;
  }

  private getIndentLineLength(): number {
    if (this.sceneBbox.isInfinity()) {
      return 20;
    }

    const direction = new Vector(0, 0, 1).transform(this.getTransformation()).normalize();
    const enlargeVec = new Vector(1e-3, 1e-3, 1e-3);
    const minCorner = this.sceneBbox.minCorner.subtracted(enlargeVec);
    const maxCorner = this.sceneBbox.maxCorner.added(enlargeVec);
    const getMinValue = (first: number, second: number) => {
      return (Math.abs(first) < Math.abs(second) ? first : second);
    };
    const distanceToClosestBBoxSide = (point: Point): number => {
      let near = Number.MAX_VALUE;
      if (direction.x !== 0) {
        const min = (minCorner.x - point.x) / direction.x;
        const max = (maxCorner.x - point.x) / direction.x;
        near = getMinValue(near, min);
        near = getMinValue(near, max);
      }

      if (direction.y !== 0) {
        const min = (minCorner.y - point.y) / direction.y;
        const max = (maxCorner.y - point.y) / direction.y;
        near = getMinValue(near, min);
        near = getMinValue(near, max);
      }

      if (direction.z !== 0) {
        const min = (minCorner.z - point.z) / direction.z;
        const max = (maxCorner.z - point.z) / direction.z;
        near = getMinValue(near, min);
        near = getMinValue(near, max);
      }

      const nearPoint = new Point(
        point.x + near * direction.x,
        point.y + near * direction.y,
        point.z + near * direction.z,
      );
      const distance = point.distance(nearPoint);

      return near >= 0 ? distance : -distance;
    };
    const center = this.distance.points[0].added(this.distance.points[1]).divided(2);
    const dist = distanceToClosestBBoxSide(center);
    return dist >= 0 ? dist + 5 : dist - 5;
  }
}
