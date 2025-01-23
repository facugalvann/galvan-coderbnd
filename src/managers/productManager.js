import fs from 'fs';

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al leer los productos:', error);
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(product => product.id === id);
  }

  async addProduct(product) {
    const products = await this.getProducts();
    products.push(product);
    await this.saveProducts(products);
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const updatedProducts = products.filter(product => product.id !== id);
    await this.saveProducts(updatedProducts);
  }

  async saveProducts(products) {
    try {
      const data = JSON.stringify(products, null, 2);
      await fs.promises.writeFile(this.filePath, data, 'utf-8');
    } catch (error) {
      console.error('Error al guardar los productos:', error);
    }
  }
}

export default new ProductManager('src/db/products.json');
