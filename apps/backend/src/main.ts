import express from 'express';
import cors from 'cors';

import {
  createProduct,
  getProduct,
  listCategories,
  listProducts,
  removeProduct,
} from './service';
import { addCategory, updateProduct } from './data';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/products', async (request, response) => {
  try {
    const data = await listProducts();
    response.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    response.status(500).send('Internal Server Error');
  }
});

app.get('/products/:id', async (request, response) => {
  const { id } = request.params;
  try {
    const data = await getProduct(id);
    response.json(data);
    // if (data) {

    //   response.json(product);
    // } else {
    //   response.status(404).send('Product not found');
    // }
  } catch (error) {
    console.error('Error fetching product:', error);
    response.status(500).send('Internal Server Error');
  }
});

app.post('/add-product', async (request, response) => {
  const { name, description, price, used } = request.body;
  try {
    const id = await createProduct(name, description, price, used || false);
    response.status(201).json({ id });
  } catch (error) {
    response.status(400).send('Bad Request');
  }
});

app.post('/update-product/:id', async (request, response) => {
  const { id } = request.params;
  const { name, description, price, used } = request.body;
  try {
    await updateProduct(id, name, description, price, used || false);
    response.status(200).send('Product updated successfully');
  } catch (error) {
    response.status(500).send('Internal Server Error');
  }
});

app.delete('/products/:id', async (request, response) => {
  const { id } = request.params;
  try {
    await removeProduct(id);
    response.status(204).send('Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
    response.status(400).send('Bad Request');
  }
});

app.get('/categories', async (request, response) => {
  try {
    const data = await listCategories();
    response.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    response.status(500).send('Internal Server Error');
  }
});

app.post('/add-category', async (request, response) => {
  const { name } = request.body;
  try {
    const id = await addCategory(name);
    response.status(201).json({ id });
  } catch (error) {
    response.status(400).send('Bad Request');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
