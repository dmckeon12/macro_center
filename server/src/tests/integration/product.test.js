import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it, before, after } from 'mocha';
import mongoose from 'mongoose';
import app from '../../index.js';
import Product from '../../models/product.model.js';
import User from '../../models/user.model.js';
import { generateAuthTokens } from '../../utils/token.js';

// Use chai-http for API testing
chai.use(chaiHttp);
const { expect } = chai;

describe('Product API', () => {
  let adminToken;
  let userToken;
  let testProduct;

  // Sample product data matching our existing data structure
  const sampleProduct = {
    category: 'cpu',
    brand_name: 'Test',
    name: 'Test CPU',
    details: 'Test CPU Details',
    price_cents: 29900,
    status: 'active',
    specs: {
      cores: 8,
      threads: 16,
      base_clock: '3.8 GHz',
      boost_clock: '4.8 GHz',
      tdp: '105W',
      socket: 'AM4'
    },
    stock: true,
    quantity: 100,
    main_picture_url: 'test-cpu.jpg',
    description: 'Test product description',
    discount_percent: 0,
    featured: false
  };

  before(async () => {
    // Create test users
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      password: 'Password123',
      role: 'admin'
    });

    const regularUser = await User.create({
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@test.com',
      password: 'Password123'
    });

    // Generate tokens
    const adminTokens = await generateAuthTokens(adminUser);
    const userTokens = await generateAuthTokens(regularUser);

    adminToken = adminTokens.access.token;
    userToken = userTokens.access.token;
  });

  after(async () => {
    // Clean up
    await Product.deleteMany({});
    await User.deleteMany({});
  });

  // Test for creating a product (admin only)
  describe('POST /api/products', () => {
    it('should not allow non-admin users to create products', async () => {
      const res = await chai
        .request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sampleProduct);

      expect(res).to.have.status(403);
    });

    it('should allow admin users to create products', async () => {
      const res = await chai
        .request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleProduct);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('id');
      expect(res.body.name).to.equal(sampleProduct.name);
      expect(res.body.price_cents).to.equal(sampleProduct.price_cents);
      
      // Save the created product for later tests
      testProduct = res.body;
    });
  });

  // Test for getting products
  describe('GET /api/products', () => {
    it('should get all products (paginated)', async () => {
      const res = await chai
        .request(app)
        .get('/api/products');

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('results');
      expect(res.body).to.have.property('pagination');
      expect(res.body.results).to.be.an('array');
    });

    it('should filter products by category', async () => {
      const res = await chai
        .request(app)
        .get('/api/products')
        .query({ category: 'cpu' });

      expect(res).to.have.status(200);
      expect(res.body.results).to.be.an('array');
      
      // All returned products should be in the CPU category
      res.body.results.forEach(product => {
        expect(product.category).to.equal('cpu');
      });
    });
  });

  // Test for getting a single product
  describe('GET /api/products/:productId', () => {
    it('should get a product by id', async () => {
      const res = await chai
        .request(app)
        .get(`/api/products/${testProduct.id}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('id');
      expect(res.body.id).to.equal(testProduct.id);
      expect(res.body.name).to.equal(testProduct.name);
    });

    it('should return 404 for non-existent product', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await chai
        .request(app)
        .get(`/api/products/${nonExistentId}`);

      expect(res).to.have.status(404);
    });
  });

  // Test for updating a product (admin only)
  describe('PUT /api/products/:productId', () => {
    it('should not allow non-admin users to update products', async () => {
      const res = await chai
        .request(app)
        .put(`/api/products/${testProduct.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price_cents: 39900 });

      expect(res).to.have.status(403);
    });

    it('should allow admin users to update products', async () => {
      const res = await chai
        .request(app)
        .put(`/api/products/${testProduct.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price_cents: 39900, featured: true });

      expect(res).to.have.status(200);
      expect(res.body.price_cents).to.equal(39900);
      expect(res.body.featured).to.equal(true);
    });
  });

  // Test for compatibility checking
  describe('POST /api/products/check-compatibility', () => {
    let cpuProduct;
    let motherboardProduct;

    before(async () => {
      // Create a CPU and motherboard with the same socket for compatibility test
      const cpu = await Product.create({
        category: 'cpu',
        brand_name: 'AMD',
        name: 'Test Ryzen',
        details: 'Test CPU',
        price_cents: 29900,
        status: 'active',
        specs: {
          cores: 8,
          threads: 16,
          base_clock: '3.8 GHz',
          boost_clock: '4.8 GHz',
          tdp: '105W',
          socket: 'AM4'
        },
        stock: true,
        main_picture_url: 'test-cpu.jpg',
        description: 'Test CPU'
      });

      const motherboard = await Product.create({
        category: 'motherboard',
        brand_name: 'ASUS',
        name: 'Test ROG',
        details: 'Test Motherboard',
        price_cents: 19900,
        status: 'active',
        specs: {
          socket: 'AM4',
          form_factor: 'ATX',
          memory_support: 'DDR4',
          pcie_version: 'PCIe 4.0'
        },
        stock: true,
        main_picture_url: 'test-mb.jpg',
        description: 'Test Motherboard'
      });

      cpuProduct = cpu;
      motherboardProduct = motherboard;
    });

    it('should check compatibility between products', async () => {
      const res = await chai
        .request(app)
        .post('/api/products/check-compatibility')
        .send({
          productIds: [cpuProduct._id.toString(), motherboardProduct._id.toString()]
        });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('compatible');
      expect(res.body).to.have.property('details');
      expect(res.body.details).to.be.an('array');
      
      // The products should be compatible (both have AM4 socket)
      expect(res.body.compatible).to.equal(true);
    });
  });

  // Test for deleting a product (admin only)
  describe('DELETE /api/products/:productId', () => {
    it('should not allow non-admin users to delete products', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/products/${testProduct.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res).to.have.status(403);
    });

    it('should allow admin users to delete products', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/products/${testProduct.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res).to.have.status(204);
    });
  });
});
