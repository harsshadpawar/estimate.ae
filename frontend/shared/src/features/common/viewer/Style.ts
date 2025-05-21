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

export class Style {
  static defaultMaterial = new PhongMaterial(
    new Color(0.2, 0.2, 0.2), // ambient
    new Color().setHex(0xcdcdcd), // diffuse
    new Color().setHex(0x0a0a0a), // specular
    new Color(0, 0, 0), // emissive
    62.5, // shininess
  );

  static defaultLineMaterial = new BasicMaterial(new Color(0, 0, 0), 1);

  originalMaterial: VisualMaterial | null = null;
  selectedMaterial: PhongMaterial;
  selectedLineMaterial: BasicMaterial;
  ghostMaterial: PhongMaterial;
  ghostLineMaterial: BasicMaterial;

  constructor() {
    this.selectedMaterial = Style.defaultMaterial.clone();
    this.selectedMaterial.diffuseColor.setHex(0x226daa);
    this.selectedLineMaterial = new BasicMaterial(new Color().setHex(0x226daa), 1);

    this.ghostMaterial = Style.defaultMaterial.clone();
    this.ghostMaterial.diffuseColor = new Color(0, 0, 0);
    this.ghostMaterial.opacity = 0.15;

    this.ghostLineMaterial = new BasicMaterial(new Color(0, 0, 0), 0.35);
  }
}
