// Import React and necessary hooks
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle, Package, Weight } from 'lucide-react';
import Card from '../components/Card.jsx';
import { pickupRequestAPI } from '../utils/api.js';

/**
 * Dashboard Page
 * Displays statistics and overview of waste pickup requests
 */
const Dashboard = () => {
  // State for user requests
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user's requests on component mount
  useEffect(() => {
    fetchUserRequests();
  }, []);

  // Fetch user's own requests and calculate statistics
  const fetchUserRequests = async () => {
    setIsLoading(true);
    setError('');

    try {
      console.log('Fetching user requests...');
      // Fetch only the logged-in user's requests
      const response = await pickupRequestAPI.getMyRequests();
      console.log('Dashboard response:', response);
      const userRequests = response.data || [];
      setRequests(userRequests);
      
      // Calculate statistics from user's requests
      const calculatedStats = calculateStats(userRequests);
      setStats(calculatedStats);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.message || 'Failed to fetch your requests');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics from user's requests
  const calculateStats = (userRequests) => {
    const totalRequests = userRequests.length;
    const pendingRequests = userRequests.filter(r => r.status === 'pending').length;
    const scheduledRequests = userRequests.filter(r => r.status === 'scheduled').length;
    const inProgressRequests = userRequests.filter(r => r.status === 'in-progress').length;
    const completedRequests = userRequests.filter(r => r.status === 'completed').length;
    const totalWeight = userRequests.reduce((sum, r) => sum + (r.estimatedWeight || 0), 0);

    // Calculate waste type distribution
    const wasteTypeCounts = {};
    userRequests.forEach(request => {
      if (request.wasteType && Array.isArray(request.wasteType)) {
        request.wasteType.forEach(type => {
          wasteTypeCounts[type] = (wasteTypeCounts[type] || 0) + 1;
        });
      }
    });

    const wasteTypeStats = Object.entries(wasteTypeCounts).map(([type, count]) => ({
      _id: type,
      count
    }));

    return {
      totalRequests,
      pendingRequests,
      scheduledRequests,
      inProgressRequests,
      completedRequests,
      totalWeight,
      wasteTypeStats
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Statistics cards data
  const statisticsCards = [
    {
      title: 'Total Requests',
      value: stats?.totalRequests || 0,
      icon: <Package className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Pending',
      value: stats?.pendingRequests || 0,
      icon: <Clock className="h-8 w-8 text-yellow-600" />,
      color: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      title: 'In Progress',
      value: stats?.inProgressRequests || 0,
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      color: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      title: 'Completed',
      value: stats?.completedRequests || 0,
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      color: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Total Weight',
      value: `${stats?.totalWeight || 0} kg`,
      icon: <Weight className="h-8 w-8 text-orange-600" />,
      color: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      title: 'Scheduled',
      value: stats?.scheduledRequests || 0,
      icon: <BarChart3 className="h-8 w-8 text-indigo-600" />,
      color: 'bg-indigo-100 dark:bg-indigo-900/20'
    }
  ];

  // Empty state when user has no requests
  if (!isLoading && !error && requests.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              My Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your waste pickup requests
            </p>
          </div>

          <Card className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Requests Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't created any pickup requests yet. Get started by requesting your first pickup!
            </p>
            <a
              href="/new-request"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Request Your First Pickup
            </a>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of your waste pickup requests
          </p>
        </div>

        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statisticsCards.map((stat, index) => (
            <Card key={index} hover className="transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Waste Type Statistics */}
        {stats?.wasteTypeStats && stats.wasteTypeStats.length > 0 && (
          <Card title="Waste Type Distribution">
            <div className="space-y-4">
              {stats.wasteTypeStats.map((item, index) => {
                // Calculate percentage
                const percentage = stats.totalRequests > 0
                  ? ((item.count / stats.totalRequests) * 100).toFixed(1)
                  : 0;

                // Get color for waste type
                const getWasteTypeColor = (type) => {
                  const typeColors = {
                    paper: 'bg-amber-500',
                    plastics: 'bg-blue-500',
                    metal: 'bg-gray-500',
                    mixed: 'bg-purple-500'
                  };
                  return typeColors[type] || 'bg-gray-500';
                };

                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {item._id}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.count} requests ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${getWasteTypeColor(item._id)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Request Status Summary */}
          <Card title="Request Status Summary">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">Pending</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm font-medium">
                  {stats?.pendingRequests || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">Scheduled</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium">
                  {stats?.scheduledRequests || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">In Progress</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-sm font-medium">
                  {stats?.inProgressRequests || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">Completed</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
                  {stats?.completedRequests || 0}
                </span>
              </div>
            </div>
          </Card>

          {/* Environmental Impact */}
          <Card title="Environmental Impact">
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="text-5xl mb-2">🌍</div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {stats?.totalWeight || 0} kg
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total waste collected
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Supporting SDG 11 (Sustainable Cities) and SDG 12 (Responsible Consumption & Production)
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
