# E-commerce  (TypeScript, MongoDB, Docker)

Esta é uma aplicação modelo completa que simula um sistema de e-commerce com funcionalidades administrativas e vitrine para clientes. O projeto está containerizado para facilitar o desenvolvimento e o deploy.

## Destaques da Arquitetura

* **Frontend:** React (Vite), TypeScript, React-Bootstrap, Context API (Carrinho e Auth).
* **Backend:** Node.js, Express, TypeScript, Mongoose.
* **Segurança:** JSON Web Tokens (JWT) e BCrypt para proteção de rotas Admin.
* **DevOps:** Docker Compose, Multi-Stage Build (Nginx para servir o React).

## Como Rodar (Modo DevOps)

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
