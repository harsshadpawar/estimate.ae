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

import { Tree } from './Tree';

export interface TreeNodeVisitor<TreeNodeDataType> {
  visitEnter(node: TreeNode<TreeNodeDataType>): boolean;
  visitLeave?(node: TreeNode<TreeNodeDataType>): void;
}

export class TreeNode<TreeNodeDataType> {
  private static Id = 0;

  id: string | number | bigint = `node-${++TreeNode.Id}`;

  protected _tree: Tree<TreeNodeDataType> | null = null;
  protected _parent: TreeNode<TreeNodeDataType> | null = null;
  protected _children: TreeNode<TreeNodeDataType>[] = [];
  protected _level: number = 0;

  constructor(
    public text: string,
    public type: string,
    protected _data: TreeNodeDataType) {
  }

  get tree(): Tree<TreeNodeDataType> | null {
    return this._tree || this._parent?.tree || null;
  }

  get parent() {
    return this._parent;
  }

  get children(): readonly TreeNode<TreeNodeDataType>[] {
    return this._children;
  }

  get level() {
    return this._level;
  }

  data<DataType extends TreeNodeDataType = TreeNodeDataType>() {
    return this._data as DataType;
  }

  accept(visitor: TreeNodeVisitor<TreeNodeDataType>) {
    if (visitor.visitEnter(this)) {
      this._children.forEach((c) => c.accept(visitor));
    }
    if (visitor.visitLeave) {
      visitor.visitLeave(this);
    }
  }

  *[Symbol.iterator](): IterableIterator<TreeNode<TreeNodeDataType>> {
    yield this;
    for (const child of this._children) {
      yield * child[Symbol.iterator]();
    }
  }

  makeRoot(tree: Tree<TreeNodeDataType>) {
    if (this._tree === tree) {
      return false;
    }
    this.removeFromParent();
    this._tree = tree;
    this._parent = null;
    this.setLevel(0);
    tree.addRoot(this);
    return true;
  }

  addNode(node: TreeNode<TreeNodeDataType>, index?: number) {
    if (node._parent === this) {
      return false;
    }
    if (node._parent) {
      node._parent._children.splice(node._parent._children.indexOf(node), 1);
    }
    node._parent = this;
    node.setLevel(this._level + 1);
    if (index === undefined) {
      index = this._children.length;
      this._children.push(node);
    } else {
      this._children.splice(index, 0, node);
    }
    this.tree?._onNodeAdded(this, node, index);
    return true;
  }

  removeNode(node: TreeNode<TreeNodeDataType>) {
    const index = this._children.indexOf(node);
    if (index === -1) {
      return false;
    }
    this._children.splice(index, 1);
    node._parent = null;
    node.setLevel(0);
    this.tree?._onNodeRemoved(this, node, index);
    return true;
  }

  removeFromParent() {
    if (this._parent) {
      this._parent.removeNode(this);
    } else if (this._tree) {
      const tree = this._tree;
      this._tree = null;
      tree.removeRoot(this);
    }
  }

  protected setLevel(level: number) {
    this._level = level;
    this._children.forEach((child) => child.setLevel(level + 1));
  }
}
