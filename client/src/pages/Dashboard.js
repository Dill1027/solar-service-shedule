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
      <div className="mobile-stack mb-4">
        <div className="mobile-text-center">
          <h1 className="mb-0">
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </h1>
        </div>
        <small className="text-muted mobile-text-center">
          Solar Installation & Service Overview
        </small>
      </div>

      <Row className="g-3 g-md-4">
        <Col xs={6} md={6} lg={3}>
          <Card className="h-100 border-0 shadow-sm mobile-card-spacing">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">
                <i className="bi bi-lightning-charge"></i>
              </div>
              <h3 className="stats-number text-primary">
                {stats?.totalInstallations || 0}
              </h3>
              <p className="stats-label text-muted mb-0 mobile-responsive-text">
                Total Installations
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={6} md={6} lg={3}>
          <Card className="h-100 border-0 shadow-sm mobile-card-spacing">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">
                <i className="bi bi-battery-charging"></i>
              </div>
              <h3 className="stats-number text-success">
                {stats?.totalCapacity ? `${stats.totalCapacity.toFixed(1)}kW` : '0kW'}
              </h3>
              <p className="stats-label text-muted mb-0 mobile-responsive-text">
                Total Capacity
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={6} md={6} lg={3}>
          <Card className="h-100 border-0 shadow-sm mobile-card-spacing">
            <Card.Body className="text-center">
              <div className="display-4 text-info mb-2">
                <i className="bi bi-tools"></i>
              </div>
              <h3 className="stats-number text-info">
                {stats?.servicedInstallations || 0}
              </h3>
              <p className="stats-label text-muted mb-0 mobile-responsive-text">
                Serviced Systems
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={6} md={6} lg={3}>
          <Card className="h-100 border-0 shadow-sm mobile-card-spacing">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">
                <i className="bi bi-calendar-check"></i>
              </div>
              <h3 className="stats-number text-warning">
                {stats?.upcomingServices || 0}
              </h3>
              <p className="stats-label text-muted mb-0 mobile-responsive-text">
                Upcoming Services
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4 mt-md-5">
        <Col lg={8} className="mb-4 mb-lg-0">
          <Card className="border-0 shadow-sm mobile-card-spacing">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                System Overview
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={6}>
                  <div className="info-row">
                    <span className="info-label mobile-responsive-text">Average System Size:</span>
                    <span className="info-value mobile-responsive-text">
                      {stats?.averageCapacity ? `${stats.averageCapacity.toFixed(1)}kW` : 'N/A'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label mobile-responsive-text">Service Rate:</span>
                    <span className="info-value mobile-responsive-text">
                      {stats?.totalInstallations > 0 
                        ? `${((stats.servicedInstallations / stats.totalInstallations) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="info-row">
                    <span className="info-label mobile-responsive-text">Systems Needing Service:</span>
                    <span className="info-value text-warning mobile-responsive-text">
                      {(stats?.totalInstallations || 0) - (stats?.servicedInstallations || 0)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label mobile-responsive-text">Service Completion:</span>
                    <span className="info-value text-success mobile-responsive-text">
                      {stats?.servicedInstallations || 0} / {stats?.totalInstallations || 0}
                    </span>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm mobile-card-spacing">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary touch-target"
                  onClick={() => window.location.href = '/installations'}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add New Installation
                </button>
                <button 
                  className="btn btn-outline-info touch-target"
                  onClick={() => window.location.href = '/installations'}
                >
                  <i className="bi bi-search me-2"></i>
                  View All Installations
                </button>
                <button 
                  className="btn btn-outline-warning touch-target"
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
      <Row className="mt-4 mt-md-5">
        <Col>
          <Card className="border-0 bg-light mobile-card-spacing">
            <Card.Body className="text-center py-4 py-md-5">
              <h2 className="text-primary mb-3">
                <i className="bi bi-sun me-2"></i>
                Welcome to Solar Service Tracker
              </h2>
              <p className="lead text-muted mb-4 mobile-responsive-text">
                Manage your solar on-grid installations and service schedules efficiently
              </p>
              <Row className="g-4">
                <Col md={4} className="mb-3 mb-md-0">
                  <div className="feature-box">
                    <i className="bi bi-shield-check display-4 text-success mb-3"></i>
                    <h5>Track Installations</h5>
                    <p className="text-muted mobile-responsive-text">
                      Keep detailed records of all solar installations with customer information and system specifications.
                    </p>
                  </div>
                </Col>
                <Col md={4} className="mb-3 mb-md-0">
                  <div className="feature-box">
                    <i className="bi bi-calendar2-week display-4 text-info mb-3"></i>
                    <h5>Service Scheduling</h5>
                    <p className="text-muted mobile-responsive-text">
                      Automatically calculate and track service dates to ensure optimal system performance.
                    </p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="feature-box">
                    <i className="bi bi-graph-up-arrow display-4 text-warning mb-3"></i>
                    <h5>Performance Insights</h5>
                    <p className="text-muted mobile-responsive-text">
                      Get insights into your installation portfolio and service completion rates.
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
