import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Badge, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const [status, setStatus] = useState<any>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/status', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) setStatus(await response.json());
      } catch (error) { console.error(error); }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [token]);

  if (!status) return <Container className="text-center py-5"><Spinner animation="border" /></Container>;

  return (
    <Container className="py-4">
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-dark text-white fw-bold">API Status</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between">Status <Badge bg="success">{status.api.status}</Badge></ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">Uptime <Badge bg="secondary">{status.api.uptime}</Badge></ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-dark text-white fw-bold">🗄️ Banco de Dados</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between">Conexão <Badge bg="success">{status.database.status}</Badge></ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">Produtos <Badge bg="primary">{status.database.collections.products}</Badge></ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">Usuários <Badge bg="primary">{status.database.collections.users}</Badge></ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">Reviews <Badge bg="primary">{status.database.collections.reviews}</Badge></ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
