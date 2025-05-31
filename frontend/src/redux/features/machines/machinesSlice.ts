import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '@/services/interceptor';

// ------------------
// Types
// ------------------
export interface Machine {
  id: string;
  name: string;
  abbreviation?: string;
  hourly_rate?: number | string;
  working_span?: string;
  category?: string;
  currency?: string;
  type?: string;
  [key: string]: any; // For any additional dynamic keys
}

export interface DefaultMachine extends Machine {
  // Any specific fields for default machines
}

interface MachinesState {
  machines: Machine[];
  defaultMachines: DefaultMachine[];
  defaultMachinesTotal: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  defaultMachinesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  defaultMachinesError: string | null;
  machineCategories: string[];
  categoriesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  categoriesError: string | null;
}

// ------------------
// Initial State
// ------------------
const initialState: MachinesState = {
  machines: [],
  defaultMachines: [],
  defaultMachinesTotal: 0,
  status: 'idle',
  defaultMachinesStatus: 'idle',
  error: null,
  defaultMachinesError: null,
  machineCategories: [],
  categoriesStatus: 'idle',
  categoriesError: null
};

// ------------------
// Thunks
// ------------------
export const fetchMachines = createAsyncThunk<Machine[], void, { rejectValue: string }>(
  'machines/fetchMachines',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/machine/');
      return response?.data?.data || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch machines');
    }
  }
);

export const fetchDefaultMachines = createAsyncThunk<
  { machines: DefaultMachine[], total: number }, 
  { page: number, size: number },
  { rejectValue: string }
>(
  'machines/fetchDefaultMachines',
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/default_machine', {
        params: { page, size }
      });

      const allowedCategories = [
        "Machining (Milling Machine)",
        "Machining (Turning Machine)",
        "Machining (Turing Machine)",
      ];
      
      // Filter machines by allowed categories
      const filteredMachines = response?.data?.data?.machines.filter((machine: DefaultMachine) =>
        allowedCategories.includes(machine.category || '')
      );

      return { 
        machines: filteredMachines || [], 
        total: filteredMachines.length // Assuming the total should be based on filtered machines
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch default machines');
    }
  }
);

export const fetchMachineCategories = createAsyncThunk<string[], void, { rejectValue: string }>(
  'machines/fetchMachineCategories',
  async ({ page=0, size=10 }={}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/default_machine/categories', {
        params: { page: page + 1, size: size }
      });
      return response?.data?.data?.categories || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch machine categories');
    }
  }
);

export const addMachine = createAsyncThunk<Machine, Machine, { rejectValue: string }>(
  'machines/addMachine',
  async (machine, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/machine', machine);
      return response?.data?.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add machine');
    }
  }
);

export const updateMachine = createAsyncThunk<Machine, { id: string; machine: Machine }, { rejectValue: string }>(
  'machines/updateMachine',
  async ({ id, machine }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/machine/${id}`, machine);
      return response?.data?.data?.machine;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update machine');
    }
  }
);

export const deleteMachine = createAsyncThunk<string, string, { rejectValue: string }>(
  'machines/deleteMachine',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/machine/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete machine');
    }
  }
);

export const importMachine = createAsyncThunk<Machine, string, { rejectValue: string }>(
  'machines/importMachine',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/machine/import/${id}`);
      return response?.data?.data?.machine;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to import machine');
    }
  }
);

// ------------------
// Slice
// ------------------
const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {
    resetMachinesState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // fetchMachines
      .addCase(fetchMachines.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMachines.fulfilled, (state, action: PayloadAction<Machine[]>) => {
        state.status = 'succeeded';

        state.machines = action.payload;
        state.error = null;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
      })

      // fetchDefaultMachines
      .addCase(fetchDefaultMachines.pending, (state) => {
        state.defaultMachinesStatus = 'loading';
      })
      .addCase(fetchDefaultMachines.fulfilled, (state, action: PayloadAction<{ machines: DefaultMachine[], total: number }>) => {
        state.defaultMachinesStatus = 'succeeded';
        state.defaultMachines = action.payload.machines;
        state.defaultMachinesTotal = action.payload.total;
        state.defaultMachinesError = null;
      })
      .addCase(fetchDefaultMachines.rejected, (state, action) => {
        state.defaultMachinesStatus = 'failed';
        state.defaultMachinesError = action.payload ?? 'Unknown error';
      })

      // fetchMachineCategories
      .addCase(fetchMachineCategories.pending, (state) => {
        state.categoriesStatus = 'loading';
      })
      .addCase(fetchMachineCategories.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.categoriesStatus = 'succeeded';
        state.machineCategories = action.payload;
        state.categoriesError = null;
      })
      .addCase(fetchMachineCategories.rejected, (state, action) => {
        state.categoriesStatus = 'failed';
        state.categoriesError = action.payload ?? 'Unknown error';
      })

      // addMachine
      .addCase(addMachine.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addMachine.fulfilled, (state, action: PayloadAction<Machine>) => {
        state.status = 'succeeded';
        state.machines.push(action.payload);
        state.error = null;
      })
      .addCase(addMachine.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
      })

      // updateMachine
      .addCase(updateMachine.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateMachine.fulfilled, (state, action: PayloadAction<Machine>) => {
        state.status = 'succeeded';
        const index = state.machines.findIndex(machine => machine.id === action.payload.id);
        if (index !== -1) {
          state.machines[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMachine.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
      })

      // deleteMachine
      .addCase(deleteMachine.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteMachine.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.machines = state.machines.filter(machine => machine.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteMachine.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
      })

      // importMachine
      .addCase(importMachine.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(importMachine.fulfilled, (state, action: PayloadAction<Machine>) => {
        state.status = 'succeeded';
        state.machines.push(action.payload);
        state.error = null;
      })
      .addCase(importMachine.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
      });
  }
});

export const { resetMachinesState } = machinesSlice.actions;

export default machinesSlice.reducer;