export class CategoryService {
  constructor(private readonly categoryServiceData: CategoryRepository) {}

  async listCategories() {
    const categories = await this.categoryServiceData.getAllCategories();
    return categories;
  }

  async createCategory(name: string) {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new Error('Invalid category data');
    }

    const id = await this.categoryServiceData.addCategory(name);
    return id;
  }
}

export interface CategoryRepository {
  getAllCategories: () => Promise<any[]>;
  addCategory: (name: string) => Promise<string>;
}
