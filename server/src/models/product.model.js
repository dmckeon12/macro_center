import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu'],
      index: true
    },
    brand_name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    details: {
      type: String,
      required: true,
      trim: true
    },
    price_cents: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive', 'discontinued'],
      default: 'active',
      index: true
    },
    specs: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    stock: {
      type: Boolean,
      default: true
    },
    quantity: {
      type: Number,
      default: 100,
      min: 0
    },
    main_picture_url: {
      type: String,
      required: true
    },
    additional_images: {
      type: [String],
      default: []
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    discount_percent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    featured: {
      type: Boolean,
      default: false
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Create compound text index for search functionality
productSchema.index(
  { 
    name: 'text', 
    brand_name: 'text', 
    details: 'text', 
    description: 'text' 
  }, 
  {
    weights: {
      name: 10,
      brand_name: 5,
      details: 3,
      description: 1
    }
  }
);

// Virtual for calculating the sale price
productSchema.virtual('sale_price_cents').get(function() {
  if (this.discount_percent > 0) {
    return Math.round(this.price_cents * (1 - this.discount_percent / 100));
  }
  return this.price_cents;
});

// Method to check if product is compatible with another product
productSchema.methods.isCompatibleWith = function(otherProduct) {
  // Basic compatibility logic - expand as needed
  if (this.category === 'cpu' && otherProduct.category === 'motherboard') {
    return this.specs.socket === otherProduct.specs.socket;
  }
  
  if (this.category === 'motherboard' && otherProduct.category === 'cpu') {
    return this.specs.socket === otherProduct.specs.socket;
  }
  
  if (this.category === 'ram' && otherProduct.category === 'motherboard') {
    return this.specs.type === otherProduct.specs.memory_support;
  }
  
  if (this.category === 'motherboard' && otherProduct.category === 'ram') {
    return this.specs.memory_support === otherProduct.specs.type;
  }
  
  // Default to true for components that don't have specific compatibility requirements
  return true;
};

// Format the product for JSON responses
productSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
