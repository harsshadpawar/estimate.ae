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
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Intersection, Object3D, Vector2 } from 'three';

import { useThree } from '@react-three/fiber';

interface RaycastSelectorProps {
  onIntersect: (
    intersection: Intersection<Object3D>[] | null,
    isMultipleSelectionModifiersUsed?: boolean
  ) => void;
}

export const RaycastSelector: FC<RaycastSelectorProps> = ({ onIntersect: onSelect }) => {
  const { camera, gl, pointer, raycaster, scene } = useThree();
  const isDragging = useRef(false);
  const isMultipleSelectionModifiersUsed = useRef(false);
  const [multipleSelectionModifiers] = useState<string[]>(['ControlRight', 'ControlLeft']);
  const startPointerPosition = useRef<Vector2 | null>(null);

  const handlePointerDown = useCallback((event: PointerEvent) => {
    isDragging.current = false;
    startPointerPosition.current = new Vector2(event.clientX, event.clientY);
  }, []);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (startPointerPosition.current) {
      const currentPointerPosition = new Vector2(event.clientX, event.clientY);
      if (currentPointerPosition.distanceTo(startPointerPosition.current) > 5) {
        isDragging.current = true;
      }
    }
  }, []);

  const handleKeyboardEvent = useCallback((event: KeyboardEvent) => {
    const type = event.type;
    if ((type === 'keydown' || type === 'keyup') && multipleSelectionModifiers.includes(event.code)) {
      isMultipleSelectionModifiersUsed.current = event.type === 'keydown'
        ? true
        : false;
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) {
      raycaster.setFromCamera(pointer, camera);
      raycaster.params.Line.threshold = 0.25;
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        onSelect(intersects, isMultipleSelectionModifiersUsed.current);
      } else {
        onSelect(null, isMultipleSelectionModifiersUsed.current);
      }
    }
    startPointerPosition.current = null;
  }, [camera, scene, pointer, raycaster, onSelect]);

  useEffect(() => {
    const domElement = gl.domElement;
    domElement.addEventListener('pointerdown', handlePointerDown);
    domElement.addEventListener('pointermove', handlePointerMove);
    domElement.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('keydown', handleKeyboardEvent);
    document.addEventListener('keyup', handleKeyboardEvent);

    return () => {
      domElement.removeEventListener('pointerdown', handlePointerDown);
      domElement.removeEventListener('pointermove', handlePointerMove);
      domElement.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('keydown', handleKeyboardEvent);
      document.removeEventListener('keyup', handleKeyboardEvent);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp, gl.domElement]);

  return null;
};
