import express from 'express';
import cors from 'cors';
import pgp from 'pg-promise';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const databaseConfig = {
  host: 'localhost',
  port: 5432,
  database: 'alura_store',
  user: 'admin',
  password: '123456',
};

app.get('/products', async (request, response) => {
  const connection = pgp()(databaseConfig);
  try {
    const data = await connection.any('SELECT * FROM alura_store.products');
    response.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    response.status(500).send('Internal Server Error');
  } finally {
    connection.$pool.end();
  }
});

app.get('/products/:id', async (request, response) => {
  const connection = pgp()(databaseConfig);
  const { id } = request.params;
  try {
    const data = await connection.oneOrNone(
      'SELECT * FROM alura_store.products WHERE id = $1',
      [id]
    );
    if (data) {
      const product = {
        id: data.id,
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        used: data.used,
      };
      response.json(product);
    } else {
      response.status(404).send('Product not found');
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    response.status(500).send('Internal Server Error');
  } finally {
    connection.$pool.end();
  }
});

app.post('/add-product', async (request, response) => {
  const connection = pgp()(databaseConfig);
  const { name, description, price, used } = request.body;
  const id = crypto.randomUUID();

  try {
    if (
      !name ||
      typeof name !== 'string' ||
      name.trim() === '' ||
      !description ||
      typeof description !== 'string' ||
      description.trim() === '' ||
      !price ||
      typeof price !== 'number' ||
      price <= 0
    ) {
      response.status(400).send('Bad Request');
      return;
    }
    await connection.none(
      'INSERT INTO alura_store.products(id, name, description, price, used) VALUES($1, $2, $3, $4, $5)',
      [id, name, description, price, used || false]
    );
    response.status(201).json({ id });
  } catch (error) {
    console.error('Error adding product:', error);
    response.status(400).send('Bad Request');
  } finally {
    connection.$pool.end();
  }
});

app.post('/update-product/:id', async (request, response) => {
  const connection = pgp()(databaseConfig);
  const { id } = request.params;
  const { name, description, price, used } = request.body;

  try {
    if (
      !name ||
      typeof name !== 'string' ||
      name.trim() === '' ||
      !description ||
      typeof description !== 'string' ||
      description.trim() === '' ||
      !price ||
      typeof price !== 'number' ||
      price <= 0
    ) {
      response.status(400).send('Bad Request');
      return;
    }

    const result = await connection.result(
      'UPDATE alura_store.products SET name = $1, description = $2, price = $3, used = $4 WHERE id = $5',
      [name, description, price, used || false, id]
    );
    if (result.rowCount > 0) {
      response.status(200).send('Product updated successfully');
    } else {
      response.status(404).send('Product not found');
    }
  } catch (error) {
    console.error('Error updating product:', error);
    response.status(500).send('Internal Server Error');
  } finally {
    connection.$pool.end();
  }
});

app.delete('/products/:id', async (request, response) => {
  const connection = pgp()(databaseConfig);
  const { id } = request.params;

  try {
    const result = await connection.result(
      'DELETE FROM alura_store.products WHERE id = $1',
      [id]
    );
    if (result.rowCount > 0) {
      response.status(200).send('Product deleted successfully');
    } else {
      response.status(404).send('Product not found');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    response.status(500).send('Internal Server Error');
  } finally {
    connection.$pool.end();
  }
});

app.get('/categories', async (request, response) => {
  const connection = pgp()(databaseConfig);
  try {
    const data = await connection.any('SELECT * FROM alura_store.categories');
    response.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    response.status(500).send('Internal Server Error');
  } finally {
    connection.$pool.end();
  }
});

app.post('/add-category', async (request, response) => {
  const connection = pgp()(databaseConfig);
  const { name } = request.body;
  const id = crypto.randomUUID();

  try {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      response.status(400).send('Bad Request');
      return;
    }
    await connection.none('INSERT INTO alura_store.categories(id, name) VALUES($1, $2)', [
      id,
      name,
    ]);
    response.status(201).json({ id });
  } catch (error) {
    console.error('Error adding category:', error);
    response.status(400).send('Bad Request');
  } finally {
    connection.$pool.end();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
