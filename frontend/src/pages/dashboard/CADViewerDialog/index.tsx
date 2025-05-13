import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Stack,
  CircularProgress
} from '@mui/material';
import apiClient from '../../../services/interceptor';
import { getVolume, getSurfaceArea, getDimensions } from '../../../utils/utils';
import ObjectDataTable from '../ObjectDataTable/index';

const CADViewerDialog = ({ open, onClose, fileId, accessToken }) => {
  const viewerDiv = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fileURN, setFileURN] = useState('');
  const [error, setError] = useState(null);

  const [actualDimensions, setActualDimensions] = useState({});
  const [rawMaterialDimensions, setRawMaterialDimensions] = useState({});
  const [scrapData, setScrapData] = useState({});

  // Fetch the URN of the file based on the fileId
  const getFileURN = async (fileId) => {
    try {
      const resp = await apiClient.post(`/api/cad/file/${fileId}/urn`);
      setFileURN(resp.data.urn);
    } catch (error) {
      setError('Failed to load CAD file. Please try again later.');
      console.error('Error fetching file URN:', error);
    } finally {
      setIsLoading(false); // Stop loading after attempt, whether success or failure
    }
  };

  // Calculate data for the tables based on actual dimensions
  const calculateDimensionsData = (dimensionsData) => {
    const { volume: actualVolume, surfaceArea: actualSurfaceArea, dimensions } = dimensionsData;
    const { length, breadth, height } = dimensions;

    const rawLength = length + 2;
    const rawWidth = breadth + 2;
    const rawHeight = height + 2;
    const rawVolume = rawLength * rawWidth * rawHeight;
    const rawSurfaceArea = 2 * (rawLength * rawWidth + rawWidth * rawHeight + rawHeight * rawLength);

    setActualDimensions([
      { property: 'Length', value: length },
      { property: 'Width', value: breadth },
      { property: 'Height', value: height },
      { property: 'Actual Volume', value: actualVolume },
      { property: 'Actual Surface Area', value: actualSurfaceArea },
    ]);

    setRawMaterialDimensions([
      { property: 'Length', value: rawLength },
      { property: 'Width', value: rawWidth },
      { property: 'Height', value: rawHeight },
      { property: 'Raw Volume', value: rawVolume },
      { property: 'Raw Surface Area', value: rawSurfaceArea },
    ]);

    setScrapData([
      { property: 'Volume Scrap', value: rawVolume - actualVolume },
      { property: 'Surface Area Scrap', value: rawSurfaceArea - actualSurfaceArea },
    ]);
  };

  useEffect(() => {
    const fetchURN = async () => {
      setIsLoading(true); // Start loading when opening
      await getFileURN(fileId); // Fetch the URN for the file
    };

    // Fetch URN and initialize viewer only if open, fileId, and accessToken are present
    if (open && fileId && accessToken) {
      fetchURN();
    }

    // Cleanup Autodesk viewer on component unmount or close
    return () => {
      if (window.Autodesk?.Viewing?.shutdown && viewerDiv.current) {
        window.Autodesk.Viewing.shutdown();
      }
    };
  }, [open, fileId, accessToken]);

  useEffect(() => {
    // Initialize viewer if fileURN and accessToken are available
    const initializeViewerIfReady = async () => {
      if (fileURN && accessToken) {
        try {
          initializeViewer(fileURN, accessToken, viewerDiv, setIsLoading);
        } catch (error) {
          setError('Could not initialize viewer. Please try again.');
          console.error('Error initializing viewer:', error);
          setIsLoading(false);
        }
      }
    };

    initializeViewerIfReady();
  }, [fileURN, accessToken]);

  const initializeViewer = (urn, token) => {
    let viewer;
    const options = {
      env: 'AutodeskProduction',
      accessToken: token,
    };
  
    const documentId = `urn:${urn}`;
  
    // Failure callback for loading the document
    const onDocumentLoadFailure = (viewerErrorCode) => {
      console.error('onDocumentLoadFailure() - errorCode: ' + viewerErrorCode);
    };
  
    // Wait for the instance tree to load before performing operations
    const waitForInstanceTree = (viewer, callback) => {
      const maxRetries = 500;
      let attempts = 0;
  
      const checkInstanceTree = () => {
        if (viewer.model && viewer.model.getData().instanceTree) {
          callback();
        } else if (attempts < maxRetries) {
          attempts++;
          console.log("Retrying instance tree...");
          setTimeout(checkInstanceTree, 1000);
        } else {
          console.log("Instance tree could not be loaded in time.");
        }
      };
  
      checkInstanceTree();
    };
  
    window.Autodesk.Viewing.Initializer(options, () => {
      viewer = new window.Autodesk.Viewing.Private.GuiViewer3D(viewerDiv.current);
      viewer.start();
  
      // Load the document into the viewer
      window.Autodesk.Viewing.Document.load(
        documentId,
        (doc) => {
          const defaultModel = doc.getRoot().getDefaultGeometry();
          viewer.loadDocumentNode(doc, defaultModel).then(() => {
            setIsLoading(false);
            viewer.addEventListener(window.Autodesk.Viewing.GEOMETRY_LOADED_EVENT, () => {
              // Model Bounding Box
              const boundingBox = viewer.model.getBoundingBox();
              //console.log("Model Bounding Box:", boundingBox);
  
              // Component Bounding Boxes and Geometry Data
              const fragmentList = viewer.model.getFragmentList();
              const fragCount = fragmentList.getCount();
  
              for (let fragId = 0; fragId < fragCount; fragId++) {
                const fragBox = new window.THREE.Box3();
                fragmentList.getWorldBounds(fragId, fragBox);
                //console.log(`Bounding box for fragment ${fragId}:`, fragBox);
  
                const matrix = new window.THREE.Matrix4();
                fragmentList.getWorldMatrix(fragId, matrix);
  
                const geometry = fragmentList.getGeometry(fragId);
                if (geometry) {
                  const positions = geometry.vb;
                  const normals = geometry.nb;
                  // console.log(`Vertices for fragment ${fragId}:`, positions);
                  // console.log(`Normals for fragment ${fragId}:`, normals);
                } else {
                  console.log(`No geometry data for fragment ${fragId}`);
                }
              }
              //calculateVolume(viewer.model, fragmentList, fragCount);
              waitForInstanceTree(viewer, function () {
                const volume = getVolume(viewer);
                const surfaceArea = getSurfaceArea(viewer);
                const dimensions =  getDimensions(viewer);
                calculateDimensionsData({ volume, surfaceArea, dimensions  });
              });
            });
          });
        },
        onDocumentLoadFailure
      );
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>View CAD File</DialogTitle>
      <DialogContent dividers style={{ minHeight:'500px', maxHeight: '500px', overflowY: 'auto' }}>
        {isLoading && (
          <CircularProgress
            size={80}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />
        )}
        {!isLoading && (
          <Stack spacing={2} style={{ width: '100%' }}>
            {/* Forge Viewer Section */}
            <Box ref={viewerDiv} sx={{ height: '200px', width: '40%', border: '1px solid #ddd' }} />

            {/* Data Tables Section */}
            {actualDimensions.length > 0 &&  (
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <ObjectDataTable title="Actual Object Dimensions" data={actualDimensions} />
                <ObjectDataTable title="Raw Material Dimensions" data={rawMaterialDimensions} />
                <ObjectDataTable title="Scrap Data" data={scrapData} />
              </Stack>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CADViewerDialog;
