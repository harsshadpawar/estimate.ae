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
  MTKPartData,
  ModelType,
  TypeToModelMap,
  initPartProcessDataConverter,
} from './helpers/manufacturingProcessHelper';
import {
  MTKProcessData,
  customObjectJSONReviver,
} from './MTKProcessData';
import {
  Model,
  ModelElementUniqueVisitor,
  ModelElementVisitor,
  Part,
} from '@mtk/web/model-data';

import { BaseProduct } from './base/BaseProduct';
import { ModelDataConverter } from 'shared/features/common/viewer/ThreeJsHelper';
import { Style } from 'shared/features/common/viewer/Style';
import { Uuid } from '@mtk/web/base';

type UuidToPartDataMap = Map<Uuid, MTKPartData>;

class PartVisitor implements ModelElementVisitor {
  private style = new Style();
  private modelDataConvertor = new ModelDataConverter();

  constructor(
    private readonly modelType: ModelType,
    private readonly parts: UuidToPartDataMap,
  ) {
    this.modelDataConvertor.lineMaterial = this.style.ghostLineMaterial;
  }

  visitPart(part: Part): void {
    if (!part.uuid) {
      return;
    }

    const object3d = this.modelDataConvertor.convertPart(part, this.style.ghostMaterial);

    const uuid = part.uuid;
    let partData = this.parts.get(uuid);
    if (!partData) {
      partData = { modelData: new Map() };
      this.parts.set(uuid, partData);
    }
    partData.modelData.set(this.modelType, { part: part, object3d: object3d });
  }
}

export class MTKDataConverter {
  private parts: UuidToPartDataMap = new Map();

  constructor(private readonly models: TypeToModelMap, protected readonly processData: string) {}

  convert(): BaseProduct[] {
    if (!this.models.has(ModelType.ORIGIN)) {
      return [];
    }
    this.parseProcessData();
    return this.convertParts();
  }

  private convertParts(): BaseProduct[] {
    for (const [key, value] of this.models) {
      this.exploreModel(value, key);
    }

    const products: BaseProduct[] = [];
    for (const [, value] of this.parts) {
      const originPart = value.modelData.get(ModelType.ORIGIN);
      const processData = value.processData;
      if (!originPart || !processData) {
        continue;
      }
      const partConverter = initPartProcessDataConverter(value);
      const product = partConverter ? partConverter.convert() : new BaseProduct(originPart);
      product.error = processData.error;
      products.push(product);
    }
    return products;
  }

  private parseProcessData() {
    const data = JSON.parse(this.processData, customObjectJSONReviver) as MTKProcessData;
    const parts = data.parts;
    if (parts) {
      for (const partProcessData of parts) {
        const uuid = partProcessData.partId;
        this.parts.set(uuid, { modelData: new Map(), processData: partProcessData });
      }
    } else {
      throw new Error(data.error ? data.error : 'Not found process information about any part.');
    }
  }

  protected exploreModel(model: Model, type: ModelType) {
    const partVisitor = new PartVisitor(type, this.parts);
    const uniqueVisitor = new ModelElementUniqueVisitor(partVisitor);
    model.accept(uniqueVisitor);
  }
}
