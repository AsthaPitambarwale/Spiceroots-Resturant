import { Layers, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ManageCategories = () => {
  const { foodItems, categories } = useApp();
  const localCategories = categories;

  const getCategoryStats = (category: string) => {
    const items = foodItems.filter(item => item.category === category);
    return {
      itemCount: items.length,
      avgPrice: items.length > 0
        ? items.reduce((sum, item) => sum + item.price, 0) / items.length
        : 0,
    };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif mb-2 text-black">Manage Categories</h1>
          <p className="text-gray-600 dark:text-gray-400">Organize your menu into categories</p>
        </div>
        {/* <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-all">
          <Plus className="h-5 w-5" />
          Add Category
        </button> */}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localCategories.map((category, index) => {
          const stats = getCategoryStats(category);
          return (
            <div
              key={category}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`bg-gradient-to-br ${
                  index % 3 === 0 ? 'from-blue-100 to-purple-100' :
                  index % 3 === 1 ? 'from-purple-100 to-blue-100' :
                  'from-blue-100 to-blue-200'
                } p-4 rounded-lg`}>
                  <Layers className="h-8 w-8 text-blue-900" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-black text-black">{category}</h3>
                  <p className="text-sm text-gray-600">{stats.itemCount} items</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="font-medium text-black">{stats.itemCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg. Price:</span>
                  <span className="font-medium text-black">${stats.avgPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
