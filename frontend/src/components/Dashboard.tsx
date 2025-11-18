import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import 'bootstrap-icons/font/bootstrap-icons.css'; 

const API_STATUS = 'http://localhost:3000/api/status';

export const Dashboard = () => {
  const [status, setStatus] = useState<any>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(API_STATUS, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Falha na autenticação');
        
        const data = await response.json();
        
        // Adiciona um timestamp para garantir que o React renderize uma data válida
        setStatus({...data, timestamp: new Date(data.timestamp || Date.now()) });

      } catch (error) { 
        console.error("Error fetching status:", error); 
        // Se a API falhar, mostramos um estado de erro
        setStatus({
          api: { status: 'Fora do Ar', uptime: 'N/A' },
          database: { connection: 'ERRO' },
          timestamp: new Date()
        });
      }
    };
    
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Polling a cada 5s
    return () => clearInterval(interval);
  }, [token]);

  if (!status) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Carregando status do sistema...</p>
      </Container>
    );
  }

  // Desestruturação segura dos contadores
  const collections = status.database?.collections || {};
  const totalOrders = collections.orders ?? 0;
  const totalProducts = collections.products ?? 0;
  const totalUsers = collections.users ?? 0;
  const totalReviews = collections.reviews ?? 0;
  const dbConnection = status.database?.connection || 'ERRO';

  return (
    <Container className="my-4">
      <h2 className="mb-4">Dashboard de Administração</h2>
      <Row>
        {/* Card de Vendas (Pedidos) */}
        <Col md={6} lg={3} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-muted">Total de Pedidos (Vendas)</Card.Title>
              <Card.Text className="h2 d-flex justify-content-between align-items-center">
                <i className="bi bi-cart-fill text-success"></i>
                <Badge bg="success" className="p-2">{totalOrders}</Badge>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Card de Produtos */}
        <Col md={6} lg={3} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-muted">Produtos Cadastrados</Card.Title>
              <Card.Text className="h2 d-flex justify-content-between align-items-center">
                <i className="bi bi-box-seam text-primary"></i>
                <Badge bg="primary" className="p-2">{totalProducts}</Badge>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Card de Usuários */}
        <Col md={6} lg={3} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-muted">Usuários Registrados</Card.Title>
              <Card.Text className="h2 d-flex justify-content-between align-items-center">
                <i className="bi bi-people-fill text-info"></i>
                <Badge bg="info" className="p-2">{totalUsers}</Badge>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Card de Avaliações */}
        <Col md={6} lg={3} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-muted">Avaliações de Produtos</Card.Title>
              <Card.Text className="h2 d-flex justify-content-between align-items-center">
                <i className="bi bi-star-fill text-warning"></i>
                <Badge bg="warning" className="p-2">{totalReviews}</Badge>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Detalhes do Servidor / Banco de Dados */}
      <Row>
        <Col>
          <Card className="shadow-sm border-0 mt-4">
            <Card.Header>Status do Sistema</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between">
                Conexão com Banco de Dados:
                <Badge bg={dbConnection === 'OK' ? 'success' : 'danger'}>
                  {dbConnection}
                </Badge>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                Última Atualização:
                <Badge bg="secondary">
                  {new Date(status.timestamp).toLocaleTimeString()} {/* <-- AGORA FUNCIONA */}
                </Badge>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
