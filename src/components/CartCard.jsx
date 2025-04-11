import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
} from "../redux/slices/CartSlice";
import toast from "react-hot-toast";

const CartCard = ({ item }) => {
  const dispatch = useDispatch();

  const remove = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.error("Removed item from cart");
  };

  const increase = (id) => {
    dispatch(increaseQty(id));
  };

  const decrease = (id) => {
    if (item.qty === 1) {
      dispatch(removeFromCart(id));
    } else dispatch(decreaseQty(id));
  };

  return (
    <div>
      <div className="h-80 w-[310px] md:h-72 md:w-[600px] bg-slate-100 dark:bg-[#1f1b24] dark:hover:bg-[#121015] rounded-2xl hover:shadow-lg mt-[40px] md:mt-[20px]">
        <div className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-[150px] h-[150px] flex items-center justify-center">
              <img
                src={item.main_picture_url}
                alt={item.name}
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col flex-grow gap-y-2 dark:text-white">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {item.brand_name} - {item.category}
              </div>
              <div className="text-sm line-clamp-2">
                {item.description}
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-xl font-bold">
                  ${((item.price_cents || 0) / 100).toFixed(2)}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <button
                      className="p-1 bg-[#dadada] dark:bg-[#2a2a2a] dark:hover:bg-black dark:border-none border rounded-lg font-bold w-[30px]"
                      onClick={() => decrease(item.id)}
                    >
                      -
                    </button>
                    <span className="mx-3 text-lg font-bold">{item.qty}</span>
                    <button
                      className="p-1 bg-[#dadada] dark:bg-[#2a2a2a] dark:hover:bg-black dark:border-none border rounded-lg font-bold w-[30px]"
                      onClick={() => increase(item.id)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="text-red-800 bg-red-200 hover:bg-red-400 transition-transform duration-300 rounded-full p-2"
                    onClick={() => remove(item.id)}
                  >
                    <AiFillDelete />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
