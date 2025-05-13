import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../services/interceptor";
import { triggerToast } from "../../components/common/Snackbar";

// Types
type Transaction = {
  id: string;
  user: string;
  reference_number: string;
  status: string;
  transaction_type: string;
  currency: string;
  amount: number;
  payment_method: string;
};

type TransactionState = {
  transactions: Transaction[];
  users: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

// Initial State
const initialState: TransactionState = {
  transactions: [],
  users: [],
  status: "idle",
  error: null,
};

// Thunks
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/transaction/transactions/");
      return response.data.data.transactions;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to fetch transactions.";
      triggerToast(errorMessage, "error");
      return rejectWithValue(errorMessage);
    }
  }
);



export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transaction: Partial<Transaction>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/transaction/transaction/", transaction);
      triggerToast(response.data?.data?.message || "Transaction added successfully!", "success");
      return response.data.data.transaction;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to add transaction.";
      triggerToast(errorMessage, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async ({ id, transaction }: { id: string; transaction: Partial<Transaction> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/transaction/transaction/${id}/`, transaction);
      triggerToast(response.data?.data?.message || "Transaction updated successfully!", "success");
      return response.data.data.transaction;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update transaction.";
      triggerToast(errorMessage, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/transaction/transaction/${id}/`);
      triggerToast(response.data?.data?.message || "Transaction deleted successfully!", "success");
      return id;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete transaction.";
      triggerToast(errorMessage, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Transactions
    builder.addCase(fetchTransactions.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
      state.status = "succeeded";
      state.transactions = action.payload;
    });
    builder.addCase(fetchTransactions.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
    });

    // Add Transaction
    builder.addCase(addTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.transactions.push(action.payload);
      });

    // Update Transaction
    builder.addCase(updateTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    });

    // Delete Transaction
    builder.addCase(deleteTransaction.fulfilled, (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter((t) => t.id !== action.payload);
    });
  },
});

export default transactionSlice.reducer;