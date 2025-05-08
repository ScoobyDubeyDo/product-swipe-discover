
import React, { useState } from 'react';
import { Product } from '../data/products';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onSwipe: (direction: 'left' | 'right' | 'up', product: Product) => void;
  isActive: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSwipe, isActive }) => {
  const [exitX, setExitX] = useState<number>(0);
  const [exitY, setExitY] = useState<number>(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Create rotation and opacity based on x position
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20]);
  
  // Calculate discount amount
  const discountAmount = product.originalPrice - product.price;
  
  // Change card opacity based on position
  const opacity = useTransform(
    x,
    [-200, -150, 0, 150, 200],
    [0.5, 0.9, 1, 0.9, 0.5]
  );
  
  // Change background color based on swipe direction
  const cardColor = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    ['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.05)', 'rgba(255, 255, 255, 1)', 'rgba(16, 185, 129, 0.05)', 'rgba(16, 185, 129, 0.2)']
  );
  
  // Create pass indicator opacity
  const passOpacity = useTransform(x, [0, -100], [0, 1]);
  
  // Create like indicator opacity
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  
  // Create add to cart indicator opacity
  const cartOpacity = useTransform(y, [0, -100], [0, 1]);
  
  // Handle drag end
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const upThreshold = -200;
    
    if (info.offset.x > threshold) {
      setExitX(500);
      onSwipe('right', product);
    } else if (info.offset.x < -threshold) {
      setExitX(-500);
      onSwipe('left', product);
    } else if (info.offset.y < upThreshold) {
      setExitY(-500);
      onSwipe('up', product);
    }
  };

  if (!isActive) {
    return null;
  }

  return (
    <motion.div
      className="absolute w-full max-w-sm touch-none"
      style={{ 
        x, 
        y, 
        rotate,
        opacity,
        backgroundColor: cardColor,
      }}
      drag={isActive}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ 
        x: exitX, 
        y: exitY,
        opacity: 0,
        transition: { duration: 0.2 }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="bg-white rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,0.9)] border-4 border-black overflow-hidden w-full transform translate-x-1 translate-y-1 transition-transform hover:translate-x-0 hover:translate-y-0">
        <div className="relative h-80 overflow-hidden border-b-4 border-black">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain bg-gray-50"
          />
          
          {/* Discount badge */}
          {product.discountPercentage > 0 && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-black rounded-none px-2 py-1 border-2 border-black transform rotate-3">
              {product.discountPercentage}% OFF
            </div>
          )}

          {/* Action indicators */}
          <motion.div
            className="absolute top-1/2 left-6 bg-red-500 text-white px-4 py-2 font-black transform -translate-y-1/2 rotate-6 border-2 border-black"
            style={{ opacity: passOpacity }}
          >
            PASS
          </motion.div>

          <motion.div
            className="absolute top-1/2 right-6 bg-green-500 text-white px-4 py-2 font-black transform -translate-y-1/2 -rotate-6 border-2 border-black"
            style={{ opacity: likeOpacity }}
          >
            LIKE
          </motion.div>

          <motion.div
            className="absolute top-10 left-1/2 bg-purple-500 text-white px-4 py-2 font-black transform -translate-x-1/2 border-2 border-black"
            style={{ opacity: cartOpacity }}
          >
            ADD TO CART
          </motion.div>
        </div>

        <div className="p-4">
          <h4 className="text-xs text-black uppercase font-black tracking-wider">{product.brand}</h4>
          <h3 className="text-lg font-black text-black capitalize mt-1">{product.name}</h3>
          
          <div className="flex items-center mt-2">
            <span className="text-xl font-black text-black">₹{product.price}</span>
            
            {product.discountPercentage > 0 && (
              <>
                <span className="text-sm text-gray-700 line-through ml-2 font-bold">₹{product.originalPrice}</span>
                <span className="text-sm bg-black text-white ml-2 font-black px-2 py-1">Save ₹{discountAmount}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
