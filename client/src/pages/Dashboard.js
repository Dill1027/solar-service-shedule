import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { installationService } from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await installationService.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
      toast.error('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <div className="mt-3">Loading dashboard...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Dashboard</Alert.Heading>
          <p>{error}</p>
          <button 
            className="btn btn-outline-danger" 
            onClick={fetchStats}
          >
            Try Again
          </button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">
          <i className="bi bi-speedometer2 me-2"></i>
          Dashboard
        </h1>
        <small className="text-muted">
          Solar Installation & Service Overview
        </small>
      </div>

      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">
                <i className="bi bi-lightning-charge"></i>
              </div>
              <h3 className="stats-number text-primary">
                {stats?.totalInstallations || 0}
              </h3>
              <p className="stats-label text-muted mb-0">
                Total Installations
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">
                <i className="bi bi-battery-charging"></i>
              </div>
              <h3 className="stats-number text-success">
                {stats?.totalCapacity ? `${stats.totalCapacity.toFixed(1)}kW` : '0kW'}
              </h3>
              <p className="stats-label text-muted mb-0">
                Total Capacity
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-4 text-info mb-2">
                <i className="bi bi-tools"></i>
              </div>
              <h3 className="stats-number text-info">
                {stats?.servicedInstallations || 0}
              </h3>
              <p className="stats-label text-muted mb-0">
                Serviced Systems
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">
                <i className="bi bi-calendar-check"></i>
              </div>
              <h3 className="stats-number text-warning">
                {stats?.upcomingServices || 0}
              </h3>
              <p className="stats-label text-muted mb-0">
                Upcoming Services
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                System Overview
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="info-row">
                    <span className="info-label">Average System Size:</span>
                    <span className="info-value">
                      {stats?.averageCapacity ? `${stats.averageCapacity.toFixed(1)}kW` : 'N/A'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Service Rate:</span>
                    <span className="info-value">
                      {stats?.totalInstallations > 0 
                        ? `${((stats.servicedInstallations / stats.totalInstallations) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="info-row">
                    <span className="info-label">Systems Needing Service:</span>
                    <span className="info-value text-warning">
                      {(stats?.totalInstallations || 0) - (stats?.servicedInstallations || 0)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Service Completion:</span>
                    <span className="info-value text-success">
                      {stats?.servicedInstallations || 0} / {stats?.totalInstallations || 0}
                    </span>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.href = '/installations'}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add New Installation
                </button>
                <button 
                  className="btn btn-outline-info"
                  onClick={() => window.location.href = '/installations'}
                >
                  <i className="bi bi-search me-2"></i>
                  View All Installations
                </button>
                <button 
                  className="btn btn-outline-warning"
                  onClick={fetchStats}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Refresh Dashboard
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Welcome Section */}
      <Row className="mt-5">
        <Col>
          <Card className="border-0 bg-light">
            <Card.Body className="text-center py-5">
              <h2 className="text-primary mb-3">
                <i className="bi bi-sun me-2"></i>
                Welcome to Solar Service Tracker
              </h2>
              <p className="lead text-muted mb-4">
                Manage your solar on-grid installations and service schedules efficiently
              </p>
              <div className="row">
                <div className="col-md-4">
                  <div className="feature-box">
                    <i className="bi bi-shield-check display-4 text-success mb-3"></i>
                    <h5>Track Installations</h5>
                    <p className="text-muted">
                      Keep detailed records of all solar installations with customer information and system specifications.
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="feature-box">
                    <i className="bi bi-calendar2-week display-4 text-info mb-3"></i>
                    <h5>Service Scheduling</h5>
                    <p className="text-muted">
                      Automatically calculate and track service dates to ensure optimal system performance.
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="feature-box">
                    <i className="bi bi-graph-up-arrow display-4 text-warning mb-3"></i>
                    <h5>Performance Insights</h5>
                    <p className="text-muted">
                      Get insights into your installation portfolio and service completion rates.
                    </p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
