import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import { Product, products as initialProducts } from "../data/products";
import { useToast } from "../hooks/useToast";

const SwipeableProductStack: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [history, setHistory] = useState<
    { product: Product; action: string }[]
  >([]);
  const { showToast } = useToast();

  // Add event listener for direct toast calls
  useEffect(() => {
    const handleShowToast = (event) => {
      showToast(event.detail.message, event.detail.type);
    };

    window.addEventListener("show-toast", handleShowToast);
    return () => window.removeEventListener("show-toast", handleShowToast);
  }, [showToast]);

  const handleSwipe = (
    direction: "left" | "right" | "up",
    product: Product
  ) => {
    // Remove the swiped product from stack
    setProducts((prevProducts) =>
      prevProducts.filter((p) => p.id !== product.id)
    );

    // Handle action based on direction
    switch (direction) {
      case "left":
        console.log(`Passed Product ID: ${product.id}`);
        setHistory((prev) => [...prev, { product, action: "passed" }]);
        showToast(`Passed on ${product.name}`, "info");
        break;
      case "right":
        console.log(`Liked Product ID: ${product.id}`);
        setHistory((prev) => [...prev, { product, action: "liked" }]);
        showToast(`Liked ${product.name}`, "success");
        break;
      case "up":
        console.log(`Add to cart Product ID: ${product.id}`);
        setHistory((prev) => [...prev, { product, action: "added to cart" }]);
        showToast(`Added ${product.name} to cart`, "success");
        break;
    }

    // If all products are swiped, reset
    if (products.length === 1) {
      setTimeout(() => {
        setProducts(initialProducts);
        showToast("Starting over with fresh products!", "info");
      }, 1000);
    }
  };

  // Show the first product card in the stack
  const activeProduct = products[0];

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full px-4">
      <div className="relative w-full max-w-sm h-[560px] flex items-center justify-center">
        <AnimatePresence>
          {products.slice(0, 3).map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onSwipe={handleSwipe}
              isActive={index === 0}
            />
          ))}
        </AnimatePresence>

        {products.length === 0 && (
          <div className="text-center">
            <p className="text-xl font-black text-black">No more products!</p>
            <p className="text-gray-800 font-bold">
              Check back soon for more items.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center space-x-6 pb-4">
        <button
          onClick={() => activeProduct && handleSwipe("left", activeProduct)}
          className="w-16 h-16 flex items-center justify-center bg-white border-4 border-black text-red-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <button
          onClick={() => activeProduct && handleSwipe("up", activeProduct)}
          className="w-16 h-16 flex items-center justify-center bg-white border-4 border-black text-purple-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </button>

        <button
          onClick={() => activeProduct && handleSwipe("right", activeProduct)}
          className="w-16 h-16 flex items-center justify-center bg-white border-4 border-black text-green-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {history.length > 0 && (
        <div className="mt-4 w-full max-w-sm">
          <h3 className="text-lg font-black text-black mb-2">
            Recent Activity
          </h3>
          <div className="bg-white rounded-none border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.9)] p-3 max-h-40 overflow-y-auto">
            {history
              .slice()
              .reverse()
              .slice(0, 5)
              .map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center py-1 border-b-2 border-black last:border-b-0"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-10 h-10 object-contain bg-gray-100 border-2 border-black"
                  />
                  <span className="ml-2 text-sm text-black font-bold truncate">
                    {item.product.name}
                  </span>
                  <span className="ml-auto text-xs font-black">
                    {item.action === "liked" && (
                      <span className="bg-green-500 text-white px-2 py-1 border border-black">
                        LIKED
                      </span>
                    )}
                    {item.action === "passed" && (
                      <span className="bg-red-500 text-white px-2 py-1 border border-black">
                        PASSED
                      </span>
                    )}
                    {item.action === "added to cart" && (
                      <span className="bg-purple-500 text-white px-2 py-1 border border-black">
                        CART
                      </span>
                    )}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeableProductStack;
