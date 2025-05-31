import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/services/interceptor";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

// Interfaces
interface Material {
    id: string;
    name: string;
    price_per_kg: number;
    active: boolean;
    material_group_id: string;
}

interface MaterialGroup {
    id: string;
    name: string;
    abbreviation?: string;
    price?: number;
    density?: number;
    co2_emission?: number;
    active?: boolean;
}

interface MaterialsState {
    materials: Material[];
    groups: MaterialGroup[];
    groupedMaterials: Record<string, Material[]>;
    pagination: {
        page: number;
        rowsPerPage: number;
        total: number;
    };
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}
const staticMaterialGroups: MaterialGroup[] = [
    { id: '1', name: 'Steel', abbreviation: 'ST', active: true,price:'40.9',density:'4',co2_emission:'0.5' },
    { id: '2', name: 'Aluminium', abbreviation: 'AL', active: true ,price:'40.9',density:'4',co2_emission:'0.5' },
    { id: '3', name: 'Plastic', abbreviation: 'PL', active: true,price:'40.9',density:'4',co2_emission:'0.5'  }
];

const initialState: MaterialsState = {
    materials: [],
    groups: staticMaterialGroups,
    groupedMaterials: {},
    pagination: {
        page: 0,
        rowsPerPage: 10,
        total: 0
    },
    status: 'idle',
    error: null,
};

// Helper function to group materials by their categories
const groupMaterialsByCategory = (materials: Material[], groups: MaterialGroup[]) => {
    return materials.reduce<Record<string, Material[]>>((acc, material) => {
        const category = groups.find(g => g.id === material.material_group_id)?.name || "Uncategorized";
        if (!acc[category]) acc[category] = [];
        acc[category].push(material);
        return acc;
    }, {});
};

// Fetch Materials
export const fetchMaterials = createAsyncThunk<Material[], void, { rejectValue: string }>(
    'materials/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/material');
            return response.data?.data || [];
        } catch (error) {
            const err = error as AxiosError;
            return rejectWithValue(err.message || "Failed to fetch materials");
        }
    }
);

export const addMaterial = createAsyncThunk(
    'materials/add',
    async (material: Material, { rejectWithValue }) => {
        try {
            const response = await apiClient.post("/material", material);
            toast.success('Material added successfully');
            return response.data?.data || [];
        } catch (error) {
            toast.error('Failed to add material');
            const err = error as AxiosError;
            return rejectWithValue(err.message || "Add failed");
        }
    }
);

// Update material
export const updateMaterial = createAsyncThunk(
    'materials/update',
    async ({ id, material }: { id: any, material: Material }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/material/${id}`, material);
            toast.success('Material updated successfully');
            return response.data?.data || [];
        } catch (error) {
            toast.error('Failed to update material');
            const err = error as AxiosError;
            return rejectWithValue(err.message || "Update failed");
        }
    }
);

// Import material
export const importMaterial = createAsyncThunk(
    'materials/import',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(`/material/import/${id}`);
            toast.success('Material imported successfully');
            return response.data?.data || [];
        } catch (error) {
            toast.error('Failed to import material');
            const err = error as AxiosError;
            return rejectWithValue(err.message || "Import failed");
        }
    }
);

// Delete material
export const deleteMaterial = createAsyncThunk(
    'materials/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await apiClient.delete(`/material/${id}`);
            toast.success('Material deleted successfully');
            return id;
        } catch (error) {
            toast.error('Failed to delete material');
            const err = error as AxiosError;
            return rejectWithValue(err.message || "Delete failed");
        }
    }
);

// Fetch Material Groups (paginated)
export const fetchPaginatedMaterialGroups = createAsyncThunk(
    'materials/fetchPaginatedGroups',
    async ({ page, rowsPerPage }: { page: number, rowsPerPage: number }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get("/material_group", {
                params: { page: page + 1, size: rowsPerPage }
            });
            return {
                groups: response.data.data,
                total: response.data.data
            };
        } catch (error) {
            const err = error as AxiosError;
            return rejectWithValue(err.message || "Failed to fetch material groups");
        }
    }
);

// Fetch Material Groups (all)
export const fetchMaterialGroups = createAsyncThunk<MaterialGroup[], void, { rejectValue: string }>(
    'materials/fetchGroups',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/material_group');
            return response.data?.data || [];
        } catch (error) {
            const err = error as AxiosError;
            return rejectWithValue(err.message || "Failed to fetch material groups");
        }
    }
);


// Delete Material Group
export const deleteMaterialGroup = createAsyncThunk(
    'materials/deleteGroup',
    async (id: string, { rejectWithValue }) => {
        try {
            await apiClient.delete(`/material_group/${id}`);
            toast.success('Material group deleted successfully');
            return id;
        } catch (error) {
            toast.error('Failed to delete material group');
            const err = error as AxiosError;
            return rejectWithValue(err.message || "Delete failed");
        }
    }
);
export const updateMaterialGroup = createAsyncThunk(
    'materials/updateGroup',
    async ({ id, material }: { id: any, material: Material }, { rejectWithValue }) => {
        try {
            await apiClient.put(`/material_group/${id}`, material);
            toast.success('Material group updates successfully');
            return id;
        } catch (error) {
            toast.error('Failed to update material group');
            const err = error as AxiosError;
            return rejectWithValue(err.message || "update failed");
        }
    }
);
const materialsSlice = createSlice({
    name: 'materials',
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.pagination.page = action.payload;
        },
        setRowsPerPage: (state, action: PayloadAction<number>) => {
            state.pagination.rowsPerPage = action.payload;
        },
        groupMaterials: (state) => {
            state.groupedMaterials = groupMaterialsByCategory(state.materials, state.groups);
        }
    },

    extraReducers: (builder) => {
        builder
            // Fetch Materials
            .addCase(fetchMaterials.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchMaterials.fulfilled, (state, action: PayloadAction<Material[]>) => {
                state.groupedMaterials = groupMaterialsByCategory(state.materials, state.groups);
                state.materials = action.payload;
            })
            .addCase(fetchMaterials.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? "Error loading materials";
            })
            .addCase(addMaterial.fulfilled, (state, action) => {
                state.materials.push(action.payload);
                state.groupedMaterials = groupMaterialsByCategory(state.materials, state.groups);
            })
            .addCase(updateMaterial.fulfilled, (state, action) => {
                const index = state.materials.findIndex(m => m.id === action.payload.id);
                if (index !== -1) {
                    state.materials[index] = action.payload;
                    state.groupedMaterials = groupMaterialsByCategory(state.materials, state.groups);
                }
            })
            .addCase(importMaterial.fulfilled, (state, action) => {
                state.materials.push(action.payload);
                state.groupedMaterials = groupMaterialsByCategory(state.materials, state.groups);
            })
            .addCase(deleteMaterial.fulfilled, (state, action) => {
                state.materials = state.materials.filter(m => m.id !== action.payload);
                state.groupedMaterials = groupMaterialsByCategory(state.materials, state.groups);
            })
            // Fetch Material Groups (all)
            .addCase(fetchMaterialGroups.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchMaterialGroups.fulfilled, (state, action: PayloadAction<MaterialGroup[]>) => {
                state.status = 'succeeded';
                state.groups = action.payload.length > 0 ? action.payload : staticMaterialGroups;

            })
            .addCase(fetchMaterialGroups.rejected, (state, action) => {
                state.status = 'failed';
                state.groups = staticMaterialGroups;
                state.error = action.payload ?? "Error loading material groups";
            })

            // Fetch Paginated Material Groups
            .addCase(fetchPaginatedMaterialGroups.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchPaginatedMaterialGroups.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.groups = action.payload.groups;
                state.pagination.total = action.payload.total;
            })
            .addCase(fetchPaginatedMaterialGroups.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Delete Material Group
            .addCase(deleteMaterialGroup.fulfilled, (state, action) => {
                state.groups = state.groups.filter(group => group.id !== action.payload);
                state.pagination.total -= 1;
            });
    }
});

export const { setPage, setRowsPerPage, groupMaterials } = materialsSlice.actions;

export default materialsSlice.reducer;
