import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Form, Button, Container, Card, Alert, Tabs, Tab } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom'; // Importar Link

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [key, setKey] = useState('login');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate(); // Hook de navegação

  useEffect(() => {
    if (isAuthenticated) navigate('/admin');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    const url = key === 'login' ? 'http://localhost:3000/api/users/login' : 'http://localhost:3000/api/users/register';

    try {
      const response = await fetch(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data || 'Erro desconhecido');
      
      login(data.token);
      navigate('/admin'); 
    } catch (err: any) { setError(err.message || 'Falha ao conectar.'); }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '25rem' }} className="shadow-sm">
        <Card.Header>
          <Tabs activeKey={key} onSelect={(k) => { setKey(k || 'login'); setError(''); }} className="mb-0" fill>
            <Tab eventKey="login" title="Login"></Tab>
            <Tab eventKey="register" title="Registrar"></Tab>
          </Tabs>
        </Card.Header>
        <Card.Body>
          <h4 className="text-center mb-4 fw-light">{key === 'login' ? 'Acesso Restrito' : 'Criar Conta Admin'}</h4>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Senha</Form.Label><Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Form.Group>
            <Button variant="dark" type="submit" className="w-100 mt-2">{key === 'login' ? 'Entrar' : 'Registrar'}</Button>
          </Form>
        </Card.Body>
      </Card>
      <Link to="/" className="mt-3 text-muted">← Voltar para a Loja</Link>
    </Container>
  );
};
