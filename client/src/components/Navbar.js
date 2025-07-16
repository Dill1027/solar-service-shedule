import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <i className="bi bi-sun me-2"></i>
          <span className="d-none d-sm-inline">Solar Service Tracker</span>
          <span className="d-inline d-sm-none">Solar Tracker</span>
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="border-0"
        />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/dashboard" 
              active={location.pathname === '/dashboard' || location.pathname === '/'}
              className="mobile-responsive-text"
            >
              <i className="bi bi-speedometer2 me-1"></i>
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/installations"
              active={location.pathname === '/installations'}
              className="mobile-responsive-text"
            >
              <i className="bi bi-list-ul me-1"></i>
              Installations
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Nav.Link href="#" className="text-light mobile-responsive-text">
              <i className="bi bi-person-circle me-1"></i>
              <span className="d-none d-sm-inline">Admin</span>
              <span className="d-inline d-sm-none">User</span>
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
