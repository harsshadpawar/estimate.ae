import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Backdrop, Box, Button, CircularProgress, Container, Typography } from "@mui/material";

import Add from "./Add";
import Edit from "./Edit";
import { RootState } from "@/redux/store/store";
import { addUser, deleteUser, fetchUsers, updateUser } from "@/redux/features/userSlice";
import EnhancedTable from "@/components/table";
import { Modal } from "@/components/customModal";

const Index: React.FC = () => {
  const dispatch = useDispatch();
  const { users, status } = useSelector((state: RootState) => state.users);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAddSubmit = async (user: any) => {
    await dispatch(addUser(user));
    setAddOpen(false);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user); // Set the selected user
    setEditForm(user); // Populate the edit form with the selected user's details
    setEditOpen(true); // Open the edit modal
  };
  
  const handleEditSubmit = async () => {
    await dispatch(updateUser({ id: selectedUser.id, user: editForm }));
    setEditOpen(false);
  };

  const handleDeleteConfirm = async () => {
    await dispatch(deleteUser(selectedUser.id));
    setDeleteOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ padding: "20px", my: 5 }}>
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
          { id: "company_name", label: "Company Name", sortable: true, searchable: true },
          {
            id: "actions",
            label: "Actions",
            format: (value: any, row: any) => (
              <>
                <Button onClick={() => handleEdit(row)}>Edit</Button> {/* Call handleEdit */}
                <Button onClick={() => { setSelectedUser(row); setDeleteOpen(true); }}>Delete</Button>
              </>
            ),
          },
        ]}
      />

      {/* Add Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New User"
        actions={
          <>
            <Button onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={() => handleAddSubmit(editForm)}>
              Add
            </Button>
          </>
        }
      >
        <Add addForm={editForm} handleAddChange={(e: any) => setEditForm({ ...editForm, [e.target.name]: e.target.value })} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit User"
        actions={
          <>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleEditSubmit}>
              Save
            </Button>
          </>
        }
      >
        <Edit editForm={editForm} handleEditChange={(e: any) => setEditForm({ ...editForm, [e.target.name]: e.target.value })} />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Confirm Delete"
        actions={
          <>
            <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </>
        }
      >
        <Typography>Are you sure you want to delete this user?</Typography>
      </Modal>
    </Container>
  );
};

export default Index;