# POS System — ระบบขายหน้าร้าน

ระบบ POS สำหรับจัดการสินค้า สต็อก และการขาย

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS    |
| Backend  | Java 17, Spring Boot 3.2, JWT           |
| Database | PostgreSQL 15                           |
| Container| Docker + Docker Compose                 |

## โครงสร้างโปรเจกต์

```
POS-main/
├── db/
│   ├── docker-compose.yml     # PostgreSQL + pgAdmin
│   └── init.sql               # Schema + Seed Data
├── backend/                   # Spring Boot API
│   ├── pom.xml
│   └── src/main/java/com/pos/
│       ├── config/            # SecurityConfig
│       ├── controller/        # REST Controllers
│       ├── dto/               # Request / Response DTOs
│       ├── entity/            # JPA Entities
│       ├── repository/        # Spring Data Repositories
│       └── security/          # JWT Filter & Util
└── front-end/                 # Next.js UI
    └── src/app/
        ├── login/             # หน้าเข้าสู่ระบบ
        ├── dashboard/         # ภาพรวม
        ├── pos/               # หน้าขายสินค้า
        ├── products/          # จัดการสินค้า
        ├── categories/        # จัดการหมวดหมู่
        ├── stock/             # จัดการสต็อก
        └── orders/            # ประวัติการขาย
```

## Prerequisites

| Tool           | Version |
|----------------|---------|
| Java JDK       | 17+     |
| Apache Maven   | 3.8+    |
| Node.js        | 20+     |
| Docker Desktop | Latest  |

## วิธีรันโปรเจกต์

### 1. เริ่ม Database

```bash
cd db
docker-compose up -d
```

- PostgreSQL: `localhost:5432` (user: `pos_user`, pass: `pos_password`, db: `pos_db`)
- pgAdmin: http://localhost:5050 (email: `admin@pos.com`, pass: `admin123`)

### 2. รัน Backend

```bash
cd backend
mvn spring-boot:run
```

Backend: http://localhost:8080

### 3. รัน Frontend

```bash
cd front-end
npm install
npm run dev
```

Frontend: http://localhost:3000

## บัญชีทดสอบ

| Username   | Password   | Role    |
|------------|------------|---------|
| `admin`    | `admin123` | ADMIN   |
| `cashier1` | `admin123` | CASHIER |

## API Endpoints

| Method | Path                        | Description          |
|--------|-----------------------------|----------------------|
| POST   | `/api/auth/login`           | เข้าสู่ระบบ          |
| GET    | `/api/products`             | รายการสินค้า         |
| GET    | `/api/products/barcode/:bc` | ค้นด้วยบาร์โค้ด     |
| POST   | `/api/products`             | เพิ่มสินค้า          |
| PUT    | `/api/products/:id`         | แก้ไขสินค้า          |
| DELETE | `/api/products/:id`         | ลบสินค้า             |
| GET    | `/api/categories`           | รายการหมวดหมู่       |
| GET    | `/api/stock`                | ดูสต็อก              |
| GET    | `/api/stock/low`            | สินค้าใกล้หมด        |
| PATCH  | `/api/stock/:id/adjust`     | ปรับสต็อก            |
| GET    | `/api/orders`               | ประวัติการขาย        |
| POST   | `/api/orders`               | สร้างบิล             |
| GET    | `/api/orders/summary/today` | ยอดขายวันนี้         |

## ผู้พัฒนา

- **konrawitAEK** — aekpeerat2542@gmail.com
