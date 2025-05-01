import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
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
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const paymentMethodSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['credit', 'debit', 'paypal'],
    required: true,
  },
  cardHolderName: {
    type: String,
    trim: true,
  },
  cardNumber: {
    type: String,
    trim: true,
  },
  expiryMonth: {
    type: Number,
  },
  expiryYear: {
    type: Number,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  // Only the last 4 digits of the card are stored
  lastFourDigits: {
    type: String,
    trim: true,
  },
  // For PayPal
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    phone: {
      type: String,
      trim: true,
    },
    addresses: [addressSchema],
    paymentMethods: [paymentMethodSchema],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to json
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

// Check if email is taken
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

// Check if password matches the user's password
userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
