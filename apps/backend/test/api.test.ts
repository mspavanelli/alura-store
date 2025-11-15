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

describe.skip('API tests', () => {
  describe('Products', () => {
    it('should list products', async () => {
      const response = await api.get('/products');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBeTruthy();
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
      expect(response.data).toHaveProperty('id');
    });

    it('should return 400 if product is invalid', async () => {
      const invalidProduct = { name: '', description: '', price: 0 };
      const response = await api.post('/add-product', invalidProduct);
      expect(response.status).toBe(400);
    });
  });

  describe('Categories', () => {
    it('should list categories', async () => {
      const response = await api.get('/categories');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBeTruthy();
    });

    it('should add a new category', async () => {
      const newCategory = { name: 'Test Category' };
      const response = await api.post('/add-category', newCategory);
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
    });
  });
});
