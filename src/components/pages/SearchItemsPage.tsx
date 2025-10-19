import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin, Package, Tag, User, Mail, Phone } from 'lucide-react';
import { supabase, Item, Category } from '../../lib/supabase';

interface SearchItemsPageProps {
  onNavigate: (page: string) => void;
}

export function SearchItemsPage({ onNavigate }: SearchItemsPageProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'matched' | 'closed'>('all');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, searchTerm, filterType, filterCategory, filterStatus]);

  const fetchData = async () => {
    setLoading(true);

    const [itemsResponse, categoriesResponse] = await Promise.all([
      supabase
        .from('items')
        .select(`
          *,
          profiles (id, email, full_name, phone),
          categories (id, name, description)
        `)
        .order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ]);

    if (itemsResponse.error) {
      console.error('Error fetching items:', itemsResponse.error);
    } else {
      setItems(itemsResponse.data || []);
    }

    if (categoriesResponse.error) {
      console.error('Error fetching categories:', categoriesResponse.error);
    } else {
      setCategories(categoriesResponse.data || []);
    }

    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...items];

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    if (filterCategory) {
      filtered = filtered.filter((item) => item.category_id === filterCategory);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }

    setFilteredItems(filtered);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      open: 'bg-green-100 text-green-800',
      matched: 'bg-blue-100 text-blue-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return styles[status as keyof typeof styles] || styles.open;
  };

  const getTypeBadge = (type: string) => {
    return type === 'lost'
      ? 'bg-red-100 text-red-800'
      : 'bg-emerald-100 text-emerald-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Search Items</h1>
          <p className="text-gray-600">Browse through lost and found items</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, description, or location..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="matched">Matched</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                      {item.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${getTypeBadge(
                        item.type
                      )}`}
                    >
                      {item.type.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(item.date_reported).toLocaleDateString()}</span>
                    </div>
                    {item.categories && (
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 mr-2" />
                        <span>{item.categories.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedItem.image_url && (
              <img
                src={selectedItem.image_url}
                alt={selectedItem.title}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedItem.title}
                </h2>
                <div className="flex space-x-2">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded ${getTypeBadge(
                      selectedItem.type
                    )}`}
                  >
                    {selectedItem.type.toUpperCase()}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded ${getStatusBadge(
                      selectedItem.status
                    )}`}
                  >
                    {selectedItem.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600">{selectedItem.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Location
                    </h3>
                    <p className="text-gray-600">{selectedItem.location}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Date {selectedItem.type === 'lost' ? 'Lost' : 'Found'}
                    </h3>
                    <p className="text-gray-600">
                      {new Date(selectedItem.date_reported).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedItem.categories && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <Tag className="w-4 h-4 mr-2" />
                      Category
                    </h3>
                    <p className="text-gray-600">{selectedItem.categories.name}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Posted By
                  </h3>
                  <p className="text-gray-600">
                    {selectedItem.profiles?.full_name || 'Unknown User'}
                  </p>
                </div>

                {selectedItem.contact_info && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact
                    </h3>
                    <p className="text-gray-600">{selectedItem.contact_info}</p>
                  </div>
                )}

                {selectedItem.profiles?.email && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </h3>
                    <p className="text-gray-600">{selectedItem.profiles.email}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
