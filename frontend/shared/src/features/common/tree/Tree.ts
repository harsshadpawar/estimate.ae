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
  Intersection,
  Object3D,
} from 'three';
import {
  TreeChangedEvent,
  TreeNodeChangedEvent,
  TreeSelectionEvent,
} from './TreeEvents';
import {
  TreeNodeVisibility,
  TreeNodeVisibilityState,
} from './TreeNodeVisibility';

import { TreeNode } from './TreeNode';

interface TreeEventMap<TreeNodeDataType> {
  inserted: TreeNodeChangedEvent<TreeNodeDataType>;
  removed: TreeNodeChangedEvent<TreeNodeDataType>;
  expansionChanged: TreeChangedEvent<TreeNodeDataType>;
  selectionChanged: TreeChangedEvent<TreeNodeDataType>;
  breakSelection: TreeSelectionEvent<TreeNodeDataType>;
  selectedFromViewport: TreeSelectionEvent<TreeNodeDataType>;
  visibilityChanged: TreeChangedEvent<TreeNodeDataType>;
}

export interface Tree<TreeNodeDataType> {
  addEventListener<K extends keyof TreeEventMap<TreeNodeDataType>>(event: K, listener: ((this: Tree<TreeNodeDataType>, ev: TreeEventMap<TreeNodeDataType>[K]) => unknown) | null, options?: AddEventListenerOptions | boolean): void;
  addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void;
  removeEventListener<K extends keyof TreeEventMap<TreeNodeDataType>>(event: K, listener: ((this: Tree<TreeNodeDataType>, ev: TreeEventMap<TreeNodeDataType>[K]) => unknown) | null, options?: AddEventListenerOptions | boolean): void;
  removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class Tree<TreeNodeDataType> extends EventTarget {
  protected _roots: TreeNode<TreeNodeDataType>[] = [];
  protected _selectedNodes = new Set<TreeNode<TreeNodeDataType>>();
  protected _expandedNodes = new Set<TreeNode<TreeNodeDataType>>();
  protected _ghostedNodes = new Set<TreeNode<TreeNodeDataType>>();
  protected _highlightedNodes = new Set<TreeNode<TreeNodeDataType>>();
  protected _nodesVisibilityStates = new Map<TreeNode<TreeNodeDataType>, TreeNodeVisibilityState>();

  get rootsNodes(): readonly TreeNode<TreeNodeDataType>[] {
    return this._roots;
  }

  isNodeVisible(node: TreeNode<TreeNodeDataType>) {
    return this.actualNodeVisibility(node) === TreeNodeVisibility.Visible;
  }

  isNodePartlyVisible(node: TreeNode<TreeNodeDataType>) {
    return this.actualNodeVisibility(node) === TreeNodeVisibility.PartlyVisible;
  }

  isNodeHidden(node: TreeNode<TreeNodeDataType>) {
    return this.actualNodeVisibility(node) === TreeNodeVisibility.Hidden;
  }

  isNodeExpandable(node: TreeNode<TreeNodeDataType>) {
    return node.children.length > 0;
  }

  isNodeExpanded(node: TreeNode<TreeNodeDataType>) {
    return this._expandedNodes.has(node);
  }

  isNodeSelected(node: TreeNode<TreeNodeDataType>) {
    return this._selectedNodes.has(node);
  }

  /**
   * Gets an iterable to all expanded nodes.
   */
  getExpanded(): Iterable<TreeNode<TreeNodeDataType>> {
    return this._expandedNodes;
  }

  get numberOfSelected() {
    return this._selectedNodes.size;
  }

  /**
   * Gets an iterable to all selected nodes.
   */
  getSelected() {
    return this._selectedNodes[Symbol.iterator]();
  }

  clear() {
    const roots = this._roots.slice();
    this._roots.length = 0;
    roots.forEach((root) => root.removeFromParent());
    this._selectedNodes.clear();
    this._expandedNodes.clear();
    this._nodesVisibilityStates.clear();
    this.dispatchEvent(new Event('cleared'));
  }

  addRoot(node: TreeNode<TreeNodeDataType>, index?: number) {
    if (this._roots.includes(node)) {
      return false;
    }
    if (index === undefined) {
      index = this.rootsNodes.length;
      this._roots.push(node);
    } else {
      this._roots.splice(index, 0, node);
    }
    node.makeRoot(this);
    for (const childNode of node) {
      this._nodesVisibilityStates.set(childNode, new TreeNodeVisibilityState());
    }
    this.dispatchEvent(new TreeNodeChangedEvent('inserted', node, null, index));
    return true;
  }

  removeRoot(node: TreeNode<TreeNodeDataType>) {
    const index = this._roots.indexOf(node);
    if (index === -1) {
      return false;
    }
    this._roots.splice(index, 1);
    for (const childNode of node) {
      this._nodesVisibilityStates.delete(childNode);
      this._expandedNodes.delete(childNode);
      this._selectedNodes.delete(childNode);
    }
    node.removeFromParent();
    this.dispatchEvent(new TreeNodeChangedEvent('removed', node, null, index));
    return true;
  }

  _onNodeAdded(parent: TreeNode<TreeNodeDataType>, node: TreeNode<TreeNodeDataType>, index: number) {
    for (const childNode of node) {
      this._nodesVisibilityStates.set(childNode, new TreeNodeVisibilityState());
    }
    this.dispatchEvent(new TreeNodeChangedEvent('inserted', node, parent, index));
  }

  _onNodeRemoved(parent: TreeNode<TreeNodeDataType>, node: TreeNode<TreeNodeDataType>, index: number) {
    for (const childNode of node) {
      this._nodesVisibilityStates.delete(childNode);
      this._expandedNodes.delete(childNode);
      this._selectedNodes.delete(childNode);
    }
    this.dispatchEvent(new TreeNodeChangedEvent('removed', node, parent, index));
  }

  /**
   * Expands every parent of the node.
   */
  expandToNode(node: TreeNode<TreeNodeDataType>) {
    let parent = node.parent;
    const expandedNodes = [];
    while (parent) {
      if (!this._expandedNodes.has(parent)) {
        expandedNodes.push(parent);
      }
      this._expandedNodes.add(parent);
      parent = parent.parent;
    }
    if (expandedNodes.length > 0) {
      this.dispatchEvent(new TreeChangedEvent('expansionChanged', expandedNodes));
    }
  }

  /**
   * Expands the node, revealing its children.
   */
  expandNode(node: TreeNode<TreeNodeDataType>) {
    if (!this._expandedNodes.has(node)) {
      this._expandedNodes.add(node);
      this.dispatchEvent(new TreeChangedEvent('expansionChanged', [node]));
    }
  }

  /**
   * Collapses the node, hiding its children.
   */
  collapseNode(node: TreeNode<TreeNodeDataType>) {
    if (this._expandedNodes.has(node)) {
      this._expandedNodes.delete(node);
      this.dispatchEvent(new TreeChangedEvent('expansionChanged', [node]));
    }
  }

  /**
   * Expands the node if it's not expanded, collapse overwise.
   *
   * @param node The node to toggle.
   */
  toggleNodeExpansion(node: TreeNode<TreeNodeDataType>) {
    if (this._expandedNodes.has(node)) {
      this._expandedNodes.delete(node);
    } else {
      this._expandedNodes.add(node);
    }
    this.dispatchEvent(new TreeChangedEvent('expansionChanged', [node]));
  }

  /**
   * Expands all nodes within the tree, revealing their children.
   */
  expandAllNodes() {
    const expandedNodes = [];
    for (const root of this._roots) {
      if (this.isNodeExpandable(root) && !this._expandedNodes.has(root)) {
        this._expandedNodes.add(root);
        expandedNodes.push(root);
      }
      for (const node of root) {
        if (this.isNodeExpandable(node) && !this._expandedNodes.has(node)) {
          this._expandedNodes.add(node);
          expandedNodes.push(node);
        }
      }
    }
    if (expandedNodes.length > 0) {
      this.dispatchEvent(new TreeChangedEvent('expansionChanged', expandedNodes));
    }
  }

  /**
   * Collapses all nodes within the tree, revealing their children.
   */
  collapseAllNodes() {
    const collapsedNodes = [...this._expandedNodes];
    this._expandedNodes.clear();
    this.dispatchEvent(new TreeChangedEvent('expansionChanged', collapsedNodes));
  }

  /**
   * Selects the node.
   */
  selectNode(node: TreeNode<TreeNodeDataType>, breakSelection: boolean, originalIntersection?: Intersection<Object3D>) {
    const changedNodes = [];
    if (breakSelection) {
      changedNodes.push(...this._selectedNodes);
      this.dispatchEvent(new TreeSelectionEvent('breakSelection', changedNodes));
      this._selectedNodes.clear();
    }
    if (!this._selectedNodes.has(node)) {
      this._selectedNodes.add(node);
      changedNodes.push(node);
    }
    if (changedNodes.length > 0) {
      this.dispatchEvent(new TreeSelectionEvent('selectionChanged', [node], originalIntersection));
    }
  }

  /**
   * Deselects the node.
   */
  deselectNode(node: TreeNode<TreeNodeDataType>) {
    if (this._selectedNodes.has(node)) {
      this._selectedNodes.delete(node);
      this.dispatchEvent(new TreeChangedEvent('selectionChanged', [node]));
    }
  }

  /**
   * Deselects all nodes.
   */
  deselectAllNodes() {
    const changedNodes = [...this._selectedNodes];
    this._selectedNodes.clear();
    this.dispatchEvent(new TreeChangedEvent('selectionChanged', changedNodes));
  }

  /**
   * Selects the node if it's not selected, deselect overwise.
   */
  toggleNodeSelection(node: TreeNode<TreeNodeDataType>) {
    if (this._selectedNodes.has(node)) {
      this.deselectNode(node);
    } else {
      this.selectNode(node, false);
    }
  }

  showNode(node: TreeNode<TreeNodeDataType>) {
    const visibilityState = this._nodesVisibilityStates.get(node);
    if (!visibilityState) {
      return;
    }
    // If the node is already shown, skit it.
    const nodeVisibility = this.actualNodeVisibility(node);
    if (nodeVisibility === TreeNodeVisibility.Visible) {
      return;
    }
    this.setNodeVisibility(node, TreeNodeVisibility.Visible);
  }

  hideNode(node: TreeNode<TreeNodeDataType>) {
    const visibilityState = this._nodesVisibilityStates.get(node);
    if (!visibilityState) {
      return;
    }
    // If the node is already hidden, skit it.
    const nodeVisibility = this.actualNodeVisibility(node);
    if (nodeVisibility === TreeNodeVisibility.Hidden) {
      return;
    }
    this.setNodeVisibility(node, TreeNodeVisibility.Hidden);
  }

  toggleNodeVisibility(node: TreeNode<TreeNodeDataType>) {
    const visibilityState = this._nodesVisibilityStates.get(node);
    if (!visibilityState) {
      return;
    }
    // If the node is already loading, skit it.
    const nodeVisibility = this.actualNodeVisibility(node);

    // If the node hidden, show it. Hide node otherwise.
    if (nodeVisibility === TreeNodeVisibility.Hidden) {
      this.showNode(node);
    } else {
      this.hideNode(node);
    }
  }

  showAllNodes() {
    // Update roots visibility
    this._roots.forEach((node) => this.actualNodeVisibility(node));
    // Make them visible (if needed)
    const shownNodes: TreeNode<TreeNodeDataType>[] = [];
    this._roots.forEach((root) => {
      this.applyNodeVisibilityToNode(root, TreeNodeVisibility.Visible, shownNodes);
    });
    if (shownNodes.length > 0) {
      this.dispatchEvent(new TreeChangedEvent('visibilityChanged', shownNodes));
    }
  }

  hideAllNodes() {
    // Update roots visibility
    this._roots.forEach((root) => this.actualNodeVisibility(root));
    // All children nodes already has actual visibility state, so just hide them (if needed)
    const hiddenNodes: TreeNode<TreeNodeDataType>[] = [];
    this._roots.forEach((node) => {
      this.applyNodeVisibilityToNode(node, TreeNodeVisibility.Hidden, hiddenNodes);
    });
    if (hiddenNodes.length > 0) {
      this.dispatchEvent(new TreeChangedEvent('visibilityChanged', hiddenNodes));
    }
  }

  find(criteria: (node: TreeNode<TreeNodeDataType>) => boolean) {
    const matches = [];
    for (const node of this._roots) {
      if (criteria(node)) {
        matches.push(node);
      }
    }
    return matches;
  }

  protected actualNodeVisibility(node: TreeNode<TreeNodeDataType>): TreeNodeVisibility {
    const visibilityState = this._nodesVisibilityStates.get(node);
    if (!visibilityState) {
      return TreeNodeVisibility.Hidden;
    }
    let visibility = visibilityState.value();
    if (visibility === undefined) {
      let hasVisibleNodes = false;
      let hasHiddenNodes = false;
      for (const childNode of node.children) {
        const childVisibility = this.actualNodeVisibility(childNode);
        if (childVisibility === TreeNodeVisibility.PartlyVisible) {
          hasHiddenNodes = true;
          hasVisibleNodes = true;
          // If a child node is partly visible, the parent node is also partly visible
          break;
        } else if (childVisibility === TreeNodeVisibility.Visible) {
          hasVisibleNodes = true;
        } else {
          hasHiddenNodes = true;
        }
      }
      visibility = TreeNodeVisibility.Hidden;
      if (hasVisibleNodes) {
        visibility = hasHiddenNodes ? TreeNodeVisibility.PartlyVisible : TreeNodeVisibility.Visible;
      }
      visibilityState.setActualValue(visibility);
    }
    return visibility;
  }

  protected setNodeVisibility(node: TreeNode<TreeNodeDataType>, visibility: TreeNodeVisibility.Visible | TreeNodeVisibility.Hidden) {
    const changedNodes: TreeNode<TreeNodeDataType>[] = [node];
    this.applyNodeVisibilityToNode(node, visibility, changedNodes);
    if (changedNodes.length === 0) {
      return;
    }

    this.invalidateParentNodesVisibility(node, changedNodes);

    this.dispatchEvent(new TreeChangedEvent('visibilityChanged', changedNodes));
  }

  private applyNodeVisibilityToNode(
    node: TreeNode<TreeNodeDataType>,
    visibility: TreeNodeVisibility.Visible | TreeNodeVisibility.Hidden,
    changedNodes: TreeNode<TreeNodeDataType>[],
  ) {
    const childVisibilityState = this._nodesVisibilityStates.get(node)!;
    if (childVisibilityState.value() === visibility) {
      return;
    }
    childVisibilityState.setActualValue(visibility);
    changedNodes.push(node);

    node.children.forEach((childNode) => {
      this.applyNodeVisibilityToNode(childNode, visibility, changedNodes);
    });
  }

  private invalidateParentNodesVisibility(node: TreeNode<TreeNodeDataType>, changedNodes: TreeNode<TreeNodeDataType>[]) {
    let parent = node.parent;
    while (parent) {
      this._nodesVisibilityStates.get(parent)?.invalidate();
      changedNodes.push(parent);
      parent = parent.parent;
    }
  }
}
