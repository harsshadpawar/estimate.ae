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

import './StructureTree.scss';

import {
  ApartmentOutlined,
  AppstoreOutlined,
  BorderOutlined,
  ExportOutlined,
  FileOutlined,
} from '@ant-design/icons';
import {
  Button,
  Tree as TreeView,
} from 'antd';
import {
  RCTreeDataNode,
  useRcTreeAdapter,
} from 'common/hooks/useRcTreeAdapter';
import {
  StructureManager,
  StructureManagerTreeNodeData,
} from 'shared/features/common/viewer/StructureManager';
import {
  useCallback,
  useState,
} from 'react';

import { AntdTreeNodeAttribute } from 'antd/es/tree';

function StructureTreeNodeIcon(nodeProps: AntdTreeNodeAttribute) {
  const props = nodeProps as AntdTreeNodeAttribute & {
    data: RCTreeDataNode<StructureManagerTreeNodeData>;
  };
  switch (props.data.treeNode.type) {
    case 'file': return <AppstoreOutlined />;
    case 'assembly': return <ApartmentOutlined />;
    case 'instance': return <ExportOutlined />;
    case 'part': return <FileOutlined />;
    case 'body': return <BorderOutlined />;
    default: return null;
  }
}

export interface StructureTreeProps<TreeNodeDataType extends StructureManagerTreeNodeData> {
  structure: StructureManager<TreeNodeDataType>;
}

export function StructureTree<TreeNodeDataType extends StructureManagerTreeNodeData>({ structure }: StructureTreeProps<TreeNodeDataType>) {
  const antTreeState = useRcTreeAdapter(structure);
  const [isExpanded, setIsExpanded] = useState(false);
  const onExpandedButtonClick = useCallback(() => {
    if (isExpanded) {
      setIsExpanded(false);
      structure.collapseAllNodes();
    } else {
      setIsExpanded(true);
      structure.expandAllNodes();
    }
  }, [structure, isExpanded]);
  return (
    <>
      <Button style={{ margin: '0 16px' }} onClick={onExpandedButtonClick}>{isExpanded ? 'Collapse all' : 'Expand all'}</Button>
      <TreeView.DirectoryTree
        ref={antTreeState.ref}
        className="structure-tree"
        showIcon
        blockNode
        icon={StructureTreeNodeIcon}
        checkable={true}
        checkedKeys={antTreeState.checkedKeys}
        checkStrictly={true}
        onCheck={antTreeState.onCheck}
        expandedKeys={antTreeState.expandedKeys}
        expandAction="doubleClick"
        onExpand={antTreeState.onExpand}
        selectable={true}
        multiple={false}
        selectedKeys={antTreeState.selectedKeys}
        onSelect={antTreeState.onSelect}
        treeData={antTreeState.treeData}
      />
    </>
  );
}
