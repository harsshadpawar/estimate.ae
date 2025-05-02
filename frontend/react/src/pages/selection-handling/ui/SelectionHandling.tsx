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

import './SelectionHandling.scss';

import { Flex, Select, notification } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { SelectionHandlingStructureManagerTreeNodeData } from '../viewer/SelectionHandlingStructureManager';
import { SelectionHandlingViewer } from '../viewer/SelectionHandlingViewer';
import { SelectionMode } from 'shared/features/common/viewer/SelectionMode';
import { TreeSelectionEvent } from 'shared/features/common/tree/TreeEvents';
import { UploadModel } from 'common/ui';
import { Viewport } from '../../../features/viewport/ui/Viewport';
import { pluralize } from 'shared/helpers/pluralize';
import { useModelLoader } from 'common/hooks';

const SelectionModeOptions = [SelectionMode[SelectionMode.Node], SelectionMode[SelectionMode.Face], SelectionMode[SelectionMode.Edge]].map((v) => ({ value: SelectionMode[v as keyof typeof SelectionMode], label: v }));

export function SelectionHandling() {
  const [viewer] = useState(new SelectionHandlingViewer());

  const {
    onMTKWEBFileSelected,
    onMTKWEBFolderSelected,
  } = useModelLoader(viewer);

  const [api, contextHolder] = notification.useNotification();

  const showMessage = useCallback((event: TreeSelectionEvent<SelectionHandlingStructureManagerTreeNodeData>) => {
    const quantity = event.nodes.length;
    const mode = SelectionMode[viewer.structureManager.selectionMode];
    const message = `Selected ${quantity} ${pluralize(quantity, mode, mode + 's', mode + 's')}`;
    let description = <></>;

    if (viewer.structureManager.selectionMode == SelectionMode.Node) {
      const pluralizedIdString = (
        <>
          {pluralize(quantity, 'ID', 'IDs', 'IDs')}
          :
          {' ' + event.nodes.map((aNode) => aNode.data().modelElement?.id).join(', ')}
        </>
      );
      description = (
        <>
          {pluralizedIdString}
          <br />
          Name:
          {' ' + event.nodes.map((aNode) => aNode.data().modelElement?.name).join(', ')}
        </>
      );
    }
    if (viewer.structureManager.selectionMode == SelectionMode.Face || viewer.structureManager.selectionMode == SelectionMode.Edge) {
      const pluralizedIdString = (
        <>
          {pluralize(quantity, 'ID', 'IDs', 'IDs')}
          :
          {' ' + event.shapes?.map((aShape) => aShape.id).join(', ')}
        </>
      );
      description = (
        <>
          {pluralizedIdString}
        </>
      );
    }

    api.open({ message, description });
  }, []);

  useEffect(() => {
    viewer.structureManager.addEventListener('selectedFromViewport', showMessage);
  }, [viewer]);

  return (
    <>
      {contextHolder}
      <Flex
        gap="small"
        style={{ position: 'fixed', zIndex: 1 }}
        vertical
      >
        <UploadModel onArchiveSelected={onMTKWEBFileSelected} onFolderSelected={onMTKWEBFolderSelected} />
        <div style={{
          padding: 16,
        }}
        >
          <Select
            defaultValue={SelectionModeOptions[0].value}
            options={SelectionModeOptions}
            placeholder="Choose selection mode"
            onSelect={(selectedValue) => { viewer.structureManager.selectionMode = selectedValue; }}
          />
        </div>
      </Flex>
      <Viewport
        viewportRef={viewer.viewport}
        onIntersect={(intersection) => viewer.structureManager.selectFromViewport(intersection)}
        isShowSpaceGrid={false}
      />
    </>
  );
}
