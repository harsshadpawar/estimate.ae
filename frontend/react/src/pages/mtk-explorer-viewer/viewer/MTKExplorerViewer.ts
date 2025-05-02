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

import { Group, Object3D, Vector3 } from 'three';

import { BaseProduct } from './base/BaseProduct';
import { FileData } from 'shared/features/mtk-explorer/base/FileData';
import { MTKDataReader } from './MTKDataReader';
import { ProductFeaturesStructureManager } from './ProductFeaturesStructureManager';
import { Style } from 'shared/features/common/viewer/Style';
import { Viewport } from 'shared/features/common/viewer/Viewport';
import { changeObject3dMaterial } from 'shared/features/common/viewer/ThreeJsHelper';

export enum AnalysisMode {
  FEATURE_RECOGNITION = 0,
  DFM = 1,
}

export class MTKExplorerViewer {
  viewport = new Viewport();

  private internalProducts: BaseProduct[] = [];
  private internalCurrentProductIndex: number = -1;

  private internalCurrentAnalysisMode = AnalysisMode.FEATURE_RECOGNITION;

  private partRoot = new Group();
  private featuresRoot = new Group();

  constructor() {
    this.viewport.addEventListener('initialized', () => {
      this.viewport.removeAllRoots();
      this.viewport.addRoot(this.partRoot);
      this.viewport.addRoot(this.featuresRoot);
      this.setCameraPosition();
      this.viewport.fitAll();
    });
  }

  get products(): BaseProduct[] {
    return this.internalProducts;
  }

  get currentProductIndex(): number {
    return this.internalCurrentProductIndex;
  }

  async setCurrentProductIndex(index: number) {
    if (this.currentProductIndex >= 0) {
      this.disconnectCurrentPartAndViewer();
      this.partRoot.clear();
      this.featuresRoot.clear();
    }
    this.disconnectCurrentStructureManagerAndViewer();
    this.internalCurrentProductIndex = index;
    await this.showPart(false);
    await this.showFeatures(undefined, false);
    await this.setCameraPosition();
    await this.viewport.fitAll();
    this.connectCurrentPartAndViewer();
    this.connectCurrentStructureManagerAndViewer();
  }

  get currentProduct(): BaseProduct | null {
    const index = this.currentProductIndex;
    return index >= 0 && index < this.products.length ? this.products[index] : null;
  }

  get currentAnalysisMode(): AnalysisMode {
    return this.internalCurrentAnalysisMode;
  }

  async setCurrentAnalysisMode(mode: AnalysisMode) {
    this.featuresRoot.clear();
    this.disconnectCurrentStructureManagerAndViewer();
    this.internalCurrentAnalysisMode = mode;
    this.updatePartMaterial();
    await this.showFeatures();
    this.connectCurrentStructureManagerAndViewer();
  }

  get currentFeaturesStructureManager(): ProductFeaturesStructureManager | null {
    switch (this.currentAnalysisMode) {
      case AnalysisMode.FEATURE_RECOGNITION: return this.getFeatureRecognitionStructureManager();
      case AnalysisMode.DFM: return this.getDFMStructureManager();
      default: return null;
    }
  }

  async loadModel(files: FileData[]) {
    this.clearViewer();
    const reader = new MTKDataReader();
    this.internalProducts = await reader.readFolder(files);
    if (this.products.length > 0) {
      await this.setCurrentProductIndex(0);
    }
  }

  async showPart(isFitAllRequired: boolean = true) {
    const object3d = this.getVisualRepresentation();
    if (object3d) {
      this.partRoot.add(object3d);
    }
    this.updatePartMaterial();
    if (isFitAllRequired) {
      await this.viewport.fitAll();
    }
  }

  async showFeatures(featureName?: string, isFitAllRequired: boolean = true) {
    const currentStructureManager = this.currentFeaturesStructureManager;
    if (currentStructureManager) {
      const object3d = currentStructureManager.getFeaturesVisualRepresentation(featureName);
      this.featuresRoot.add(object3d);
    }
    if (isFitAllRequired) {
      await this.viewport.fitAll();
    }
  }

  async changeFeatures(featureName?: string) {
    this.featuresRoot.clear();
    await this.showFeatures(featureName, true);
  }

  clearViewer() {
    this.partRoot.clear();
    this.featuresRoot.clear();
    this.internalCurrentProductIndex = -1;
    this.products.length = 0;
  }

  dispose() {
    this.clearViewer();
    this.viewport.dispose();
  }

  protected getVisualRepresentation(): Object3D | null {
    const product = this.currentProduct;
    return product ? product.visualRepresentation : null;
  }

  protected getFeatureRecognitionStructureManager(): ProductFeaturesStructureManager | null {
    const product = this.currentProduct;
    return product ? product.featuresStructureManager : null;
  }

  protected getDFMStructureManager(): ProductFeaturesStructureManager | null {
    const product = this.currentProduct;
    return product ? product.dfmIssuesStructureManager : null;
  }

  protected connectCurrentStructureManagerAndViewer() {
    const currentStructureManager = this.currentFeaturesStructureManager;
    if (currentStructureManager) {
      currentStructureManager.addEventListener('needUpdateViewer', () => {
        this.viewport.updateScene();
      });
    }
  }

  protected disconnectCurrentStructureManagerAndViewer() {
    const currentStructureManager = this.currentFeaturesStructureManager;
    if (currentStructureManager) {
      currentStructureManager.removeEventListener('needUpdateViewer', () => {
        this.viewport.updateScene();
      });
    }
  }

  protected connectCurrentPartAndViewer() {
    const product = this.currentProduct;
    product?.addEventListener('needRefreshScene', this.refreshScene);
  }

  protected disconnectCurrentPartAndViewer() {
    const product = this.currentProduct;
    product?.removeEventListener('needRefreshScene', this.refreshScene);
  }

  protected updatePartMaterial() {
    for (const part of this.partRoot.children) {
      const style = new Style();
      if (!this.currentFeaturesStructureManager) {
        changeObject3dMaterial(part, Style.defaultMaterial, Style.defaultLineMaterial);
      } else {
        changeObject3dMaterial(part, style.ghostMaterial, style.ghostLineMaterial);
      }
    }
  }

  private refreshScene = async () => {
    if (this.currentProductIndex >= 0) {
      this.partRoot.clear();
      this.featuresRoot.clear();
    }
    await this.showPart(false);
    await this.showFeatures(undefined, false);
    await this.viewport.fitAll();
  };

  private async setCameraPosition() {
    const box = this.viewport.rootsBox;
    if (box.isEmpty()) {
      return;
    }

    const center = new Vector3();
    box.getCenter(center);
    const dist = box.min.distanceTo(box.max) / 1.2;
    const pos = new Vector3().addVectors(center, new Vector3(dist, -dist, dist));

    this.viewport.cameraControls.setLookAt(pos.x, pos.y, pos.z, center.x, center.y, center.z);
  }
}
