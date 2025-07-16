import moment from 'moment';

export const sriLankanDistricts = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];

export const systemCapacities = [
  { value: 5, label: '5kW' },
  { value: 10, label: '10kW' },
  { value: 20, label: '20kW' },
  { value: 30, label: '30kW' },
  { value: 40, label: '40kW' },
  { value: 'other', label: 'Other' }
];

export const inverterModels = ['Huawei', 'Solis', 'Other'];

// Calculate next service date (6 months from last service or installation)
export const calculateNextServiceDate = (installationDate, lastServiceDate) => {
  const baseDate = lastServiceDate || installationDate;
  return moment(baseDate).add(6, 'months').toDate();
};

// Format date for display
export const formatDate = (date) => {
  if (!date) return 'Not set';
  return moment(date).format('MMM DD, YYYY');
};

// Format date for form inputs (YYYY-MM-DD)
export const formatDateForInput = (date) => {
  if (!date) return '';
  return moment(date).format('YYYY-MM-DD');
};

// Get service status based on next service date
export const getServiceStatus = (nextServiceDate) => {
  if (!nextServiceDate) return { status: 'unknown', class: 'secondary', text: 'Unknown' };
  
  const today = moment();
  const serviceDate = moment(nextServiceDate);
  const daysDiff = serviceDate.diff(today, 'days');
  
  if (daysDiff < 0) {
    return { 
      status: 'overdue', 
      class: 'danger', 
      text: `Overdue by ${Math.abs(daysDiff)} days` 
    };
  } else if (daysDiff <= 30) {
    return { 
      status: 'due-soon', 
      class: 'warning', 
      text: `Due in ${daysDiff} days` 
    };
  } else {
    return { 
      status: 'current', 
      class: 'success', 
      text: `Due in ${daysDiff} days` 
    };
  }
};

// Validate form data
export const validateInstallationForm = (data) => {
  const errors = {};
  
  if (!data.customerName?.trim()) {
    errors.customerName = 'Customer name is required';
  }
  
  if (!data.systemCapacity?.value || data.systemCapacity.value <= 0) {
    errors.systemCapacity = 'System capacity is required and must be greater than 0';
  }
  
  if (!data.inverterModel) {
    errors.inverterModel = 'Inverter model is required';
  }
  
  if (!data.location?.district) {
    errors.location = 'District is required';
  }
  
  if (!data.installationDate) {
    errors.installationDate = 'Installation date is required';
  } else {
    const instDate = moment(data.installationDate);
    if (instDate.isAfter(moment(), 'day')) {
      errors.installationDate = 'Installation date cannot be in the future';
    }
  }
  
  if (data.lastServiceDate && data.installationDate) {
    const instDate = moment(data.installationDate);
    const serviceDate = moment(data.lastServiceDate);
    
    if (serviceDate.isBefore(instDate, 'day')) {
      errors.lastServiceDate = 'Last service date cannot be before installation date';
    }
    
    if (serviceDate.isAfter(moment(), 'day')) {
      errors.lastServiceDate = 'Last service date cannot be in the future';
    }
  }
  
  return errors;
};

// Format system capacity for display
export const formatCapacity = (capacity) => {
  if (!capacity) return 'Not specified';
  return `${capacity.value}${capacity.unit || 'kW'}`;
};

// Format location for display
export const formatLocation = (location) => {
  if (!location) return 'Not specified';
  if (location.address) {
    return `${location.address}, ${location.district}`;
  }
  return location.district;
};

// Generate search query for API
export const buildSearchParams = (filters) => {
  const params = {};
  
  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }
  
  if (filters.capacity && filters.capacity !== 'all') {
    params.capacity = filters.capacity;
  }
  
  if (filters.district && filters.district !== 'all') {
    params.district = filters.district;
  }
  
  if (filters.page) {
    params.page = filters.page;
  }
  
  if (filters.limit) {
    params.limit = filters.limit;
  }
  
  return params;
};

// Debounce function for search input
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
