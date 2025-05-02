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
import {
  IndexedTriangleSet,
  PolylineSet,
} from '@mtk/web/poly';
import {
  Axis1d,
  Box,
  Circle,
  ConicalSurface,
  CurveType,
  CylindricalSurface,
  Direction,
  Ellipse,
  Matrix3d,
  Point,
  Polyline,
  SphericalSurface,
  SurfaceType,
  ToroidalSurface,
  Transformation,
  Vector } from '@mtk/web/geom';
import {
  convertMeshMaterial,
  convertTransformation,
  ModelDataConverter,
} from 'shared/features/common/viewer/ThreeJsHelper';
import {
  BasicMaterial,
  Color,
} from '@mtk/web/materials';
import {
  Quaternion,
  Vector3,
} from 'three';
import {
  Edge,
  Face,
  Shape,
  ShapeIterator,
  ShapeType,
  Vertex,
} from '@mtk/web/brep';
import { ValueWithAnchorPoints } from '@mtk/web/measurements';
import { Text } from 'troika-three-text';

type MeasurementParameters = {
  textWidth: number;
  textHeight: number;
  margin: number;
  arrowWidth: number;
  arrowHeight: number;
};

function distanceToClosestBBoxSide(bbox: Box, point: Point, direction: Direction): number {
  const minCorner = bbox.minCorner;
  const maxCorner = bbox.maxCorner;
  let near = Number.MAX_VALUE;
  if (direction.x !== 0) {
    const min = (minCorner.x - point.x) / direction.x;
    const max = (maxCorner.x - point.x) / direction.x;
    near = Math.min(near, min >= 0 ? min : near, max >= 0 ? max : near);
  }

  if (direction.y !== 0) {
    const min = (minCorner.y - point.y) / direction.y;
    const max = (maxCorner.y - point.y) / direction.y;
    near = Math.min(near, min >= 0 ? min : near, max >= 0 ? max : near);
  }

  if (direction.z !== 0) {
    const min = (minCorner.z - point.z) / direction.z;
    const max = (maxCorner.z - point.z) / direction.z;
    near = Math.min(near, min >= 0 ? min : near, max >= 0 ? max : near);
  }

  const nearPoint = new Point(
    point.x + near * direction.x,
    point.y + near * direction.y,
    point.z + near * direction.z,
  );
  return point.distance(nearPoint);
}

class SingleRadiusMeasurement extends Measurement {
  private converter = new ModelDataConverter();
  private parameters: MeasurementParameters;

  constructor(public radius: ValueWithAnchorPoints, sceneBBox: Box) {
    super(sceneBBox);
    this.converter.isDepthTestEnabled = this.isDepthTestEnabled;
    const textWidth = this.fontSize * 7;
    const textHeight = this.fontSize * 2;
    const arrowWidth = textHeight / 2;
    const margin = arrowWidth / 2;
    this.parameters = {
      textWidth: textWidth,
      textHeight: textHeight,
      arrowWidth: arrowWidth,
      arrowHeight: arrowWidth / 2,
      margin: margin,
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
    const radius = this.radius.value;
    const points = this.radius.points;
    if (radius > 1e-7 && points.length === 2) {
      const direction = Direction.fromVector(Vector.fromPoints(points[0], points[1]));
      const indent = distanceToClosestBBoxSide(this.sceneBbox, points[1], direction);
      const textObject = await this.createTextObject(radius, indent);
      this.object3d.add(textObject);
      this.createNonTextObjects(indent);
      this.object3d.matrix = convertTransformation(this.getTransformation());
      // manually decompose matrix into components to actualize the object state
      this.object3d.matrix.decompose(this.object3d.position, this.object3d.quaternion, this.object3d.scale);
      this.object3d.matrixWorldNeedsUpdate = true;
    }
  }

  private computeParameters(textMesh: Text) {
    const renderInfo = textMesh.textRenderInfo;
    if (!renderInfo) {
      return;
    }
    const textWidth = renderInfo.blockBounds[2] - renderInfo.blockBounds[0];
    const textHeight = renderInfo.blockBounds[3] - renderInfo.blockBounds[1];
    const arrowWidth = textHeight / 2;
    const margin = arrowWidth / 2;
    this.parameters = {
      textWidth: textWidth,
      textHeight: textHeight,
      arrowWidth: arrowWidth,
      arrowHeight: arrowWidth / 2,
      margin: margin,
    };
  }

  private async createTextObject(radius: number, xIndent: number): Promise<Text> {
    const material = convertMeshMaterial(new BasicMaterial(new Color(0, 0, 0)));
    material.depthTest = this.isDepthTestEnabled;
    return new Promise((resolve) => {
      const textMesh = new Text();
      textMesh.text = 'R' + radius.toFixed(2) + ' mm';
      textMesh.fontSize = this.fontSize;
      textMesh.material = material;
      textMesh.anchorX = 'center';
      textMesh.anchorY = 'bottom';
      textMesh.position.set(radius + xIndent, 0, 0);
      textMesh.rotation.setFromQuaternion(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2));
      /* textMesh.onAfterRender = (_renderer: WebGLRenderer, _scene: Scene, camera: Camera) => {
            const cameraQuaternion = camera.quaternion;
            if (!textMesh.quaternion.equals(cameraQuaternion)) {
              textMesh.quaternion.rotateTowards(cameraQuaternion, 0.2);
            }
          }; */
      textMesh.sync(() => {
        this.computeParameters(textMesh);
        const arrowWidth = this.parameters.arrowWidth;
        const x = radius + (xIndent > arrowWidth ? xIndent : arrowWidth) + (this.parameters.margin * 2 + this.parameters.textWidth) / 2;
        textMesh.position.setX(x);
        resolve(textMesh);
      });
    });
  }

  private createNonTextObjects(indent: number) {
    this.createSegmentsObject(indent);
    this.createArrowsObject();
  }

  private createSegmentsObject(indent: number) {
    const radius = this.radius.value;
    const params = this.parameters;
    const arrowWidth = params.arrowWidth;
    const firstPoint = new Point(0, 0, 0);
    const length = (indent > arrowWidth ? indent : arrowWidth) + radius + params.margin * 2 + params.textWidth;
    const secondPoint = new Point(length, 0, 0);
    const pls = new PolylineSet([new Polyline([firstPoint, secondPoint])]);
    const lineSegments = this.converter.convertPolyShape(pls);
    if (lineSegments) {
      this.object3d.add(lineSegments);
    }
  }

  private createArrowsObject() {
    const radius = this.radius.value;
    const its = new IndexedTriangleSet();
    const width = this.parameters.arrowWidth;
    const height = this.parameters.arrowHeight;
    const trianglePoints: Point[] = [
      new Point(radius, 0, 0),
      new Point(radius + width, 0, height / 2),
      new Point(radius + width, 0, -height / 2),
    ];
    const triangleIndices = [0, 1, 2];
    its.addTriangles(trianglePoints, triangleIndices);
    const arrows = this.converter.convertPolyShape(its, new BasicMaterial(new Color(0, 0, 0)));
    if (arrows) {
      this.object3d.add(arrows);
    }
  }

  private getTransformation(): Transformation {
    const trsf = new Transformation();

    const points = this.radius.points;
    const initVec = new Vector(1, 0, 0);
    trsf.setTranslation(Vector.fromXYZ(points[0]));

    const targetVec = Vector.fromPoints(points[0], points[1]).normalize();
    const rotationVec = initVec.crossed(targetVec).normalize();
    const angle = initVec.angle(targetVec);
    if (rotationVec.length() < 1e-7 && Math.abs(angle - Math.PI) < 1e-7) {
      trsf.setRotation(new Matrix3d().setDiagonal(-1, 1, 1));
    } else {
      trsf.setRotation(rotationVec, angle);
    }

    return trsf;
  }
}

export class RadiusMeasurement extends Measurement {
  private internalRadii: ValueWithAnchorPoints[] = [];

  constructor(private shape: Shape, private shapeTransformation: Transformation | null, sceneBBox: Box) {
    super(sceneBBox);
    this.collectRadii();
  }

  get radii(): number[] {
    return this.internalRadii.map((radius) => radius.value);
  }

  override async createObject3D(isDepthTestEnabled?: boolean, fontSize?: number) {
    if (fontSize) {
      this.fontSize = fontSize;
    }
    if (isDepthTestEnabled) {
      this.isDepthTestEnabled = isDepthTestEnabled;
    }
    for (const radius of this.internalRadii) {
      const radMeasurement = new SingleRadiusMeasurement(radius, this.sceneBbox);
      await radMeasurement.createObject3D(this.isDepthTestEnabled, this.fontSize);
      this.object3d.add(radMeasurement.object3d);
    }
  }

  private collectRadii() {
    const getRadiusPoint = (center: Point, dir: Direction, rad: number) => {
      const vec = Vector.fromXYZ(dir);
      const point = center.added(vec.multiplied(rad));
      return point;
    };
    const getTransformedPoint = (point: Point) => {
      return this.shapeTransformation ? point.transformed(this.shapeTransformation) : point;
    };
    const addRadiusPoint = (points: ValueWithAnchorPoints[], rad: number, center: Point, radPoint: Point) => {
      points.push(
        {
          value: rad,
          points: [getTransformedPoint(center), getTransformedPoint(radPoint)],
        },
      );
    };

    const getLineProjectionPoint = (point: Point, lineLoc: Point, lineDir: Direction) => {
      const lineLocToPointVec = Vector.fromPoints(lineLoc, point);
      const lineVec = Vector.fromXYZ(lineDir);
      const t = lineLocToPointVec.dot(lineVec);
      const linePoint = lineLoc.added(lineVec.multiplied(t));
      return linePoint;
    };

    let minorRad = -1;
    let majorRad = -1;
    let axis = new Direction();
    const minorRadPoints: ValueWithAnchorPoints[] = [];
    const majorRadPoints: ValueWithAnchorPoints[] = [];
    if (this.shape instanceof Edge && this.shape.curve) {
      switch (this.shape.curve.type) {
        case CurveType.CIRCLE: {
          const curve = this.shape.curve as Circle;
          majorRad = curve.radius;
          axis = curve.position.axis;
          const it = new ShapeIterator(this.shape, ShapeType.VERTEX);
          for (const vertex of it) {
            addRadiusPoint(majorRadPoints, majorRad, curve.position.location, (vertex as Vertex).point);
          }
          break;
        }
        case CurveType.ELLIPSE: {
          const curve = this.shape.curve as Ellipse;
          minorRad = curve.minorRadius;
          majorRad = curve.majorRadius;
          const position = curve.position;
          axis = position.axis;
          const location = position.location;
          const xDir = position.xDirection;
          const yDir = position.yDirection;
          addRadiusPoint(minorRadPoints, minorRad, location, getRadiusPoint(location, yDir, minorRad));
          addRadiusPoint(minorRadPoints, minorRad, location, getRadiusPoint(location, yDir.reversed(), minorRad));
          addRadiusPoint(majorRadPoints, majorRad, location, getRadiusPoint(location, xDir, majorRad));
          addRadiusPoint(majorRadPoints, majorRad, location, getRadiusPoint(location, xDir.reversed(), majorRad));
          break;
        }
        default: break;
      }
    } else if (this.shape instanceof Face) {
      switch (this.shape.surface.type) {
        case SurfaceType.CONE: {
          const surface = this.shape.surface as ConicalSurface;
          minorRad = Number.MAX_VALUE;
          majorRad = -1;
          axis = surface.position.axis;
          const it = new ShapeIterator(this.shape, ShapeType.VERTEX);
          for (const vertex of it) {
            const point = (vertex as Vertex).point;
            const center = getLineProjectionPoint(point, surface.position.location, axis);
            const distance = center.distance(point);
            if (distance > majorRad + 1e-7) {
              majorRad = distance;
              majorRadPoints.length = 0;
              addRadiusPoint(majorRadPoints, majorRad, center, point);
            } else if (Math.abs(majorRad - distance) < 1e-7) {
              addRadiusPoint(majorRadPoints, majorRad, center, point);
            }

            if (distance < minorRad - 1e-7) {
              minorRad = distance;
              minorRadPoints.length = 0;
              addRadiusPoint(minorRadPoints, minorRad, center, point);
            } else if (Math.abs(minorRad - distance) < 1e-7) {
              addRadiusPoint(minorRadPoints, minorRad, center, point);
            }
          }
          if (Math.abs(majorRad - minorRad) < 1e-7 || majorRad < minorRad) {
            minorRad = -1;
            minorRadPoints.length = 0;
          }
          if (majorRad < 0) {
            majorRad = surface.radius;
            majorRadPoints.length = 0;
          }
          break;
        }
        case SurfaceType.CYLINDER: {
          const surface = this.shape.surface as CylindricalSurface;
          majorRad = surface.radius;
          axis = surface.position.axis;
          const it = new ShapeIterator(this.shape, ShapeType.VERTEX);
          for (const vertex of it) {
            const point = (vertex as Vertex).point;
            const center = getLineProjectionPoint(point, surface.position.location, axis);
            addRadiusPoint(majorRadPoints, majorRad, center, point);
          }
          break;
        }
        case SurfaceType.SPHERE: {
          const surface = this.shape.surface as SphericalSurface;
          majorRad = surface.radius;
          axis = surface.position.axis;
          const it = new ShapeIterator(this.shape, ShapeType.VERTEX);
          for (const vertex of it) {
            addRadiusPoint(majorRadPoints, majorRad, surface.position.location, (vertex as Vertex).point);
          }
          break;
        }
        case SurfaceType.TORUS: {
          const surface = this.shape.surface as ToroidalSurface;
          minorRad = surface.minorRadius;
          majorRad = surface.majorRadius;
          const position = surface.position;
          const location = position.location;
          axis = position.axis;
          const it = new ShapeIterator(this.shape, ShapeType.VERTEX);
          for (const vertex of it) {
            const point = (vertex as Vertex).point;
            const projPoint = getLineProjectionPoint(location, point, axis);
            const direction = Direction.fromVector(Vector.fromPoints(location, projPoint));
            const majorRadPoint = getRadiusPoint(location, direction, majorRad);
            addRadiusPoint(majorRadPoints, majorRad, location, majorRadPoint);
            if (!direction.isParallel(Direction.fromVector(Vector.fromPoints(majorRadPoint, point)))) {
              addRadiusPoint(minorRadPoints, minorRad, majorRadPoint, point);
            } else {
              const firstMinorRadPoint = getRadiusPoint(majorRadPoint, axis, minorRad);
              addRadiusPoint(minorRadPoints, minorRad, majorRadPoint, firstMinorRadPoint);
              const secondMinorRadPoint = getRadiusPoint(majorRadPoint, axis.reversed(), minorRad);
              addRadiusPoint(minorRadPoints, minorRad, majorRadPoint, secondMinorRadPoint);
            }
          }
          break;
        }
        default: break;
      }
    }

    const findClosestPointToBBoxSide = (points: ValueWithAnchorPoints[]): ValueWithAnchorPoints | null => {
      let minDistance = Number.MAX_VALUE;
      let minDistancePoint: ValueWithAnchorPoints | null = null;
      points.forEach((point: ValueWithAnchorPoints) => {
        const direction = Direction.fromVector(Vector.fromPoints(point.points[0], point.points[1]));
        const distance = distanceToClosestBBoxSide(this.sceneBbox, point.points[1], direction);
        if (distance < minDistance - 1e-7) {
          minDistance = distance;
          minDistancePoint = point;
        }
      });
      return minDistancePoint;
    };

    let minRadDirection: Direction | null = null;
    if (minorRad >= 0) {
      const point = findClosestPointToBBoxSide(minorRadPoints);
      if (point) {
        this.internalRadii.push(point);
        minRadDirection = Direction.fromVector(Vector.fromPoints(point.points[0], point.points[1]));
      }
    }
    if (majorRad >= 0) {
      const point = findClosestPointToBBoxSide(majorRadPoints);
      if (point) {
        const direction = Direction.fromVector(Vector.fromPoints(point.points[0], point.points[1]));
        if (minRadDirection && minRadDirection.isEqual(direction)) {
          const turningAxis = new Axis1d(point.points[0], axis);
          point.points[1] = getRadiusPoint(point.points[0], direction.rotated(turningAxis, Math.PI / 2), point.value);
        }
        this.internalRadii.push(point);
      }
    }
  }
}
