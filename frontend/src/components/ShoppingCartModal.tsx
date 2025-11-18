import { Modal, Button, ListGroup, Row, Col, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // <-- IMPORTAR AUTH

interface CartModalProps {
  show: boolean;
  onHide: () => void;
}

export const ShoppingCartModal: React.FC<CartModalProps> = ({ show, onHide }) => {
  const { cartItems, removeItem, updateQuantity, cartTotal, clearCart } = useCart();
  const { isAuthenticated, token } = useAuth(); // <-- USAR HOOK DE AUTH

  const [checkoutStep, setCheckoutStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  const API_ORDER_URL = 'http://localhost:3000/api/orders';

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setCheckoutStep(2);
  };

  const handleFinalizeOrder = async () => {
    if (!shippingAddress || !token) return;

    setLoading(true);
    setOrderError('');

    // 1. Mapear itens do carrinho para o formato do backend
    const itemsForApi = cartItems.map(item => ({
        productId: item._id, // O _id do produto
        title: item.title,
        price: item.price,
        quantity: item.quantity,
    }));

    try {
        const response = await fetch(API_ORDER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Envia o token
            },
            body: JSON.stringify({
                items: itemsForApi,
                totalAmount: cartTotal,
                shippingAddress,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao processar o pedido.');
        }

        // Sucesso
        setCheckoutStep(3);
        clearCart();

    } catch (error: any) {
        setOrderError(error.message || 'Erro de conexão.');
        setLoading(false);
        setCheckoutStep(1); // Volta para o carrinho em caso de erro
    } finally {
        setLoading(false);
    }
  };

  const handleModalHide = () => {
    setCheckoutStep(1);
    setShippingAddress('');
    setOrderError('');
    onHide();
  }

  return (
    <Modal show={show} onHide={handleModalHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>🛒 Meu Carrinho ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <div className="text-center py-5"><Spinner animation="border" /> <p>Processando pedido...</p></div>}
        
        {!loading && checkoutStep === 1 && (
            <>
            {orderError && <Alert variant="danger">{orderError}</Alert>}
            <h5 className="mb-3">Resumo dos Itens</h5>
            {cartItems.length === 0 ? (
                <Alert variant="info">Seu carrinho está vazio.</Alert>
            ) : (
                <ListGroup variant="flush">
                    {cartItems.map(item => (
                        <ListGroup.Item key={item._id} className="d-flex justify-content-between align-items-center">
                            <div className="flex-grow-1">
                                <strong>{item.title}</strong>
                                <p className="mb-0 text-muted small">{formatPrice(item.price)} x {item.quantity}</p>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                                    style={{ width: '60px' }}
                                />
                                <Button variant="outline-danger" size="sm" onClick={() => removeItem(item._id)}>
                                    Remover
                                </Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
            </>
        )}

        {!loading && checkoutStep === 2 && (
            <>
                <h5 className="mb-3">2. Endereço de Entrega</h5>
                {(!isAuthenticated || !token) && <Alert variant="warning">Você precisa estar logado para finalizar a compra.</Alert>}
                <Form.Group className="mb-3">
                    <Form.Label>Endereço Completo</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        placeholder="Rua, Número, Bairro e Cidade"
                        value={shippingAddress}
                        onChange={(e: any) => setShippingAddress(e.target.value)}
                        required
                        disabled={!isAuthenticated}
                    />
                </Form.Group>
            </>
        )}
        
        {!loading && checkoutStep === 3 && (
            <div className="text-center py-5">
                <h3 className="text-success">Pedido Enviado com Sucesso!</h3>
                <p className="text-muted">Aguarde a confirmação por email.</p>
                <Button variant="info" onClick={handleModalHide}>Voltar para a loja</Button>
            </div>
        )}

      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        {checkoutStep === 1 && (
            <>
                <h5>Total: <Badge bg="dark">{formatPrice(cartTotal)}</Badge></h5>
                <Button variant="success" onClick={handleCheckout} disabled={cartItems.length === 0}>
                    Finalizar Compra
                </Button>
            </>
        )}
        {checkoutStep === 2 && (
            <>
                <Button variant="secondary" onClick={() => setCheckoutStep(1)}>Voltar</Button>
                <Button variant="success" onClick={handleFinalizeOrder} disabled={!shippingAddress || !isAuthenticated}>
                    Confirmar Pedido ({formatPrice(cartTotal)})
                </Button>
            </>
        )}
      </Modal.Footer>
    </Modal>
  );
};
