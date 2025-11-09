import axios from 'axios';
import { describe, expect, it } from 'vitest';

axios.defaults.validateStatus = function () {
  return true;
};

const baseUrl = 'http://localhost:3000';
const api = axios.create({
  baseURL: baseUrl,
  headers: { 'Content-Type': 'application/json' },
});

describe('API tests', () => {
  describe('Products', () => {
    it('should list products', async () => {
      const response = await api.get('/products');
      expect(response.status).toBe(200);
      const products = response.data;
      expect(Array.isArray(products)).toBeTruthy();
    });

    it('should add a new product', async () => {
      const newProduct = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        used: false,
      };
      const response = await api.post('/add-product', newProduct);
      expect(response.status).toBe(201);
      const responseBody = response.data;
      expect(responseBody).toHaveProperty('id');
      const getProductResponse = await api.get(`/products/${responseBody.id}`);
      const addedProduct = getProductResponse.data;
      expect(addedProduct).toBeDefined();
      expect(addedProduct.name).toBe(newProduct.name);
      expect(addedProduct.price).toBe(newProduct.price);
      expect(addedProduct.description).toBe(newProduct.description);
      expect(addedProduct.used).toEqual(newProduct.used);
    });

    it('should update a product', async () => {
      const newProduct = {
        name: 'Product to Update',
        description: 'Description to Update',
        price: 59.99,
        used: false,
      };
      const addResponse = await api.post('/add-product', newProduct);
      const { id } = await addResponse.data;
      const updatedProduct = {
        name: 'Updated Product Name',
        description: 'Updated Description',
        price: 79.99,
        used: true,
      };
      const updateResponse = await api.post(`/update-product/${id}`, updatedProduct);
      expect(updateResponse.status).toBe(200);
      const getProductResponse = await api.get(`/products/${id}`);
      const fetchedProduct = getProductResponse.data;
      expect(fetchedProduct.name).toBe(updatedProduct.name);
      expect(fetchedProduct.description).toBe(updatedProduct.description);
      expect(fetchedProduct.price).toBe(updatedProduct.price);
      expect(fetchedProduct.used).toEqual(updatedProduct.used);
    });

    it('should return 400 if product is invalid', async () => {
      const invalidProduct = { name: '', description: '', price: 0 };
      const response = await api.post('/add-product', invalidProduct);
      expect(response.status).toBe(400);
    });

    it('should remove a product', async () => {
      const newProduct = {
        name: 'Product to Remove',
        description: 'Description to Remove',
        price: 49.99,
      };
      const addResponse = await api.post('/add-product', newProduct);
      const { id } = await addResponse.data;
      const deleteResponse = await api.delete(`/products/${id}`);
      expect(deleteResponse.status).toBe(200);
    });
  });

  describe('Categories', () => {
    it('should list categories', async () => {
      const response = await api.get('/categories');
      expect(response.status).toBe(200);
      const categories = response.data;
      expect(Array.isArray(categories)).toBeTruthy();
    });

    it('should add a new category', async () => {
      const newCategory = { name: 'Test Category' };
      const response = await api.post('/add-category', newCategory);
      expect(response.status).toBe(201);
      const responseBody = response.data;
      expect(responseBody).toHaveProperty('id');
    });
  });
});
