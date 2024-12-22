
# CodPet

### Baixar o projeto:
```bash
git clone https://github.com/ifpi-picos/projeto-web-full-stack-mandalori.git
```

### Lado do Backend

### Acesse a pasta principal:
```bash
cd codpet/api
```
### Instalar dependencias:
```bash
npm install 
```

# Crie um arquivo .env com os dados do MySQL da sua máquina
Existe um arquivo de exemplo do .env chamado .envexample que deve ser criado dentro da pasta api, basta apenas adicionar os dados do seu MySQL nos campos.

### Iniciar o projeto:
```bash
npm run start
```

### Lado do Frontend

### Acesse a pasta principal:
```bash
cd codpet/client/rede
```
### Instalar dependencias:
```bash
npm install 
```
### Iniciar o projeto:
```bash
npm run dev
```

# Comandos para criar o banco de dados MYSQL utilizado na aplicação

```bash

CREATE SCHEMA codpet;

USE codpet;

CREATE TABLE codpet.user (
  id SERIAL PRIMARY KEY,
  username VARCHAR(45) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(200),
  "userImg" VARCHAR(300) DEFAULT 'https://st3.depositphotos.com/1007566/32958/v/450/depositphotos_329584890-stock-illustration-young-man-avatar-character-icon.jpg',
  "bgImg" VARCHAR(300) DEFAULT 'https://st4.depositphotos.com/4413287/40922/i/450/depositphotos_409223806-stock-photo-natural-linen-material-textile-canvas.jpg'
);

CREATE TABLE codpet.posts (
  id SERIAL PRIMARY KEY,
  post_desc VARCHAR(200),
  img VARCHAR(300),
  "userId" INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES codpet.user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE codpet.comments (
  id SERIAL PRIMARY KEY,
  comment_desc VARCHAR(200) NOT NULL,
  "comment_user_id" INT NOT NULL,
  "post_id" INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("comment_user_id") REFERENCES codpet.user(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("post_id") REFERENCES codpet.posts(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE codpet.likes (
  id SERIAL PRIMARY KEY,
  "likes_user_id" INT NOT NULL,
  "likes_post_id" INT NOT NULL,
  FOREIGN KEY ("likes_user_id") REFERENCES codpet.user(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("likes_post_id") REFERENCES codpet.posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT unique_user_post_like UNIQUE ("likes_user_id", "likes_post_id")
);


CREATE TABLE codpet.friendship (
  id SERIAL PRIMARY KEY,
  "follower_id" INT NOT NULL,
  "followed_id" INT NOT NULL,
  FOREIGN KEY ("follower_id") REFERENCES codpet.user(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("followed_id") REFERENCES codpet.user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

```

