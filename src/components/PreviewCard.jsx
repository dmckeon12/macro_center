/**
 * PreviewCard - displays product details
 * handles images, specs, price, and add to cart
 * Used on the product page to showcase product info
 */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/CartSlice";
import toast from "react-hot-toast";

const PreviewCard = ({ product }) => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const add = () => {
    const itemInCart = cart.some((item) => item.id === product.id);
    if (itemInCart) {
      toast.error("This item is already in your cart");
    } else {
      dispatch(addToCart(product));
      toast.success("Added to cart");
    }
  };

  const img = product.main_picture_url;
  const price = product.price_cents;
  const desc = product.description;
  const name = product.name;
  const brand = product.brand_name;
  const category = product.category;
  const specs = product.specs;

  const renderSpecs = () => {
    if (!specs) return null;
    
    return (
      <div className="mt-4 space-y-2">
        <h4 className="font-semibold text-black dark:text-white">Specifications</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(specs).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/_/g, ' ')}:</span>
              <span className="font-medium text-black dark:text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <main className="grid place-items-center min-h-screen bg-gray-50 dark:bg-[#121212]">
        <section className="flex flex-col md:flex-row gap-11 py-10 px-5 bg-white dark:bg-[#1f1b24] dark:hover:bg-[#121015] rounded-xl shadow-xl hover:shadow-2xl w-3/4 md:max-w-2xl">
          <div className="text-gray-500 dark:text-white flex flex-col justify-between">
            <div className="w-full h-[350px] flex items-center justify-center">
              <img
                src={img}
                alt={name}
                className="max-h-[350px] w-auto object-contain"
              />
            </div>
            <div className="mt-4">
              <div className="text-sm bg-gray-100 dark:bg-[#2a2a2a] p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Status:</span>
                  <span className={`font-medium ${product.stock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <main className="text-gray-500 dark:text-white flex-1">
            <div className="space-y-4">
              <div>
                <small className="uppercase text-gray-500 dark:text-gray-400">
                  {category} by {brand}
                </small>
                <h3 className="text-black dark:text-white text-2xl font-semibold">
                  {name}
                </h3>
                <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                  ${(price / 100).toLocaleString()}
                </h3>
              </div>

              <div className="prose prose-sm dark:prose-invert">
                <p className="text-gray-600 dark:text-gray-300">{desc}</p>
              </div>

              {renderSpecs()}

              <div className="flex gap-2 mt-6">
                <button
                  className="flex-1 bg-[#2a2a2a] hover:bg-black focus:outline-none transition text-white uppercase px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={add}
                  disabled={!product.stock}
                >
                  {product.stock ? 'Add to cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </main>
        </section>
      </main>
    </div>
  );
};

export default PreviewCard;
