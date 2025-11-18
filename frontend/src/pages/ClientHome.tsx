import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Navbar, Button, Badge, Modal, Form, ListGroup, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../context/CartContext'; // <-- IMPORTAR CARRINHO
import { ShoppingCartModal } from '../components/ShoppingCartModal'; // <-- IMPORTAR MODAL CARRINHO

const API_BASE_URL = 'http://localhost:3000/api/products';
const STATIC_URL = 'http://localhost:3000/';

export const ClientHome = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const [showDetails, setShowDetails] = useState(false);
  const [showCart, setShowCart] = useState(false); // <-- NOVO ESTADO DO CARRINHO

  const { addItem, cartCount } = useCart(); // <-- USAR HOOK DO CARRINHO

  // Estado para novo comentário (Público)
  const [newReview, setNewReview] = useState({ author: '', rating: '5', description: '' });

  // --- Buscar Produtos ---
  useEffect(() => {
    fetch(`${API_BASE_URL}/allProducts`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // --- Abrir Detalhes ---
  const openDetails = async (product: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/getProductReviews/${product._id}`);
      const data = await res.json();
      setSelectedProduct(data);
      setShowDetails(true);
    } catch (error) { console.error(error); }
  };

  // --- Adicionar Comentário (Público) ---
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!selectedProduct) return;
    try {
        await fetch(`${API_BASE_URL}/addReview/${selectedProduct._id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newReview)
        });
        setNewReview({ author: '', rating: '5', description: '' });
        openDetails(selectedProduct); 
        alert("Comentário enviado!");
    } catch { alert("Erro ao comentar."); }
  };
  
  // --- Adicionar ao Carrinho ---
  const handleAddToCart = (product: any) => {
    addItem({ 
        _id: product._id,
        title: product.title,
        price: product.price,
        quantity: 1
    });
    alert(`${product.title} adicionado ao carrinho!`);
  };


  return (
    <>
      {/* Navbar do Cliente */}
      <Navbar bg="white" expand="lg" className="shadow-sm sticky-top border-bottom py-3">
        <Container>
          <Navbar.Brand className="fw-bold fs-4">🛍️ Minha Loja Inc.</Navbar.Brand>
          <div className="d-flex gap-3">
             {/* BOTÃO DO CARRINHO */}
            <Button variant="warning" onClick={() => setShowCart(true)} className="position-relative">
                🛒 Carrinho
                <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {cartCount}
                </Badge>
            </Button>
             {/* O BOTÃO PARA ACESSO ADMIN */}
            <Link to="/login">
              <Button variant="outline-dark" size="sm">🔒 Acesso Admin</Button>
            </Link>
          </div>
        </Container>
      </Navbar>

      {/* Hero Section (Banner) */}
      <div className="bg-light py-5 mb-5 text-center border-bottom">
        <Container>
          <h1 className="display-4 fw-bold">Bem-vindo à nossa loja</h1>
          <p className="lead text-muted">Os melhores produtos tech você encontra aqui.</p>
        </Container>
      </div>

      <Container className="pb-5">
        {loading && <p className="text-center">Carregando vitrine...</p>}
        
        {!loading && products.length === 0 && (
          <Alert variant="info" className="text-center">Nenhum produto disponível no momento.</Alert>
        )}

        <Row xs={1} md={2} lg={4} className="g-4">
          {products.map((p: any) => (
            <Col key={p._id}>
              <Card className="h-100 border-0 shadow-sm hover-effect">
                <div className="position-relative">
                  <Card.Img 
                    variant="top" 
                    src={p.imageUrl ? `${STATIC_URL}${p.imageUrl}` : `https://placehold.co/600x400?text=${p.title}`} 
                    className="custom-card-img" 
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold">{p.title}</Card.Title>
                  <Card.Text className="text-muted small flex-grow-1 text-truncate">{p.description}</Card.Text>
                  <h5 className="text-success mt-3">{formatPrice(p.price)}</h5>
                </Card.Body>
                <Card.Footer className="bg-white border-0 d-flex gap-2">
                    <Button variant="outline-primary" className="flex-grow-1" size="sm" onClick={() => openDetails(p)}>Ver Detalhes</Button>
                    <Button variant="success" size="sm" onClick={() => handleAddToCart(p)}>Adicionar ➕</Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Modal de Detalhes (Cliente) */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>{selectedProduct?.title}</Modal.Title></Modal.Header>
        <Modal.Body>
            <Row>
                <Col md={6}>
                    <img src={selectedProduct?.imageUrl ? `${STATIC_URL}${selectedProduct?.imageUrl}` : ''} className="img-fluid rounded mb-3" />
                    <h3 className="text-success">{selectedProduct && formatPrice(selectedProduct.price)}</h3>
                    <p className="lead fs-6">{selectedProduct?.description}</p>
                </Col>
                <Col md={6}>
                    <h5 className="border-bottom pb-2">Opinião dos Clientes</h5>
                    <ListGroup variant="flush" className="mb-3" style={{maxHeight: '300px', overflowY: 'auto'}}>
                        {selectedProduct?.reviews?.map((r: any) => (
                            <ListGroup.Item key={r._id}>
                                <strong>{r.author}</strong> <Badge bg="warning" text="dark">★ {r.rating}</Badge>
                                <p className="mb-0 small text-muted">{r.description}</p>
                            </ListGroup.Item>
                        ))}
                        {(!selectedProduct?.reviews || selectedProduct.reviews.length === 0) && <p className="text-muted small">Seja o primeiro a avaliar!</p>}
                    </ListGroup>
                    
                    {/* Formulário de Comentário Público */}
                    <Form onSubmit={handleAddReview} className="bg-light p-3 rounded">
                        <h6 className="mb-3">Deixe sua avaliação</h6>
                        <Row className="g-2">
                            <Col md={8}><Form.Control placeholder="Seu nome" value={newReview.author} onChange={e => setNewReview({...newReview, author: e.target.value})} required size="sm" /></Col>
                            <Col md={4}><Form.Select size="sm" value={newReview.rating} onChange={e => setNewReview({...newReview, rating: e.target.value})}>{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Estrelas</option>)}</Form.Select></Col>
                            <Col md={12}><Form.Control as="textarea" rows={2} placeholder="O que achou do produto?" value={newReview.description} onChange={e => setNewReview({...newReview, description: e.target.value})} required size="sm" /></Col>
                            <Col md={12}><Button type="submit" size="sm" variant="dark" className="w-100">Enviar Comentário</Button></Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Modal.Body>
      </Modal>

      {/* NOVO MODAL DO CARRINHO */}
      <ShoppingCartModal show={showCart} onHide={() => setShowCart(false)} />
    </>
  );
};
