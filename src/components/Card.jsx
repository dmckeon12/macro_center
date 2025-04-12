/**
 * Card - card used for displaying products
 * controlls the add to cart and remove from cart functions
 * Used in product listing pages and posts product details with image that is stored in images folder
 */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/slices/CartSlice";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Card = ({ product }) => {
  const cart = useSelector((state) => state.cart);
  const img = product.main_picture_url;
  const price = product.price_cents;
  const desc = product.description;
  const id = product.id;
  const name = product.name;
  const brand = product.brand_name;

  const dispatch = useDispatch();

  const add = () => {
    dispatch(addToCart(product));
    toast.success("Added to cart");
  };

  const remove = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.error("Removed item from cart");
  };

  return (
    <div>
      <div className="w-full max-w-sm h-[450px] shadow-sm rounded-2xl p-4 bg-slate-50 dark:bg-[#1f1b24] dark:hover:bg-[#121015] dark:text-white dark:outline-none dark:border-none border border-slate-100 outline outline-slate-100 hover:shadow-2xl relative">
        <div className="flex flex-col gap-4">
          <div>
            <img
              src={img}
              width={200}
              height={200}
              alt={name}
              className="mx-auto object-contain"
            />
            <Link to={`/preview/${id}`}>
              <button className="absolute bg-slate-600 dark:bg-slate-800 dark:font-semibold text-white text-xs p-1 top-2 right-2 rounded-md hover:bg-slate-700">
                Details
              </button>
            </Link>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-lg truncate">{name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{brand}</p>
            <p className="text-sm max-h-[60px] overflow-y-hidden">
              {desc.split(" ").slice(0, 15).join(" ") + "..."}
            </p>
          </div>

          <div className="flex items-center justify-between mt-auto">
            {cart.some((item) => item.id === product.id) ? (
              <button
                onClick={() => remove(product.id)}
                className="bg-red-400 hover:bg-red-500 text-white p-2 rounded-md text-sm"
              >
                Remove Item
              </button>
            ) : (
              <button
                onClick={add}
                className="bg-black dark:bg-slate-800 dark:hover:bg-black hover:bg-gray-800 text-white p-2 rounded-md text-sm"
              >
                Add to Cart
              </button>
            )}
            <span className="text-xl font-semibold">${(price / 100).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
