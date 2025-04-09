# Database Schema

This document outlines the database schema for the Bloobase web application, detailing the tables, fields, and relationships.

## Tables

### Users

- **user_id:** Unique identifier for the user (Primary Key)
- **username:** Username of the user
- **email:** Email address of the user
- **password:** Hashed password of the user
- **created_at:** Timestamp of user creation

### Artisans

- **artisan_id:** Unique identifier for the artisan (Primary Key)
- **user_id:** Foreign key referencing the Users table (User who is an artisan)
- **name:** Name of the artisan
- **mobile_number:** Mobile number of the artisan
- **shop_name:** Name of the artisan's shop
- **description:** Description of the artisan's services
- **created_at:** Timestamp of artisan creation
- **profile_img:** Profile image of the artisan

### Products

- **prodcut_id:** Unique identifier for the product (Primary Key)
- **artisan_id:** Foreign key referencing the Artisans table (Artisan who created the product)
- **name:** Name of the product
- **description:** Description of the product
- **price:** Price of the product
- **created_at:** Timestamp of product creation
- **product_img:** Image of the product
- **category:** Category of the product
- **quantity:** Quantity of the product

### Orders

-**order_id:** Unique identifier for the order (Primary Key)

- **user_id:** Foreign key referencing the Users table (User who placed the order)
- **product_id:** Foreign key referencing the Products table (Product ordered)
- **quantity:** Quantity of the product ordered
- **created_at:** Timestamp of order creation
- **total_amount:** Total amount of the order

## Relationships

- A **User** can be an **Artisan** (1-to-1)
- A **User** can place multiple **Orders** (1-to-many)
- An **Artisan** can have multiple **Products** (1-to-many)
- A **Product** can be ordered multiple times (1-to-many)
