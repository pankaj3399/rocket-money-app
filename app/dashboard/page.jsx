import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, AlertCircle, ExternalLink } from 'lucide-react';

// Dummy data for demonstration
const trackedItems = [
  {
    id: 1,
    name: 'Amazon Echo Dot',
    currentPrice: 49.99,
    originalPrice: 59.99,
    priceChange: -10,
    url: 'https://amazon.com',
    category: 'Electronics',
    alertThreshold: 45.00
  },
  {
    id: 2,
    name: 'Nike Air Max',
    currentPrice: 129.99,
    originalPrice: 149.99,
    priceChange: -20,
    url: 'https://nike.com',
    category: 'Fashion',
    alertThreshold: 120.00
  },
  // Add more dummy items as needed
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-inherit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Price Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Track and monitor your favorite items</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Item
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-8">
          <Input
            placeholder="Search items..."
            className="max-w-sm"
          />
          <select className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2">
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home & Garden</option>
          </select>
        </div>

        {/* Price Alerts */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Price Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trackedItems.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Current Price</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${item.currentPrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Original Price</span>
                    <span className="text-gray-500 line-through">${item.originalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Price Change</span>
                    <span className={item.priceChange < 0 ? 'text-green-600' : 'text-red-600'}>
                      {item.priceChange}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <AlertCircle className="h-4 w-4" />
                    Alert when price drops below ${item.alertThreshold}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Price History Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Price History</h2>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Price history chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
}