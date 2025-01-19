'use client'; // Mark this file as a client component

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Leaf, Search, ImageOff } from 'lucide-react';

// Use environment variable for API key
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

const meals = {
  morning: {
    regular: [
      { name: 'Omelette', query: 'omelette breakfast' },
      { name: 'Pancakes', query: 'pancakes breakfast' },
    ],
    vegetarian: [
      { name: 'Vegetable Omelette', query: 'vegetable omelette breakfast' },
    ],
    vegan: [
      { name: 'Vegan Pancakes', query: 'vegan pancakes breakfast' },
    ],
  },
  lunch: {
    regular: [
      { name: 'Sandwich', query: 'sandwich lunch' },
      { name: 'Salad', query: 'salad lunch' },
    ],
    vegetarian: [
      { name: 'Vegetarian Wrap', query: 'vegetarian wrap lunch' },
    ],
    vegan: [
      { name: 'Vegan Salad', query: 'vegan salad lunch' },
    ],
  },
  dinner: {
    regular: [
      { name: 'Spaghetti', query: 'spaghetti dinner' },
      { name: 'Steak', query: 'steak dinner' },
    ],
    vegetarian: [
      { name: 'Vegetarian Pasta', query: 'vegetarian pasta dinner' },
    ],
    vegan: [
      { name: 'Vegan Burger', query: 'vegan burger dinner' },
    ],
  },
};

const WhatToEat = () => {
  const [selectedMealTime, setSelectedMealTime] = useState(null);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [dietaryPreference, setDietaryPreference] = useState('regular');
  const [mealImage, setMealImage] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Function to fetch image from Unsplash
  const fetchMealImage = async (query: string) => {
    setIsLoadingImage(true);
    setImageError(false);
    
    try {
      const res = await fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`);
      const data = await res.json();
      
      if (data.length > 0) {
        setMealImage(data[0].urls.regular); // Use the regular image URL
      } else {
        setImageError(true); // Handle no image found
      }
    } catch (error) {
      console.error('Error fetching image from Unsplash:', error);
      setImageError(true); // Handle error fetching image
    } finally {
      setIsLoadingImage(false);
    }
  };

  // Function to handle dietary preference change
  const handleDietaryChange = (pref: string) => {
    setDietaryPreference(pref);
  };

  // Function to handle meal time selection with error checking
  const handleMealTimeSelect = (mealTime: string) => {
    if (
      meals[mealTime] &&
      meals[mealTime][dietaryPreference] &&
      meals[mealTime][dietaryPreference].length > 0
    ) {
      setSelectedMealTime(mealTime);
      setCurrentMeal(meals[mealTime][dietaryPreference][0]); // Pick the first meal as default
    } else {
      console.error(`Invalid meal time or dietary preference: ${mealTime} / ${dietaryPreference}`);
      setCurrentMeal(null); // Handle invalid selection
    }
  };

  // Function to handle meal refresh
  const handleRefresh = () => {
    if (selectedMealTime && meals[selectedMealTime][dietaryPreference]) {
      setCurrentMeal(meals[selectedMealTime][dietaryPreference][Math.floor(Math.random() * meals[selectedMealTime][dietaryPreference].length)]);
    }
  };

  // Fetch image when current meal is selected or meal time changes
  useEffect(() => {
    if (currentMeal) {
      fetchMealImage(currentMeal.query);
    }
  }, [currentMeal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-2xl mx-auto">
        {!selectedMealTime ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 mt-32"
          >
            <div className="text-center space-y-4">
              <h1 className="text-6xl font-bold text-center">
                <span className="text-blue-500">What</span>
                <span className="text-red-500">To</span>
                <span className="text-yellow-500">Eat</span>
              </h1>
              <p className="text-gray-500">Find your next meal</p>
            </div>

            <div className="max-w-xl mx-auto">
              <div 
                className={`relative border rounded-full ${
                  searchFocused 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200 shadow'
                } transition-all duration-300`}
              >
                <div className="flex items-center px-4 h-12">
                  <Search className="text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for food..."
                    className="w-full px-4 outline-none"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    readOnly
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                {['regular', 'vegetarian', 'vegan'].map((pref) => (
                  <motion.button
                    key={pref}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDietaryChange(pref)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      dietaryPreference === pref 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pref === 'vegetarian' || pref === 'vegan' ? <Leaf size={16} /> : null}
                    <span className="capitalize">{pref}</span>
                  </motion.button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {['morning', 'lunch', 'dinner'].map((mealTime) => (
                  <motion.button
                    key={mealTime}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMealTimeSelect(mealTime)}
                    className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                  >
                    <h2 className="text-xl font-semibold capitalize text-gray-700">
                      {mealTime}
                    </h2>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 mt-10"
          >
            <div className="flex justify-between items-center">
              <button
                onClick={() => setSelectedMealTime(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
              <h2 className="text-2xl font-semibold capitalize text-gray-800">
                {selectedMealTime}
              </h2>
              <div className="w-10" />
            </div>
            
            {currentMeal && (
              <motion.div
                key={currentMeal.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative w-full h-64 bg-gray-200">
                  {isLoadingImage ? (
                    <div className="flex items-center justify-center w-full h-full">
                      <span className="text-xl text-gray-600">Loading...</span>
                    </div>
                  ) : imageError ? (
                    <div className="flex items-center justify-center w-full h-full">
                      <ImageOff className="text-red-500 w-10 h-10" />
                      <span className="text-xl text-gray-600">Image not available</span>
                    </div>
                  ) : (
                    <img
                      src={mealImage}
                      alt={currentMeal.name}
                      className="object-cover w-full h-64"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {currentMeal.name}
                  </h3>
                  <p className="text-gray-600">{currentMeal.query}</p>
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="w-full p-3 mt-6 rounded-xl bg-yellow-500 text-white font-semibold shadow-lg"
            >
              <RefreshCw className="inline-block mr-2 w-5 h-5" />
              Refresh Meal
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WhatToEat;
