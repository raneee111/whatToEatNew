'use client'; // Mark this file as a client component

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Leaf, Search, ImageOff } from 'lucide-react';

// Use environment variable for API key
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

// Define the type for meal structure
interface Meal {
  name: string;
  query: string;
}

// Define the type for each meal time category (morning, lunch, dinner)
interface MealTime {
  regular: Meal[];
  vegetarian: Meal[];
  vegan: Meal[];
}

// Define the structure of the meals object
interface Meals {
  morning: MealTime;
  lunch: MealTime;
  dinner: MealTime;
}

// Meals object with types applied
const meals: Meals = {
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
  const [selectedMealTime, setSelectedMealTime] = useState<string | null>(null);
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);
  const [dietaryPreference, setDietaryPreference] = useState<'regular' | 'vegetarian' | 'vegan'>('regular');
  const [mealImage, setMealImage] = useState<string | null>(null);
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
  const handleDietaryChange = (pref: 'regular' | 'vegetarian' | 'vegan') => {
    setDietaryPreference(pref);
  };

  // Function to handle meal time selection with error checking
  const handleMealTimeSelect = (mealTime: string) => {
    if (
      meals[mealTime as keyof Meals] &&
      meals[mealTime as keyof Meals][dietaryPreference] &&
      meals[mealTime as keyof Meals][dietaryPreference].length > 0
    ) {
      setSelectedMealTime(mealTime);
      setCurrentMeal(meals[mealTime as keyof Meals][dietaryPreference][0]); // Pick the first meal as default
    } else {
      console.error(`Invalid meal time or dietary preference: ${mealTime} / ${dietaryPreference}`);
      setCurrentMeal(null); // Handle invalid selection
    }
  };

  // Function to handle meal refresh
  const handleRefresh = () => {
    if (selectedMealTime && meals[selectedMealTime as keyof Meals][dietaryPreference]) {
      setCurrentMeal(meals[selectedMealTime as keyof Meals][dietaryPreference][Math.floor(Math.random() * meals[selectedMealTime as keyof Meals][dietaryPreference].length)]);
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
                    onClick={() => handleDietaryChange(pref as 'regular' | 'vegetarian' | 'vegan')}
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
                <div className="relative w-full h-64">
                  {isLoadingImage ? (
                    <div className="absolute inset-0 flex justify-center items-center bg-gray-200">
                      <RefreshCw className="animate-spin text-blue-500 w-8 h-8" />
                    </div>
                  ) : imageError ? (
                    <div className="absolute inset-0 flex justify-center items-center bg-gray-200">
                      <ImageOff className="text-gray-500 w-8 h-8" />
                    </div>
                  ) : (
                    <img
                      src={mealImage || ''}
                      alt={currentMeal.name}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-700">{currentMeal.name}</h3>
                  <p className="mt-2 text-gray-500">{currentMeal.query}</p>
                </div>

                <div className="p-6 flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRefresh}
                    className="bg-blue-500 text-white py-2 px-6 rounded-xl"
                  >
                    Refresh
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WhatToEat;
