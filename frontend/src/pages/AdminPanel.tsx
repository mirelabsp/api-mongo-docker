import { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Form, Modal, ListGroup, Nav, Navbar, ToastContainer, Toast, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Dashboard } from '../components/Dashboard';
import { formatPrice } from '../utils/formatPrice';
import { Link } from 'react-router-dom';

const API = 'http://localhost:3000/api/products';
const STATIC = 'http://localhost:3000/';

export const AdminPanel = () => {
  const { token, logout } = useAuth();
  const [prods, setProds] = useState<any[]>([]);
  const [view, setView] = useState('products');
  const [modal, setModal] = useState(false);
  const [det, setDet] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [sel, setSel] = useState<any>(null);
  const [form, setForm] = useState({title:'', price:'', description:''});
  const [file, setFile] = useState<File|null>(null);
  const [msg, setMsg] = useState({show:false, txt:'', var:'success'});
  
  const toast = (txt:string, v:any) => setMsg({show:true, txt, var:v});
  const getProds = async () => { try { setProds(await (await fetch(`${API}/allProducts`)).json()); } catch {} };
  useEffect(() => { getProds(); }, []);

  const save = async (e:any) => { e.preventDefault();
    const d = new FormData(); d.append('title', form.title); d.append('price', form.price); d.append('description', form.description); d.append('published', 'true'); if(file) d.append('image', file);
    try {
      const res = await fetch(edit ? `${API}/updateProduct/${edit._id}` : `${API}/addProduct`, { method: edit?'PUT':'POST', headers: {'Authorization': `Bearer ${token}`}, body: d });
      if(!res.ok) throw new Error(); getProds(); setModal(false); toast("Salvo!", 'success');
    } catch { toast("Erro ao salvar", 'danger'); }
  };
  
  const del = async (id:string) => { if(!confirm("Deletar?")) return; await fetch(`${API}/deleteProduct/${id}`, {method:'DELETE', headers:{'Authorization':`Bearer ${token}`}}); getProds(); toast("Apagado", 'success'); };
  
  const openDet = async (p:any) => { const d = await (await fetch(`${API}/getProductReviews/${p._id}`)).json(); setSel(d); setDet(true); };
  
  const delRev = async (rid: string) => { await fetch(`${API}/reviews/${rid}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); const d = await (await fetch(`${API}/getProductReviews/${sel._id}`)).json(); setSel(d); toast("Review removida.", 'success'); };

  return (
    <>
      {/* Navbar do Admin */}
      <Navbar bg="dark" variant="dark" sticky="top">
        <Container>
          <Navbar.Brand>📦 Painel Admin</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as="span" className={`admin-nav-link ${view === 'products' ? 'active' : ''}`} onClick={() => setView('products')}>Produtos</Nav.Link>
            <Nav.Link as="span" className={`admin-nav-link ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>Dashboard</Nav.Link>
          </Nav>
          <div className="d-flex gap-2">
            <Link to="/"><Button variant="outline-light" size="sm">Ir para Loja</Button></Link>
            <Button variant="danger" size="sm" onClick={logout}>Sair</Button>
          </div>
        </Container>
      </Navbar>

      {/* RENDERIZAÇÃO CONDICIONAL */}
      {view==='dashboard' ? <Dashboard /> : (
        <Container className="py-4">
            <div className="d-flex justify-content-between mb-4"><h3>Gerenciar Estoque</h3><Button variant="success" onClick={()=>{setEdit(null); setForm({title:'', price:'', description:''}); setFile(null); setModal(true)}}>+ Novo Produto</Button></div>
            <Row xs={1} md={4} className="g-4">{prods.map(p => (
              <Col key={p._id}><Card className="h-100 shadow-sm" style={{cursor:'pointer'}} onClick={()=>openDet(p)}>
                <Card.Img variant="top" src={p.imageUrl ? `${STATIC}${p.imageUrl}` : `https://placehold.co/600x400?text=${p.title}`} className="custom-card-img" />
                <Card.Body><Card.Title>{p.title}</Card.Title><h5 className="text-success">{formatPrice(p.price)}</h5></Card.Body>
                <Card.Footer className="bg-white d-flex gap-2" onClick={e=>e.stopPropagation()}><Button size="sm" variant="warning" className="flex-grow-1" onClick={()=>{setEdit(p); setForm({title:p.title, price:String(p.price), description:p.description}); setModal(true)}}>Editar</Button><Button size="sm" variant="danger" onClick={()=>del(p._id)}>X</Button></Card.Footer>
              </Card></Col>
            ))}</Row>
        </Container>
      )}

      {/* Modal Formulário (Create/Edit) */}
      <Modal show={modal} onHide={()=>setModal(false)} centered><Form onSubmit={save}><Modal.Header closeButton><Modal.Title>{edit?'Editar':'Criar'}</Modal.Title></Modal.Header><Modal.Body>
        <Form.Group className="mb-2"><Form.Label>Nome</Form.Label><Form.Control value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required/></Form.Group>
        <Form.Group className="mb-2"><Form.Label>Preço</Form.Label><Form.Control type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required/></Form.Group>
        <Form.Group className="mb-2"><Form.Label>Descrição</Form.Label><Form.Control as="textarea" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/></Form.Group>
        <Form.Group className="mb-2"><Form.Label>Imagem</Form.Label><Form.Control type="file" onChange={(e:any)=>setFile(e.target.files[0])}/></Form.Group>
      </Modal.Body><Modal.Footer><Button type="submit">Salvar</Button></Modal.Footer></Form></Modal>

      {/* Modal Detalhes (Gerenciar Reviews) */}
      <Modal show={det} onHide={()=>setDet(false)} size="lg" centered><Modal.Header closeButton><Modal.Title>Gerenciar Comentários</Modal.Title></Modal.Header><Modal.Body><Row><Col md={6}>
        <img src={sel?.imageUrl ? `${STATIC}${sel?.imageUrl}` : ''} className="img-fluid rounded mb-3"/><h4>{sel && formatPrice(sel.price)}</h4><p>{sel?.description}</p>
      </Col><Col md={6}><h5>Reviews dos Clientes</h5><ListGroup variant="flush" className="mb-3" style={{maxHeight:'300px', overflowY:'auto'}}>{sel?.reviews?.map((r:any)=>(<ListGroup.Item key={r._id} className="d-flex justify-content-between"><div><strong>{r.author}</strong> <Badge bg="warning" text="dark">★ {r.rating}</Badge><br/><small>{r.description}</small></div><Button size="sm" variant="link" className="text-danger" onClick={()=>delRev(r._id)}>Excluir (Admin)</Button></ListGroup.Item>))}</ListGroup>
      </Col></Row></Modal.Body></Modal>

      {/* Toast Container */}
      <ToastContainer position="bottom-end" className="p-3"><Toast onClose={()=>setMsg({...msg, show:false})} show={msg.show} delay={3000} autohide bg={msg.var}><Toast.Body className="text-white">{msg.txt}</Toast.Body></Toast></ToastContainer>
    </>
  );
};
