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

import './FeaturesTreeView.scss';

import {
  Button,
  Flex,
  Select,
  Tree as TreeView,
} from 'antd';
import {
  ProductFeaturesStructureManager,
  ProductFeaturesTreeNodeData,
} from '../viewer/ProductFeaturesStructureManager';
import {
  RCTreeDataNode,
  useRcTreeAdapter,
} from 'common/hooks/useRcTreeAdapter';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { AntdTreeNodeAttribute } from 'antd/es/tree';
import { BorderOutlined } from '@ant-design/icons';
import { DefaultOptionType } from 'antd/es/select';
import { TreeNode } from 'shared/features/common/tree/TreeNode';

interface FeaturesTreeViewProps {
  structure: ProductFeaturesStructureManager;
  onFeatureTypeChanged: (name?: string) => void;
}

export function FeaturesTreeView({ structure, onFeatureTypeChanged }: FeaturesTreeViewProps) {
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

  const [selectOptions, setSelectOptions] = useState<DefaultOptionType[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<string>('All Features');
  function getSelectOptions(): DefaultOptionType[] {
    const featureTypes: DefaultOptionType[] = [{ label: 'All Features', value: 'All Features' }];
    const featureGroups = structure.rootsNodes.length > 0 ? structure.rootsNodes[0].children : [];
    for (const group of featureGroups) {
      featureTypes.push({ label: group.text, value: group.text });
    }
    return featureTypes;
  }

  useEffect(() => {
    structure.deselectAllNodes();
    setSelectOptions(getSelectOptions());
    setSelectedFeature('All Features');
  }, [structure]);

  function onSelectOptionsChanged(value: string) {
    setSelectedFeature(value);
    onFeatureTypeChanged(value === selectOptions[0].label ? undefined : value);
    const getFilteredChild = (node: TreeNode<ProductFeaturesTreeNodeData>, filter: string) => {
      for (const child of node.children) {
        if (child.text === filter) {
          return child;
        }
      }
      return null;
    };
    const convertTreeNode = (node: TreeNode<ProductFeaturesTreeNodeData>) => {
      const filteredChild = getFilteredChild(node, value);
      const rcTreeNode: RCTreeDataNode<ProductFeaturesTreeNodeData> = {
        key: node.id,
        title: node.text,
        treeNode: node,
        children: filteredChild ? [convertTreeNode(filteredChild)] : node.children.map(convertTreeNode),
        isLeaf: node.children.length === 0,
      };
      return rcTreeNode;
    };
    const newRcTreeData = structure.rootsNodes.map((root) => {
      return convertTreeNode(root);
    });
    antTreeState.changeTreeData(newRcTreeData);
  }

  function StructureTreeNodeIcon(nodeProps: AntdTreeNodeAttribute) {
    const props = nodeProps as AntdTreeNodeAttribute & {
      data: RCTreeDataNode<ProductFeaturesTreeNodeData>;
    };
    switch (props.data.treeNode.type) {
      case 'feature': return <BorderOutlined />;
      default: return null;
    }
  }

  const titleRender = (nodeData: RCTreeDataNode<ProductFeaturesTreeNodeData>) => {
    const color = nodeData.treeNode.data().color;
    return nodeData.treeNode.type === 'group' && color && !(color.r === 0 && color.g === 0 && color.b === 0)
      ? (
        <span className="feature-node-title">
          <span className="text">{nodeData.title}</span>
          <span
            className="color-mark"
            style={{ backgroundColor: `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})` }}
          />
        </span>
        )
      : (
        <span>{nodeData.title}</span>
        );
  };

  return (
    <Flex
      className="features-tree-container"
      gap="small"
      vertical
    >
      {(selectOptions.length > 2) && (
        <Select
          defaultValue={selectedFeature}
          value={selectedFeature}
          onChange={onSelectOptionsChanged}
          options={selectOptions}
        />
      )}
      <Button onClick={onExpandedButtonClick}>{isExpanded ? 'Collapse all' : 'Expand all'}</Button>
      <TreeView.DirectoryTree
        ref={antTreeState.ref}
        className="features-tree"
        showIcon={true}
        blockNode={true}
        icon={StructureTreeNodeIcon}
        expandedKeys={antTreeState.expandedKeys}
        expandAction="doubleClick"
        onExpand={antTreeState.onExpand}
        selectable={true}
        multiple={true}
        selectedKeys={antTreeState.selectedKeys}
        onSelect={antTreeState.onSelect}
        treeData={antTreeState.treeData}
        titleRender={titleRender}
      />
    </Flex>
  );
}
