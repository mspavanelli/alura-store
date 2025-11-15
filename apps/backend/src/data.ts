import pgp from 'pg-promise';
import crypto from 'crypto';
import { ProductRepository } from '@/product-service';
import { CategoryRepository } from '@/category-service';

const databaseConfig = {
  host: 'localhost',
  port: 5432,
  database: 'alura_store',
  user: 'admin',
  password: '123456',
};

export interface ProductsDAO extends ProductRepository, CategoryRepository {
  getAllProducts: () => Promise<any[]>;
  getProductById: (id: string) => Promise<any>;
  addProduct: (
    name: string,
    description: string,
    price: number,
    used: boolean
  ) => Promise<string>;
  updateProduct: (
    id: string,
    name: string,
    description: string,
    price: number,
    used: boolean
  ) => Promise<number>;
  deleteProduct: (id: string) => Promise<number>;
  getAllCategories: () => Promise<any[]>;
  addCategory: (name: string) => Promise<string>;
}

export class ProductsDAODatabase implements ProductsDAO {
  async getAllProducts() {
    const connection = pgp()(databaseConfig);
    const products = await connection.query('SELECT * FROM alura_store.products');
    await connection.$pool.end();
    return products;
  }

  async getProductById(id: string) {
    const connection = pgp()(databaseConfig);
    const product = await connection.oneOrNone(
      'SELECT * FROM alura_store.products WHERE id = $1',
      [id]
    );
    await connection.$pool.end();
    return product;
  }

  async addProduct(name: string, description: string, price: number, used: boolean) {
    const connection = pgp()(databaseConfig);
    const id = crypto.randomUUID();
    await connection.none(
      'INSERT INTO alura_store.products(id, name, description, price, used) VALUES($1, $2, $3, $4, $5)',
      [id, name, description, price, used]
    );
    await connection.$pool.end();
    return id;
  }

  async updateProduct(
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

  async deleteProduct(id: string) {
    const connection = pgp()(databaseConfig);
    const result = await connection.result(
      'DELETE FROM alura_store.products WHERE id = $1',
      [id]
    );
    await connection.$pool.end();
    return result.rowCount;
  }

  async getAllCategories() {
    const connection = pgp()(databaseConfig);
    const categories = await connection.query('SELECT * FROM alura_store.categories');
    await connection.$pool.end();
    return categories;
  }

  async addCategory(name: string) {
    const connection = pgp()(databaseConfig);
    const id = crypto.randomUUID();
    await connection.none('INSERT INTO alura_store.categories(id, name) VALUES($1, $2)', [
      id,
      name,
    ]);
    await connection.$pool.end();
    return id;
  }
}

export class ProductsDAOInMemory implements ProductsDAO {
  private products: any[] = [];
  private categories: any[] = [];

  async getAllProducts() {
    return this.products;
  }

  async getProductById(id: string) {
    return this.products.find((product) => product.id === id) || null;
  }

  async addProduct(name: string, description: string, price: number, used: boolean) {
    const id = crypto.randomUUID();
    const newProduct = { id, name, description, price, used };
    this.products.push(newProduct);
    return id;
  }

  async updateProduct(
    id: string,
    name: string,
    description: string,
    price: number,
    used: boolean
  ) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) return 0;
    this.products[index] = { id, name, description, price, used };
    return 1;
  }

  async deleteProduct(id: string) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) return 0;
    this.products.splice(index, 1);
    return 1;
  }

  async getAllCategories() {
    return this.categories;
  }

  async addCategory(name: string) {
    const id = crypto.randomUUID();
    const newCategory = { id, name };
    this.categories.push(newCategory);
    return id;
  }
}
