// Import React and necessary hooks
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, MapPin, Weight, Clock, CheckCircle, XCircle, AlertCircle, Filter, Search, Plus } from 'lucide-react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { pickupRequestAPI } from '../utils/api.js';

/**
 * My Requests Page
 * Displays all user's pickup requests with filtering and search
 */
const MyRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch user's requests
  useEffect(() => {
    fetchRequests();
  }, []);

  // Filter requests when search or filter changes
  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

  const fetchRequests = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await pickupRequestAPI.getMyRequests();
      const userRequests = response.data || [];
      setRequests(userRequests);
      setFilteredRequests(userRequests);
    } catch (err) {
      console.error('Fetch requests error:', err);
      setError(err.message || 'Failed to fetch your requests');
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...requests];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    // Search by address or waste type
    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.wasteType?.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredRequests(filtered);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        icon: <Clock className="h-4 w-4" />,
        text: 'Pending',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        textColor: 'text-yellow-800 dark:text-yellow-300',
        borderColor: 'border-yellow-200 dark:border-yellow-800'
      },
      scheduled: {
        icon: <Calendar className="h-4 w-4" />,
        text: 'Scheduled',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        textColor: 'text-blue-800 dark:text-blue-300',
        borderColor: 'border-blue-200 dark:border-blue-800'
      },
      completed: {
        icon: <CheckCircle className="h-4 w-4" />,
        text: 'Completed',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        textColor: 'text-green-800 dark:text-green-300',
        borderColor: 'border-green-200 dark:border-green-800'
      },
      cancelled: {
        icon: <XCircle className="h-4 w-4" />,
        text: 'Cancelled',
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        textColor: 'text-red-800 dark:text-red-300',
        borderColor: 'border-red-200 dark:border-red-800'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} text-sm font-medium`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeSlot = (slot) => {
    const slots = {
      morning: '8 AM - 12 PM',
      afternoon: '12 PM - 4 PM',
      evening: '4 PM - 8 PM'
    };
    return slots[slot] || slot;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                My Pickup Requests
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track and manage all your waste pickup requests
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/new-request')}
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              New Request
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 dark:text-red-300 font-medium">Error loading requests</p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Search and Filter */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by address or waste type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredRequests.length}</span> of {requests.length} requests
            </p>
          </div>
        </Card>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <Card className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No matching requests found' : 'No requests yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first pickup request'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button
                variant="primary"
                onClick={() => navigate('/new-request')}
                className="mx-auto"
              >
                Create First Request
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request._id} className="hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Request Info */}
                  <div className="flex-1 space-y-3">
                    {/* Status and Date */}
                    <div className="flex flex-wrap items-center gap-3">
                      {getStatusBadge(request.status)}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Requested on {formatDate(request.createdAt)}
                      </span>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {request.address}
                        </p>
                      </div>
                    </div>

                    {/* Waste Type and Weight */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {Array.isArray(request.wasteType) ? request.wasteType.join(', ') : request.wasteType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Weight className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {request.estimatedWeight} kg
                        </span>
                      </div>
                    </div>

                    {/* Preferred Schedule */}
                    {request.preferredDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Preferred: {formatDate(request.preferredDate)}
                        </span>
                        <Clock className="h-4 w-4 text-blue-500 ml-2" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatTimeSlot(request.preferredTimeSlot)}
                        </span>
                      </div>
                    )}

                    {/* Scheduled Date (if scheduled) */}
                    {request.status === 'scheduled' && request.scheduledDate && (
                      <div className="inline-flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-blue-800 dark:text-blue-300 font-medium">
                          Scheduled for: {formatDate(request.scheduledDate)}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    {request.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        "{request.description}"
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex lg:flex-col gap-2">
                    {request.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* Add cancel functionality if needed */}}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
