FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Instala TODAS as dependências (incluindo dev)
RUN npm install

# Copia o código fonte
COPY tsconfig.json ./
COPY . .

# Usa o npx para rodar o tsc localmente (solução para o erro 'tsc not found')
RUN npx tsc

EXPOSE 3000
CMD ["npm", "start"]
