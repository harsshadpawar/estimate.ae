// import React, { useEffect, useState } from 'react';
// import { Backdrop, Box, Button, CircularProgress, Container, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
// import apiClient from '../../../../services/interceptor';
// import EnhancedTable from '../../../../components/common/Table';
// import { FaEye } from 'react-icons/fa';
// import { TbEdit } from 'react-icons/tb';
// import { Delete } from '@mui/icons-material';
// import Modal from '../../../../components/common/AdminModel';
// import Add from './Add';
// import Edit from './Edit';
// import CommonSnackbar from '../../../../components/common/Snackbar';



// const Index: React.FC = () => {
//   const datacolumn = [
//     { id: 'title', label: 'Title', sortable: true, searchable: true },
//     { id: 'first_name', label: 'First Name', sortable: true, searchable: true },
//     { id: 'last_name', label: 'Last Name', sortable: true, searchable: true },
//     { id: 'email', label: 'Email', sortable: true, searchable: true },
//     { id: 'company_name', label: 'Company Name', sortable: false, searchable: true },
//     {
//       id: 'actions',
//       label: 'Action',
//       format: (value: any, row: any) => (
//         <>
//           <IconButton size="small" color="success" onClick={() => handleView(row)}><i className="fas fa-eye" /><FaEye /></IconButton>
//           <IconButton size="small" color="primary" onClick={() => handleEdit(row)}><i className="fas fa-pen" /><TbEdit /></IconButton>
//           <IconButton size="small" color="error" onClick={() => handleDelete(row)}><i className="fas fa-trash" /><Delete /></IconButton>
//         </>
//       )
//     }
//   ];
//   const [isLoading, setIsLoading] = useState(false);
//   const [userData, setUserData] = useState<any[]>([]);
//   const [viewData, setViewData] = useState()
//   const [editData, setEditData] = useState()
//   const [deleteData, setDeleteData] = useState()
//   const [viewOpen, setViewOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [editForm, setEditForm] = useState({});
//   const [errors, setErrors] = useState<any>({});
//   const [addOpen, setAddOpen] = useState(false);
//   const [addForm, setAddForm] = useState({});
//   const [addErrors, setAddErrors] = useState<any>({});
//   const [snackbar, setSnackbar] = React.useState({
//     message: '',
//     open: false,
//     vertical: 'bottom',
//     horizontal: 'center',
//   });
//   const handleCloseSnackbar = () => {
//     setSnackbar((prevState) => ({
//       ...prevState,
//       open: false,
//     }));
//   };
//   const initializeData = async () => {
//     setIsLoading(true);
//     await fetchApiData();
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     initializeData();
//   }, []);

//   const fetchApiData = async () => {
//     const [userlist] = await Promise.all([apiClient.get('/api/user/list-users/')]);
//     console.log("userlist", userlist);
//     setUserData(userlist?.data?.data?.users);
//   };
//   const handleAdd = () => {
//     setAddForm({});
//     setAddErrors({});
//     setAddOpen(true);
//   };

//   const handleView = (data: any) => {
//     setViewData(data);
//     setEditForm(data); // same form fields
//     setViewOpen(true); // open View mode
//   };

//   const handleEdit = (data: any) => {
//     setEditData(data);
//     setEditForm(data);
//     setViewOpen(false); // make sure View is false
//     setEditOpen(true);  // open Edit mode
//   };


//   const handleDelete = (data: any) => {
//     setDeleteData(data);
//     setDeleteOpen(true);
//   };
//   const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setEditForm(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };
//   const validateForm = () => {
//     const newErrors: any = {};

//     if (!editForm?.first_name?.trim()) newErrors.first_name = 'First name is required';
//     if (!editForm?.last_name?.trim()) newErrors.last_name = 'Last name is required';
//     if (!editForm?.email?.trim()) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(editForm.email)) newErrors.email = 'Email is invalid';
//     if (!editForm?.company_name?.trim()) newErrors.company_name = 'Company name is required';
//     if (!editForm?.role?.trim()) newErrors.role = 'Role is required';
//     if (!editForm?.title?.trim()) newErrors.title = 'Title is required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleEditSubmit = async () => {
//     if (!validateForm()) return;

//     try {
//       const res = await apiClient.put(`/api/user/update-user/${editData?.id}/`, editForm);
//       setSnackbar((prevState) => ({
//         ...prevState,
//         open: true,
//         message: res?.data?.data?.message,
//       }));
//       console.log("Updated:", res.data);
//       setEditOpen(false);
//       fetchApiData();
//     } catch (error) {
//       console.error("Update failed:", error);
//       setSnackbar((prevState) => {
//         let errorMessage = "An error occurred";

//         if (error?.response?.data?.errors) {
//           const errorData = error?.response?.data;

//           if (errorData.status === "error" && errorData.errors) {
//             // Extract specific field error messages
//             const errorFields = Object.keys(errorData.errors);
//             if (errorFields.length > 0) {
//               const fieldErrors = errorFields.map(field => {
//                 return `${field}: ${errorData.errors[field].message}`;
//               });
//               errorMessage = fieldErrors.join(", ");
//             }
//           }
//         }

//         return {
//           ...prevState,
//           open: true,
//           message: errorMessage,
//           severity: "error"
//         };
//       });
//     }
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       const res=await apiClient.delete(`/api/user/delete-user/${deleteData?.id}/`);
//       setDeleteOpen(false);
//       fetchApiData(); // Refresh the user list
//       setSnackbar((prevState) => ({
//         ...prevState,
//         open: true,
//         message: res?.data?.data?.message,
//       }));
//     } catch (error) {
//       console.error("Delete failed:", error);
//       setSnackbar((prevState) => {
//         let errorMessage = "An error occurred";

//         if (error?.response?.data?.errors) {
//           const errorData = error?.response?.data;

//           if (errorData.status === "error" && errorData.errors) {
//             // Extract specific field error messages
//             const errorFields = Object.keys(errorData.errors);
//             if (errorFields.length > 0) {
//               const fieldErrors = errorFields.map(field => {
//                 return `${field}: ${errorData.errors[field].message}`;
//               });
//               errorMessage = fieldErrors.join(", ");
//             }
//           }
//         }

//         return {
//           ...prevState,
//           open: true,
//           message: errorMessage,
//           severity: "error"
//         };
//       });
//     }
//   };

//   const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
//     const { name, value } = e.target;
//     setAddForm(prev => ({
//       ...prev,
//       [name!]: value
//     }));
//   };

//   const validateAddForm = () => {
//     const newErrors: any = {};
//     if (!addForm?.first_name?.trim()) newErrors.first_name = 'First name is required';
//     if (!addForm?.last_name?.trim()) newErrors.last_name = 'Last name is required';
//     if (!addForm?.email?.trim()) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(addForm.email)) newErrors.email = 'Email is invalid';
//     if (!addForm?.company_name?.trim()) newErrors.company_name = 'Company name is required';
//     if (!addForm?.role?.trim()) newErrors.role = 'Role is required';
//     if (!addForm?.title?.trim()) newErrors.title = 'Title is required';
//     if (!addForm?.password?.trim()) newErrors.password = 'Password is required';

//     setAddErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
//   const handleAddSubmit = async () => {
//     if (!validateAddForm()) return;

//     try {
//       const res = await apiClient.post('/api/user/create-user/', addForm);
//       console.log("User Created:", res.data);
//       setAddOpen(false);
//       fetchApiData(); // Refresh data
//       setSnackbar((prevState) => ({
//         ...prevState,
//         open: true,
//         message: res?.data?.data?.message,
//       }));
//     } catch (error) {
//       console.error("Add user failed:", error);
//       setSnackbar((prevState) => {
//         let errorMessage = "An error occurred";

//         if (error?.response?.data?.errors) {
//           const errorData = error?.response?.data;

//           if (errorData.status === "error" && errorData.errors) {
//             // Extract specific field error messages
//             const errorFields = Object.keys(errorData.errors);
//             if (errorFields.length > 0) {
//               const fieldErrors = errorFields.map(field => {
//                 return `${field}: ${errorData.errors[field].message}`;
//               });
//               errorMessage = fieldErrors.join(", ");
//             }
//           }
//         }
//         else if(error?.response?.data?.message){
//           console.log("mess",error?.response?.data?.message)
//           errorMessage=error?.response?.data?.message
//         }

//         return {
//           ...prevState,
//           open: true,
//           message: errorMessage,
//           severity: "error"
//         };
//       });
//     }
//   };

//   return (
//     <Container maxWidth="lg" sx={{ padding: '20px', my: 5 }}>
//       <CommonSnackbar
//         message={snackbar.message}
//         vertical={snackbar.vertical}
//         horizontal={snackbar.horizontal}
//         open={snackbar.open}
//         onClose={handleCloseSnackbar} // Passing the function here
//       />
//       {isLoading && (
//         <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
//           <CircularProgress color="inherit" />
//         </Backdrop>
//       )}
//       <EnhancedTable add={handleAdd} title={"User Management"} data={userData} columns={datacolumn} />

//       <Modal
//         isOpen={editOpen || viewOpen}
//         onClose={() => {
//           setEditOpen(false);
//           setViewOpen(false);
//         }}
//         title={viewOpen ? "View User" : "Edit User"}
//         actions={
//           viewOpen ? (
//             <Button onClick={() => setViewOpen(false)}>Close</Button>  // Only Close button in View
//           ) : (
//             <>
//               <Button onClick={() => setEditOpen(false)}>Cancel</Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleEditSubmit}
//               >
//                 Save
//               </Button>
//             </>
//           )
//         }
//       >
//         <Edit
//           handleEditChange={handleEditChange}
//           disabled={viewOpen}  // disable form in view mode
//           editForm={editForm}
//           errors={errors}
//         />
//       </Modal>



//       <Modal
//         isOpen={deleteOpen}
//         onClose={() => setDeleteOpen(false)}
//         title="Confirm Delete"
//       // width='md'
//       >
//         <p>Are you sure you want to delete user <strong>{deleteData?.first_name} {deleteData?.last_name}</strong>?</p>
//         <>
//           <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
//           <Button sx={{
//             // display: "block",
//             // width: '100%',
//             padding: "12px 12px",
//             textAlign: "center",
//             backgroundColor: "red",
//             color: "#fff",
//             borderRadius: "14px",
//             cursor: "pointer",
//             "&:hover": {
//               backgroundColor: "#0591FC",
//             },
//           }} variant="contained" color="error" onClick={handleDeleteConfirm}>Delete</Button>
//         </>
//       </Modal>

//       <Modal
//         isOpen={addOpen}
//         onClose={() => setAddOpen(false)}
//         title="Add New User"
//         actions={
//           <>
//             <Button onClick={() => setAddOpen(false)}>Cancel</Button>
//             <Button variant="contained" color="primary" onClick={handleAddSubmit}>Add</Button>
//           </>
//         }
//       >
//         <Add addForm={addForm} handleAddChange={handleAddChange} addErrors={addErrors} />

//       </Modal>


//     </Container>
//   );
// };

// export default Index;



import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Backdrop, Box, Button, CircularProgress, Container, Typography } from "@mui/material";

import Add from "./Add";
import Edit from "./Edit";
import CommonSnackbar from "../../../../components/common/Snackbar";
import { RootState } from "../../../../redux/store/store";
import { addUser, deleteUser, fetchUsers, updateUser } from "../../../../redux/features/userSlice";
import EnhancedTable from "../../../../components/common/Table";
import { Modal } from "../../../../components/common/CustomModal";

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