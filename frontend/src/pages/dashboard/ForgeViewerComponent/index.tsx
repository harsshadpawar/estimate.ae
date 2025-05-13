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
import { getVolume, getSurfaceArea, getDimensions, calculateDimensionsData } from '../../../utils/utils';

const ForgeViewerComponent = ({ fileId, accessToken, setDimensions }) => {

    const viewerDiv = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fileURN, setFileURN] = useState('');
    const [error, setError] = useState(null);

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

    useEffect(() => {
        const fetchURN = async () => {
            await getFileURN(fileId); // Fetch the URN for the file
        };

        // Fetch URN and initialize viewer only if open, fileId, and accessToken are present
        if (fileId && accessToken) {
            fetchURN();
        }

        // Cleanup Autodesk viewer on component unmount or close
        return () => {
            if (window.Autodesk?.Viewing?.shutdown && viewerDiv.current) {
                window.Autodesk.Viewing.shutdown();
            }
        };
    }, [fileId, accessToken]);

    useEffect(() => {
        // Initialize viewer if fileURN and accessToken are available
        const initializeViewerIfReady = async () => {
        if (fileURN && accessToken) {
            try {
                let fileURN='dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cGVlcF9kb3RfcGVlcF92MTEyNy9CQVNFNC5zdGVw';
                let accessToken="eyJhbGciOiJSUzI1NiIsImtpZCI6ImI4YjJkMzNhLTFlOTYtNDYwNS1iMWE4LTgwYjRhNWE4YjNlNyIsInR5cCI6IkpXVCJ9"
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
                    viewer?.loadDocumentNode(doc, defaultModel).then(() => {
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
                        const { actualDimensions, rawMaterialDimensions, scrapData } = calculateDimensionsData({ volume, surfaceArea, dimensions });
                        setDimensions({
                            actualDimensions,
                            rawMaterialDimensions,
                            scrapData
                        })
                        });
                });
                });
            },
            onDocumentLoadFailure
            );
        });
    };

    return (
        <Box 
            ref={viewerDiv}
            className="forge-viewer"
        />

    );
};

export default ForgeViewerComponent;
