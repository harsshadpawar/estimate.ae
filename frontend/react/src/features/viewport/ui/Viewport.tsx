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
  Euler,
  Intersection,
  Object3D,
  Vector3,
} from 'three';
import { useEffect, useState } from 'react';

import { Canvas } from '@react-three/fiber';
import { CustomGizmoHelper } from '../../gizmo-helper';
import { RaycastSelector } from '../../../common/viewer';
import { SpaceGrid } from '../../space-grid';
import { ViewportInitializer } from './ViewportInitializer';
import { Viewport as ViewportRef } from 'shared/features/common/viewer/Viewport';

interface SpaceGridProps {
  position: Vector3;
  fadeDistance: number;
}

interface ViewportProps {
  viewportRef: ViewportRef;
  onIntersect?: (
    intersection: Intersection<Object3D>[] | null,
    isMultipleSelectionModifiersUsed?: boolean
  ) => void;
  isShowSpaceGrid?: boolean;
}

export const Viewport = (props: ViewportProps) => {
  const spaceGridRotation = new Euler(Math.PI / 2, 0, 0);
  const [spaceGridProps, setSpaceGridProps] = useState<SpaceGridProps>({ position: new Vector3(), fadeDistance: 100 });

  const onSceneBboxChanged = () => {
    const bbox = props.viewportRef.rootsBox;
    if (bbox.isEmpty()) {
      return;
    }
    setSpaceGridProps(
      {
        position: new Vector3((bbox.max.x + bbox.min.x) / 2, (bbox.max.y + bbox.min.y) / 2, 0),
        fadeDistance: Math.max(bbox.max.x - bbox.min.x, bbox.max.y - bbox.min.y) * 3,
      },
    );
  };

  useEffect(() => {
    props.viewportRef.addEventListener('sceneBboxChanged', onSceneBboxChanged);
  }, [props.viewportRef]);

  return (
    <Canvas gl={{ preserveDrawingBuffer: true }} orthographic frameloop="demand">
      <color attach="background" args={['aliceblue']} />
      <ViewportInitializer viewport={props.viewportRef} />
      {props.isShowSpaceGrid && (
        <SpaceGrid position={spaceGridProps.position} rotation={spaceGridRotation} fadeDistance={spaceGridProps.fadeDistance} />
      )}
      <CustomGizmoHelper />
      {props.onIntersect && (
        <RaycastSelector onIntersect={props.onIntersect} />
      )}
    </Canvas>
  );
};
