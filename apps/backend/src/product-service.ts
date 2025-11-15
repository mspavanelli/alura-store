export class ProductService {
  constructor(private readonly productServiceData: ProductRepository) {}

  async listProducts() {
    const products = await this.productServiceData.getAllProducts();
    return products;
  }

  async getProduct(id: string) {
    const product = await this.productServiceData.getProductById(id);
    if (product) {
      const data = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        used: product.used,
      };
      return data;
    } else {
      throw new Error('Product not found');
    }
  }

  async createProduct(name: string, description: string, price: number, used: boolean) {
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
    )
      throw new Error('Invalid product data');

    const id = await this.productServiceData.addProduct(
      name,
      description,
      price,
      used || false
    );
    return id;
  }

  async modifyProduct(
    id: string,
    name: string,
    description: string,
    price: number,
    used: boolean
  ) {
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
    )
      throw new Error('Invalid product data');

    const rowCount = await this.productServiceData.updateProduct(
      id,
      name,
      description,
      price,
      used || false
    );
    return rowCount;
  }

  async removeProduct(id: string) {
    const rowCount = await this.productServiceData.deleteProduct(id);
    return rowCount;
  }
}

export interface ProductRepository {
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
}
