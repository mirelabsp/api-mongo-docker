import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Button, Container, Row, Col, Card, Form, Navbar, Modal, Toast, ToastContainer, Badge, ListGroup, Nav, Alert, Spinner } from 'react-bootstrap';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { ClientHome } from './pages/ClientHome';
import { AdminPanel } from './pages/AdminPanel';


const PrivateRoute = ({ children }: { children: any }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<ClientHome />} />
          
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
