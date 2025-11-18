# 📦 Full Stack E-commerce MVP (TypeScript, MongoDB, Docker)

Esta é uma aplicação modelo completa (MVP) que simula um sistema de e-commerce com funcionalidades administrativas e vitrine para clientes. O projeto está 100% containerizado para facilitar o desenvolvimento e o deploy.

## ✨ Destaques da Arquitetura

* **Frontend:** React (Vite), TypeScript, React-Bootstrap, Context API (Carrinho e Auth).
* **Backend:** Node.js, Express, TypeScript, Mongoose.
* **Segurança:** JSON Web Tokens (JWT) e BCrypt para proteção de rotas Admin.
* **DevOps:** Docker Compose, Multi-Stage Build (Nginx para servir o React).

## 🚀 Como Rodar (Modo DevOps)

Certifique-se de que o Docker e o Docker Compose (V2) estão instalados.

1.  **Configurar Segredos:** Crie o arquivo `.env` na raiz do projeto e defina sua chave JWT:
    ```env
    JWT_SECRET="SuaChaveSecretaUnicaAqui"
    DB_URI="mongodb://mongo:27017/node_mongo_api_db"
    ```

2.  **Lançamento (Build & Run):**
    Na raiz do projeto, rode o comando que constrói e inicia todos os quatro serviços.
    ```bash
    docker compose up --build -d
    ```

3.  **Acessar a Aplicação:**
    * **Site/Cliente:** [http://localhost:5173](http://localhost:5173) (Servido pelo Nginx)
    * **Painel Admin:** Use o botão "Acesso Admin" e faça Login.
    * **Monitoramento DB:** [http://localhost:8081](http://localhost:8081) (Mongo Express)

## 🔑 Acesso de Admin (Primeiro Uso)

1.  Acesse o site.
2.  Clique em **🔒 Acesso Admin**.
3.  Vá para a aba **Registrar** para criar a primeira conta (ex: admin@exemplo.com).
4.  Após o login, você será redirecionado para o **Dashboard**.

---

## 🧠 Explicação dos Conceitos Técnicos

Seu projeto é um exemplo excelente de uma aplicação Full Stack desacoplada. Ele é dividido em três camadas: Frontend, Backend e Infraestrutura.

### 1. Backend (Node.js/TypeScript/Segurança)

| Conceito | O que é e Como Foi Usado | Arquivos Relacionados |
| :--- | :--- | :--- |
| **TypeScript (TS)** | Linguagem que adiciona tipagem estática ao JavaScript. **Uso:** Reduz erros em tempo de desenvolvimento (IDE) e facilita a manutenção, tornando a API mais robusta. | `*.ts` em `src/`, `tsconfig.json` |
| **Mongoose** | Um *Object Data Modeling (ODM)* que fornece uma estrutura (Schema) sobre o MongoDB. **Uso:** Define como os documentos (`Product`, `Review`, `User`) devem ser formatados e armazenados. | `src/models/*.ts` |
| **Autenticação JWT** | **JSON Web Token:** Um padrão seguro para criar tokens de acesso. **Uso:** Após o login, o servidor cria um token (assinado com seu `JWT_SECRET`) que o frontend armazena. Este token é enviado em todos os pedidos de admin. | `authController.ts`, `authMiddleware.ts` |
| **Middleware `protect`** | **Uso:** Aplica-se às rotas críticas (`/addProduct`, `/deleteReview`). Antes que a requisição chegue ao controller, ele verifica o Token JWT. Se o Token for inválido, ele retorna `401 Não Autorizado`. | `productRouter.ts`, `authMiddleware.ts` |
| **Multer (Uploads)** | Middleware Express para lidar com `multipart/form-data` (arquivos). **Uso:** Captura a imagem enviada pelo frontend e a salva na pasta `uploads` do servidor, registrando o caminho (`/uploads/imagem_x.jpg`) no banco de dados. | `uploadMiddleware.ts` |
| **Serviço Estático** | **Uso:** Permite que o Node.js sirva arquivos da pasta `uploads` publicamente via URL. Ex: `http://localhost:3000/uploads/imagem_x.jpg`. | `server.ts` (`express.static`) |

### 2. Frontend (React/TypeScript)

| Conceito | O que é e Como Foi Usado | Arquivos Relacionados |
| :--- | :--- | :--- |
| **React Router (SPA)** | Gerencia a navegação sem recarregar a página. **Uso:** Permitiu separar o site em áreas lógicas: `/` (Loja), `/login`, `/admin`. | `App.tsx` (Arquivo principal) |
| **Context API (Auth & Carrinho)** | **Uso:** Gerenciamento de estado global. O `AuthContext` armazena o Token JWT e o `isAuthenticated`, permitindo que o `AdminPanel` cheque o login. O `CartContext` armazena os itens e calcula o total, tornando-o acessível a qualquer componente. | `AuthContext.tsx`, `CartContext.tsx` |
| **Formato BRL** | **Uso:** O utilitário `formatPrice` usou o padrão global `Intl.NumberFormat('pt-BR', { currency: 'BRL' })` para garantir que os preços sejam exibidos como `R$ 10.000,00`. | `formatPrice.ts` |
| **Componentes Modais** | **Uso:** O `Modal` substituiu os `alert()`s nativos, proporcionando uma experiência de edição e confirmação de exclusão mais profissional e não-bloqueante. | `App.tsx` |

### 3. Infraestrutura (Docker Compose)

| Serviço | Função | Conexão Interna |
| :--- | :--- | :--- |
| **`api`** | Backend Node.js (Servidor de Token, Lógica, Upload). | Conecta-se a `mongo:27017` |
| **`mongo`** | Banco de Dados MongoDB. | Fornece dados para os outros serviços. |
| **`mongo-express`** | Interface visual para você gerenciar o banco. | Conecta-se a `mongo:27017` |
| **`frontend`** | **Nginx** (servidor web). | Serve os arquivos estáticos do React em alta velocidade. |
| **Volumes** | **Uso:** As imagens salvas na pasta `uploads` são persistidas mesmo se o container cair. | `./uploads:/app/uploads` |
