# MacroCenter

MacroCenter is an e-commerce website designed for PC components and custom PC building. The website allows users to browse computer parts, build PC configurations with compatibility checking, and purchase components.

## Setup Instructions

### Download needs
- Node.js (v18.0.0 or later)
- npm package manager

### Installation

1. Clone the repository:
   git clone <repository-url>

2. Install dependencies:
   npm install
  
3. Start the development server:
   npm run dev

4. Open your browser and navigate to:
   http://localhost:5173

## Features

### E-commerce Platform
- **Product Catalog**: Browse through 60+ PC components across seperated  categories or on a featured tab
- **Product Details**: View specs and prices for each component
- **Shopping Cart**: Add/remove items with a limit of one per item
- **User Authentication**: Register, login, and maintain user profiles
- **Order Processing**: Complete checkout with order confirmation connected to account
- **Special Deals**: View discounted components (5-30% off)
- **Dark Mode**: Toggle between light and dark mode

### PC Builder
- **Component Selection**: Choose from 60 components across 6 categories:
  - CPU
  - GPU
  - Motherboard
  - RAM
  - Storage
  - Power Supply
- **Real-time Performance Metrics**: Performance score based on selected components (higher or high end products)
- **Compatibility Checking**: Verification of component compatibility (socket types, power requirements)
- **Price Tracking**: Keeps track of total build cost
- **Add to Cart**: Adds entire build to the shopping cart
- **Responsive Design**: Functions on desktop and mobile devices

## Testing Instructions

### General Testing
1. **Browse Products**: Navigate through different categories and product pages
2. **User Authentication**: Test registration and login functions
3. **Shopping Cart**: Add products to cart and proceed to checkout
4. **Dark Mode**: Test the modes in the top right
### PC Builder Testing
1. **Component Selection**: Try selecting components from different categories
2. **Compatibility Testing**: Test compatibility warnings by selecting incompatible parts
3. **Performance Metrics**: Verify the performance score increases as you add higher-tier components
4. **Build Management**: Test removing and replacing components in the PC builder
5. **Cart Integration**: Add the entire PC to the cart and verify all included parts are added

## Third-Party Libraries
The used libraries used are:
- **React (18.2.0)**: UI library for building the user interface
- **React Router (6.15.0)**: application routing and navigation
- **React Redux (8.1.2)**: management across the application
- **React Icons (4.10.1)**: icon sets for UI
- **React Hot Toast (2.4.1)**: notifications for user feedback
- **Tailwind CSS (3.3.3)**: CSS framework for style
- **UUID (11.1.0)**: Generates identifiers for products and orders

### Why These Libraries?
- **Redux**: Essential for managing the application, its used the most in the shopping cart and PC builder function
- **React Router**: Provides routing for single page application
- **Tailwind CSS**: Allows for a UI with consistent style everywhere
- **React Hot Toast**: increases user experience with customizable notifications
- **React Icons**: Provides a set of icons

## Future Enhancements
- product filtering
- compatibility checking algorithm
- Saved PC builds for registered users
- history tracking
- Component comparison
