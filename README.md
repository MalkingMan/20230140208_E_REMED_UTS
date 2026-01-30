# 📚 Library System API with Geolocation

A backend REST API for managing library books and tracking book borrowing with geolocation data. Built for academic examination purposes (UCP/UTS).

---

## 📋 Table of Contents

1. [Project Description](#-project-description)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Installation](#-installation)
5. [Database Setup](#-database-setup)
6. [Running the Server](#-running-the-server)
7. [API Documentation](#-api-documentation)
8. [Testing with Postman](#-testing-with-postman)
9. [Error Handling](#-error-handling)
10. [Screenshots](#-screenshots)

---

## 📖 Project Description

This project is a **backend-only REST API** that provides functionality for:

- **Book Management**: CRUD operations for library books (Admin only)
- **Book Browsing**: Public access to view available books
- **Book Borrowing**: Users can borrow books with geolocation tracking
- **Role-Based Access Control**: Using HTTP headers for authentication simulation

### Key Features

- ✅ No JWT/Session authentication (uses HTTP headers)
- ✅ Role-based access control (Admin/User)
- ✅ Geolocation tracking for borrow transactions
- ✅ Stock management with transaction safety
- ✅ Comprehensive input validation
- ✅ Clean JSON error responses

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | v18+ | Runtime environment |
| **Express.js** | v4.18.2 | Web framework |
| **Sequelize** | v6.35.2 | ORM for database operations |
| **MySQL** | v8.0+ | Database |
| **mysql2** | v3.6.5 | MySQL driver |
| **dotenv** | v16.3.1 | Environment configuration |
| **nodemon** | v3.0.2 | Development server |

---

## 📁 Project Structure

```
library-system-geolocation/
├── src/
│   ├── config/
│   │   └── database.js         # Sequelize configuration
│   ├── models/
│   │   ├── Book.js             # Book model
│   │   ├── BorrowLog.js        # BorrowLog model
│   │   └── index.js            # Model associations
│   ├── controllers/
│   │   ├── bookController.js   # Book CRUD logic
│   │   └── borrowController.js # Borrowing logic
│   ├── routes/
│   │   ├── bookRoutes.js       # Book endpoints
│   │   ├── borrowRoutes.js     # Borrow endpoints
│   │   └── index.js            # Route aggregator
│   ├── middleware/
│   │   ├── roleMiddleware.js   # Role-based access control
│   │   └── errorHandler.js     # Error handling
│   ├── scripts/
│   │   ├── syncDatabase.js     # DB sync script
│   │   └── seedData.js         # Sample data script
│   ├── app.js                  # Express app setup
│   └── server.js               # Entry point
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies
└── README.md                   # This file
```

---

## 🚀 Installation

### Prerequisites

- Node.js v18 or higher
- MySQL v8.0 or higher
- npm or yarn
- Postman (for testing)

### Step 1: Clone/Download the Project

```bash
cd library-system-geolocation
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit `.env` with your MySQL credentials:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=library_system
DB_USER=root
DB_PASSWORD=your_password_here
DB_DIALECT=mysql
```

---

## 🗄 Database Setup

### Step 1: Create the Database

Open MySQL and create the database:

```sql
CREATE DATABASE library_system;
```

Or using MySQL command line:

```bash
mysql -u root -p -e "CREATE DATABASE library_system;"
```

### Step 2: Sync Database Tables

Run the sync script to create tables:

```bash
npm run db:sync
```

Or with force (drops existing tables):

```bash
node src/scripts/syncDatabase.js --force
```

### Step 3: Seed Sample Data (Optional)

Populate the database with sample books:

```bash
node src/scripts/seedData.js
```

### Database Schema

#### Books Table
| Column     | Type         | Constraints        |
|------------|--------------|-------------------|
| id         | INT          | PK, AUTO_INCREMENT |
| title      | VARCHAR(255) | NOT NULL          |
| author     | VARCHAR(255) | NOT NULL          |
| stock      | INT          | NOT NULL, >= 0    |
| createdAt  | DATETIME     | Auto-generated    |
| updatedAt  | DATETIME     | Auto-generated    |

#### Borrow_Logs Table
| Column     | Type      | Constraints        |
|------------|-----------|-------------------|
| id         | INT       | PK, AUTO_INCREMENT |
| userId     | INT       | NOT NULL          |
| bookId     | INT       | FK -> books.id    |
| borrowDate | DATE      | NOT NULL          |
| latitude   | FLOAT     | NOT NULL          |
| longitude  | FLOAT     | NOT NULL          |
| createdAt  | DATETIME  | Auto-generated    |
| updatedAt  | DATETIME  | Auto-generated    |

---

## ▶️ Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Expected Output

```
╔════════════════════════════════════════════════════════════╗
║         LIBRARY SYSTEM API WITH GEOLOCATION                ║
╠════════════════════════════════════════════════════════════╣
║  🌐 Server running on: http://localhost:3000              ║
║  📚 API Documentation: http://localhost:3000/api          ║
╚════════════════════════════════════════════════════════════╝
```

---

## 📚 API Documentation

### Headers for Authentication

| Header         | Value              | Description                    |
|----------------|--------------------|--------------------------------|
| `x-user-role`  | `admin` or `user`  | Role for access control        |
| `x-user-id`    | Integer            | User ID (required for `user`)  |

### Endpoints Overview

| Method | Endpoint              | Access  | Description              |
|--------|----------------------|---------|--------------------------|
| GET    | `/api/books`         | Public  | Get all books            |
| GET    | `/api/books/:id`     | Public  | Get book by ID           |
| POST   | `/api/books`         | Admin   | Create a new book        |
| PUT    | `/api/books/:id`     | Admin   | Update a book            |
| DELETE | `/api/books/:id`     | Admin   | Delete a book            |
| POST   | `/api/borrow`        | User    | Borrow a book            |
| GET    | `/api/borrow/my-logs`| User    | Get user's borrow history|
| GET    | `/api/borrow/logs`   | Admin   | Get all borrow logs      |

---

## 🧪 Testing with Postman

### 1. PUBLIC: Get All Books

```
GET http://localhost:3000/api/books
```

**Response:**
```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "count": 10,
  "data": [
    {
      "id": 1,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "stock": 5,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

### 2. PUBLIC: Get Book by ID

```
GET http://localhost:3000/api/books/1
```

### 3. ADMIN: Create a Book

```
POST http://localhost:3000/api/books
```

**Headers:**
```
x-user-role: admin
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "stock": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "id": 11,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "stock": 5,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. ADMIN: Update a Book

```
PUT http://localhost:3000/api/books/1
```

**Headers:**
```
x-user-role: admin
Content-Type: application/json
```

**Body:**
```json
{
  "stock": 10
}
```

### 5. ADMIN: Delete a Book

```
DELETE http://localhost:3000/api/books/1
```

**Headers:**
```
x-user-role: admin
```

### 6. USER: Borrow a Book

```
POST http://localhost:3000/api/borrow
```

**Headers:**
```
x-user-role: user
x-user-id: 123
Content-Type: application/json
```

**Body:**
```json
{
  "bookId": 1,
  "latitude": -6.2088,
  "longitude": 106.8456
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "borrowLog": {
      "id": 1,
      "userId": 123,
      "bookId": 1,
      "borrowDate": "2024-01-15",
      "location": {
        "latitude": -6.2088,
        "longitude": 106.8456
      },
      "createdAt": "2024-01-15T10:45:00.000Z"
    },
    "book": {
      "id": 1,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "remainingStock": 4
    }
  }
}
```

### 7. USER: Get My Borrow History

```
GET http://localhost:3000/api/borrow/my-logs
```

**Headers:**
```
x-user-role: user
x-user-id: 123
```

### 8. ADMIN: Get All Borrow Logs

```
GET http://localhost:3000/api/borrow/logs
```

**Headers:**
```
x-user-role: admin
```

---

## ❌ Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message",
  "details": [] // Optional: validation details
}
```

### Common Error Responses

#### Missing Role Header (400)
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Missing required header: x-user-role"
}
```

#### Invalid Role (400)
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Invalid role: 'manager'. Valid roles are: admin, user"
}
```

#### Access Denied (403)
```json
{
  "success": false,
  "error": "Forbidden",
  "message": "Access denied. This endpoint requires role: admin"
}
```

#### Book Not Found (404)
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Book with ID 999 not found"
}
```

#### Out of Stock (400)
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Book \"The Great Gatsby\" is currently out of stock"
}
```

#### Validation Error (400)
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Title is required and cannot be empty"
}
```

---
## 📝 Notes for Grading

1. **No Authentication Library Used**: Role simulation is done via HTTP headers as required
2. **Transaction Safety**: Book borrowing uses Sequelize transactions to ensure data integrity
3. **Validation**: All inputs are validated with clear error messages
4. **Clean Code**: Follows Express.js best practices with modular structure
5. **Error Handling**: Centralized error handling with proper HTTP status codes
6. **Geolocation**: Latitude and longitude are validated and stored for each borrow

---

## 👨‍💻 Author

Student - Web Application Development Course

---

## 📄 License

ISC License
