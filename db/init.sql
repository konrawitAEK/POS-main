-- ============================================================
-- POS System Database Schema (PostgreSQL)
-- ============================================================

CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    full_name   VARCHAR(100) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'CASHIER',
    email       VARCHAR(100) UNIQUE,
    phone       VARCHAR(20),
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE suppliers (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    contact     VARCHAR(100),
    phone       VARCHAR(20),
    email       VARCHAR(100),
    address     TEXT,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id            BIGSERIAL PRIMARY KEY,
    barcode       VARCHAR(50)    UNIQUE,
    name          VARCHAR(200)   NOT NULL,
    description   TEXT,
    price         NUMERIC(12,2)  NOT NULL,
    cost_price    NUMERIC(12,2)  NOT NULL DEFAULT 0,
    category_id   BIGINT         REFERENCES categories(id),
    supplier_id   BIGINT         REFERENCES suppliers(id),
    image_url     VARCHAR(500),
    is_active     BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE TABLE stock (
    id              BIGSERIAL PRIMARY KEY,
    product_id      BIGINT        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity        INT           NOT NULL DEFAULT 0,
    min_quantity    INT           NOT NULL DEFAULT 5,
    max_quantity    INT           NOT NULL DEFAULT 500,
    last_updated    TIMESTAMP     NOT NULL DEFAULT NOW(),
    UNIQUE(product_id)
);

CREATE TABLE stock_movements (
    id           BIGSERIAL PRIMARY KEY,
    product_id   BIGINT       NOT NULL REFERENCES products(id),
    user_id      BIGINT       REFERENCES users(id),
    type         VARCHAR(20)  NOT NULL,
    quantity     INT          NOT NULL,
    note         TEXT,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE customers (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    phone       VARCHAR(20)  UNIQUE,
    email       VARCHAR(100) UNIQUE,
    address     TEXT,
    points      INT          NOT NULL DEFAULT 0,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
    id              BIGSERIAL PRIMARY KEY,
    order_number    VARCHAR(50)   NOT NULL UNIQUE,
    customer_id     BIGINT        REFERENCES customers(id),
    user_id         BIGINT        NOT NULL REFERENCES users(id),
    status          VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    subtotal        NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount        NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax             NUMERIC(12,2) NOT NULL DEFAULT 0,
    total           NUMERIC(12,2) NOT NULL DEFAULT 0,
    note            TEXT,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id          BIGSERIAL PRIMARY KEY,
    order_id    BIGINT        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id  BIGINT        NOT NULL REFERENCES products(id),
    quantity    INT           NOT NULL,
    unit_price  NUMERIC(12,2) NOT NULL,
    discount    NUMERIC(12,2) NOT NULL DEFAULT 0,
    subtotal    NUMERIC(12,2) NOT NULL
);

CREATE TABLE payments (
    id              BIGSERIAL PRIMARY KEY,
    order_id        BIGINT        NOT NULL REFERENCES orders(id),
    method          VARCHAR(30)   NOT NULL,
    amount          NUMERIC(12,2) NOT NULL,
    change_amount   NUMERIC(12,2) NOT NULL DEFAULT 0,
    reference_no    VARCHAR(100),
    paid_at         TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_barcode  ON products(barcode);
CREATE INDEX idx_orders_user       ON orders(user_id);
CREATE INDEX idx_orders_customer   ON orders(customer_id);
CREATE INDEX idx_orders_status     ON orders(status);
CREATE INDEX idx_orders_created    ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_stock_product     ON stock(product_id);

-- Seed Data
INSERT INTO users (username, password, full_name, role, email) VALUES
('admin',    '$2a$10$HDCnk56g7YbKASomskMF5uiGfFJzHeo06vkm5/qmAjA.28MSOQ/y.', 'System Admin', 'ADMIN',   'admin@pos.com'),
('cashier1', '$2a$10$HDCnk56g7YbKASomskMF5uiGfFJzHeo06vkm5/qmAjA.28MSOQ/y.', 'สมชาย รักงาน', 'CASHIER', 'cashier1@pos.com');

INSERT INTO categories (name, description) VALUES
('อาหารและเครื่องดื่ม', 'สินค้าประเภทอาหารและเครื่องดื่ม'),
('ของใช้ส่วนตัว',      'สบู่ แชมพู ยาสีฟัน'),
('เครื่องเขียน',       'ปากกา ดินสอ กระดาษ'),
('อุปกรณ์อิเล็กทรอนิกส์', 'แบตเตอรี่ สายชาร์จ'),
('ขนมขบเคี้ยว',        'ขนม ช็อกโกแลต ลูกอม');

INSERT INTO suppliers (name, contact, phone, email) VALUES
('บริษัท ABC จำกัด', 'คุณสมหมาย', '02-123-4567', 'abc@supplier.com'),
('ร้านค้าส่ง XYZ',   'คุณวิไล',   '081-234-5678', 'xyz@supplier.com');

INSERT INTO products (barcode, name, price, cost_price, category_id, supplier_id) VALUES
('8850006001218', 'น้ำดื่มสิงห์ 600ml',   7.00,  4.00,  1, 1),
('8850007001001', 'โค้ก 325ml',           15.00, 10.00, 1, 1),
('8850999001001', 'มาม่า รสต้มยำ',         6.00,  3.50,  1, 2),
('8851234000001', 'สบู่ลักส์',            35.00, 22.00, 2, 2),
('8851234000002', 'ยาสีฟันคอลเกต',        55.00, 38.00, 2, 1),
('8852000000001', 'ปากกาลูกลื่น',         10.00,  5.00,  3, 2),
('8853000000001', 'แบตเตอรี่ AA (2ก้อน)', 45.00, 28.00, 4, 1),
('8854000000001', 'มันฝรั่งทอดกรอบ',      20.00, 13.00, 5, 2);

INSERT INTO stock (product_id, quantity, min_quantity) VALUES
(1,200,20),(2,150,20),(3,300,30),(4,80,10),(5,60,10),(6,200,20),(7,100,15),(8,120,20);
