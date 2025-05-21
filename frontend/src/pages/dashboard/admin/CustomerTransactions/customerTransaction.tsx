import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Backdrop, Button, CircularProgress, Container, Typography } from "@mui/material";

import Add from "./Add";
import Edit from "./Edit";
import CommonSnackbar from "@/components/customToast";
import {
  addTransaction,
  deleteTransaction,
  fetchTransactions,
  updateTransaction,
} from "@/redux/features/transactionSlice";
import EnhancedTable from "@/components/table";
import { Modal } from "@/components/customModal";
import { fetchUsers } from "@/redux/features/userSlice";
import { RootState } from "@/redux/store/store";


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
