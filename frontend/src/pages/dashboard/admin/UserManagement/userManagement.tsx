import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Avatar
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import PersonIcon from "@mui/icons-material/Person";

import Add from "./Add";
import Edit from "./Edit";
import { RootState } from "@/redux/store/store";
import { addUser, deleteUser, fetchUsers, updateUser, assignRole } from "@/redux/features/userSlice";
import EnhancedTable from "@/components/table";
import { Modal } from "@/components/customModal";
import EditIcon from "@mui/icons-material/Edit";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"; // For Role
import DeleteIcon from "@mui/icons-material/Delete";
import DrawerModal from "@/components/drawerModel";

// Delete Confirmation Component
const DeleteConfirmation: React.FC<{
  user: any;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}> = ({ user, onConfirm, onCancel, isLoading }) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'error';
      case 'super-admin':
        return 'secondary';
      case 'user':
      default:
        return 'primary';
    }
  };

  const formatRoleName = (role: string) => {
    return role?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'User';
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Warning Icon and Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <WarningIcon sx={{ color: "#f44336", fontSize: 40 }} />
        <Box>
          <Typography variant="h6" sx={{ color: "#f44336", fontWeight: 600 }}>
            Confirm User Deletion
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            This action will permanently remove the user
          </Typography>
        </Box>
      </Box>

      {/* User Information Card */}
      <Box sx={{ 
        backgroundColor: "#f5f5f5", 
        padding: 3, 
        borderRadius: 2,
        border: "1px solid #e0e0e0"
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          User to be deleted:
        </Typography>
        
        {/* User Avatar and Basic Info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: "#1976d2", width: 50, height: 50 }}>
            {getInitials(user.first_name, user.last_name)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              {user.email}
            </Typography>
          </Box>
        </Box>

        {/* Detailed Information Grid */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#666" }}>
              User ID:
            </Typography>
            <Typography variant="body1">{user.id}</Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#666" }}>
              Role:
            </Typography>
            <Chip
              label={formatRoleName(user.role_name)}
              color={getRoleColor(user.role_name)}
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#666" }}>
              Phone:
            </Typography>
            <Typography variant="body1">{user.phone || 'Not provided'}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#666" }}>
              Status:
            </Typography>
            <Chip
              label={user.is_active ? "Active" : "Inactive"}
              color={user.is_active ? "success" : "default"}
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#666" }}>
              Email Verified:
            </Typography>
            <Chip
              label={user.email_verified ? "Verified" : "Not Verified"}
              color={user.email_verified ? "success" : "warning"}
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#666" }}>
              Company:
            </Typography>
            <Typography variant="body1">{user.company_name || 'Not specified'}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Warning Messages */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ 
          backgroundColor: "#fff3e0", 
          padding: 2, 
          borderRadius: 2,
          border: "1px solid #ffcc02"
        }}>
          <Typography variant="body2" sx={{ color: "#e65100" }}>
            ⚠️ <strong>Warning:</strong> Deleting this user will permanently remove their account and all associated data.
          </Typography>
        </Box>

        {user.role_name === 'admin' || user.role_name === 'super-admin' ? (
          <Box sx={{ 
            backgroundColor: "#ffebee", 
            padding: 2, 
            borderRadius: 2,
            border: "1px solid #f44336"
          }}>
            <Typography variant="body2" sx={{ color: "#c62828" }}>
              🚨 <strong>Critical:</strong> This user has administrative privileges. Deleting this account may affect system operations.
            </Typography>
          </Box>
        ) : null}

        <Box sx={{ 
          backgroundColor: "#f3e5f5", 
          padding: 2, 
          borderRadius: 2,
          border: "1px solid #9c27b0"
        }}>
          <Typography variant="body2" sx={{ color: "#7b1fa2" }}>
            💡 <strong>Note:</strong> Consider deactivating the user instead of deleting if you might need to restore access later.
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : <DeleteIcon />}
          sx={{ minWidth: 140 }}
        >
          {isLoading ? "Deleting..." : "Delete User"}
        </Button>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={isLoading}
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

const Index: React.FC = () => {
  const dispatch = useDispatch();
  const { users, status } = useSelector((state: RootState) => state.users);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [addForm, setAddForm] = useState<any>({});
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Available roles for assignment
  const availableRoles = ["user", "admin", "super-admin"];

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAddSubmit = async () => {
    await dispatch(addUser(addForm));
    setAddOpen(false);
    setAddForm({});
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setEditForm(user);
    setEditOpen(true);
  };

  const handleEditSubmit = async () => {
    await dispatch(updateUser({ id: selectedUser.id, user: editForm }));
    setEditOpen(false);
    setEditForm({});
    setSelectedUser(null);
  };

  const handleDeleteConfirm = async () => {
    await dispatch(deleteUser(selectedUser.id));
    setDeleteOpen(false);
    setSelectedUser(null);
  };

  const handleRoleAssign = (user: any) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setRoleOpen(true);
  };

  const handleRoleSubmit = async () => {
    await dispatch(assignRole({ id: selectedUser.id, role_name: selectedRole }));
    setRoleOpen(false);
    setSelectedUser(null);
    setSelectedRole("");
    dispatch(fetchUsers());
  };

  return (
    <Box sx={{ my: 5 }}>
      {status === "loading" && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <EnhancedTable
        add={() => setAddOpen(true)}
        title={"User Management"}
        data={users}
        columns={[
          { id: "first_name", label: "First Name", sortable: true, searchable: true },
          { id: "last_name", label: "Last Name", sortable: true, searchable: true },
          { id: "email", label: "Email", sortable: true, searchable: true },
          { id: "phone", label: "Phone", sortable: true, searchable: true },
          // { id: "company_name", label: "Company Name", sortable: true, searchable: true },
          { id: "role_name", label: "Role", sortable: true, searchable: true },
          {
            id: "is_active",
            label: "Status",
            format: (value: boolean) => value ? "Active" : "Inactive",
            sortable: true
          },
          {
            id: "email_verified",
            label: "Email Verified",
            format: (value: boolean) => value ? "Yes" : "No",
            sortable: true
          },
          {
            id: "actions",
            label: "Actions",
            format: (value: any, row: any) => (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => handleEdit(row)}
                  sx={{ color: "#ff9800" }} // Orange for edit
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleRoleAssign(row)}
                  sx={{ color: "#673ab7" }} // Purple for role
                >
                  <ManageAccountsIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedUser(row);
                    setDeleteOpen(true);
                  }}
                  sx={{ color: "#f44336" }} // Red for delete
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ),
          }
        ]}
      />

      {/* Add Modal */}
      <DrawerModal
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          setAddForm({});
        }}
        title="Add New User"
        width="40%"
        actions={
          <>
            <Button onClick={() => {
              setAddOpen(false);
              setAddForm({});
            }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSubmit}
              disabled={!addForm.email || !addForm.first_name || !addForm.last_name}
            >
              Add
            </Button>
          </>
        }
      >
        <Add
          addForm={addForm}
          handleAddChange={(e: any) => setAddForm({ ...addForm, [e.target.name]: e.target.value })}
        />
      </DrawerModal>

      {/* Edit Modal */}
      <DrawerModal
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditForm({});
          setSelectedUser(null);
        }}
        title="Edit User"
        width="40%"
        actions={
          <>
            <Button onClick={() => {
              setEditOpen(false);
              setEditForm({});
              setSelectedUser(null);
            }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditSubmit}
            >
              Save
            </Button>
          </>
        }
      >
        <Edit
          editForm={editForm}
          handleEditChange={(e: any) => setEditForm({ ...editForm, [e.target.name]: e.target.value })}
        />
      </DrawerModal>

      {/* Role Assignment Modal */}
      <DrawerModal
        isOpen={roleOpen}
        onClose={() => {
          setRoleOpen(false);
          setSelectedUser(null);
          setSelectedRole("");
        }}
        title="Assign Role"
        actions={
          <>
            <Button onClick={() => {
              setRoleOpen(false);
              setSelectedUser(null);
              setSelectedRole("");
            }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRoleSubmit}
              disabled={!selectedRole}
            >
              Assign Role
            </Button>
          </>
        }
      >
        <Box sx={{ minWidth: 200, mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Assign role to: <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong>
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={selectedRole}
              label="Role"
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {availableRoles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1).replace('-', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DrawerModal>

      {/* Enhanced Delete Modal */}
      <DrawerModal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedUser(null);
        }}
        title="Delete User"
        width={600}
      >
        {selectedUser && (
          <DeleteConfirmation
            user={selectedUser}
            onConfirm={handleDeleteConfirm}
            onCancel={() => {
              setDeleteOpen(false);
              setSelectedUser(null);
            }}
            isLoading={status === "loading"}
          />
        )}
      </DrawerModal>
    </Box>
  );
};

export default Index;