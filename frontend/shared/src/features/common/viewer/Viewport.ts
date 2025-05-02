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
  AmbientLight,
  Box3,
  Color,
  DirectionalLight,
  Group,
  LinearSRGBColorSpace,
  NeutralToneMapping,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';

import { CameraControls } from './CameraControls';

export class Viewport extends EventTarget {
  protected internalScene!: Scene;
  protected internalRenderer!: WebGLRenderer;
  protected scheduleRender: () => void = () => {};

  protected internalCamera!: OrthographicCamera | PerspectiveCamera;
  protected internalCameraControls!: CameraControls;

  protected internalLights = new Group();

  protected readonly root = new Group();

  private isInitialized = false;

  private copyCameraQuaternionToLightsBinding = this.copyCameraQuaternionToLights.bind(this);
  private onSceneObjectsChangedBinding = this.onSceneObjectsChanged.bind(this);

  constructor() {
    super();
    Object3D.DEFAULT_UP.set(0, 0, 1);
    this.root.addEventListener('childadded', this.onSceneObjectsChangedBinding);
    this.root.addEventListener('childremoved', this.onSceneObjectsChangedBinding);
  }

  init(): void;
  init(scene: Scene, renderer: WebGLRenderer, camera: OrthographicCamera | PerspectiveCamera, scheduleRender: () => void): void;
  init(scene?: Scene, renderer?: WebGLRenderer, camera?: OrthographicCamera | PerspectiveCamera, scheduleRender?: () => void): void {
    this.internalCamera = camera ? camera : new OrthographicCamera();
    this.initScene(scene);
    this.initRenderer(renderer);
    this.initScheduleRender(scheduleRender);
    this.initCameraControls();
    this.isInitialized = true;
    this.dispatchEvent(new Event('initialized'));
  }

  get scene(): Scene {
    return this.internalScene;
  }

  get renderer(): WebGLRenderer {
    return this.internalRenderer;
  }

  get canvas(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  get roots(): Object3D[] {
    return this.root.children;
  }

  addRoot(root: Object3D) {
    this.root.add(root);
    root.addEventListener('childadded', (event) => {
      this.root.dispatchEvent(event);
    });
    root.addEventListener('childremoved', (event) => {
      this.root.dispatchEvent(event);
    });
  }

  removeRoot(root: Object3D) {
    root.removeEventListener('childadded', (event) => {
      this.root.dispatchEvent(event);
    });
    root.removeEventListener('childremoved', (event) => {
      this.root.dispatchEvent(event);
    });
    this.root.remove(root);
  }

  removeAllRoots() {
    for (const root of this.root.children) {
      root.removeEventListener('childadded', (event) => {
        this.root.dispatchEvent(event);
      });
      root.removeEventListener('childremoved', (event) => {
        this.root.dispatchEvent(event);
      });
    }
    this.root.clear();
  }

  get rootsBox(): Box3 {
    return new Box3().setFromObject(this.root);
  }

  get lights(): Group {
    return this.internalLights;
  }

  get camera(): OrthographicCamera | PerspectiveCamera {
    return this.internalCamera;
  }

  get cameraControls(): CameraControls {
    return this.internalCameraControls;
  }

  async fitAll() {
    if (this.isInitialized) {
      await this.cameraControls.fitToObject(this.root);
    }
  }

  captureSceneImage(callback: (imageBlob: Blob | null) => void) {
    if (this.isInitialized) {
      this.canvas.toBlob(callback);
    }
  }

  updateScene() {
    this.scheduleRender();
  }

  dispose() {
    this.clearScene();
    this.cameraControls.dispose();
  }

  private initScene(scene?: Scene) {
    this.internalScene = scene ? scene : new Scene();
    this.initLights();
    this.scene.add(this.lights);
    this.scene.add(this.root);
  }

  private clearScene() {
    this.clearLights();
    this.scene.remove(this.lights);
    this.removeAllRoots();

    this.root.removeEventListener('childadded', this.onSceneObjectsChangedBinding);
    this.root.removeEventListener('childremoved', this.onSceneObjectsChangedBinding);
    this.scene.remove(this.root);
  }

  private initLights() {
    this.lights.add(new AmbientLight(new Color(1, 1, 1), 0.1));

    // Directional lights will depend to camera position.
    // See also https://stackoverflow.com/a/76830080
    let light = new DirectionalLight(new Color(1, 1, 1), 1.75);
    light.position.set(-1, 1, 1); // left top light
    light.target.position.set(0, 0, 0);
    this.lights.add(light, light.target);

    light = new DirectionalLight(new Color(1, 1, 1), 1.75);
    light.position.set(1, 1, 1); // right top light
    light.target.position.set(0, 0, 0);
    this.lights.add(light, light.target);

    light = new DirectionalLight(new Color(1, 1, 1), 1);
    light.position.set(0, -1, 1); // center bottom light
    light.target.position.set(0, 0, 0);
    this.lights.add(light, light.target);
  }

  private clearLights() {
    this.lights.clear();
  }

  private initRenderer(renderer?: WebGLRenderer) {
    this.internalRenderer = renderer ? renderer : new WebGLRenderer();
    this.renderer.outputColorSpace = LinearSRGBColorSpace;
    this.renderer.toneMapping = NeutralToneMapping;
    this.renderer.toneMappingExposure = 1;
  }

  private initScheduleRender(scheduleRender?: () => void) {
    if (scheduleRender) {
      this.scheduleRender = scheduleRender;
    } else {
      let animationFrameRequestId = 0;
      const render = () => {
        animationFrameRequestId = 0;
        this.renderer.render(this.scene, this.camera);
      };
      this.scheduleRender = () => {
        if (!animationFrameRequestId) {
          animationFrameRequestId = requestAnimationFrame(render);
        }
      };
    }
  }

  private initCameraControls() {
    this.internalCameraControls = new CameraControls(this.camera, this.canvas);
    this.cameraControls.controls.addEventListener('start', this.scheduleRender);
    this.cameraControls.controls.addEventListener('change', this.copyCameraQuaternionToLightsBinding);
    this.cameraControls.controls.addEventListener('change', this.scheduleRender);
    this.cameraControls.controls.addEventListener('end', this.scheduleRender);
    this.cameraControls.handleResize();
    this.cameraControls.setLookAt(10, -10, 10, 0, 0, 0);
  }

  private copyCameraQuaternionToLights() {
    this.lights.quaternion.copy(this.camera.quaternion);
  }

  private onSceneObjectsChanged() {
    const box = new Box3().setFromObject(this.root);
    if (!box.isEmpty()) {
      const boxCenter = new Vector3();
      box.getCenter(boxCenter);
      const bboxDist = box.min.distanceTo(box.max);
      this.cameraControls.maxDistance = bboxDist * 4;
      this.cameraControls.target = boxCenter;
      this.camera.far = this.cameraControls.maxDistance;
      this.camera.updateProjectionMatrix();
      this.cameraControls.update();
    }
    this.dispatchEvent(new Event('sceneBboxChanged'));
    this.updateScene();
  }
}
