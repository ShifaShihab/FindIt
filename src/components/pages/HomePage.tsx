import { Search, PlusCircle, CheckCircle, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to FindIt
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted platform for reporting and recovering lost or found items
            within your organization or community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Easy Search
            </h3>
            <p className="text-gray-600 text-sm">
              Quickly find items that match your lost belongings
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Report Items
            </h3>
            <p className="text-gray-600 text-sm">
              Post details of lost or found items with photos
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Track Status
            </h3>
            <p className="text-gray-600 text-sm">
              Monitor the status of your reported items in real-time
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Community Driven
            </h3>
            <p className="text-gray-600 text-sm">
              Connect with others to reunite items with their owners
            </p>
          </div>
        </div>

        {user ? (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              What would you like to do?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => onNavigate('report')}
                className="flex items-center justify-center space-x-3 bg-blue-500 text-white py-4 px-6 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
              >
                <PlusCircle className="w-6 h-6" />
                <span className="font-medium text-lg">Report an Item</span>
              </button>
              <button
                onClick={() => onNavigate('search')}
                className="flex items-center justify-center space-x-3 bg-green-500 text-white py-4 px-6 rounded-lg hover:bg-green-600 transition-colors shadow-md"
              >
                <Search className="w-6 h-6" />
                <span className="font-medium text-lg">Search Items</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Get Started Today
            </h2>
            <p className="text-gray-600 mb-6">
              Create an account or login to start reporting and searching for items
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => onNavigate('register')}
                className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md"
              >
                Register Now
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Login
              </button>
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="space-y-3">
              <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Create Account</h3>
              <p className="text-gray-600 text-sm">
                Sign up with your email to get started
              </p>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Report Item</h3>
              <p className="text-gray-600 text-sm">
                Post details about lost or found items
              </p>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Get Matched</h3>
              <p className="text-gray-600 text-sm">
                Connect with others and recover your items
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
