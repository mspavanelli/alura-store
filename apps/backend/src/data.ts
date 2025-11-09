import pgp from 'pg-promise';
import crypto from 'crypto';

const databaseConfig = {
  host: 'localhost',
  port: 5432,
  database: 'alura_store',
  user: 'admin',
  password: '123456',
};

export async function getAllProducts() {
  const connection = pgp()(databaseConfig);
  const products = await connection.query('SELECT * FROM alura_store.products');
  await connection.$pool.end();
  return products;
}

export async function getProductById(id: string) {
  const connection = pgp()(databaseConfig);
  const product = await connection.oneOrNone(
    'SELECT * FROM alura_store.products WHERE id = $1',
    [id]
  );
  await connection.$pool.end();
  return product;
}

export async function addProduct(
  name: string,
  description: string,
  price: number,
  used: boolean
) {
  const connection = pgp()(databaseConfig);
  const id = crypto.randomUUID();
  await connection.none(
    'INSERT INTO alura_store.products(id, name, description, price, used) VALUES($1, $2, $3, $4, $5)',
    [id, name, description, price, used]
  );
  await connection.$pool.end();
  return id;
}

export async function updateProduct(
  id: string,
  name: string,
  description: string,
  price: number,
  used: boolean
) {
  const connection = pgp()(databaseConfig);
  const result = await connection.result(
    'UPDATE alura_store.products SET name = $1, description = $2, price = $3, used = $4 WHERE id = $5',
    [name, description, price, used, id]
  );
  await connection.$pool.end();
  return result.rowCount;
}

export async function deleteProduct(id: string) {
  const connection = pgp()(databaseConfig);
  const result = await connection.result(
    'DELETE FROM alura_store.products WHERE id = $1',
    [id]
  );
  await connection.$pool.end();
  return result.rowCount;
}

export async function getAllCategories() {
  const connection = pgp()(databaseConfig);
  const categories = await connection.query('SELECT * FROM alura_store.categories');
  await connection.$pool.end();
  return categories;
}

export async function addCategory(name: string) {
  const connection = pgp()(databaseConfig);
  const id = crypto.randomUUID();
  await connection.none('INSERT INTO alura_store.categories(id, name) VALUES($1, $2)', [
    id,
    name,
  ]);
  await connection.$pool.end();
  return id;
}
