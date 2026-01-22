# Database Structure for EduFit E-Commerce Platform

## Overview
This document outlines the database structure for the EduFit school/university uniform e-commerce platform.

---

## Core Tables

### 1. **users** (Already exists)
```sql
- id (bigint, primary key)
- name (string)
- email (string, unique)
- email_verified_at (timestamp, nullable)
- password (string)
- phone (string, nullable) - Add for customer contact
- role (enum: 'customer', 'admin') - Add for role management
- remember_token (string, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### 2. **categories**
```sql
- id (bigint, primary key)
- name (string) - e.g., "Shirt", "Pant", "Blouse"
- slug (string, unique)
- description (text, nullable)
- image (string, nullable)
- is_active (boolean, default: true)
- created_at (timestamp)
- updated_at (timestamp)
```

### 3. **products**
```sql
- id (bigint, primary key)
- name (string)
- slug (string, unique)
- category_id (bigint, foreign key -> categories.id)
- description (text, nullable)
- base_price (decimal 10,2)
- image (string, nullable)
- is_active (boolean, default: true)
- stock_quantity (integer, default: 0)
- min_order_quantity (integer, default: 1)
- is_customizable (boolean, default: false) - For custom orders
- created_at (timestamp)
- updated_at (timestamp)
```

### 4. **product_sizes**
```sql
- id (bigint, primary key)
- product_id (bigint, foreign key -> products.id)
- size (enum: 'S', 'M', 'L', 'XL', 'XXL') - or string for flexibility
- price_adjustment (decimal 10,2, default: 0) - Price difference for this size
- stock_quantity (integer, default: 0)
- is_available (boolean, default: true)
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE(product_id, size)
```

### 5. **product_images**
```sql
- id (bigint, primary key)
- product_id (bigint, foreign key -> products.id)
- image_path (string)
- is_primary (boolean, default: false)
- display_order (integer, default: 0)
- created_at (timestamp)
- updated_at (timestamp)
```

---

## Order Management

### 6. **orders**
```sql
- id (bigint, primary key)
- order_number (string, unique) - e.g., "ORD-2024-001234"
- user_id (bigint, foreign key -> users.id, nullable) - Nullable for guest orders
- customer_name (string) - For guest orders
- customer_email (string)
- customer_phone (string)
- delivery_address (text)
- order_type (enum: 'standard', 'custom') - Standard or custom order
- status (enum: 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
- subtotal (decimal 10,2)
- shipping_cost (decimal 10,2, default: 0)
- total_amount (decimal 10,2)
- payment_status (enum: 'pending', 'paid', 'failed', 'refunded')
- payment_method (string, nullable) - e.g., "KBZ PAY", "AYA PAY"
- transaction_id (string, nullable) - Last 4 digits or full transaction ID
- notes (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### 7. **order_items**
```sql
- id (bigint, primary key)
- order_id (bigint, foreign key -> orders.id)
- product_id (bigint, foreign key -> products.id, nullable) - Nullable for custom items
- product_name (string) - Store name for historical reference
- product_type (string, nullable) - For custom orders
- size (string, nullable)
- quantity (integer)
- unit_price (decimal 10,2) - Price at time of order
- total_price (decimal 10,2) - quantity * unit_price
- created_at (timestamp)
- updated_at (timestamp)
```

### 8. **custom_orders**
```sql
- id (bigint, primary key)
- order_id (bigint, foreign key -> orders.id, nullable) - Link to order if converted
- customer_type (enum: 'child', 'adult')
- gender (enum: 'male', 'female', 'unisex')
- uniform_type (string) - e.g., "School Shirt", "Pant", "Blouse"
- size_small_quantity (integer, default: 0)
- size_medium_quantity (integer, default: 0)
- size_large_quantity (integer, default: 0)
- notes (text, nullable)
- status (enum: 'pending', 'quoted', 'accepted', 'rejected', 'completed')
- quoted_price (decimal 10,2, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

---

## Shopping Cart

### 9. **cart_items**
```sql
- id (bigint, primary key)
- user_id (bigint, foreign key -> users.id, nullable) - Nullable for guest carts
- session_id (string, nullable) - For guest carts
- product_id (bigint, foreign key -> products.id)
- product_size_id (bigint, foreign key -> product_sizes.id, nullable)
- size (string) - Store size directly for flexibility
- quantity (integer)
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE(user_id, product_id, size) or UNIQUE(session_id, product_id, size)
```

---

## Payment Management

### 10. **payment_methods**
```sql
- id (bigint, primary key)
- name (string) - e.g., "KBZ PAY", "AYA PAY"
- bank_name (string)
- account_name (string)
- account_number (string)
- qr_code_image (string, nullable)
- is_active (boolean, default: true)
- display_order (integer, default: 0)
- created_at (timestamp)
- updated_at (timestamp)
```

### 11. **payments**
```sql
- id (bigint, primary key)
- order_id (bigint, foreign key -> orders.id)
- payment_method_id (bigint, foreign key -> payment_methods.id)
- amount (decimal 10,2)
- transaction_id (string) - Last 4 digits or full ID
- payment_type (enum: 'bank', 'qr')
- status (enum: 'pending', 'verified', 'failed', 'refunded')
- verified_at (timestamp, nullable)
- verified_by (bigint, foreign key -> users.id, nullable) - Admin who verified
- notes (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

---

## Address Management

### 12. **addresses**
```sql
- id (bigint, primary key)
- user_id (bigint, foreign key -> users.id)
- type (enum: 'home', 'work', 'other')
- full_name (string)
- phone (string)
- address_line_1 (string)
- address_line_2 (string, nullable)
- city (string)
- state (string, nullable)
- postal_code (string, nullable)
- country (string, default: 'Myanmar')
- is_default (boolean, default: false)
- created_at (timestamp)
- updated_at (timestamp)
```

---

## Additional Features

### 13. **order_status_history**
```sql
- id (bigint, primary key)
- order_id (bigint, foreign key -> orders.id)
- status (enum: 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
- notes (text, nullable)
- changed_by (bigint, foreign key -> users.id, nullable)
- created_at (timestamp)
```

### 14. **notifications**
```sql
- id (bigint, primary key)
- user_id (bigint, foreign key -> users.id)
- type (string) - e.g., 'order_confirmed', 'order_shipped', 'payment_received'
- title (string)
- message (text)
- is_read (boolean, default: false)
- related_id (bigint, nullable) - ID of related order, etc.
- created_at (timestamp)
- updated_at (timestamp)
```

---

## Indexes Recommendations

```sql
-- Performance indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_session_id ON cart_items(session_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_product_sizes_product_id ON product_sizes(product_id);
```

---

## Relationships Summary

1. **User** → has many **Orders**, **Cart Items**, **Addresses**
2. **Category** → has many **Products**
3. **Product** → belongs to **Category**, has many **Product Sizes**, **Product Images**, **Order Items**, **Cart Items**
4. **Order** → belongs to **User**, has many **Order Items**, **Payments**, **Status History**, may have one **Custom Order**
5. **Order Item** → belongs to **Order**, **Product**
6. **Custom Order** → belongs to **Order** (optional)
7. **Cart Item** → belongs to **User** (or session), **Product**, **Product Size**
8. **Payment** → belongs to **Order**, **Payment Method**, **User** (verifier)
9. **Address** → belongs to **User**

---

## Migration Priority

1. **Phase 1 (Core)**: users (extend), categories, products, product_sizes, product_images
2. **Phase 2 (Orders)**: orders, order_items, custom_orders
3. **Phase 3 (Cart & Payment)**: cart_items, payment_methods, payments
4. **Phase 4 (Enhancement)**: addresses, order_status_history, notifications

---

## Notes

- Use **soft deletes** for products and orders if needed
- Consider **audit logs** for sensitive operations
- Add **timestamps** to all tables for tracking
- Use **enums** for fixed value sets (status, type, etc.)
- Consider **JSON columns** for flexible data (e.g., product attributes)
- Add **slug fields** for SEO-friendly URLs
- Consider **stock management** triggers/events for inventory
