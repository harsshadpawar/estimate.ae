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
  FieldDataNode,
  Key as RcTreeNodeKey,
} from 'rc-tree/lib/interface';
import {
  TreeChangedEvent,
  TreeNodeChangedEvent,
} from 'shared/features/common/tree/TreeEvents';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { TreeProps as TcTreeProps } from 'rc-tree/lib/Tree';
import { Tree } from 'shared/features/common/tree/Tree';
import { TreeNode } from 'shared/features/common/tree/TreeNode';
import {
  type GetRef,
  Tree as TreeView,
} from 'antd';

export type RCTreeDataNode<TreeNodeDataType> = FieldDataNode<{
  key: RcTreeNodeKey;
  treeNode: TreeNode<TreeNodeDataType>;
  title: React.ReactNode;
}>;

export function useRcTreeAdapter<TreeNodeDataType>(tree: Tree<TreeNodeDataType> | undefined) {
  const [checkedKeys, setCheckedKeys] = useState(() => ({ checked: [] as RcTreeNodeKey[], halfChecked: [] as RcTreeNodeKey[] }));
  const [expandedKeys, setExpandedKeys] = useState<RcTreeNodeKey[]>(() => []);
  const [selectedKeys, setSelectedKeys] = useState<RcTreeNodeKey[]>(() => []);
  const [rcTreeData, setRcTreeData] = useState<RCTreeDataNode<TreeNodeDataType>[]>(() => []);
  const treeRef = useRef<GetRef<typeof TreeView> | null>(null);

  const [flatTreeNodes] = useState<TreeNode<TreeNodeDataType>[]>([]);

  useEffect(() => {
    if (!tree) {
      return;
    }
    const regenerateRcTreeData = () => {
      flatTreeNodes.length = 0;
      const convertTreeNode = (node: TreeNode<TreeNodeDataType>) => {
        node.id = flatTreeNodes.length;
        flatTreeNodes.push(node);
        const rcTreeNode: RCTreeDataNode<TreeNodeDataType> = {
          key: node.id,
          title: node.text,
          treeNode: node,
          children: node.children.map(convertTreeNode),
          isLeaf: node.children.length === 0,
        };
        return rcTreeNode;
      };
      const newRcTreeData = tree.rootsNodes.map((root) => {
        return convertTreeNode(root);
      });
      setRcTreeData(newRcTreeData);
    };
    const onNodeInserted = (_event: TreeNodeChangedEvent<TreeNodeDataType>) => {
      regenerateRcTreeData();
    };
    const onNodeRemoved = (_event: TreeNodeChangedEvent<TreeNodeDataType>) => {
      regenerateRcTreeData();
    };
    const onExpansionChanged = (_event: TreeChangedEvent<TreeNodeDataType>) => {
      const expandedKeys = [];
      for (const expandedNode of tree.getExpanded()) {
        expandedKeys.push(expandedNode.id);
      }
      setExpandedKeys(expandedKeys);
    };
    const onSelectionChanged = (_event: TreeChangedEvent<TreeNodeDataType>) => {
      const selectedKeys = [];
      for (const selectedNode of tree.getSelected()) {
        selectedKeys.push(selectedNode.id);
      }
      setSelectedKeys(selectedKeys);
    };
    const onVisibilityChanged = (_event: TreeChangedEvent<TreeNodeDataType>) => {
      const checkedKeys = flatTreeNodes.reduce((r, node) => {
        if (tree.isNodeVisible(node)) {
          r.checked.push(node.id);
        } else if (tree.isNodePartlyVisible(node)) {
          r.halfChecked.push(node.id);
        }
        return r;
      }, {
        checked: [] as RcTreeNodeKey[],
        halfChecked: [] as RcTreeNodeKey[],
      });
      setCheckedKeys(checkedKeys);
    };

    tree.addEventListener('inserted', onNodeInserted);
    tree.addEventListener('removed', onNodeRemoved);
    tree.addEventListener('expansionChanged', onExpansionChanged);
    tree.addEventListener('selectionChanged', onSelectionChanged);
    tree.addEventListener('visibilityChanged', onVisibilityChanged);

    if (tree.rootsNodes.length > 0) {
      regenerateRcTreeData();
      onExpansionChanged(new TreeChangedEvent('expansionChanged', []));
    }

    return () => {
      tree.removeEventListener('inserted', onNodeInserted);
      tree.removeEventListener('removed', onNodeRemoved);
      tree.removeEventListener('expansionChanged', onExpansionChanged);
      tree.removeEventListener('selectionChanged', onSelectionChanged);
      tree.removeEventListener('visibilityChanged', onVisibilityChanged);
    };
  }, [tree]);

  useEffect(() => {
    setTimeout(() => {
      const selected = document.querySelector('.ant-tree-node-selected');
      selected?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // const lastSelected = selectedKeys.at(-1);
      // if(lastSelected) {
      //   console.log(selectedKeys, expandedKeys, lastSelected)
      //   console.log(treeRef)
      //   treeRef.current?.listRef.current?.scrollTo({ key: lastSelected, align: "auto" });
      // }
    }, 100);
  }, [selectedKeys]);

  const onCheck: NonNullable<TcTreeProps['onCheck']> = useCallback((_checkedKeys, info) => {
    const node = flatTreeNodes[info.node.key as number];
    if (!node || !tree) {
      return;
    }
    if (info.checked) {
      tree.showNode(node);
    } else {
      tree.hideNode(node);
    }
  }, [tree]);

  const onExpand: NonNullable<TcTreeProps['onExpand']> = useCallback((_expandedKeys, info) => {
    const node = flatTreeNodes[info.node.key as number];
    if (!node || !tree) {
      return;
    }
    if (info.expanded) {
      tree.expandNode(node);
    } else {
      tree.collapseNode(node);
    }
  }, [tree]);

  const onSelect: NonNullable<TcTreeProps['onSelect']> = useCallback((_selectedKeys, info) => {
    const node = flatTreeNodes[info.node.key as number];
    if (!node || !tree) {
      return;
    }
    if (info.selected) {
      if (info.nativeEvent.ctrlKey) {
        tree.toggleNodeSelection(node);
      } else {
        tree.selectNode(node, true);
      }
    } else {
      tree.deselectNode(node);
    }
  }, [tree]);

  const changeTreeData = (treeData: RCTreeDataNode<TreeNodeDataType>[]) => {
    setRcTreeData(treeData);
  };

  return {
    checkedKeys,
    onCheck,
    expandedKeys,
    onExpand,
    selectedKeys,
    onSelect,
    treeData: rcTreeData,
    ref: treeRef,
    changeTreeData,
  };
}
