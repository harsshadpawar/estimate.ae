import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, IconButton, Chip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WarningIcon from "@mui/icons-material/Warning";
import {
  fetchAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  clearCurrentCompany,
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
  Company,
  CompanyCreate,
  CompanyUpdate,
} from "@/redux/features/company/companySlice";
import CustomButton from "@/components/button";
import EnhancedTable from "@/components/table";
import DrawerModal from "@/components/drawerModel";

// Form Component for Create/Edit
const CompanyForm: React.FC<{
  company?: Company | null;
  onSubmit: (data: CompanyCreate | CompanyUpdate) => void;
  onCancel: () => void;
  isLoading: boolean;
}> = ({ company, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: company?.name || "",
    contact_email: company?.contact_email || "",
    contact_phone: company?.contact_phone || "",
    address: company?.address || "",
    website: company?.website || "",
    description: company?.description || "",
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
            Company Name *
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
            contact_email
          </label>
          <input
            type="email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
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
            contact_phone
          </label>
          <input
            type="tel"
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
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
            Website
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
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
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
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
            text={isLoading ? "Saving..." : company ? "Update Company" : "Create Company"}
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

// Company Details View Component
const CompanyDetails: React.FC<{ company: Company }> = ({ company }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <h2 style={{ margin: 0 }}>{company.name}</h2>
          <Chip
            label={company.is_active ? "Active" : "Inactive"}
            color={company.is_active ? "success" : "error"}
            size="small"
          />
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <Box>
          <strong>contact_email:</strong>
          <p style={{ margin: "4px 0" }}>{company.contact_email || "Not provided"}</p>
        </Box>
        <Box>
          <strong>contact_phone:</strong>
          <p style={{ margin: "4px 0" }}>{company.contact_phone || "Not provided"}</p>
        </Box>
        <Box>
          <strong>Website:</strong>
          <p style={{ margin: "4px 0" }}>
            {company.website_url ? (
              <a href={company.website_url} target="_blank" rel="noopener noreferrer">
                {company.website_url}
              </a>
            ) : (
              "Not provided"
            )}
          </p>
        </Box>
        <Box>
          <strong>Created:</strong>
          <p style={{ margin: "4px 0" }}>{formatDate(company.created_at)}</p>
        </Box>
      </Box>

      <Box>
        <strong>Address:</strong>
        <p style={{ margin: "4px 0" }}>{company.address || "Not provided"}</p>
      </Box>
    </Box>
  );
};

// Delete Confirmation Component
const DeleteConfirmation: React.FC<{
  company: Company;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}> = ({ company, onConfirm, onCancel, isLoading }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <WarningIcon sx={{ color: "#f44336", fontSize: "2rem" }} />
        <Typography variant="h6" sx={{ color: "#f44336" }}>
          Confirm Deletion
        </Typography>
      </Box>

      <Box sx={{ 
        p: 2, 
        backgroundColor: "#fff3cd", 
        border: "1px solid #ffeaa7", 
        borderRadius: "8px",
        mb: 2 
      }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Are you sure you want to delete the following company?
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#856404" }}>
          This action will deactivate the company and cannot be undone.
        </Typography>
      </Box>

      <Box sx={{ 
        p: 2, 
        backgroundColor: "#f8f9fa", 
        border: "1px solid #dee2e6", 
        borderRadius: "8px" 
      }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {company.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Email: {company.contact_email || "Not provided"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Phone: {company.contact_phone || "Not provided"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Status: {company.is_active ? "Active" : "Inactive"}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <CustomButton
          text={isLoading ? "Deleting..." : "Yes, Delete Company"}
          color="#f44336"
          onClick={onConfirm}
          disabled={isLoading}
        />
        <CustomButton
          text="Cancel"
          color="#6c757d"
          onClick={onCancel}
          disabled={isLoading}
        />
      </Box>
    </Box>
  );
};

// Main Company Management Component
const CompanyManagement: React.FC = () => {
  const dispatch = useDispatch();
  const {
    companies,
    currentCompany,
    status,
    createStatus,
    updateStatus,
    deleteStatus,
  } = useSelector((state: any) => state.company);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view" | "delete">("create");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    dispatch(fetchAllCompanies() as any);
  }, [dispatch]);

  // Handle successful operations
  useEffect(() => {
    if (createStatus === "succeeded") {
      setDrawerOpen(false);
      setSelectedCompany(null);
      dispatch(resetCreateStatus());
    }
  }, [createStatus, dispatch]);

  useEffect(() => {
    if (updateStatus === "succeeded") {
      setDrawerOpen(false);
      setSelectedCompany(null);
      dispatch(resetUpdateStatus());
    }
  }, [updateStatus, dispatch]);

  useEffect(() => {
    if (deleteStatus === "succeeded") {
      setDrawerOpen(false);
      setSelectedCompany(null);
      dispatch(resetDeleteStatus());
    }
  }, [deleteStatus, dispatch]);

  const handleAddCompany = () => {
    setDrawerMode("create");
    setSelectedCompany(null);
    setDrawerOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setDrawerMode("edit");
    setSelectedCompany(company);
    setDrawerOpen(true);
  };

  const handleViewCompany = (company: Company) => {
    setDrawerMode("view");
    setSelectedCompany(company);
    setDrawerOpen(true);
  };

  const handleDeleteCompany = (company: Company) => {
    setDrawerMode("delete");
    setSelectedCompany(company);
    setDrawerOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCompany) {
      dispatch(deleteCompany(selectedCompany.id) as any);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedCompany(null);
    dispatch(clearCurrentCompany());
  };

  const handleCreateCompany = (data: CompanyCreate) => {
    dispatch(createCompany(data) as any);
  };

  const handleUpdateCompany = (data: CompanyUpdate) => {
    if (selectedCompany) {
      dispatch(updateCompany({ companyId: selectedCompany.id, data }) as any);
    }
  };

  const columns = [
    {
      id: "name",
      label: "Company Name",
      sortable: true,
      searchable: true,
    },
    {
      id: "contact_email",
      label: "contact_email",
      sortable: true,
      searchable: true,
      format: (value: string) => value || "N/A",
    },
    {
      id: "contact_phone",
      label: "contact_phone",
      sortable: true,
      searchable: true,
      format: (value: string) => value || "N/A",
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
      id: "created_at",
      label: "Created Date",
      sortable: true,
      format: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      id: "actions",
      label: "Actions",
      format: (value: any, row: Company) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => handleViewCompany(row)}
            sx={{ color: "#2196f3" }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleEditCompany(row)}
            sx={{ color: "#ff9800" }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteCompany(row)}
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
        return "Add New Company";
      case "edit":
        return "Edit Company";
      case "view":
        return "Company Details";
      case "delete":
        return "Delete Company";
      default:
        return "Company";
    }
  };

  const getDrawerWidth = () => {
    return drawerMode === "delete" ? 500 : 600;
  };

  return (
    <Box sx={{ p: 3 }}>
      <EnhancedTable
        title="Company Management"
        data={companies || []}
        columns={columns}
        add={handleAddCompany}
        initialSortColumn="created_at"
        initialSortDirection="desc"
      />

      <DrawerModal
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        title={getDrawerTitle()}
        width={getDrawerWidth()}
      >
        {drawerMode === "view" && selectedCompany && (
          <CompanyDetails company={selectedCompany} />
        )}
        
        {(drawerMode === "create" || drawerMode === "edit") && (
          <CompanyForm
            company={selectedCompany}
            onSubmit={drawerMode === "create" ? handleCreateCompany : handleUpdateCompany}
            onCancel={handleCloseDrawer}
            isLoading={createStatus === "loading" || updateStatus === "loading"}
          />
        )}

        {drawerMode === "delete" && selectedCompany && (
          <DeleteConfirmation
            company={selectedCompany}
            onConfirm={handleConfirmDelete}
            onCancel={handleCloseDrawer}
            isLoading={deleteStatus === "loading"}
          />
        )}
      </DrawerModal>
    </Box>
  );
};

export default CompanyManagement;