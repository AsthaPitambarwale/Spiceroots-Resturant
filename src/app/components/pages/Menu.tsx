import { useState, useEffect } from 'react';
import { Search, Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router';
import { useNavigate } from "react-router";

const ITEMS_PER_PAGE = 12;

// Veg/Non-veg Icon Component
const VegNonVegIcon = ({ isVeg }: { isVeg: boolean }) => (
  <div className={`w-5 h-5 border-2 ${isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
    <div className={`w-2.5 h-2.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
  </div>
);

export const Menu = () => {
  const { foodItems, categories: indianCategories, addToCart } = useApp();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const filteredItems = foodItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesDiet = dietFilter === 'all' ||
        (dietFilter === 'veg' && item.isVegetarian) ||
        (dietFilter === 'non-veg' && !item.isVegetarian);
      return matchesSearch && matchesCategory && matchesDiet;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, dietFilter, sortBy]);

  const handleAddToCart = (item: typeof foodItems[0]) => {
    addToCart(item);

    toast.success(`${item.name} added to cart!`, {
      action: {
        label: "Go to Cart",
        onClick: () => navigate("/cart"),
      },
    });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        <motion.div
          className="text-center mb-8 md:mb-12 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 dark:text-white">Our Menu</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">Discover 130+ authentic Indian dishes</p>
        </motion.div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-3 md:p-4 mb-5 space-y-3">

          {/* ================= SEARCH ================= */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />

            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl
      bg-gray-50 dark:bg-gray-900
      border border-gray-200 dark:border-gray-700
      focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900
      focus:border-blue-500 outline-none text-sm transition"
            />
          </div>

          {/* ================= CATEGORY CHIPS ================= */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">

            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition
        ${selectedCategory === 'All'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
            >
              🍽️ All
            </button>

            {indianCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition
          ${selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
              >
                {cat}
              </button>
            ))}

          </div>

          {/* ================= FILTERS ROW ================= */}
          <div className="flex flex-wrap items-center justify-between gap-2">

            {/* ===== Veg / Non-Veg Toggle ===== */}
            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">

              {[
                { key: 'all', label: '🍽️' },
                { key: 'veg', label: '🟢' },
                { key: 'non-veg', label: '🔴' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setDietFilter(item.key as any)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition
            ${dietFilter === item.key
                      ? 'bg-white dark:bg-gray-700 shadow'
                      : 'text-gray-500'
                    }`}
                >
                  {item.label}
                </button>
              ))}

            </div>

            {/* ===== Sort Buttons ===== */}
            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">

              {[
                { key: 'name', label: 'A-Z' },
                { key: 'price', label: '₹' },
                { key: 'rating', label: '★' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setSortBy(item.key as any)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition
            ${sortBy === item.key
                      ? 'bg-white dark:bg-gray-700 shadow'
                      : 'text-gray-500'
                    }`}
                >
                  {item.label}
                </button>
              ))}

            </div>

            {/* ===== Results Counter ===== */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {filteredItems.length} dishes
            </div>

          </div>
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
          {paginatedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300"
            >
              <div className="relative h-44 sm:h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <VegNonVegIcon isVeg={item.isVegetarian} />
                </div>
                <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-lg">
                  <span className="text-blue-600 font-bold">₹{item.price}</span>
                </div>
              </div>

              <div className="p-3 md:p-4">
                <h3 className="font-bold text-base md:text-lg mb-2 dark:text-white line-clamp-1">{item.name}</h3>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 text-green-600 fill-green-600" />
                    <span className="ml-1 text-xs font-medium text-green-700 dark:text-green-400">{item.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">({item.reviews})</span>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{item.description}</p>

                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-sm font-semibold"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 dark:text-gray-400">No dishes found matching your criteria</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 px-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>

            {getPageNumbers().map((page, idx) => (
              page === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-500 dark:text-gray-400">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as number)}
                  className={`min-w-[40px] px-3 md:px-4 py-2 rounded-lg font-semibold transition-colors ${currentPage === page
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
                    }`}
                >
                  {page}
                </button>
              )
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
