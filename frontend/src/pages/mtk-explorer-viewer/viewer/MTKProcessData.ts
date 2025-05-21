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

import { BasePartProcessData } from './base/BasePartProcessData';
import { Color } from '@mtk/web/materials';
import { Direction } from '@mtk/web/geom';

export interface MTKProcessData {
  version: number;
  parts?: BasePartProcessData[];
  error?: string;
}

export function customObjectJSONReviver(key: unknown, value: unknown) {
  const getNumberArray = (value: string) => {
    const numberArray = value.slice(1, -1).split(', ').map(Number);
    return numberArray;
  };

  const getCorrectNumber = (value: number) => {
    if (Math.abs(0 - value) < 1e-7) {
      return 0;
    }
    return value;
  };
  const axisRegex = /^\(-?\d+(\.\d+)?,\s-?\d+(\.\d+)?,\s-?\d+(\.\d+)?\)$/;
  // const size2dRegex = /^\d+(\.\d+)?\sx\s\d+(\.\d+)?$/;
  if (key === 'color' && typeof value === 'string') {
    const colorValues = getNumberArray(value);
    const color = colorValues.length === 3
      ? new Color (colorValues[0] / 255, colorValues[1] / 255, colorValues[2] / 255)
      : new Color();
    return color;
  } else if (key === 'value' && typeof value === 'string' && value.match(axisRegex)) {
    const directionValues = getNumberArray(value);
    const direction = directionValues.length === 3
      ? new Direction(getCorrectNumber(directionValues[0]), getCorrectNumber(directionValues[1]), getCorrectNumber(directionValues[2]))
      : new Direction();
    return direction;
  } else if (key === 'id' && (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint')) {
    return BigInt(value);
  } else {
    return value;
  }
}
