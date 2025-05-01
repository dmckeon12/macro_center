import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
    price_cents: {
      type: Number,
      required: true,
      min: 0,
    },
    main_picture_url: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    street: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    zipCode: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: 'United States',
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const paymentResultSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    update_time: {
      type: String,
      required: true,
    },
    email_address: {
      type: String,
    },
    payment_method: {
      type: String,
      required: true,
      enum: ['credit_card', 'paypal', 'stripe'],
    },
    last_four: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      required: true,
      enum: ['credit_card', 'paypal', 'stripe'],
    },
    paymentResult: paymentResultSchema,
    itemsPrice_cents: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingPrice_cents: {
      type: Number,
      required: true,
      default: 0,
    },
    taxPrice_cents: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice_cents: {
      type: Number,
      required: true,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    trackingNumber: {
      type: String,
      default: '',
    },
    invoiceNumber: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Create index on user to optimize queries
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ isPaid: 1 });
orderSchema.index({ isDelivered: 1 });

// Virtual for formatted prices
orderSchema.virtual('formattedTotalPrice').get(function() {
  return (this.totalPrice_cents / 100).toFixed(2);
});

orderSchema.virtual('formattedItemsPrice').get(function() {
  return (this.itemsPrice_cents / 100).toFixed(2);
});

orderSchema.virtual('formattedShippingPrice').get(function() {
  return (this.shippingPrice_cents / 100).toFixed(2);
});

orderSchema.virtual('formattedTaxPrice').get(function() {
  return (this.taxPrice_cents / 100).toFixed(2);
});

// Format for JSON responses
orderSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Function to generate invoice number
orderSchema.pre('save', async function(next) {
  if (!this.invoiceNumber && this.isPaid) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the max invoice number for today
    const invoicePrefix = `INV-${year}${month}${day}-`;
    const maxInvoice = await this.constructor.findOne(
      { invoiceNumber: { $regex: `^${invoicePrefix}` } },
      { invoiceNumber: 1 },
      { sort: { invoiceNumber: -1 } }
    );
    
    let nextNumber = 1;
    if (maxInvoice && maxInvoice.invoiceNumber) {
      const lastNumber = parseInt(maxInvoice.invoiceNumber.split('-').pop(), 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }
    
    this.invoiceNumber = `${invoicePrefix}${nextNumber.toString().padStart(4, '0')}`;
  }
  
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
