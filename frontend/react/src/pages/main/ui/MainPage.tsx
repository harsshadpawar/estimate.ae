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

import './MainPage.scss';

import { FC } from 'react';
import { Link } from 'react-router-dom';
import { PageCard } from './PageCard';
import basic3dviewer from 'assets/images/pages/basic3dviewer.png';
import measurements from 'assets/images/pages/measurements.png';
import modelexplorer from 'assets/images/pages/modelexplorer.png';
import mtkexplorer from 'assets/images/pages/mtkexplorer.png';
import selection from 'assets/images/pages/selection.png';
import treeview from 'assets/images/pages/treeview.png';

export const MainPage: FC = () => (
  <section className="main-page">
    <Link to="/base-viewer"><PageCard title="Base viewer" img={basic3dviewer} /></Link>
    <Link to="/product-structure"><PageCard title="Product structure" img={treeview} /></Link>
    <Link to="/model-explorer"><PageCard title="Model explorer" img={modelexplorer} /></Link>
    <Link to="/selection-handling"><PageCard title="Selection handling" img={selection} /></Link>
    <Link to="/measurements"><PageCard title="Measurements" img={measurements} /></Link>
    <Link to="/mtk-explorer"><PageCard title="MTK explorer" img={mtkexplorer} /></Link>
  </section>
);
