import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Modal, 
  Form, 
  Alert, 
  Spinner,
  Badge,
  Pagination
} from 'react-bootstrap';
// DatePicker can be added later for enhanced date selection
import { installationService } from '../services/api';
import { toast } from 'react-toastify';
import {
  sriLankanDistricts,
  systemCapacities,
  inverterModels,
  formatDate,
  formatDateForInput,
  getServiceStatus,
  validateInstallationForm,
  formatCapacity,
  formatLocation,
  buildSearchParams,
  debounce,
  calculateNextServiceDate
} from '../utils/helpers';

const Installations = () => {
  const [installations, setInstallations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingInstallation, setEditingInstallation] = useState(null);
  const [pagination, setPagination] = useState({});
  
  // Search and filter states
  const [filters, setFilters] = useState({
    search: '',
    capacity: 'all',
    district: 'all',
    page: 1,
    limit: 12
  });

  // Form data state
  const [formData, setFormData] = useState({
    customerName: '',
    systemCapacity: { value: '', unit: 'kW' },
    inverterModel: '',
    location: { district: '', address: '' },
    installationDate: '',
    lastServiceDate: '',
    note: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  // Debounced search function
  const debouncedSearch = debounce((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  }, 300);

  const fetchInstallations = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = buildSearchParams(filters);
      const response = await installationService.getAll(params);
      setInstallations(response.data);
      setPagination(response.pagination || {});
    } catch (err) {
      console.error('Error fetching installations:', err);
      setError(err.message);
      toast.error('Failed to fetch installations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstallations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleShowModal = (installation = null) => {
    if (installation) {
      setEditingInstallation(installation);
      setFormData({
        customerName: installation.customerName || '',
        systemCapacity: installation.systemCapacity || { value: '', unit: 'kW' },
        inverterModel: installation.inverterModel || '',
        location: installation.location || { district: '', address: '' },
        installationDate: formatDateForInput(installation.installationDate),
        lastServiceDate: formatDateForInput(installation.lastServiceDate),
        note: installation.note || ''
      });
    } else {
      setEditingInstallation(null);
      setFormData({
        customerName: '',
        systemCapacity: { value: '', unit: 'kW' },
        inverterModel: '',
        location: { district: '', address: '' },
        installationDate: '',
        lastServiceDate: '',
        note: ''
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInstallation(null);
    setFormData({
      customerName: '',
      systemCapacity: { value: '', unit: 'kW' },
      inverterModel: '',
      location: { district: '', address: '' },
      installationDate: '',
      lastServiceDate: '',
      note: ''
    });
    setFormErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateInstallationForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitLoading(true);
      
      if (editingInstallation) {
        await installationService.update(editingInstallation._id, formData);
        toast.success('Installation updated successfully');
      } else {
        await installationService.create(formData);
        toast.success('Installation created successfully');
      }
      
      handleCloseModal();
      fetchInstallations();
    } catch (err) {
      console.error('Error saving installation:', err);
      toast.error(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (installation) => {
    if (window.confirm(`Are you sure you want to delete the installation for ${installation.customerName}?`)) {
      try {
        await installationService.delete(installation._id);
        toast.success('Installation deleted successfully');
        fetchInstallations();
      } catch (err) {
        console.error('Error deleting installation:', err);
        toast.error(err.message);
      }
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, search: value }));
    debouncedSearch(value);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const renderInstallationCard = (installation) => {
    const nextServiceDate = calculateNextServiceDate(
      installation.installationDate, 
      installation.lastServiceDate
    );
    const serviceStatus = getServiceStatus(nextServiceDate);

    return (
      <Col key={installation._id} xs={12} sm={6} lg={4} className="installation-card mobile-card-spacing">
        <Card className="h-100 border-0 shadow-sm">
          <div className="installation-header">
            <h5 className="mb-1 mobile-responsive-text">{installation.customerName}</h5>
            <small className="opacity-75 mobile-responsive-text">
              {formatCapacity(installation.systemCapacity)} | {installation.inverterModel}
            </small>
          </div>
          
          <Card.Body className="installation-body">
            <div className="info-row">
              <span className="info-label mobile-responsive-text">Location:</span>
              <span className="info-value mobile-responsive-text">{formatLocation(installation.location)}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label mobile-responsive-text">Installed:</span>
              <span className="info-value mobile-responsive-text">{formatDate(installation.installationDate)}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label mobile-responsive-text">Last Service:</span>
              <span className="info-value mobile-responsive-text">
                {installation.lastServiceDate ? formatDate(installation.lastServiceDate) : 'Not yet'}
              </span>
            </div>
            
            <div className="info-row">
              <span className="info-label mobile-responsive-text">Next Service:</span>
              <Badge bg={serviceStatus.class} className="status-badge">
                {formatDate(nextServiceDate)}
              </Badge>
            </div>

            <div className="info-row">
              <span className="info-label mobile-responsive-text">Status:</span>
              <Badge bg={serviceStatus.class} className="status-badge">
                {serviceStatus.text}
              </Badge>
            </div>

            {installation.note && (
              <div className="info-row">
                <span className="info-label mobile-responsive-text">Note:</span>
                <span className="info-value small mobile-responsive-text">{installation.note}</span>
              </div>
            )}
          </Card.Body>
          
          <Card.Footer className="bg-transparent border-0 pt-0">
            <div className="d-flex gap-2 flex-column flex-sm-row">
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => handleShowModal(installation)}
                className="flex-fill touch-target"
              >
                <i className="bi bi-pencil me-1"></i>
                Edit
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={() => handleDelete(installation)}
                className="touch-target"
              >
                <i className="bi bi-trash me-1"></i>
                Delete
              </Button>
            </div>
          </Card.Footer>
        </Card>
      </Col>
    );
  };

  return (
    <Container className="py-4">
      <div className="mobile-stack mb-4">
        <div className="mobile-text-center">
          <h1 className="mb-0">
            <i className="bi bi-list-ul me-2"></i>
            Installations
          </h1>
        </div>
        <Button 
          variant="primary" 
          onClick={() => handleShowModal()}
          className="mobile-full-width touch-target"
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add Installation
        </Button>
      </div>

      {/* Search and Filter Section */}
      <Card className="search-container mobile-card-spacing">
        <Row className="g-3">
          <Col xs={12} md={6}>
            <Form.Group className="form-group-mobile">
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by customer name or location..."
                value={filters.search}
                onChange={handleSearchChange}
                className="touch-target"
              />
            </Form.Group>
          </Col>
          <Col xs={6} md={3}>
            <Form.Group className="form-group-mobile">
              <Form.Label>Capacity</Form.Label>
              <Form.Select
                value={filters.capacity}
                onChange={(e) => handleFilterChange('capacity', e.target.value)}
                className="touch-target"
              >
                <option value="all">All Capacities</option>
                {systemCapacities.slice(0, -1).map(cap => (
                  <option key={cap.value} value={cap.value}>{cap.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={6} md={3}>
            <Form.Group className="form-group-mobile">
              <Form.Label>District</Form.Label>
              <Form.Select
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                className="touch-target"
              >
                <option value="all">All Districts</option>
                {sriLankanDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <div className="mt-3">Loading installations...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="danger" className="mt-4">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchInstallations}>
            Try Again
          </Button>
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && installations.length === 0 && (
        <div className="empty-state mobile-card-spacing">
          <i className="bi bi-inbox"></i>
          <h3>No installations found</h3>
          <p className="mobile-responsive-text">
            {filters.search || filters.capacity !== 'all' || filters.district !== 'all'
              ? 'Try adjusting your search filters'
              : 'Get started by adding your first solar installation'
            }
          </p>
          <Button 
            variant="primary" 
            onClick={() => handleShowModal()}
            className="touch-target"
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Installation
          </Button>
        </div>
      )}

      {/* Installations Grid */}
      {!loading && !error && installations.length > 0 && (
        <>
          <Row className="g-3 g-md-4 mt-2 mobile-grid-full">
            {installations.map(renderInstallationCard)}
          </Row>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="d-flex justify-content-center mt-4 pagination-mobile">
              <Pagination size="sm">
                <Pagination.Prev 
                  disabled={!pagination.hasPrev}
                  onClick={() => handlePageChange(pagination.current - 1)}
                />
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                  <Pagination.Item
                    key={page}
                    active={page === pagination.current}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Pagination.Item>
                ))}
                <Pagination.Next 
                  disabled={!pagination.hasNext}
                  onClick={() => handlePageChange(pagination.current + 1)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Modal for Add/Edit */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        size="lg"
        className="modal-fullscreen-sm-down"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingInstallation ? 'Edit Installation' : 'Add New Installation'}
          </Modal.Title>
        </Modal.Header>
        
        <Form onSubmit={handleSubmit} className="mobile-form-spacing">
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="form-group-mobile">
                  <Form.Label className="form-label">Customer Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    isInvalid={!!formErrors.customerName}
                    placeholder="Enter customer name"
                    className="touch-target"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.customerName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="form-group-mobile">
                  <Form.Label className="form-label">System Capacity *</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={formData.systemCapacity.value}
                      onChange={(e) => handleInputChange('systemCapacity.value', parseFloat(e.target.value) || '')}
                      isInvalid={!!formErrors.systemCapacity}
                      placeholder="Enter capacity"
                      className="me-2 touch-target"
                    />
                    <Form.Select
                      value={formData.systemCapacity.unit}
                      onChange={(e) => handleInputChange('systemCapacity.unit', e.target.value)}
                      style={{ maxWidth: '80px' }}
                      className="touch-target"
                    >
                      <option value="kW">kW</option>
                      <option value="MW">MW</option>
                    </Form.Select>
                  </div>
                  {formErrors.systemCapacity && (
                    <div className="invalid-feedback d-block">
                      {formErrors.systemCapacity}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="form-group-mobile">
                  <Form.Label className="form-label">Inverter Model *</Form.Label>
                  <Form.Select
                    value={formData.inverterModel}
                    onChange={(e) => handleInputChange('inverterModel', e.target.value)}
                    isInvalid={!!formErrors.inverterModel}
                    className="touch-target"
                  >
                    <option value="">Select inverter model</option>
                    {inverterModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.inverterModel}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="form-group-mobile">
                  <Form.Label className="form-label">District *</Form.Label>
                  <Form.Select
                    value={formData.location.district}
                    onChange={(e) => handleInputChange('location.district', e.target.value)}
                    isInvalid={!!formErrors.location}
                    className="touch-target"
                  >
                    <option value="">Select district</option>
                    {sriLankanDistricts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.location}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="form-group-mobile">
                  <Form.Label className="form-label">Installation Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.installationDate}
                    onChange={(e) => handleInputChange('installationDate', e.target.value)}
                    isInvalid={!!formErrors.installationDate}
                    max={new Date().toISOString().split('T')[0]}
                    className="touch-target"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.installationDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="form-group-mobile">
                  <Form.Label className="form-label">Last Service Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.lastServiceDate}
                    onChange={(e) => handleInputChange('lastServiceDate', e.target.value)}
                    isInvalid={!!formErrors.lastServiceDate}
                    max={new Date().toISOString().split('T')[0]}
                    className="touch-target"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.lastServiceDate}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted mobile-responsive-text">
                    Optional - leave empty if not serviced yet
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="form-group-mobile">
              <Form.Label className="form-label">Address</Form.Label>
              <Form.Control
                type="text"
                value={formData.location.address}
                onChange={(e) => handleInputChange('location.address', e.target.value)}
                placeholder="Enter detailed address (optional)"
                className="touch-target"
              />
            </Form.Group>

            <Form.Group className="form-group-mobile">
              <Form.Label className="form-label">Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                placeholder="Additional notes or remarks (optional)"
                maxLength={500}
                className="touch-target"
              />
              <Form.Text className="text-muted mobile-responsive-text">
                {formData.note.length}/500 characters
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          
          <Modal.Footer className="mobile-sticky-actions">
            <div className="d-flex gap-2 w-100 flex-column flex-sm-row">
              <Button 
                variant="secondary" 
                onClick={handleCloseModal}
                className="mobile-full-width touch-target"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={submitLoading}
                className="mobile-full-width touch-target"
              >
                {submitLoading && (
                  <Spinner animation="border" size="sm" className="me-2" />
                )}
                {editingInstallation ? 'Update Installation' : 'Create Installation'}
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Installations;
