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
//     { id: 'user.first_name', label: 'User', sortable: true, searchable: true },
//     { id: 'reference_number', label: 'Ref Number', sortable: true, searchable: true },
//     { id: 'status', label: 'Status', sortable: true, searchable: true },
//     { id: 'transaction_type', label: 'Transaction Type', sortable: true, searchable: true },
//     { id: 'currency', label: 'Currency', sortable: false, searchable: true },
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
//   const [user, setUser] = useState<any[]>([]);
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
//     const [translist] = await Promise.all([apiClient.get('/api/transaction/list-transactions/')]);
//     console.log("userlist", translist);
//     setUserData(translist?.data?.data?.transactions);
//     const [userlist] = await Promise.all([apiClient.get('/api/user/list-users/')]);
//     console.log("userlist", userlist);
//     setUser(userlist?.data?.data?.users);
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
//     console.log("editForm", editForm)
//     if (!editForm?.currency?.trim()) newErrors.currency = 'currency is required';
//     if (editForm?.amount == null || editForm.amount === '') newErrors.amount = 'amount is required';
//     if (!editForm?.reference_number?.trim()) newErrors.reference_number = 'reference_number is required';
//     if (!editForm?.status?.trim()) newErrors.status = 'status is required';
//     if (!editForm?.transaction_type?.trim()) newErrors.transaction_type = 'transaction_type is required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleEditSubmit = async () => {
//     if (!validateForm()) return;

//     try {
//       const res = await apiClient.put(`/api/transaction/update-transaction/${editData?.id}/`, editForm);
//       console.log("Updated:", res.data);
//         setSnackbar((prevState) => ({
//           ...prevState,
//           open: true,
//           message: res?.data?.data?.message,
//         }));

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
//       const res = await apiClient.delete(`/api/transaction/delete-transaction/${deleteData?.id}/`);
//         console.log("success", res.data)
//         setSnackbar((prevState) => ({
//           ...prevState,
//           open: true,
//           message: res?.data?.data?.message,
//         }));

//       setDeleteOpen(false);
//       fetchApiData(); // Refresh the user list
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
//     if (!addForm?.user?.trim()) newErrors.user = 'user is required';
//     if (!addForm?.currency?.trim()) newErrors.currency = 'currency is required';
//     if (addForm?.amount == null || editForm.amount === '') newErrors.amount = 'amount is required';
//     if (!addForm?.reference_number?.trim()) newErrors.reference_number = 'reference_number is required';
//     if (!addForm?.status?.trim()) newErrors.status = 'status is required';
//     if (!addForm?.transaction_type?.trim()) newErrors.transaction_type = 'transaction_type is required';
//     if (!addForm?.payment_method?.trim()) newErrors.payment_method = 'payment_method is required';


//     setAddErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
//   const handleAddSubmit = async () => {
//     if (!validateAddForm()) return;

//     try {
//       const res = await apiClient.post('/api/transaction/create-transaction/', addForm);
//       setSnackbar((prevState) => ({
//         ...prevState,
//         open: true,
//         message: res?.data?.data?.message,
//       }));
//       console.log("User Created:", res.data);
//       setAddOpen(false);
//       fetchApiData(); // Refresh data
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
//       <EnhancedTable add={handleAdd} title={"Transaction Management"} data={userData} columns={datacolumn} />

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
//         <Add addForm={addForm} handleAddChange={handleAddChange} addErrors={addErrors} user={user} />

//       </Modal>


//     </Container>
//   );
// };

// export default Index;


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Backdrop, Button, CircularProgress, Container, Typography } from "@mui/material";

import Add from "./Add";
import Edit from "./Edit";
import CommonSnackbar from "../../../../components/common/Snackbar";
import {
  addTransaction,
  deleteTransaction,
  fetchTransactions,
  updateTransaction,
} from "../../../../redux/features/transactionSlice";
import EnhancedTable from "../../../../components/common/Table";
import { Modal } from "../../../../components/common/CustomModal";
import { fetchUsers } from "../../../../redux/features/userSlice";
import { RootState } from "../../../../redux/store/store";


const Index: React.FC = () => {
  const dispatch = useDispatch();
  const { transactions, status } = useSelector((state: RootState) => state.transactions);
  const { users } = useSelector((state: RootState) => state.users);
  console.log("users", users);


  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [addForm, setAddForm] = useState<any>({});
  const [addErrors, setAddErrors] = useState<any>({});
  const [editErrors, setEditErrors] = useState<any>({});
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAddSubmit = async () => {
    if (!validateAddForm()) return;

    await dispatch(addTransaction(addForm));
    setAddOpen(false);
    setAddForm({});
  };

  const handleEditSubmit = async () => {
    if (!validateEditForm()) return;

    await dispatch(updateTransaction({ id: selectedTransaction.id, transaction: editForm }));
    setEditOpen(false);
    setEditForm({});
  };

  const handleDeleteConfirm = async () => {
    await dispatch(deleteTransaction(selectedTransaction.id));
    setDeleteOpen(false);
  };

  const validateAddForm = () => {
    const newErrors: any = {};
    if (!addForm?.user?.trim()) newErrors.user = "User is required";
    if (!addForm?.currency?.trim()) newErrors.currency = "Currency is required";
    if (addForm?.amount == null || addForm.amount === "") newErrors.amount = "Amount is required";
    if (!addForm?.reference_number?.trim()) newErrors.reference_number = "Reference number is required";
    if (!addForm?.status?.trim()) newErrors.status = "Status is required";
    if (!addForm?.transaction_type?.trim()) newErrors.transaction_type = "Transaction type is required";
    if (!addForm?.payment_method?.trim()) newErrors.payment_method = "Payment method is required";

    setAddErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors: any = {};
    if (!editForm?.currency?.trim()) newErrors.currency = "Currency is required";
    if (editForm?.amount == null || editForm.amount === "") newErrors.amount = "Amount is required";
    if (!editForm?.reference_number?.trim()) newErrors.reference_number = "Reference number is required";
    if (!editForm?.status?.trim()) newErrors.status = "Status is required";
    if (!editForm?.transaction_type?.trim()) newErrors.transaction_type = "Transaction type is required";

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Container maxWidth="lg" sx={{ padding: "20px", my: 5 }}>
      <CommonSnackbar />
      {status === "loading" && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <EnhancedTable
        add={() => setAddOpen(true)}
        title={"Transaction Management"}
        data={transactions}
        columns={[
          { id: "user.first_name", label: "User", sortable: true, searchable: true },
          { id: "reference_number", label: "Ref Number", sortable: true, searchable: true },
          { id: "status", label: "Status", sortable: true, searchable: true },
          { id: "transaction_type", label: "Transaction Type", sortable: true, searchable: true },
          { id: "currency", label: "Currency", sortable: false, searchable: true },
          {
            id: "actions",
            label: "Actions",
            format: (value: any, row: any) => (
              <>
                <Button
                  onClick={() => {
                    setSelectedTransaction(row);
                    setEditForm(row);
                    setEditOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    setSelectedTransaction(row);
                    setDeleteOpen(true);
                  }}
                >
                  Delete
                </Button>
              </>
            ),
          },
        ]}
      />

      {/* Add Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Transaction"
        actions={
          <>
            <Button onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleAddSubmit}>
              Add
            </Button>
          </>
        }
      >
        <Add
          addForm={addForm}
          handleAddChange={(e: any) =>
            setAddForm({ ...addForm, [e.target.name]: e.target.value })
          }
          addErrors={addErrors}
          user={users}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Transaction"
        actions={
          <>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleEditSubmit}>
              Save
            </Button>
          </>
        }
      >
        <Edit
          editForm={editForm}
          handleEditChange={(e: any) =>
            setEditForm({ ...editForm, [e.target.name]: e.target.value })
          }
          editErrors={editErrors}
        />
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
        <Typography>Are you sure you want to delete this transaction?</Typography>
      </Modal>
    </Container>
  );
};

export default Index;
