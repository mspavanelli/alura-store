import axios from 'axios';
import { describe, expect, it } from 'vitest';
import { CategoryService } from '@/category-service';
import { ProductService } from '@/product-service';
import { ProductsDAODatabase } from '@/data';

axios.defaults.validateStatus = function () {
  return true;
};

describe('API tests', () => {
  const productDAO = new ProductsDAODatabase();

  describe('Products', () => {
    const productService = new ProductService(productDAO);
    it('should list products', async () => {
      const products = await productService.listProducts();
      expect(Array.isArray(products)).toBeTruthy();
    });

    it('should add a new product', async () => {
      const newProduct = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        used: false,
      };
      const response = await productService.createProduct(
        'Test Product',
        'Test Description',
        99.99,
        false
      );
      const id = response;
      // expect(response).toHaveProperty('id');
      const getProductResponse = await productService.getProduct(id);
      const addedProduct = getProductResponse;
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

      const addResponse = await productService.createProduct(
        newProduct.name,
        newProduct.description,
        newProduct.price,
        newProduct.used
      );
      const id = await addResponse;
      const updatedProduct = {
        name: 'Updated Product Name',
        description: 'Updated Description',
        price: 79.99,
        used: true,
      };
      const updateResponse = await productService.modifyProduct(
        id,
        updatedProduct.name,
        updatedProduct.description,
        updatedProduct.price,
        updatedProduct.used
      );
      const getProductResponse = await productService.getProduct(id);
      const fetchedProduct = getProductResponse;
      expect(fetchedProduct.name).toBe(updatedProduct.name);
      expect(fetchedProduct.description).toBe(updatedProduct.description);
      expect(fetchedProduct.price).toBe(updatedProduct.price);
      expect(fetchedProduct.used).toEqual(updatedProduct.used);
    });

    it('should return 400 if product is invalid', async () => {
      const invalidProduct = { name: '', description: '', price: 0 };
      await expect(
        productService.createProduct(
          invalidProduct.name,
          invalidProduct.description,
          invalidProduct.price,
          false
        )
      ).rejects.toThrow();
    });

    it('should remove a product', async () => {
      const newProduct = {
        name: 'Product to Remove',
        description: 'Description to Remove',
        price: 49.99,
      };
      const addResponse = await productService.createProduct(
        newProduct.name,
        newProduct.description,
        newProduct.price,
        false
      );
      const id = addResponse;
      const deleteResponse = await productService.removeProduct(id);
      expect(deleteResponse).toBe(1);
    });
  });

  describe('Categories', () => {
    const categoryService = new CategoryService(productDAO);
    it('should list categories', async () => {
      const response = await categoryService.listCategories();
      expect(Array.isArray(response)).toBeTruthy();
    });

    it('should add a new category', async () => {
      const newCategory = { name: 'Test Category' };
      const response = await categoryService.createCategory(newCategory.name);
      expect(response).toBeDefined();
      // expect(response).toHaveProperty('id');
    });
  });
});
