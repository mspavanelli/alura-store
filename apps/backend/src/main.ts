import express from 'express';
import cors from 'cors';

import { ProductService } from '@/product-service';
import { CategoryService } from '@/category-service';
import { ProductsDAOInMemory } from '@/data';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const productDAO = new ProductsDAOInMemory();

app.get('/products', async (request, response) => {
  try {
    const productService = new ProductService(productDAO);
    const data = await productService.listProducts();
    response.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    response.status(500).send('Internal Server Error');
  }
});

app.get('/products/:id', async (request, response) => {
  const { id } = request.params;
  try {
    const service = new ProductService(productDAO);
    const data = await service.getProduct(id);
    response.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    response.status(500).send('Internal Server Error');
  }
});

app.post('/add-product', async (request, response) => {
  const { name, description, price, used } = request.body;

  const service = new ProductService(productDAO);
  try {
    const id = await service.createProduct(name, description, price, used || false);
    response.status(201).json({ id });
  } catch (error) {
    response.status(400).send('Bad Request');
  }
});

app.post('/update-product/:id', async (request, response) => {
  const { id } = request.params;
  const { name, description, price, used } = request.body;

  const service = new ProductService(productDAO);
  try {
    await service.modifyProduct(id, name, description, price, used || false);
    response.status(200).send('Product updated successfully');
  } catch (error) {
    response.status(500).send('Internal Server Error');
  }
});

app.delete('/products/:id', async (request, response) => {
  const { id } = request.params;

  const service = new ProductService(productDAO);
  try {
    await service.removeProduct(id);
    response.status(204).send('Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
    response.status(400).send('Bad Request');
  }
});

app.get('/categories', async (request, response) => {
  const categoryDAO = new ProductsDAOInMemory();
  const service = new CategoryService(categoryDAO);
  try {
    const data = await service.listCategories();
    response.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    response.status(500).send('Internal Server Error');
  }
});

app.post('/add-category', async (request, response) => {
  const categoryDAO = new ProductsDAOInMemory();
  const service = new CategoryService(categoryDAO);
  const { name } = request.body;
  try {
    const id = await service.createCategory(name);
    response.status(201).json({ id });
  } catch (error) {
    response.status(400).send('Bad Request');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
