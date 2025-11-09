drop schema if exists alura_store cascade;

create schema alura_store;

create table alura_store.products (
    id uuid primary key,
    name varchar(255) not null,
    description text not null,
    price decimal(10,2) not null,
    category_id uuid
);

create table alura_store.categories (
  id uuid primary key,
  name varchar(255) not null
);

-- FAKE DATA
insert into alura_store.categories (id, name) values
  ('1e8f1c4e-3c2a-4d5b-9f1e-1c4e3c2a4d5b', 'Electronics'),
  ('2f9g2d5f-4d3b-5e6c-0g2f-2d5f4d3b5e6c', 'Books'),
  ('3g0h3e6g-5e4c-6f7d-1h3g-3e6g5e4c6f7d', 'Clothing');

insert into alura_store.products (id, name, description, price, category_id) values
  ('1e8f1c4e-3c2a-4d5b-9f1e-1c4e3c2a4d5b', 'Smartphone', 'Latest model smartphone', 699.99, '1e8f1c4e-3c2a-4d5b-9f1e-1c4e3c2a4d5b'),
  ('2f9g2d5f-4d3b-5e6c-0g2f-2d5f4d3b5e6c', 'Laptop', 'High-performance laptop', 1299.99, '1e8f1c4e-3c2a-4d5b-9f1e-1c4e3c2a4d5b'),
  ('3g0h3e6g-5e4c-6f7d-1h3g-3e6g5e4c6f7d', 'T-Shirt', 'Comfortable cotton t-shirt', 19.99, '3g0h3e6g-5e4c-6f7d-1h3g-3e6g5e4c6f7d');