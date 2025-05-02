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
  BoxGeometry,
  EdgesGeometry,
  LineSegments,
} from 'three';
import { convertLineMaterial } from 'shared/features/common/viewer/ThreeJsHelper';

import { Box } from '@mtk/web/geom';
import { Measurement } from './Measurement';
import { Style } from 'shared/features/common/viewer/Style';
import { DistanceMeasurement } from './DistanceMeasurement';

export class BoundingBoxMeasurement extends Measurement {
  constructor(public readonly bbox: Box, sceneBBox: Box) {
    super(sceneBBox);
  }

  override async createObject3D(isDepthTestEnabled?: boolean, fontSize?: number) {
    if (fontSize) {
      this.fontSize = fontSize;
    }
    if (isDepthTestEnabled) {
      this.isDepthTestEnabled = isDepthTestEnabled;
    }

    this.object3d.add(this.createBoxObject());

    const minCorner = this.bbox.minCorner;
    const maxCorner = this.bbox.maxCorner;

    const xRangeMeasurement = new DistanceMeasurement(
      {
        value: this.bbox.xRange,
        points: [maxCorner.clone().setX(minCorner.x), maxCorner.clone()],
      },
      this.sceneBbox,
    );
    await xRangeMeasurement.createObject3D(isDepthTestEnabled, fontSize);
    this.object3d.add(xRangeMeasurement.object3d);

    const yRangeMeasurement = new DistanceMeasurement(
      {
        value: this.bbox.yRange,
        points: [minCorner.clone().setZ(maxCorner.z), maxCorner.clone().setX(minCorner.x)],
      },
      this.sceneBbox,
    );
    await yRangeMeasurement.createObject3D(isDepthTestEnabled, fontSize);
    this.object3d.add(yRangeMeasurement.object3d);

    const zRangeMeasurement = new DistanceMeasurement(
      {
        value: this.bbox.zRange,
        points: [maxCorner.clone(), maxCorner.clone().setZ(minCorner.z)],
      },
      this.sceneBbox,
    );
    await zRangeMeasurement.createObject3D(isDepthTestEnabled, fontSize);
    this.object3d.add(zRangeMeasurement.object3d);
    // this.object3d.add(await this.createTextObject());
  }

  private createBoxObject() {
    const boxGeometry = new BoxGeometry(this.bbox.xRange, this.bbox.yRange, this.bbox.zRange);
    const edgesGeometry = new EdgesGeometry(boxGeometry);
    const center = this.bbox.center;
    const lineMaterial = convertLineMaterial(Style.defaultLineMaterial);
    lineMaterial.depthTest = this.isDepthTestEnabled;
    const lineSegments = new LineSegments(edgesGeometry, lineMaterial);
    lineSegments.position.copy(center);
    return lineSegments;
  }

  // Alternative text creation for bbox ranges.
  /* private async createTextObject() {
    const textObject = new Group();

    const center = this.bbox.center;
    const minCorner = this.bbox.minCorner;
    const maxCorner = this.bbox.maxCorner;
    const xRange = this.bbox.xRange;
    const yRange = this.bbox.yRange;
    const zRange = this.bbox.zRange;
    const ranges = [xRange, yRange, zRange].sort((first, second) => first - second);
    const minRange = ranges.find((range) => range > 1e-7);
    const maxRange = ranges[2];
    const rangesDif = minRange ? minRange / maxRange : 1;
    const textSize = minRange && rangesDif > 0.2 ? minRange : 0.25 * maxRange;
    const fontSize = textSize / 5;

    const createSideRangeText = async (value: number, position: Vector3, rotation: Quaternion): Promise<Object3D> => {
      return new Promise((resolve) => {
        const textMesh = new Text();
        textMesh.text = value.toFixed(2) + ' mm';
        textMesh.fontSize = fontSize;
        textMesh.material = convertMeshMaterial(new BasicMaterial(new Color(0, 0, 0)));
        textMesh.position.copy(position);
        textMesh.quaternion.copy(rotation);
        textMesh.anchorX = 'center';
        textMesh.anchorY = 'bottom';
        textMesh.sync(() => {
          resolve(textMesh);
        });
      });
    };

    const createLineObject = (points: Point[]) => {
      const geometry = new BufferGeometry();
      const indices: number[] = [];
      const vertices = new Float32Array(points.length * 3);
      for (let i = 0; i < points.length; i++) {
        vertices[i * 3] = points[i].x;
        vertices[i * 3 + 1] = points[i].y;
        vertices[i * 3 + 2] = points[i].z;
        indices.push(i);
        if (i < points.length - 1) {
          indices.push(i + 1);
        }
      }
      geometry.setAttribute('position', new BufferAttribute(vertices, 3));
      geometry.setIndex(indices);
      const material = convertLineMaterial(Style.defaultLineMaterial);
      return new LineSegments(geometry, material);
    };

    if (xRange > 1e-7) {
      const position = new Vector3(center.x, maxCorner.y, maxCorner.z);
      if (xRange < textSize) {
        textObject.add(createLineObject([maxCorner, maxCorner.clone().setX(maxCorner.x + textSize)]));
        position.setX(maxCorner.x + textSize / 2);
      }
      const xRotation = new Quaternion();
      xRotation.setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);
      textObject.add(await createSideRangeText(xRange, position, xRotation));
    }
    if (yRange > 1e-7) {
      const position = new Vector3(minCorner.x, center.y, maxCorner.z);
      if (yRange < textSize) {
        const firstPoint = minCorner.clone().setZ(maxCorner.z);
        textObject.add(createLineObject([firstPoint, firstPoint.clone().setY(minCorner.y - textSize)]));
        position.setY(minCorner.y - textSize / 2);
      }
      const yRotation = new Quaternion();
      yRotation.setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2);
      textObject.add(await createSideRangeText(yRange, position, yRotation));
    }
    if (zRange > 1e-7) {
      const position = new Vector3(minCorner.x, maxCorner.y, center.z);
      if (zRange < textSize) {
        const firstPoint = minCorner.clone().setY(maxCorner.y);
        textObject.add(createLineObject([firstPoint, firstPoint.clone().setZ(minCorner.z - textSize)]));
        position.setZ(minCorner.z - textSize / 2);
      }
      const zRotation = new Quaternion();
      zRotation.setFromAxisAngle(new Vector3(0, 1, 0), -Math.PI / 2);
      textObject.add(await createSideRangeText(zRange, position, zRotation));
    }

    return textObject;
  } */
}
