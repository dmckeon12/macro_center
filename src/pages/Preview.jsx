import React from "react";
import PreviewCard from "../components/PreviewCard";
import { useParams } from "react-router-dom";
import data from "../assets/data";

const Preview = () => {
  const { id } = useParams();
  const productId = Number(id);

  const product = data.products.find(item => item.id === productId);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">
          Product Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          The product you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <PreviewCard product={product} />
    </div>
  );
};

export default Preview;
