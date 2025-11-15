import { describe, expect, it, beforeEach } from 'vitest';
import { ProductService } from '@/product-service';
import { CategoryService } from '@/category-service';
import { ProductsDAODatabase, ProductsDAOInMemory } from '@/data';

describe('Service tests', () => {
  describe('Products', () => {
    let productService: ProductService;

    beforeEach(() => {
      const productRepository = new ProductsDAOInMemory();
      productService = new ProductService(productRepository);
    });
    it('should list products', async () => {
      const products = await productService.listProducts();
      expect(Array.isArray(products)).toBeTruthy();
    });
    it('should add a new product', async () => {
      const name = 'Test Product';
      const description = 'Test Description';
      const price = 49.99;
      const used = false;

      const id = await productService.createProduct(name, description, price, used);
      expect(id).toBeDefined();

      const addedProduct = await productService.getProduct(id);
      expect(addedProduct).toBeDefined();
      expect(addedProduct.name).toBe(name);
      expect(addedProduct.price).toBe(price);
      expect(addedProduct.description).toBe(description);
      expect(addedProduct.used).toEqual(used);
    });

    it('should update a product', async () => {
      const name = 'Product to Update';
      const description = 'Description to Update';
      const price = 59.99;
      const used = false;

      const id = await productService.createProduct(name, description, price, used);

      const updatedName = 'Updated Product Name';
      const updatedDescription = 'Updated Description';
      const updatedPrice = 79.99;
      const updatedUsed = true;

      await productService.modifyProduct(
        id,
        updatedName,
        updatedDescription,
        updatedPrice,
        updatedUsed
      );

      const fetchedProduct = await productService.getProduct(id);
      expect(fetchedProduct.name).toBe(updatedName);
      expect(fetchedProduct.description).toBe(updatedDescription);
      expect(fetchedProduct.price).toBe(updatedPrice);
      expect(fetchedProduct.used).toEqual(updatedUsed);
    });

    it('should throw error if product is invalid', async () => {
      const invalidName = '';
      const invalidDescription = '';
      const invalidPrice = 0;

      await expect(
        productService.createProduct(invalidName, invalidDescription, invalidPrice, false)
      ).rejects.toThrow('Invalid product data');
    });

    it('should remove a product', async () => {
      const name = 'Product to Remove';
      const description = 'Description to Remove';
      const price = 29.99;
      const used = false;
      const id = await productService.createProduct(name, description, price, used);
      await productService.removeProduct(id);
      await expect(productService.getProduct(id)).rejects.toThrow('Product not found');
    });
  });

  describe('Categories', () => {
    let categoryService: CategoryService;

    beforeEach(() => {
      const productRepository = new ProductsDAOInMemory();
      categoryService = new CategoryService(productRepository);
    });

    it('should list categories', async () => {
      const categories = await categoryService.listCategories();
      expect(Array.isArray(categories)).toBeTruthy();
    });

    it('should add a new category', async () => {
      const name = 'Test Category';
      const id = await categoryService.createCategory(name);
      expect(id).toBeDefined();
    });
  });
});
