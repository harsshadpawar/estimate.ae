import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, IconButton, Chip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { BsCalendarDate } from "react-icons/bs";
import { CustomDatePicker } from "@/components/formikDatePicker"; // Adjust path
import {
  fetchAllSubscriptions,
  fetchCountrySubscriptionPlans,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  clearError,
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
  setCurrentSubscription,
  clearCurrentSubscription,
  type Subscription,
  type SubscriptionCreate,
  type SubscriptionUpdate,
  type CountrySubscriptionPlan,
} from "@/redux/features/subscription/subscriptionSlice";
import { fetchUsers } from "@/redux/features/userSlice";
// Import your store slices
import { fetchAllProducts } from "@/redux/features/product/productSlice"; // Adjust path
import { fetchAllCompanies } from "@/redux/features/company/companySlice"; // Adjust path
import { RootState } from "@/redux/store/store";
import EnhancedTable from "@/components/table";
import DrawerModal from "@/components/drawerModel";
import CustomButton from "@/components/button";
import InputWithDropdown from "@/components/inputWithDropdown";
import Loader from "@/components/loader";



interface FormData {
  user_id: string;
  company_id: string;
  product_id: number;
  subscription_plan_id: number;
  start_date: string;
  end_date: string;
  status: string;
}

interface FormErrors {
  user_id?: string;
  company_id?: string;
  product_id?: string;
  subscription_plan_id?: string;
  start_date?: string;
  end_date?: string;
}

const SubscriptionManagement: React.FC = () => {
  const dispatch = useDispatch();
  const {
    subscriptions,
    currentSubscription,
    countryPlans,
    status,
    createStatus,
    updateStatus,
    deleteStatus,
    error,
  } = useSelector((state: RootState) => state.subscription);

  // Get data from other stores
  const { products } = useSelector((state: RootState) => state.product);
  const { companies } = useSelector((state: RootState) => state.company);
  const { users } = useSelector((state: RootState) => state.users);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    user_id: "",
    company_id: "",
    product_id: 0,
    subscription_plan_id: 1,
    start_date: "",
    end_date: "",
    status: "active",
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  // Load data on component mount
  useEffect(() => {
    dispatch(fetchAllSubscriptions() as any);
    dispatch(fetchCountrySubscriptionPlans() as any);
    dispatch(fetchAllProducts() as any);
    dispatch(fetchAllCompanies() as any);
    dispatch(fetchUsers());
  }, [dispatch]);

  // Prepare dropdown options
  const getUserOptions = () => {
    return users?.map(user => ({
      label: `${user.first_name} (${user.email})`, // Adjust based on your user object structure
      value: user.id.toString()
    })) || [];
  };

  const getCompanyOptions = () => {
    return companies?.map(company => ({
      label: company.name, // Adjust based on your company object structure
      value: company.id.toString()
    })) || [];
  };

  const getProductOptions = () => {
    return products?.map(product => ({
      label: product.name, // Adjust based on your product object structure
      value: product.id.toString()
    })) || [];
  };

  const getSubscriptionPlanOptions = () => {
    return countryPlans?.map(plan => ({
      label: `${plan.features} - ${plan.price} ${plan.currency_code}`, // Adjust based on your plan structure
      value: plan?.id?.toString()
    })) || [];
  };

  // Handle form input changes  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('_id') && name !== 'user_id' && name !== 'company_id'
        ? parseInt(value) || 0
        : value
    }));

    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Handle dropdown changes
  const handleDropdownChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'product_id' || name === 'subscription_plan_id'
        ? parseInt(value) || 0
        : value
    }));

    // Clear error when user makes selection
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Handle date changes
  const handleDateChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user selects date
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.user_id) errors.user_id = "User is required";
    if (!formData.company_id) errors.company_id = "Company is required";
    if (!formData.product_id) errors.product_id = "Product is required";
    if (!formData.subscription_plan_id) errors.subscription_plan_id = "Subscription plan is required";
    if (!formData.start_date) errors.start_date = "Start date is required";
    if (!formData.end_date) errors.end_date = "End date is required";

    // Validate date range
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (endDate <= startDate) {
        errors.end_date = "End date must be after start date";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      user_id: "",
      company_id: "",
      product_id: 0,
      subscription_plan_id: 0,
      start_date: "",
      end_date: "",
      status: "active",
    });
    setFormErrors({});
  };

  // Handle create subscription
  const handleCreate = async () => {
    if (!validateForm()) return;

    const createData: SubscriptionCreate = {
      ...formData,
      start_date: formData.start_date,
      end_date: formData.end_date,
    };

    try {
      await dispatch(createSubscription(createData) as any);
      if (createStatus === 'succeeded') {
        setIsCreateModalOpen(false);
        resetForm();
        dispatch(resetCreateStatus());
      }
    } catch (error) {
      console.error('Create subscription error:', error);
    }
  };

  // Handle edit subscription
  const handleEdit = async () => {
    if (!selectedSubscription || !validateForm()) return;

    const updateData: SubscriptionUpdate = {
      id: selectedSubscription.id,
      ...formData,
    };

    try {
      await dispatch(updateSubscription({
        subscriptionId: selectedSubscription.id,
        data: updateData
      }) as any);
      if (updateStatus === 'succeeded') {
        setIsEditModalOpen(false);
        resetForm();
        setSelectedSubscription(null);
        dispatch(resetUpdateStatus());
      }
    } catch (error) {
      console.error('Update subscription error:', error);
    }
  };

  // Handle delete subscription
  const handleDelete = async () => {
    if (!selectedSubscription) return;

    try {
      await dispatch(deleteSubscription(selectedSubscription.id) as any);
      if (deleteStatus === 'succeeded') {
        setIsDeleteModalOpen(false);
        setSelectedSubscription(null);
        dispatch(resetDeleteStatus());
      }
    } catch (error) {
      console.error('Delete subscription error:', error);
    }
  };

  // Open create modal
  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setFormData({
      user_id: subscription.user_id || "",
      company_id: subscription.company_id || "",
      product_id: subscription.product_id || 0,
      subscription_plan_id: subscription.subscription_plan_id || 0,
      start_date: subscription.start_date?.split('T')[0] || "",
      end_date: subscription.end_date?.split('T')[0] || "",
      status: subscription.status || "active",
    });
    setIsEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    dispatch(setCurrentSubscription(subscription));
    setIsViewModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsDeleteModalOpen(true);
  };

  // Close modals
  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedSubscription(null);
    resetForm();
    dispatch(clearCurrentSubscription());
  };

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Get display names for table
  const getUserName = (userId: string) => {
    const user = users?.find(u => u.id.toString() === userId);
    return user ? `${user.first_name} (${user.email})` : userId;
  };

  const getCompanyName = (companyId: string) => {
    const company = companies?.find(c => c.id.toString() === companyId);
    return company ? company.name : companyId;
  };

  const getProductName = (productId: number) => {
    const product = products?.find(p => p.id === productId);
    return product ? product.name : productId.toString();
  };

  const getPlanName = (planId: number) => {
    const plan = countryPlans?.find(p => p.id === planId);
    return plan ? `${plan.name} - ${plan.price} ${plan.currency}` : planId.toString();
  };

  // Table columns configuration
  const columns = [
    {
      id: 'id',
      label: 'ID',
      sortable: true,
      searchable: true,
    },
    {
      id: 'user_id',
      label: 'User',
      sortable: true,
      searchable: true,
      format: (value: string) => getUserName(value),
    },
    {
      id: 'company_id',
      label: 'Company',
      sortable: true,
      searchable: true,
      format: (value: string) => getCompanyName(value),
    },
    {
      id: 'product_id',
      label: 'Product',
      sortable: true,
      searchable: true,
      format: (value: number) => getProductName(value),
    },
    {
      id: 'subscription_plan_id',
      label: 'Plan',
      sortable: true,
      searchable: true,
      format: (value: number) => getPlanName(value),
    },
    {
      id: 'start_date',
      label: 'Start Date',
      sortable: true,
      format: (value: string) => formatDate(value),
    },
    {
      id: 'end_date',
      label: 'End Date',
      sortable: true,
      format: (value: string) => formatDate(value),
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      searchable: true,
      format: (value: string) => (
        <Chip
          label={value || 'Unknown'}
          color={getStatusColor(value) as any}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      format: (value: any, row: Subscription) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => openViewModal(row)}
            sx={{ color: '#1976d2' }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => openEditModal(row)}
            sx={{ color: '#ed6c02' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => openDeleteModal(row)}
            sx={{ color: '#d32f2f' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Form component with dropdowns
  const SubscriptionForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* User Dropdown */}
      <InputWithDropdown
        label="User"
        options={getUserOptions().map(option => option.label)}
        value={getUserOptions().find(option => option.value === formData.user_id)?.label || ''}
        onChange={(selectedLabel) => {
          const selectedOption = getUserOptions().find(option => option.label === selectedLabel);
          if (selectedOption) {
            handleDropdownChange('user_id', selectedOption.value);
          }
        }}
        error={!!formErrors.user_id}
        helperText={formErrors.user_id}
      />

      {/* Company Dropdown */}
      <InputWithDropdown
        label="Company"
        options={getCompanyOptions().map(option => option.label)}
        value={getCompanyOptions().find(option => option.value === formData.company_id)?.label || ''}
        onChange={(selectedLabel) => {
          const selectedOption = getCompanyOptions().find(option => option.label === selectedLabel);
          if (selectedOption) {
            handleDropdownChange('company_id', selectedOption.value);
          }
        }}
        error={!!formErrors.company_id}
        helperText={formErrors.company_id}
      />

      {/* Product Dropdown */}
      <InputWithDropdown
        label="Product"
        options={getProductOptions().map(option => option.label)}
        value={getProductOptions().find(option => option.value === formData.product_id.toString())?.label || ''}
        onChange={(selectedLabel) => {
          const selectedOption = getProductOptions().find(option => option.label === selectedLabel);
          if (selectedOption) {
            handleDropdownChange('product_id', selectedOption.value);
          }
        }}
        error={!!formErrors.product_id}
        helperText={formErrors.product_id}
      />

      {/* Subscription Plan Dropdown */}
      <InputWithDropdown
        label="Subscription Plan"
        options={getSubscriptionPlanOptions().map(option => option.label)}
        value={getSubscriptionPlanOptions().find(option => option.value === formData.subscription_plan_id.toString())?.label || ''}
        onChange={(selectedLabel) => {
          const selectedOption = getSubscriptionPlanOptions().find(option => option.label === selectedLabel);
          if (selectedOption) {
            handleDropdownChange('subscription_plan_id', selectedOption.value);
          }
        }}
        error={!!formErrors.subscription_plan_id}
        helperText={formErrors.subscription_plan_id}
      />
      <Box sx={{ mt: 2 }}>
        {/* Start Date */}
        <CustomDatePicker
          label="Start Date"
          value={formData.start_date}
          onChange={(value) => handleDateChange('start_date', value)}
          error={!!formErrors.start_date}
          helperText={formErrors.start_date}
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        {/* End Date */}
        <CustomDatePicker
          label="End Date"
          value={formData.end_date}
          onChange={(value) => handleDateChange('end_date', value)}
          error={!!formErrors.end_date}
          helperText={formErrors.end_date}
        />
      </Box>
      {/* Status Dropdown */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <label style={{ fontWeight: 600, color: '#333' }}>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          style={{
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white',
          }}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </Box>
    </Box>
  );

  // View details component
  const ViewDetails = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {selectedSubscription && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color="primary">
              Subscription Details
            </Typography>
            <Chip
              label={selectedSubscription.status || 'Unknown'}
              color={getStatusColor(selectedSubscription.status || '') as any}
              variant="filled"
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">ID</Typography>
              <Typography variant="body1">{selectedSubscription.id}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">User</Typography>
              <Typography variant="body1">{getUserName(selectedSubscription.user_id || '')}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Company</Typography>
              <Typography variant="body1">{getCompanyName(selectedSubscription.company_id || '')}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Product</Typography>
              <Typography variant="body1">{getProductName(selectedSubscription.product_id || 0)}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Plan</Typography>
              <Typography variant="body1">{getPlanName(selectedSubscription.subscription_plan_id || 0)}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Start Date</Typography>
              <Typography variant="body1">{formatDate(selectedSubscription.start_date || '')}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">End Date</Typography>
              <Typography variant="body1">{formatDate(selectedSubscription.end_date || '')}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Created At</Typography>
              <Typography variant="body1">{formatDate(selectedSubscription.created_at || '')}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Updated At</Typography>
              <Typography variant="body1">{formatDate(selectedSubscription.updated_at || '')}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Created By</Typography>
              <Typography variant="body1">{selectedSubscription.created_by || 'N/A'}</Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Main Table */}
      <EnhancedTable
        title="Subscription Management"
        data={subscriptions || []}
        columns={columns}
        add={openCreateModal}
        initialSortColumn="id"
        initialSortDirection="desc"
      />

      {/* Create Modal */}
      <DrawerModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        title="Create New Subscription"
        width={800}
        actions={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <CustomButton
              text="Cancel"
              color="#f5f5f5"
              textColor="#666"
              width="120px"
              height="45px"
              onClick={closeModals}
            />
            <CustomButton
              text={createStatus === 'loading' ? 'Creating...' : 'Create'}
              width="120px"
              height="45px"
              onClick={handleCreate}
              disabled={createStatus === 'loading'}
            />
          </Box>
        }
      >
        <SubscriptionForm />
      </DrawerModal>

      {/* Edit Modal */}
      <DrawerModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        title="Edit Subscription"
        width={500}
        actions={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <CustomButton
              text="Cancel"
              color="#f5f5f5"
              textColor="#666"
              width="120px"
              height="45px"
              onClick={closeModals}
            />
            <CustomButton
              text={updateStatus === 'loading' ? 'Updating...' : 'Update'}
              width="120px"
              height="45px"
              onClick={handleEdit}
              disabled={updateStatus === 'loading'}
            />
          </Box>
        }
      >
        <SubscriptionForm isEdit={true} />
      </DrawerModal>

      {/* View Modal */}
      <DrawerModal
        isOpen={isViewModalOpen}
        onClose={closeModals}
        title="View Subscription"
        width={600}
      >
        <ViewDetails />
      </DrawerModal>

      {/* Delete Confirmation Modal */}
      <DrawerModal
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        title="Delete Subscription"
        width={400}
        actions={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <CustomButton
              text="Cancel"
              color="#f5f5f5"
              textColor="#666"
              width="120px"
              height="45px"
              onClick={closeModals}
            />
            <CustomButton
              text={deleteStatus === 'loading' ? 'Deleting...' : 'Delete'}
              color="#d32f2f"
              width="120px"
              height="45px"
              onClick={handleDelete}
              disabled={deleteStatus === 'loading'}
            />
          </Box>
        }
      >
        <Box sx={{ py: 2 }}>
          <Typography variant="body1" color="textSecondary">
            Are you sure you want to delete this subscription?
          </Typography>
          {selectedSubscription && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2">Subscription ID: {selectedSubscription.id}</Typography>
              <Typography variant="body2">User: {getUserName(selectedSubscription.user_id || '')}</Typography>
              <Typography variant="body2">Status: {selectedSubscription.status}</Typography>
            </Box>
          )}
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </Box>
      </DrawerModal>

      {/* Loading overlay */}
      {status === 'loading' && (
        <Loader loading={status === 'loading'} />
      )}
    </Box>
  );
};

export default SubscriptionManagement;