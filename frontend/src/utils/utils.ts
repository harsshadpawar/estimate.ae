import { jwtDecode } from 'jwt-decode';

const validateToken = (token) => {
  if (!token) return false;

  try {
      // Decode the token
      const decodedToken = jwtDecode(token);

      // Check if token has expired
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return decodedToken.exp > currentTime; // Token is valid if `exp` is in the future
  } catch (error) {
      // If decoding fails, the token is invalid
      console.error("Invalid token:", error);
      return false;
  }
};

const truncateFilename = (filename, maxLength = 20) => {
    const [name, extension] = filename.split('.');
  
    if (name.length + extension.length <= maxLength) {
      return filename;
    }
  
    const availableLength = maxLength - extension.length - 3;
    const startLength = Math.ceil(availableLength / 2);
    const endLength = Math.floor(availableLength / 2);
  
    const truncatedName = `${name.slice(0, startLength)}...${name.slice(-endLength)}`;
    return `${truncatedName}.${extension}`;
};

const getDimensions = (viewer) => {
  // Get the bounding box for the given dbId
  const it = viewer.model.getData().instanceTree;
  const rootDbId = it.getRootId();
  const boundingBox = viewer.model.getBoundingBox(rootDbId);

  if (boundingBox) {
      const min = boundingBox.min; // Minimum corner (x, y, z)
      const max = boundingBox.max; // Maximum corner (x, y, z)

      // Calculate length, breadth, and height
      const length = max.x - min.x;
      const breadth = max.y - min.y;
      const height = max.z - min.z;

      console.log("Length: " + length + " mm");
      console.log("Breadth: " + breadth + " mm");
      console.log("Height: " + height + " mm");

      return { length, breadth, height };
  } else {
      console.log("Bounding box not available for this dbId.");
      return null;
  }
}

const getVolume = (viewer) => {
  let volume = 0;
  const it = viewer.model.getData().instanceTree;
  const rootDbId = it.getRootId();

  it.enumNodeFragments(rootDbId, (fragId) => {
    getVertices(viewer, fragId, (p1, p2, p3) => {
      volume += getTriangleVolume(p1, p2, p3);
    });
  }, true);

  console.log("Volume ", volume, " cubic millimeters");
  return volume;
};

const getSurfaceArea = (viewer) => {
  let area = 0;
  const it = viewer.model.getData().instanceTree;
  const rootDbId = it.getRootId();

  it.enumNodeFragments(rootDbId, (fragId) => {
    getVertices(viewer, fragId, (p1, p2, p3) => {
      area += getTriangleArea(p1, p2, p3);
    });
  }, true);

  console.log("Area ", area, " square millimeters");
  return area;
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

    const actualDimensions = {
      'length': length,
      'width': breadth,
      'height': height,
      'volume': actualVolume,
      'surfaceArea': actualSurfaceArea 
    };

    const rawMaterialDimensions = {
      'length': rawLength,
      'width': rawWidth,
      'height': rawHeight,
      'volume': rawVolume,
      'surfaceArea': rawSurfaceArea
    };

    const scrapData = {
      'volume': rawVolume - actualVolume,
      'surfaceArea': rawSurfaceArea - actualSurfaceArea
    };

    return { actualDimensions, rawMaterialDimensions, scrapData };
};

const getTriangleArea = (p1, p2, p3) => {
  const tr = new window.THREE.Triangle(p1, p2, p3);
  return tr.area();
};

const getTriangleVolume = (p1, p2, p3) => {
  return p1.dot(p2.cross(p3)) / 6.0;
};

const getVertices = (viewer, fragId, callback) => {
  const fragProxy = viewer.impl.getFragmentProxy(viewer.model, fragId);
  const renderProxy = viewer.impl.getRenderProxy(viewer.model, fragId);

  fragProxy.updateAnimTransform();

  const matrix = new window.THREE.Matrix4();
  fragProxy.getWorldMatrix(matrix);

  const geometry = renderProxy.geometry;
  const attributes = geometry && geometry.attributes;

  if (geometry && attributes) {
    const vA = new window.THREE.Vector3();
    const vB = new window.THREE.Vector3();
    const vC = new window.THREE.Vector3();

    if (attributes && attributes.index !== undefined) {
      const indices = attributes.index.array || geometry.ib;
      const positions = geometry.vb ? geometry.vb : attributes.position.array;
      const stride = geometry.vb ? geometry.vbstride : 3;
      const offsets = geometry.offsets || [{ start: 0, count: indices.length, index: 0 }];

      for (const offset of offsets) {
        const { start, count, index } = offset;

        for (let i = start; i < start + count; i += 3) {
          const a = index + indices[i];
          const b = index + indices[i + 1];
          const c = index + indices[i + 2];

          vA.fromArray(positions, a * stride);
          vB.fromArray(positions, b * stride);
          vC.fromArray(positions, c * stride);

          vA.applyMatrix4(matrix);
          vB.applyMatrix4(matrix);
          vC.applyMatrix4(matrix);

          callback(vA, vB, vC);
        }
      }
    } else {
      const positions = geometry.vb ? geometry.vb : attributes.position.array;
      const stride = geometry.vb ? geometry.vbstride : 3;

      for (let i = 0; i < positions.length; i += 3) {
        vA.fromArray(positions, i * stride);
        vB.fromArray(positions, (i + 1) * stride);
        vC.fromArray(positions, (i + 2) * stride);

        vA.applyMatrix4(matrix);
        vB.applyMatrix4(matrix);
        vC.applyMatrix4(matrix);

        callback(vA, vB, vC);
      }
    }
  }
};

const colorPalette = [
  '#66c2a5', // Green
  '#fc8d62', // Orange
  '#8da0cb', // Blue
  '#e78ac3', // Purple
  '#a6d854', // Light Green
  '#ffd92f', // Yellow
  '#e5c494', // Beige
  '#b3b3b3', // Gray
  '#1f78b4', // Dark Blue
  '#33a02c', // Dark Green
  '#fb9a99', // Light Red
  '#fdbf6f', // Light Orange
  '#cab2d6', // Lavender
  '#6a3d9a', // Dark Purple
  '#ffff99', // Pale Yellow
  '#b15928', // Brown
  '#ff7f00', // Bright Orange
  '#b2df8a', // Soft Green
  '#a6cee3', // Light Blue
  '#bc80bd', // Muted Purple
];


export {
  validateToken,
  truncateFilename,
  getVolume,
  getSurfaceArea,
  getDimensions,
  calculateDimensionsData,
  colorPalette
};