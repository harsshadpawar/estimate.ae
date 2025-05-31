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
  Box3,
  MOUSE,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Sphere,
  Vector3,
} from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

export enum CameraControlsType {
  ORBIT = 0,
  TRACKBALL = 1,
}

export class CameraControls {
  private internalControls: OrbitControls | TrackballControls;

  constructor(
    camera: OrthographicCamera | PerspectiveCamera,
    domElement: HTMLCanvasElement,
    type: CameraControlsType = CameraControlsType.TRACKBALL,
  ) {
    switch (type) {
      case CameraControlsType.ORBIT: {
        this.internalControls = new OrbitControls(camera, domElement);
        break;
      }
      case CameraControlsType.TRACKBALL: {
        this.internalControls = new TrackballControls(camera, domElement);
        break;
      }
      default: {
        throw new Error(`Undefined camera controls type: ${type}.`);
      }
    }
    this.setupControls();
  }

  get controls(): OrbitControls | TrackballControls {
    return this.internalControls;
  }

  get maxDistance() {
    return this.controls.maxDistance;
  }

  set maxDistance(distance: number) {
    this.controls.maxDistance = distance;
  }

  get target() {
    return this.controls.target;
  }

  set target(point: Vector3) {
    this.controls.target.copy(point);
  }

  setLookAt(
    positionX: number, positionY: number, positionZ: number,
    targetX: number, targetY: number, targetZ: number,
  ) {
    this.camera.position.set(positionX, positionY, positionZ);
    this.controls.target.set(targetX, targetY, targetZ);
    this.update();
  }

  async fitToObject(object: Object3D) {
    const camera = this.controls.object;

    const box = new Box3().setFromObject(object);
    const sphere = new Sphere();
    box.getBoundingSphere(sphere);

    const center = sphere.center;
    const radius = sphere.radius;

    this.controls.target.copy(center);

    if (camera instanceof PerspectiveCamera) {
      const currentDistance = camera.position.distanceTo(center);
      const distance = 2 * radius / (2 * Math.tan((camera.fov * Math.PI) / 360));
      camera.zoom = currentDistance / distance;
      camera.updateProjectionMatrix();
    } else if (camera instanceof OrthographicCamera) {
      const diam = 2 * radius;
      camera.zoom = Math.min(camera.right - camera.left, camera.top - camera.bottom) / diam;
      camera.updateProjectionMatrix();
    }

    this.update();
  }

  update(deltaTime?: number) {
    this.controls.update(deltaTime);
  }

  handleResize() {
    if (this.controls instanceof TrackballControls) {
      this.controls.handleResize();
    }
  }

  dispose() {
    this.controls.dispose();
  }

  private get camera() {
    return this.controls.object;
  }

  private setupControls() {
    if (this.controls instanceof OrbitControls) {
      this.controls.rotateSpeed = 1;
      this.controls.zoomSpeed = 1;
      this.controls.panSpeed = 0.5;
    } else if (this.controls instanceof TrackballControls) {
      this.controls.rotateSpeed = 2;
      this.controls.zoomSpeed = 1;
      this.controls.panSpeed = 0.5;
      this.controls.keys = ['', '', 'ControlLeft'];
      this.controls.addEventListener('start', this.connectPointerMoveAction);
      this.controls.addEventListener('end', this.disconnectPointerMoveAction);
    } else {
      return;
    }

    this.controls.mouseButtons = {
      LEFT: MOUSE.ROTATE,
      MIDDLE: null,
      RIGHT: null,
    };
  }

  private onPointerMove = () => {
    this.update();
  };

  private connectPointerMoveAction = () => {
    this.controls.domElement?.addEventListener('pointermove', this.onPointerMove);
  };

  private disconnectPointerMoveAction = () => {
    this.controls.domElement?.removeEventListener('pointermove', this.onPointerMove);
  };
}
