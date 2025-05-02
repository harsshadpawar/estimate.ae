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

import './PropertyTable.scss';

import {
  Assembly,
  Body,
  Instance,
  Part,
  PolyBody,
  SheetBody,
  SolidBody,
  WireframeBody,
} from '@mtk/web/model-data';
import { BasicMaterial, Color, PhongMaterial } from '@mtk/web/materials';
import {
  Descriptions,
  Empty,
} from 'antd';
import {
  FC,
  useEffect,
  useState,
} from 'react';
import {
  StructureManager,
  StructureManagerTreeNodeData,
} from 'shared/features/common/viewer/StructureManager';

import { DescriptionsItemType } from 'antd/es/descriptions';

function ColorProperty(props: { color: Color }) {
  return (
    <>
      {props.color.toString()}
      <span className="color-box" style={{ background: `#${props.color.hex().toString(16).padStart(6, '0')}` }}></span>
    </>
  );
}

type PropertyTableProps = {
  structureManager: StructureManager<StructureManagerTreeNodeData>;
};

export const PropertyTable: FC<PropertyTableProps> = ({ structureManager }) => {
  const [properties, setProperties] = useState(new Map<string, DescriptionsItemType[]>());

  useEffect(() => {
    const selectionChangeHandler = () => {
      const properties = new Map();
      for (const selectedNode of structureManager.getSelected()) {
        const nodeData = selectedNode.data() as StructureManagerTreeNodeData & { body?: Body };
        let elementType = 'Unknown';
        if (nodeData.modelElement instanceof Assembly) {
          elementType = 'Assembly';
        } else if (nodeData.modelElement instanceof Instance) {
          elementType = 'Instance';
        } else if (nodeData.modelElement instanceof Part) {
          elementType = 'Part';
        } else if (nodeData.body instanceof PolyBody) {
          elementType = 'Poly Body';
        } else if (nodeData.body instanceof WireframeBody) {
          elementType = 'Wireframe Body';
        } else if (nodeData.body instanceof SheetBody) {
          elementType = 'Sheet Body';
        } else if (nodeData.body instanceof SolidBody) {
          elementType = 'Solid Body';
        }
        properties.set('General', [
          {
            key: 'name',
            label: 'Name',
            children: selectedNode.text,
          },
          {
            key: 'type',
            label: 'Type',
            children: elementType,
          },
        ]);

        const elementMaterial = nodeData.modelElement?.material || nodeData.body?.material;
        if (elementMaterial) {
          const materialItems: DescriptionsItemType[] = [];
          if (elementMaterial instanceof PhongMaterial) {
            materialItems.push(
              {
                key: 'diffuseColor',
                label: 'Diffuse Color',
                children: <ColorProperty color={elementMaterial.diffuseColor} />,
              },
              {
                key: 'specularColor',
                label: 'Specular Color',
                children: <ColorProperty color={elementMaterial.specularColor} />,
              },
              {
                key: 'emissiveColor',
                label: 'Emissive Color',
                children: <ColorProperty color={elementMaterial.emissionColor} />,
              },
            );
          } else if (elementMaterial instanceof BasicMaterial) {
            materialItems.push(
              {
                key: 'color',
                label: 'Color',
                children: <ColorProperty color={elementMaterial.color} />,
              },
            );
          }
          materialItems.push(
            {
              key: 'opacity',
              label: 'Opacity',
              children: elementMaterial.opacity,
            },
          );

          properties.set('Material', materialItems);
        }

        if (nodeData.modelElement instanceof Instance && nodeData.modelElement.transformation) {
          const trsf = nodeData.modelElement.transformation;
          properties.set('Transformation', [
            {
              key: 'rotation',
              label: 'Rotation',
              children: trsf.rotation.toString().split('\n').map((value, key) => {
                return <div key={key}>{value}</div>;
              }),
            },
            {
              key: 'location',
              label: 'Location',
              children: `${trsf.translation}`,
            },
            {
              key: 'scale',
              label: 'Scale',
              children: `${trsf.scaleFactor}`,
            },
          ]);
        }
        break;
      }
      setProperties(properties);
    };
    structureManager.addEventListener('selectionChanged', selectionChangeHandler);

    return () => {
      structureManager.removeEventListener('selectionChanged', selectionChangeHandler);
    };
  }, [
    structureManager,
    setProperties,
  ]);

  if (properties.size > 0) {
    return Array.from(properties).map(([key, values]) => (
      <Descriptions
        key={key}
        bordered
        size="small"
        column={1}
        title={key}
        items={values}
      />
    ),

    );
  } else {
    return <Empty key="empty" description="Select model element" />;
  }
};
