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

import './Measurements.scss';

import { Button, Flex, Select, Tooltip, Typography, notification } from 'antd';
import { Intersection, Object3D } from 'three';
import { useCallback, useEffect, useState } from 'react';

import { BoundingBoxMeasurement } from '../viewer/BoundingBoxMeasurement';
import { DistanceMeasurement } from '../viewer/DistanceMeasurement';
import { InfoCircleOutlined } from '@ant-design/icons';
import { MeasurementEvent } from '../viewer/MeasurementsStructureManager';
import { MeasurementType } from '../viewer/MeasurementType';
import { MeasurementsViewer } from '../viewer/MeasurementsViewer';
import { RadiusMeasurement } from '../viewer/RadiusMeasurement';
import { SelectionType } from '../viewer/SelectionType';
import { UploadModel } from 'common/ui';
import { Viewport } from '../../../features/viewport/ui/Viewport';
import { useModelLoader } from 'common/hooks';

type SelectionOptions = {
  value: SelectionType;
  label: string;
};

type MeasurementOptions = {
  value: MeasurementType;
  label: string;
};

export const Measurements = () => {
  const [selectionOptions, setSelectionOptions] = useState<SelectionOptions[]>([]);
  const [measurementOptions, setMeasurementOptions] = useState<MeasurementOptions[]>([]);
  const [selectionType, setSelectionType] = useState<SelectionType>(SelectionType.UNDEFINED);
  const [measurementType, setMeasurementType] = useState<MeasurementType>(MeasurementType.UNDEFINED);
  const [measurementTooltip, setMeasurementTooltip] = useState<string>();
  const [isMeasurementTooltipOpen, setIsMeasurementTooltipOpen] = useState<boolean>(false);

  useEffect(() => {
    const sOptions: SelectionOptions[] = [];
    const selectionTypes = Object.entries(SelectionType);
    selectionTypes.forEach(([, value]) => {
      if (value !== SelectionType.UNDEFINED) {
        sOptions.push({ value: value, label: value });
      }
    });
    setSelectionOptions(sOptions);
    const mOptions: MeasurementOptions[] = [];
    const measurementsTypes = Object.entries(MeasurementType);
    measurementsTypes.forEach(([, value]) => {
      if (value !== MeasurementType.UNDEFINED) {
        mOptions.push({ value: value, label: value });
      }
    });
    setMeasurementOptions(mOptions);
  }, []);

  const [viewer] = useState(new MeasurementsViewer());

  const {
    onMTKWEBFileSelected,
    onMTKWEBFolderSelected,
  } = useModelLoader(viewer);

  const notificationConfig = {
    duration: 0,
    maxCount: 2,
  };
  const [api, contextHolder] = notification.useNotification(notificationConfig);

  const showMeasurementResult = useCallback((event: Event) => {
    if (!(event instanceof MeasurementEvent)) {
      return;
    }
    const measurementType = viewer.structureManager.measurementType;
    const message = `${measurementType} measurement`;
    const measurement = event.measurement;
    let description = <></>;
    if (measurement instanceof DistanceMeasurement) {
      const distance = measurement.distance;
      description = (
        <>
          Distance (mm):
          {` ${distance.value.toFixed(2)}`}
          <br />
          First point:
          {` ${distance.points[0].toString(2)}`}
          <br />
          Second point:
          {` ${distance.points[1].toString(2)}`}
        </>
      );
    } else if (measurement instanceof BoundingBoxMeasurement) {
      const bbox = measurement.bbox;
      description = (
        <>
          Ranges (mm):
          {` (${bbox.xRange.toFixed(2)}, ${bbox.yRange.toFixed(2)}, ${bbox.zRange.toFixed(2)})`}
          <br />
          Min corner:
          {` ${bbox.minCorner.toString(2)}`}
          <br />
          Max corner:
          {` ${bbox.maxCorner.toString(2)}`}
        </>
      );
    } else if (measurement instanceof RadiusMeasurement) {
      const radii = measurement.radii;
      if (radii.length === 1) {
        description = (
          <>{`Radius (mm): ${radii[0].toFixed(2)}`}</>
        );
      } else if (radii.length === 2) {
        description = (
          <>
            {`Minor Radius (mm): ${radii[0].toFixed(2)}`}
            <br />
            {`Major Radius (mm): ${radii[1].toFixed(2)}`}
          </>
        );
      }
    }

    api.open({ message, description });
  }, []);

  const showMeasurementWarning = useCallback(() => {
    const measurementType = viewer.structureManager.measurementType;
    const message = `${measurementType} measurement`;
    let description = <></>;
    if (selectionType === SelectionType.NODE) {
      description = (
        <>Radius measurement can't be created for body. Please, change selection type to Shape and try again.</>
      );
    } else {
      description = (
        <>Radius measurement can't be created for selected shape. Please, select radial face or edge.</>
      );
    }

    api.open({ message, description });
  }, []);

  useEffect(() => {
    viewer.structureManager.addEventListener('measurementCreated', showMeasurementResult);
    viewer.structureManager.addEventListener('incorrectRadiusSource', showMeasurementWarning);
    setSelectionType(viewer.structureManager.selectionType);
    setMeasurementType(viewer.structureManager.measurementType);
  }, [viewer]);

  useEffect(() => {
    if (viewer.structureManager.selectionType !== selectionType && selectionType !== SelectionType.UNDEFINED) {
      viewer.structureManager.selectionType = selectionType;
    }
    setMeasurementTooltip(measurementMessage());
  }, [selectionType]);

  const measurementMessage = () => {
    let message = '';
    let entity = 'entity';
    switch (selectionType) {
      case SelectionType.NODE: {
        entity = 'body';
        break;
      }
      case SelectionType.SHAPE: {
        entity = 'shape (face or edge)';
        break;
      }
      default: break;
    }
    switch (measurementType) {
      case MeasurementType.BOUNDING_BOX: {
        message = `Select 1 or more (using CTRL key) ${entity} to create measurement.`;
        break;
      }
      case MeasurementType.DISTANCE: {
        message = `Select 2 (using CTRL key) ${entity} to create measurement.`;
        break;
      }
      case MeasurementType.RADIUS: {
        if (selectionType === SelectionType.NODE) {
          message = `Radius measurement can't be created for body.`;
        } else {
          message = `Select 1 radial ${entity} to create measurement.`;
        }
        break;
      }
      default: break;
    }
    return message;
  };

  useEffect(() => {
    if (viewer.structureManager.measurementType !== measurementType && measurementType !== MeasurementType.UNDEFINED) {
      viewer.structureManager.measurementType = measurementType;
    }
    setIsMeasurementTooltipOpen(true);
    setMeasurementTooltip(measurementMessage());
  }, [measurementType]);

  const onMeasurementOptionsDropdownVisibleChanged = (isVisible: boolean) => {
    if (isVisible) {
      setIsMeasurementTooltipOpen(false);
    }
  };

  const onSelectedFromViewport = (
    intersection: Intersection<Object3D>[] | null,
    isMultipleSelectionModifiersUsed?: boolean,
  ) => {
    viewer.structureManager.selectFromViewport(intersection, isMultipleSelectionModifiersUsed);
  };

  return (
    <>
      {contextHolder}
      <Flex
        gap="small"
        style={{ position: 'fixed', zIndex: 1 }}
        vertical
      >
        <UploadModel onArchiveSelected={onMTKWEBFileSelected} onFolderSelected={onMTKWEBFolderSelected} />
        <div style={{ marginLeft: '16px' }}>
          <Typography.Title level={5}>Selection type</Typography.Title>
          <Select
            className="select"
            value={selectionType === SelectionType.UNDEFINED ? undefined : selectionType}
            options={selectionOptions}
            popupMatchSelectWidth={false}
            placeholder="Choose selection type"
            onChange={(selectedValue) => { setSelectionType(selectedValue); }}
          />
        </div>
        <div style={{ marginLeft: '16px' }}>
          <Typography.Title level={5}>Measurement type</Typography.Title>
          <Select
            className="select"
            value={measurementType === MeasurementType.UNDEFINED ? undefined : measurementType}
            options={measurementOptions}
            popupMatchSelectWidth={false}
            placeholder="Choose measurement type"
            onChange={(selectedValue) => { setMeasurementType(selectedValue); }}
            onDropdownVisibleChange={onMeasurementOptionsDropdownVisibleChanged}
          />
          <Tooltip
            title={measurementTooltip}
            placement="bottomRight"
            open={isMeasurementTooltipOpen}
            trigger="click"
            overlayStyle={{ maxWidth: '12.5rem' }}
            arrow={{ pointAtCenter: true }}
          >
            <Button
              type="default"
              size="small"
              shape="circle"
              icon={<InfoCircleOutlined />}
              style={{ marginLeft: '4px' }}
              onClick={() => { setIsMeasurementTooltipOpen(!isMeasurementTooltipOpen); }}
            />
          </Tooltip>
        </div>
      </Flex>
      <Viewport
        viewportRef={viewer.viewport}
        onIntersect={onSelectedFromViewport}
        isShowSpaceGrid={false}
      />
    </>
  );
};
