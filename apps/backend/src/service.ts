import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllCategories,
  addCategory,
} from './data';

export async function listProducts() {
  const products = await getAllProducts();
  return products;
}

export async function getProduct(id: string) {
  const product = await getProductById(id);
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

export async function createProduct(
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

  const id = await addProduct(name, description, price, used || false);
  return id;
}

export async function modifyProduct(
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

  const rowCount = await updateProduct(id, name, description, price, used || false);
  return rowCount;
}

export async function removeProduct(id: string) {
  const rowCount = await deleteProduct(id);
  return rowCount;
}

export async function listCategories() {
  const categories = await getAllCategories();
  return categories;
}

export async function createCategory(name: string) {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error('Invalid category data');
  }

  const id = await addCategory(name);
  return id;
}
