import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./Header.css"; // Assuming you have a CSS file for styling

export const header = () => {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home"><strong>Not-Login</strong></Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/Login" className='nav-link'>Login</Nav.Link>
            <Nav.Link as={Link} to="/Register" className='nav-link'>Register</Nav.Link>
            <Nav.Link as={Link} to="/Dashboard" className='nav-link'>Dashboard</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}

export default header;