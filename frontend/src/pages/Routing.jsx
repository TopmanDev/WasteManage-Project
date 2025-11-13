// Import React and necessary hooks
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Calendar, CheckCircle } from 'lucide-react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { pickupRequestAPI } from '../utils/api.js';

/**
 * Routing Page
 * Displays optimized routes for waste pickup
 */
const Routing = () => {
  // State for requests
  const [scheduledRequests, setScheduledRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch scheduled requests on component mount
  useEffect(() => {
    fetchScheduledRequests();
  }, []);

  // Fetch scheduled pickup requests
  const fetchScheduledRequests = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await pickupRequestAPI.getAll({ status: 'scheduled' });
      // Group requests by date
      const grouped = groupByDate(response.data || []);
      setScheduledRequests(grouped);
    } catch (err) {
      console.error('Routing page error:', err);
      setError(err.message || 'Failed to fetch scheduled requests. Make sure you are logged in as admin.');
    } finally {
      setIsLoading(false);
    }
  };

  // Group requests by preferred date
  const groupByDate = (requests) => {
    const grouped = {};

    requests.forEach(request => {
      const date = new Date(request.preferredDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(request);
    });

    // Sort requests within each date by time slot
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        const timeSlotOrder = { morning: 1, afternoon: 2, evening: 3 };
        return timeSlotOrder[a.preferredTimeSlot] - timeSlotOrder[b.preferredTimeSlot];
      });
    });

    return grouped;
  };

  // Get time slot icon
  const getTimeSlotIcon = (timeSlot) => {
    const icons = {
      morning: '🌅',
      afternoon: '☀️',
      evening: '🌙'
    };
    return icons[timeSlot] || '⏰';
  };

  // Calculate route distance (simplified - in real app would use mapping API)
  const calculateRouteStats = (requests) => {
    const totalStops = requests.length;
    const totalWeight = requests.reduce((sum, req) => sum + req.estimatedWeight, 0);
    // Simplified distance calculation: 2 km per stop
    const estimatedDistance = totalStops * 2;
    // Simplified time calculation: 15 minutes per stop
    const estimatedTime = totalStops * 15;

    return {
      totalStops,
      totalWeight,
      estimatedDistance,
      estimatedTime
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading routes...</p>
          </div>
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
            Route Optimization
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Optimized collection routes for scheduled pickups
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {Object.keys(scheduledRequests).length === 0 ? (
          <Card className="text-center py-12">
            <Navigation className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
              No scheduled pickups found
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Schedule some pickup requests to see optimized routes
            </p>
          </Card>
        ) : (
          // Routes by Date
          <div className="space-y-8">
            {Object.entries(scheduledRequests).map(([date, requests]) => {
              const stats = calculateRouteStats(requests);

              return (
                <Card key={date}>
                  {/* Date Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-6 w-6 text-green-600" />
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {date}
                      </h2>
                    </div>
                    <span className="px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
                      {requests.length} Stops
                    </span>
                  </div>

                  {/* Route Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Stops</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalStops}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Weight</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalWeight} kg
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Est. Distance</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.estimatedDistance} km
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Est. Time</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.estimatedTime} min
                      </p>
                    </div>
                  </div>

                  {/* Route Stops */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Route Sequence
                    </h3>
                    {requests.map((request, index) => (
                      <div
                        key={request._id}
                        className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow duration-200"
                      >
                        {/* Stop Number */}
                        <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>

                        {/* Stop Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {request.userName}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {request.userPhone}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl">{getTimeSlotIcon(request.preferredTimeSlot)}</span>
                              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize mt-1">
                                {request.preferredTimeSlot}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{request.address}</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs">
                              {request.wasteType.join(', ')}
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded text-xs">
                              {request.estimatedWeight} kg
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(request.address)}`, '_blank')}
                          >
                            <Navigation className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Route Actions */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      variant="primary" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => {
                        // Get first address from the route
                        const firstAddress = requests[0]?.address;
                        if (firstAddress) {
                          // Open Google Maps with all addresses as waypoints
                          const addresses = requests.map(r => r.address).join('/');
                          window.open(`https://www.google.com/maps/dir/${encodeURIComponent(addresses)}`, '_blank');
                        }
                      }}
                    >
                      <Navigation className="h-5 w-5" />
                      Start Route in Google Maps
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Route Optimization Info */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Smart Route Optimization
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Routes are automatically optimized based on pickup locations, preferred time slots,
                and waste volume to minimize travel distance and maximize efficiency. This helps
                reduce fuel consumption and carbon emissions, supporting sustainable waste management.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Routing;
