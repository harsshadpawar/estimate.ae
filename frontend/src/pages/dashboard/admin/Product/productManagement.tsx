import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, IconButton, Chip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WarningIcon from "@mui/icons-material/Warning";
import {
  fetchAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  clearCurrentProduct,
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
  Product,
  ProductCreate,
  ProductUpdate,
} from "@/redux/features/product/productSlice";
import CustomButton from "@/components/button";
import EnhancedTable from "@/components/table";
import DrawerModal from "@/components/drawerModel";

// Form Component for Create/Edit
const ProductForm: React.FC<{
  product?: Product | null;
  onSubmit: (data: ProductCreate | ProductUpdate) => void;
  onCancel: () => void;
  isLoading: boolean;
}> = ({ product, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
        </Box>

        <Box>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "14px",
              resize: "vertical",
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <CustomButton
            text={isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
            type="submit"
            disabled={isLoading || !formData.name.trim()}
          />
          <CustomButton
            text="Cancel"
            color="#6c757d"
            onClick={onCancel}
            disabled={isLoading}
          />
        </Box>
      </Box>
    </form>
  );
};

// Product Details View Component
const ProductDetails: React.FC<{ product: Product }> = ({ product }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <h2 style={{ margin: 0 }}>{product.name}</h2>
          <Chip
            label={product.is_active ? "Active" : "Inactive"}
            color={product.is_active ? "success" : "error"}
            size="small"
          />
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <Box>
          <strong>ID:</strong>
          <p style={{ margin: "4px 0" }}>{product.id}</p>
        </Box>
        <Box>
          <strong>Status:</strong>
          <p style={{ margin: "4px 0" }}>
            <Chip
              label={product.is_active ? "Active" : "Inactive"}
              color={product.is_active ? "success" : "error"}
              size="small"
            />
          </p>
        </Box>
        <Box>
          <strong>Created By:</strong>
          <p style={{ margin: "4px 0" }}>{product.created_by || "System"}</p>
        </Box>
        <Box>
          <strong>Updated By:</strong>
          <p style={{ margin: "4px 0" }}>{product.updated_by || "System"}</p>
        </Box>
        <Box>
          <strong>Created:</strong>
          <p style={{ margin: "4px 0" }}>{formatDate(product.created_at)}</p>
        </Box>
        <Box>
          <strong>Last Updated:</strong>
          <p style={{ margin: "4px 0" }}>{formatDate(product.updated_at)}</p>
        </Box>
      </Box>

      <Box>
        <strong>Description:</strong>
        <p style={{ margin: "4px 0" }}>{product.description || "No description provided"}</p>
      </Box>
    </Box>
  );
};

// Delete Confirmation Component
const DeleteConfirmation: React.FC<{
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}> = ({ product, onConfirm, onCancel, isLoading }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Warning Icon and Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <WarningIcon sx={{ color: "#f44336", fontSize: 40 }} />
        <Box>
          <Typography variant="h6" sx={{ color: "#f44336", fontWeight: 600 }}>
            Confirm Deletion
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            This action cannot be undone
          </Typography>
        </Box>
      </Box>

      {/* Product Information */}
      <Box sx={{ 
        backgroundColor: "#f5f5f5", 
        padding: 2, 
        borderRadius: 2,
        border: "1px solid #e0e0e0"
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Product to be deleted:
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <strong>ID:</strong>
            <span>{product.id}</span>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Name:</strong>
            <span>{product.name}</span>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Status:</strong>
            <Chip
              label={product.is_active ? "Active" : "Inactive"}
              color={product.is_active ? "success" : "error"}
              size="small"
            />
          </Box>
          {product.description && (
            <Box>
              <strong>Description:</strong>
              <Typography variant="body2" sx={{ mt: 0.5, wordBreak: "break-word" }}>
                {product.description}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Warning Message */}
      <Box sx={{ 
        backgroundColor: "#fff3e0", 
        padding: 2, 
        borderRadius: 2,
        border: "1px solid #ffcc02"
      }}>
        <Typography variant="body2" sx={{ color: "#e65100" }}>
          ⚠️ <strong>Warning:</strong> Deleting this product will deactivate it and it may affect related data. 
          This action cannot be reversed.
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <CustomButton
          text={isLoading ? "Deleting..." : "Yes, Delete Product"}
          onClick={onConfirm}
          disabled={isLoading}
          color="#f44336"
        />
        <CustomButton
          text="Cancel"
          onClick={onCancel}
          disabled={isLoading}
          color="#6c757d"
        />
      </Box>
    </Box>
  );
};

// Main Product Management Component
const ProductManagement: React.FC = () => {
  const dispatch = useDispatch();
  const {
    products,
    currentProduct,
    status,
    createStatus,
    updateStatus,
    deleteStatus,
  } = useSelector((state: any) => state.product);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view" | "delete">("create");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchAllProducts() as any);
  }, [dispatch]);

  // Handle successful operations
  useEffect(() => {
    if (createStatus === "succeeded") {
      setDrawerOpen(false);
      setSelectedProduct(null);
      dispatch(resetCreateStatus());
    }
  }, [createStatus, dispatch]);

  useEffect(() => {
    if (updateStatus === "succeeded") {
      setDrawerOpen(false);
      setSelectedProduct(null);
      dispatch(resetUpdateStatus());
    }
  }, [updateStatus, dispatch]);

  useEffect(() => {
    if (deleteStatus === "succeeded") {
      setDrawerOpen(false);
      setSelectedProduct(null);
      dispatch(resetDeleteStatus());
    }
  }, [deleteStatus, dispatch]);

  const handleAddProduct = () => {
    setDrawerMode("create");
    setSelectedProduct(null);
    setDrawerOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setDrawerMode("edit");
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setDrawerMode("view");
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setDrawerMode("delete");
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      dispatch(deleteProduct(selectedProduct.id) as any);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedProduct(null);
    dispatch(clearCurrentProduct());
  };

  const handleCreateProduct = (data: ProductCreate) => {
    dispatch(createProduct(data) as any);
  };

  const handleUpdateProduct = (data: ProductUpdate) => {
    if (selectedProduct) {
      dispatch(updateProduct({ productId: selectedProduct.id, data }) as any);
    }
  };

  const columns = [
    {
      id: "id",
      label: "ID",
      sortable: true,
      searchable: true,
    },
    {
      id: "name",
      label: "Product Name",
      sortable: true,
      searchable: true,
    },
    {
      id: "description",
      label: "Description",
      sortable: true,
      searchable: true,
      format: (value: string) => value ? 
        (value.length > 50 ? `${value.substring(0, 50)}...` : value) : 
        "No description",
    },
    {
      id: "is_active",
      label: "Status",
      sortable: true,
      format: (value: boolean) => (
        <Chip
          label={value ? "Active" : "Inactive"}
          color={value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      id: "created_by",
      label: "Created By",
      sortable: true,
      format: (value: string) => value || "System",
    },
    {
      id: "created_at",
      label: "Created Date",
      sortable: true,
      format: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      id: "actions",
      label: "Actions",
      format: (value: any, row: Product) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => handleViewProduct(row)}
            sx={{ color: "#2196f3" }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleEditProduct(row)}
            sx={{ color: "#ff9800" }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteProduct(row)}
            sx={{ color: "#f44336" }}
            disabled={deleteStatus === "loading"}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const getDrawerTitle = () => {
    switch (drawerMode) {
      case "create":
        return "Add New Product";
      case "edit":
        return "Edit Product";
      case "view":
        return "Product Details";
      case "delete":
        return "Delete Product";
      default:
        return "Product";
    }
  };

  const getDrawerWidth = () => {
    return drawerMode === "delete" ? 500 : 600;
  };

  return (
    <Box sx={{ p: 3 }}>
      <EnhancedTable
        title="Product Management"
        data={products || []}
        columns={columns}
        add={handleAddProduct}
        initialSortColumn="created_at"
        initialSortDirection="desc"
      />

      <DrawerModal
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        title={getDrawerTitle()}
        width={getDrawerWidth()}
      >
        {drawerMode === "view" && selectedProduct && (
          <ProductDetails product={selectedProduct} />
        )}
        
        {(drawerMode === "create" || drawerMode === "edit") && (
          <ProductForm
            product={selectedProduct}
            onSubmit={drawerMode === "create" ? handleCreateProduct : handleUpdateProduct}
            onCancel={handleCloseDrawer}
            isLoading={createStatus === "loading" || updateStatus === "loading"}
          />
        )}

        {drawerMode === "delete" && selectedProduct && (
          <DeleteConfirmation
            product={selectedProduct}
            onConfirm={handleConfirmDelete}
            onCancel={handleCloseDrawer}
            isLoading={deleteStatus === "loading"}
          />
        )}
      </DrawerModal>
    </Box>
  );
};

export default ProductManagement;