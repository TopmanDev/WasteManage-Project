// Import React and necessary hooks
import React, { useState, useEffect } from 'react';
import { Filter, Search, Trash2, CheckCircle, Clock, XCircle, Calendar, RefreshCw, User, Phone, Weight, Package } from 'lucide-react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import { pickupRequestAPI } from '../utils/api.js';

/**
 * Pickup Requests List Page
 * Displays all pickup requests with filtering and management options
 */
const PickupRequests = () => {
  // State for pickup requests
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [wasteTypeFilter, setWasteTypeFilter] = useState('all');

  // Fetch pickup requests on component mount
  useEffect(() => {
    fetchRequests();
  }, []);

  // Apply filters when search term or filters change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, wasteTypeFilter, requests]);

  // Fetch all pickup requests
  const fetchRequests = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await pickupRequestAPI.getAll();
      // Transform data to flatten user information
      const transformedData = response.data.map(request => ({
        ...request,
        userName: request.user ? `${request.user.firstName} ${request.user.lastName}` : 'Unknown User',
        userEmail: request.user?.email || 'No email',
        userPhone: request.user?.phoneNumber || 'No phone number'
      }));
      setRequests(transformedData);
      setFilteredRequests(transformedData);
    } catch (err) {
      setError(err.message || 'Failed to fetch requests');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters to requests
  const applyFilters = () => {
    let filtered = [...requests];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    // Waste type filter
    if (wasteTypeFilter !== 'all') {
      filtered = filtered.filter(req => req.wasteType.includes(wasteTypeFilter));
    }

    setFilteredRequests(filtered);
  };

  // Update request status
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await pickupRequestAPI.updateStatus(id, newStatus);
      // Refresh requests after update
      fetchRequests();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  // Delete request
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      await pickupRequestAPI.delete(id);
      // Refresh requests after deletion
      fetchRequests();
    } catch (err) {
      setError(err.message || 'Failed to delete request');
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'in-progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              All Pickup Requests
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track all waste pickup requests from users
            </p>
          </div>
          <Button 
            variant="secondary"
            size="lg" 
            className="flex items-center gap-2 mt-4 md:mt-0"
            onClick={fetchRequests}
          >
            <RefreshCw className="h-5 w-5" />
            Refresh
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Search by name, email, or address..."
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Waste Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Waste Type
              </label>
              <select
                value={wasteTypeFilter}
                onChange={(e) => setWasteTypeFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Types</option>
                <option value="paper">Paper</option>
                <option value="plastics">Plastics</option>
                <option value="metal">Metal</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          // Empty State
          <Card className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {statusFilter !== 'all' || wasteTypeFilter !== 'all' || searchTerm 
                ? 'No requests match your filters'
                : 'No pickup requests found'
              }
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {statusFilter !== 'all' || wasteTypeFilter !== 'all' || searchTerm
                ? 'Try adjusting your filters to see more results'
                : 'No pickup requests have been created yet'
              }
            </p>
            {(statusFilter !== 'all' || wasteTypeFilter !== 'all' || searchTerm) && (
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter('all');
                  setWasteTypeFilter('all');
                  setSearchTerm('');
                }}
              >
                Clear All Filters
              </Button>
            )}
          </Card>
        ) : (
          // Requests List
          <div className="grid grid-cols-1 gap-6">
            {filteredRequests.map((request) => (
              <Card key={request._id} hover>
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex-1">
                    {/* Header with Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {request.userName}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">{request.userEmail}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Key Information - Name, Phone, Weight */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {request.userName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {request.userPhone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Weight className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {request.estimatedWeight} kg
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Request Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <strong>Address:</strong> {request.address}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Waste Types:</strong> {request.wasteType.join(', ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <strong>Preferred Date:</strong> {formatDate(request.preferredDate)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Time Slot:</strong> {request.preferredTimeSlot}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    {request.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-4">
                        "{request.description}"
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {request.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleStatusUpdate(request._id, 'scheduled')}
                        >
                          Schedule
                        </Button>
                      )}
                      {request.status === 'scheduled' && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleStatusUpdate(request._id, 'in-progress')}
                        >
                          Start Pickup
                        </Button>
                      )}
                      {request.status === 'in-progress' && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleStatusUpdate(request._id, 'completed')}
                        >
                          Mark Complete
                        </Button>
                      )}
                      {request.status !== 'completed' && request.status !== 'cancelled' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleStatusUpdate(request._id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(request._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

export default PickupRequests;
