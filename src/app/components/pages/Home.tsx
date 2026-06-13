import { Link, useNavigate } from 'react-router';
import { Star, Clock, Award, ChefHat, MapPin, Phone, Mail, Sparkles, TruckIcon, Shield, Percent, Search, ArrowRight, Download, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import leafImg from '../../../assets/images/leaf.png';
import chiliImg from '../../../assets/images/chili.png';
import mushroomImg from '../../../assets/images/mushroom.png';

export const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const slideIn = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  const offers = [
    { code: 'WELCOME50', title: '50% OFF on first order', color: 'from-purple-500 to-pink-500' },
    { code: 'FREEDEL', title: 'Free delivery on orders above ₹300', color: 'from-blue-500 to-cyan-500' },
    { code: 'FEAST30', title: '₹30 OFF on orders above ₹500', color: 'from-blue-500 to-red-500' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Auto-rotate offers
  useState(() => {
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(interval);
  });
  const features = [
    { icon: ChefHat, title: 'Authentic Recipes', desc: 'Traditional Indian flavors' },
    { icon: Star, title: 'Premium Quality', desc: 'Fresh ingredients daily' },
    { icon: Clock, title: 'Quick Delivery', desc: 'Hot food in 30 minutes' },
    { icon: Award, title: 'Top Rated', desc: '4.8★ customer satisfaction' },
  ];

  const categories = [
    {
      name: 'Appetizers & Starters',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
      count: '15+',
      color: 'from-blue-500 to-red-500'
    },
    {
      name: 'Tandoori & Kebabs',
      image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80',
      count: '15+',
      color: 'from-red-500 to-pink-500'
    },
    {
      name: 'Curries & Gravies',
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80',
      count: '20+',
      color: 'from-yellow-500 to-blue-500'
    },
    {
      name: 'Biryanis & Rice',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
      count: '15+',
      color: 'from-amber-500 to-yellow-500'
    },
    {
      name: 'Breads',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
      count: '10+',
      color: 'from-blue-400 to-amber-500'
    },
    {
      name: 'South Indian',
      image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80',
      count: '15+',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Street Food',
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80',
      count: '15+',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Desserts',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIH9lOaew2Vn8O6k9oeiQyAaO0Zy5mf3Dzrw&s',
      count: '15+',
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'Beverages',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxexW6paUUZef6nTrtEB64MsaYXvfQ_hYBNg&s',
      count: '10+',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Thalis & Combos',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
      count: '10+',
      color: 'from-indigo-500 to-purple-500'
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Modern Hero Section with Search */}
      <section className="relative overflow-hidden bg-[#fafafa] dark:bg-gray-900 min-h-screen lg:min-h-[85vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeeUffLekDypxq5YstuPhcdvWTu9z1OalCcg&s"
            alt="Background Food"
            className="w-full h-full object-cover scale-110 blur-md"
          />
        </div>
        {/* Background Shape */}
        <div
          className="
    hidden lg:block
    absolute top-0 right-0
    w-[45%] h-full
    rounded-l-[220px]

    bg-blue-100/70
    dark:bg-blue-900/30

    backdrop-blur-sm
    blur-[2px]

    border-l border-white/30
    dark:border-white/5
  "
        />

        <div className="max-w-7xl mx-auto w-full px-5 sm:px-4 lg:px-5 pt-6 pb-5 lg:pt-10 lg:pb-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">

            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="
relative z-10
backdrop-blur-xl
bg-white/70 dark:bg-gray-900/60
border border-white/30 dark:border-white/10
rounded-3xl
p-6 sm:p-8 lg:p-12
shadow-2xl
text-center lg:text-left
"
            >
              {/* Badge */}
              <span
                className="
      inline-flex items-center
      bg-blue-100
      dark:bg-blue-500/20
      text-blue-600
      dark:text-blue-300
      px-6 py-2
      rounded-full
      text-sm
      font-semibold
    "
              >
                ✨ Authentic Indian Fine Dining
              </span>

              {/* Heading */}
              <h1
                className="
      mt-6
      text-3xl
      sm:text-4xl
      lg:text-5xl
      font-extrabold
      leading-tight
      text-gray-900
      dark:text-white
    "
              >
                Deliciousness
                <br />
                <span className="text-blue-500 dark:text-blue-400">
                  Jumping Into
                </span>
                <br />
                Your Mouth
              </h1>

              {/* Description */}
              <p
                className="
      mt-5
      text-base
      lg:text-sm
      text-gray-600
      dark:text-gray-300
      leading-relaxed
      max-w-xl
    "
              >
                Experience authentic Indian cuisine crafted by expert chefs using
                premium ingredients, aromatic spices and traditional recipes.
                Every bite delivers unforgettable flavour and a memorable dining
                experience.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center lg:justify-start">
                <Link
                  to="/reservations"
                  className="
        bg-blue-500
        hover:bg-blue-600
        text-white
        px-8 py-4
        rounded-full
        font-semibold
        shadow-lg
        hover:shadow-blue-500/30
        transition-all
        duration-300
        text-center
      "
                >
                  Reserve a Table
                </Link>

                <button
                  className="
        group
        flex items-center justify-center gap-3
        px-8 py-4
        rounded-full
        border-2 border-blue-500
        text-blue-500 dark:text-blue-400
        hover:bg-blue-500
        hover:text-white
        transition-all
        duration-300
      "
                >
                  <div
                    className="
          w-7 h-7
          rounded-full
          bg-blue-500
          text-white
          flex items-center justify-center
          text-xs
          group-hover:bg-white
          group-hover:text-blue-500
          transition-all
        "
                  >
                    ▶
                  </div>

                  Watch Our Story
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-6 mt-10">
                {[
                  { value: "130+", label: "Dishes" },
                  { value: "10+", label: "Cities" },
                  { value: "4.8★", label: "Rating" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                  >
                    <h3
                      className="
            text-2xl
            lg:text-3xl
            font-bold
            text-blue-500
          "
                    >
                      {item.value}
                    </h3>

                    <p
                      className="
            text-sm
            text-gray-600
            dark:text-gray-400
            mt-1
          "
                    >
                      {item.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT IMAGE */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="
order-first lg:order-2
relative
flex
justify-center
items-center
mt-4 lg:mt-0
"
            >
              {/* blue Background Circle */}
              <div
                className="
  absolute
  w-[220px] h-[220px]
  sm:w-[320px] sm:h-[320px]
  lg:w-[520px] lg:h-[520px]
  rounded-full
  bg-blue-500/20
  blur-[80px]
  lg:blur-[120px]
"
              />

              {/* Main Plate */}
              <motion.img
                src="https://backend.sulaindianrestaurant.com/wp-content/uploads/2024/07/Indian-food-near-me-by-sula-indian-restaurant-serving-vancouver-with-locations-on-commercial-drive-main-street-davie-street.jpg"
                alt="Indian Food"
                className="
relative z-10
w-[220px]
sm:w-[300px]
md:w-[380px]
lg:w-[520px]
aspect-square
object-cover
rounded-full
border-8 lg:border-[14px]
border-white
shadow-2xl
"
                animate={{
                  rotate: 360,
                  y: [0, -12, 0],
                }}
                transition={{
                  rotate: {
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              />

              {/* Small Dish */}
              <img
                src="https://images.immediate.co.uk/production/volatile/sites/30/2024/06/Spices700-3a52cf2.jpg?quality=90&fit=700,350"
                alt="Dish"
                className="hidden lg:block absolute bottom-0 right-0 w-40 h-40 object-cover rounded-full border-5 border-white shadow-xl z-20"
              />

              {/* Decorations */}
              <motion.img
                src={leafImg}
                alt="Leaf"
                className="hidden lg:block absolute top-10 -left-10 w-40 xl:w-52"
              />

              <motion.img
                src={chiliImg}
                alt="Chili"
                className="hidden lg:block absolute top-10 -right-10 w-32 xl:w-44"
              />

              <motion.img
                src={mushroomImg}
                alt="Mushroom"
                className="hidden lg:block absolute bottom-10 -left-8 w-28 xl:w-40"
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Offers Banner */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-900 dark:to-pink-900 py-6 overflow-hidden">
        <div className="container mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentOfferIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-4 text-white"
            >
              <Percent className="h-8 w-8" />
              <div className="text-center">
                <p className="text-xl font-bold">{offers[currentOfferIndex].title}</p>
                <p className="text-sm opacity-90">Use code: <span className="font-mono font-bold">{offers[currentOfferIndex].code}</span></p>
              </div>
              <Link to="/offers">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold"
                >
                  View All Offers
                </motion.button>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-serif mb-4 dark:text-white">Why Choose Us</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">India's #1 Online Food Delivery</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-medium mb-3 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Carousel */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 dark:text-white">
              What's on your mind?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">
              Explore our delicious categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="cursor-pointer"
              >
                <Link to="/menu" className="block">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg group aspect-square">
                    <motion.img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`}></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                      <motion.div
                        className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-2"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      >
                        {category.count} dishes
                      </motion.div>
                      <h3 className="font-bold text-center text-sm md:text-base">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/menu"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl font-semibold shadow-lg transition-all inline-block"
              >
                View All 130+ Dishes
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Popular Dishes */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 dark:text-white">
              Most Popular Dishes
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">
              Customer favorites you must try
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Butter Chicken', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80', price: '₹16.99', rating: '4.9⭐', veg: false },
              { name: 'Paneer Tikka', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80', price: '₹12.99', rating: '4.8⭐', veg: true },
              { name: 'Chicken Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80', price: '₹18.99', rating: '4.9⭐', veg: false },
              { name: 'Masala Dosa', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80', price: '₹9.99', rating: '4.7⭐', veg: true },
            ].map((dish, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
              >
                <Link to="/menu">
                  <div className="relative h-44 sm:h-48 overflow-hidden">
                    <motion.img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="absolute top-3 right-3">
                      <div className={`w-6 h-6 border-2 ${dish.veg ? 'border-green-600' : 'border-red-600'} bg-white flex items-center justify-center`}>
                        <div className={`w-3 h-3 rounded-full ${dish.veg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3">
                      <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-bold">
                        {dish.rating}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-bold text-lg mb-2 dark:text-white">{dish.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-bold text-xl">{dish.price}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
                Get the SpiceRoots App
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Order faster, track your food in real-time, and get exclusive app-only offers. Download now and get 50% off on your first order!
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: TruckIcon, text: 'Live order tracking' },
                  { icon: Percent, text: 'Exclusive deals & offers' },
                  { icon: Zap, text: 'Lightning fast checkout' },
                  { icon: Award, text: 'Earn rewards & cashback' },
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-3 bg-white dark:bg-gray-700 px-4 py-3 rounded-xl shadow-md"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <feature.icon className="h-5 w-5 text-blue-600" />
                    <span className="font-medium dark:text-white">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-4 flex-wrap">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-3 font-semibold"
                >
                  <Download className="h-5 w-5" />
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm">App Store</div>
                  </div>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-3 font-semibold"
                >
                  <Download className="h-5 w-5" />
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm">Google Play</div>
                  </div>
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
                  alt="App Interface"
                  className="rounded-2xl shadow-xl h-80 w-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
                  alt="Food Delivery"
                  className="rounded-2xl shadow-xl h-80 w-full object-cover mt-12"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Order From Us */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 dark:text-white">
              Why order from SpiceRoots?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">
              We make food ordering easy, fast, and delightful
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: TruckIcon,
                title: 'Super Fast Delivery',
                desc: 'Get your food delivered hot and fresh in just 30 minutes',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Shield,
                title: '100% Safe & Hygienic',
                desc: 'ISO certified kitchen with contactless delivery option',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Percent,
                title: 'Best Offers & Deals',
                desc: 'Save more with exclusive coupons and cashback offers',
                color: 'from-blue-500 to-red-500'
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -10 }}
                className="text-center p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                  <item.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '60px 60px',
          }}
        />
        <motion.div
          className="container mx-auto px-6 text-center relative z-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Craving delicious food?</h2>
          </motion.div>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Order from 130+ authentic Indian dishes and get it delivered in 30 minutes!
          </p>
          <div className="flex gap-6 justify-center flex-wrap mb-10">
            <motion.div
              className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-8 py-4 rounded-xl"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }}
            >
              <Phone className="h-6 w-6" />
              <div className="text-left">
                <div className="text-xs opacity-90">Call us now</div>
                <div className="text-lg font-bold">+91 1800 123 4567</div>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-8 py-4 rounded-xl"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }}
            >
              <Mail className="h-6 w-6" />
              <div className="text-left">
                <div className="text-xs opacity-90">Email us at</div>
                <div className="text-lg font-bold">order@spiceroots.com</div>
              </div>
            </motion.div>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/menu"
                className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-5 rounded-xl font-bold shadow-2xl transition-all inline-flex items-center gap-3 text-lg"
              >
                Order Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/offers"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-12 py-5 rounded-xl font-bold transition-all inline-flex items-center gap-3 text-lg"
              >
                View Offers
                <Percent className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Food Quality & Hygiene Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="h-6 w-6" />
              <span className="font-bold">100% Safe & Hygienic</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 dark:text-white">
              Pure Veg & Non-Veg Excellence
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We maintain separate kitchens for vegetarian and non-vegetarian dishes with the highest standards of cleanliness and food safety
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-12">
            {/* Vegetarian Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-4 border-green-500"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 border-4 border-green-600 flex items-center justify-center rounded-full bg-green-50 dark:bg-green-900/30">
                  <div className="w-8 h-8 rounded-full bg-green-600"></div>
                </div>
                <h3 className="text-3xl font-bold text-green-600">Pure Vegetarian</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">Dedicated vegetarian kitchen with separate cooking equipment</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">100% fresh vegetables sourced daily from trusted suppliers</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">No cross-contamination with non-veg items guaranteed</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">Traditional recipes with authentic spices and ingredients</p>
                </div>
              </div>
              <motion.div
                className="mt-6"
                whileHover={{ scale: 1.02 }}
              >
                <Link to="/menu?diet=veg" className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-xl font-bold transition-colors">
                  Browse Veg Menu
                </Link>
              </motion.div>
            </motion.div>

            {/* Non-Vegetarian Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-4 border-red-500"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 border-4 border-red-600 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30">
                  <div className="w-8 h-8 rounded-full bg-red-600"></div>
                </div>
                <h3 className="text-3xl font-bold text-red-600">Premium Non-Veg</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">Separate non-veg kitchen with dedicated chefs and equipment</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">Fresh halal-certified meat from premium quality sources</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">Temperature-controlled storage ensuring perfect freshness</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">Expert marination and cooking techniques for tender meat</p>
                </div>
              </div>
              <motion.div
                className="mt-6"
                whileHover={{ scale: 1.02 }}
              >
                <Link to="/menu?diet=non-veg" className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-3 rounded-xl font-bold transition-colors">
                  Browse Non-Veg Menu
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Certifications */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {[
              { icon: Shield, text: 'FSSAI Certified' },
              { icon: Award, text: 'ISO 22000:2018' },
              { icon: Star, text: '5-Star Hygiene' },
              { icon: ChefHat, text: 'Expert Chefs' },
            ].map((cert, idx) => (
              <motion.div
                key={idx}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <cert.icon className="h-12 w-12 mx-auto mb-3 text-green-600" />
                <p className="font-bold text-gray-800 dark:text-white">{cert.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 dark:text-white">We Deliver In</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">Currently serving 10 major Indian cities</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'].map((city, index) => (
              <motion.div
                key={city}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="bg-white dark:bg-gray-800 px-8 py-4 rounded-full font-semibold text-lg shadow-md hover:shadow-xl transition-all dark:text-white border-2 border-blue-200 dark:border-blue-900"
              >
                <MapPin className="inline h-5 w-5 mr-2 text-blue-600" />
                {city}
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Don't see your city? We're expanding soon!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Request Your City
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 dark:text-white">
              What our customers say
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">
              50,000+ happy customers and counting
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Priya Sharma', city: 'Mumbai', rating: 5, review: 'Best biryani in town! Always delivered hot and fresh. The packaging is excellent and delivery is super fast.' },
              { name: 'Rahul Verma', city: 'Delhi', rating: 5, review: 'Authentic Indian flavors that remind me of home. The butter chicken is absolutely divine. Highly recommended!' },
              { name: 'Sneha Patel', city: 'Bangalore', rating: 5, review: 'Amazing food quality and great offers. The app is so easy to use and tracking is real-time. Love it!' },
            ].map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                  "{review.review}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold dark:text-white">{review.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{review.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
