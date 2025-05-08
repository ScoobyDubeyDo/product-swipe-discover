
import React from 'react';
import Layout from '../components/Layout';
import SwipeableProductStack from '../components/SwipeableProductStack';

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Discover Products</h2>
          <p className="text-gray-500 mt-1">Swipe right to like, left to pass, up to add to cart</p>
        </div>
        
        <div className="w-full flex-1">
          <SwipeableProductStack />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
