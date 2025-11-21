# 🏠 MackImóveis

**📚 Disciplina:** Programação de Sistemas II

**🏫 Instituição:** Universidade Presbiteriana Mackenzie (UPM)

---

## 📖 Descrição

**MackImóveis** é uma aplicação web desenvolvida para gerenciamento de aluguel de imóveis, permitindo que **proprietários** cadastrem suas propriedades e **inquilinos** realizem reservas de forma simples e intuitiva.

O sistema foi desenvolvido utilizando **Spring Boot** no backend com **PostgreSQL** como banco de dados, e uma interface web responsiva com **HTML, CSS e JavaScript** no frontend. A aplicação implementa operações **CRUD completas** (Criar, Ler, Atualizar, Deletar) para todas as entidades principais.

---

## ✨ Funcionalidades

### 🔐 Autenticação e Usuários
* Sistema de login e cadastro de usuários
* Criptografia de senhas com SHA-256
* Suporte a múltiplos perfis (Proprietário, Inquilino ou Ambos)
* Troca de perfil durante a sessão

### 🏘️ Gestão de Propriedades
* Cadastro de propriedades com título, descrição, localização e capacidade
* Upload de múltiplas fotos por propriedade
* Edição e exclusão de propriedades
* Visualização de propriedades disponíveis e alugadas
* Busca por localização
* Cálculo automático de preço por noite

### 📅 Sistema de Reservas
* Realização de reservas com datas de check-in e check-out
* Validação de conflitos de datas
* Cálculo automático do custo total da reserva
* Visualização de reservas do inquilino
* Cancelamento de reservas
* Busca de propriedades disponíveis por período

### 🎨 Interface
* Design responsivo e moderno
* Navegação intuitiva entre diferentes áreas
* Modais de confirmação para ações críticas
* Mensagens de feedback para o usuário
* Validação de formulários em tempo real

---

## ⚙️ Tecnologias Utilizadas

### 🎨 Front-end
* HTML5
* CSS3
* JavaScript (ES6+)
* jQuery
* jQuery Mask Plugin

### 🧠 Back-end
* **Spring Boot 3.5.7**
* **Java 17**
* **Spring Data JPA**
* **Spring Web**
* **Spring Validation**
* **PostgreSQL** (via Supabase)
* **Hibernate**

### 🗄️ Banco de Dados
* PostgreSQL
* JPA/Hibernate para mapeamento objeto-relacional

---

## 🌐 Rotas da API

### Usuários (`/usuarios`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/usuarios` | Cadastra um novo usuário genérico |
| POST | `/usuarios/proprietario` | Cadastra um usuário como proprietário |
| POST | `/usuarios/inquilino` | Cadastra um usuário como inquilino |
| POST | `/usuarios/login` | Realiza login e autenticação |
| PUT | `/usuarios/{id}` | Atualiza dados de um usuário |
| DELETE | `/usuarios/{id}` | Remove um usuário |

### Propriedades (`/propriedades`)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/propriedades` | Lista todas as propriedades |
| GET | `/propriedades/{id}` | Busca propriedade por ID |
| GET | `/propriedades/disponiveis` | Lista propriedades disponíveis |
| GET | `/propriedades/buscar?localizacao={local}` | Busca propriedades por localização |
| GET | `/propriedades/minhas?proprietarioId={id}` | Lista propriedades de um proprietário |
| GET | `/propriedades/alugadas?proprietarioId={id}` | Lista propriedades alugadas de um proprietário |
| POST | `/propriedades?proprietarioId={id}` | Cadastra nova propriedade |
| PUT | `/propriedades/{id}?proprietarioId={id}` | Atualiza uma propriedade |
| DELETE | `/propriedades/{id}?proprietarioId={id}` | Remove uma propriedade |

### Reservas (`/reservas`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/reservas?inquilinoId={id}&propriedadeId={id}` | Cria uma nova reserva |
| GET | `/reservas?inquilinoId={id}` | Lista reservas de um inquilino |
| GET | `/reservas/buscar?dataCheckin={date}&dataCheckout={date}&localizacao={local}` | Busca propriedades disponíveis por período |
| DELETE | `/reservas/{id}?inquilinoId={id}` | Cancela uma reserva |

### Upload de Arquivos (`/upload`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/upload` | Faz upload de imagens para propriedades |

> 🔧 Todas as rotas podem ser testadas via **Postman** ou através da interface web da aplicação.

---

## 🛠️ Operações CRUD Implementadas

### 👥 Usuários
* ✅ **Create**: Cadastro de novos usuários com diferentes perfis
* ✅ **Read**: Busca e listagem de usuários
* ✅ **Update**: Atualização de dados do usuário
* ✅ **Delete**: Remoção de usuários

### 🏠 Propriedades
* ✅ **Create**: Cadastro de propriedades com fotos
* ✅ **Read**: Listagem, busca por ID, localização e disponibilidade
* ✅ **Update**: Edição de propriedades (com validação de reservas ativas)
* ✅ **Delete**: Remoção de propriedades (com validação de reservas ativas)

### 📅 Reservas
* ✅ **Create**: Criação de reservas com validação de datas
* ✅ **Read**: Listagem de reservas do inquilino
* ✅ **Update**: (Através de cancelamento e nova reserva)
* ✅ **Delete**: Cancelamento de reservas

---
