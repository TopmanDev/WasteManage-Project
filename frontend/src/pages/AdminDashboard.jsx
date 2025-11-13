import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Package, 
  Weight,
  Users,
  AlertCircle,
  Calendar,
  MapPin,
  Activity,
  Download
} from 'lucide-react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { pickupRequestAPI, userAPI } from '../utils/api.js';

/**
 * Admin Dashboard Page
 * Overview of all system statistics and recent activity
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Fetch all requests to calculate statistics
      const response = await pickupRequestAPI.getAll();
      const allRequests = response.data || [];
      
      // Fetch total registered users count
      const userCountResponse = await userAPI.getUserCount();
      const totalUsers = userCountResponse.count || 0;
      
      // Calculate statistics
      const calculatedStats = {
        totalRequests: allRequests.length,
        pendingRequests: allRequests.filter(r => r.status === 'pending').length,
        scheduledRequests: allRequests.filter(r => r.status === 'scheduled').length,
        inProgressRequests: allRequests.filter(r => r.status === 'in-progress').length,
        completedRequests: allRequests.filter(r => r.status === 'completed').length,
        totalWeight: allRequests.reduce((sum, r) => sum + (r.estimatedWeight || 0), 0),
        uniqueUsers: totalUsers,
        
        // Calculate waste type distribution
        wasteTypeStats: calculateWasteTypeStats(allRequests),
        
        // Recent activity (last 7 days)
        recentActivity: allRequests.filter(r => {
          const requestDate = new Date(r.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return requestDate >= weekAgo;
        }).length
      };

      setStats(calculatedStats);
      
      // Get 5 most recent requests
      const recent = allRequests
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentRequests(recent);
      
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateWasteTypeStats = (requests) => {
    const wasteTypeCounts = {};
    requests.forEach(request => {
      if (request.wasteType && Array.isArray(request.wasteType)) {
        request.wasteType.forEach(type => {
          wasteTypeCounts[type] = (wasteTypeCounts[type] || 0) + 1;
        });
      }
    });

    return Object.entries(wasteTypeCounts)
      .map(([type, count]) => ({ _id: type, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'in-progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Export dashboard data to PDF
  const exportToPDF = () => {
    const reportDate = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Create HTML content for PDF
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Admin Dashboard Report</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    body {
      font-family: Arial, sans-serif;
      color: #333;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #10b981;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #10b981;
      margin: 0 0 10px 0;
      font-size: 24px;
    }
    .header p {
      color: #666;
      margin: 5px 0;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      background: #10b981;
      color: white;
      padding: 10px 15px;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    .stat-item {
      border: 1px solid #e5e7eb;
      padding: 15px;
      border-radius: 8px;
      background: #f9fafb;
    }
    .stat-label {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 5px;
    }
    .stat-value {
      color: #10b981;
      font-size: 24px;
      font-weight: bold;
    }
    .waste-type-item {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      border-bottom: 1px solid #e5e7eb;
    }
    .waste-type-name {
      font-weight: 600;
      text-transform: uppercase;
    }
    .request-item {
      border: 1px solid #e5e7eb;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 8px;
      background: #ffffff;
    }
    .request-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .request-name {
      font-weight: bold;
      font-size: 16px;
      color: #111827;
    }
    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-pending { background: #fef3c7; color: #92400e; }
    .status-scheduled { background: #dbeafe; color: #1e40af; }
    .status-in-progress { background: #e9d5ff; color: #6b21a8; }
    .status-completed { background: #d1fae5; color: #065f46; }
    .request-details {
      color: #6b7280;
      font-size: 14px;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #9ca3af;
      font-size: 12px;
      border-top: 1px solid #e5e7eb;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌱 WASTE MANAGEMENT SYSTEM</h1>
    <h2>Admin Dashboard Report</h2>
    <p>Generated: ${reportDate}</p>
  </div>

  <div class="section">
    <div class="section-title">📊 System Statistics</div>
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-label">Total Requests</div>
        <div class="stat-value">${stats?.totalRequests || 0}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Pending Requests</div>
        <div class="stat-value">${stats?.pendingRequests || 0}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Scheduled Requests</div>
        <div class="stat-value">${stats?.scheduledRequests || 0}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">In Progress</div>
        <div class="stat-value">${stats?.inProgressRequests || 0}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Completed Requests</div>
        <div class="stat-value">${stats?.completedRequests || 0}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Total Weight Collected</div>
        <div class="stat-value">${stats?.totalWeight || 0} kg</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Registered Users</div>
        <div class="stat-value">${stats?.uniqueUsers || 0}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Recent Activity (7 days)</div>
        <div class="stat-value">${stats?.recentActivity || 0}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">♻️ Waste Type Distribution</div>
`;

    // Add waste type stats
    if (stats?.wasteTypeStats && stats.wasteTypeStats.length > 0) {
      stats.wasteTypeStats.forEach(item => {
        const percentage = stats.totalRequests > 0
          ? ((item.count / stats.totalRequests) * 100).toFixed(1)
          : 0;
        htmlContent += `
    <div class="waste-type-item">
      <span class="waste-type-name">${item._id}</span>
      <span>${item.count} requests (${percentage}%)</span>
    </div>`;
      });
    } else {
      htmlContent += '<p>No waste type data available</p>';
    }

    htmlContent += `
  </div>

  <div class="section">
    <div class="section-title">📋 Recent Requests</div>
`;

    // Add recent requests
    if (recentRequests.length > 0) {
      recentRequests.forEach((request, index) => {
        const statusClass = `status-${request.status.replace('-', '')}`;
        const userName = request.user 
          ? `${request.user.firstName || ''} ${request.user.lastName || ''}`.trim() 
          : 'N/A';
        const userPhone = request.user?.phoneNumber || 'N/A';
        
        htmlContent += `
    <div class="request-item">
      <div class="request-header">
        <span class="request-name">${index + 1}. ${userName}</span>
        <span class="status-badge ${statusClass}">${request.status}</span>
      </div>
      <div class="request-details">
        <div style="background: #f0fdf4; padding: 10px; border-radius: 6px; margin-bottom: 10px; border-left: 3px solid #10b981;">
          <div style="margin-bottom: 5px;"><strong>👤 Name:</strong> ${userName}</div>
          <div style="margin-bottom: 5px;"><strong>📞 Phone:</strong> ${userPhone}</div>
          <div><strong>⚖️ Weight:</strong> ${request.estimatedWeight} kg</div>
        </div>
        <div><strong>Waste Type:</strong> ${Array.isArray(request.wasteType) ? request.wasteType.join(', ') : request.wasteType}</div>
        <div><strong>Address:</strong> ${request.address}</div>
        ${request.description ? `<div style="margin-top: 8px; padding: 8px; background: #f9fafb; border-left: 3px solid #6b7280; font-style: italic;"><strong>Description:</strong> "${request.description}"</div>` : ''}
        <div><strong>Created:</strong> ${formatDate(request.createdAt)}</div>
      </div>
    </div>`;
      });
    } else {
      htmlContent += '<p>No recent requests</p>';
    }

    htmlContent += `
  </div>

  <div class="footer">
    <p>This report is generated from the Waste Management System Admin Dashboard</p>
    <p>For more information, please contact your system administrator</p>
  </div>
</body>
</html>`;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // Close window after printing (user can cancel this)
      setTimeout(() => {
        printWindow.close();
      }, 100);
    };
  };

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

  const statisticsCards = [
    {
      title: 'Total Requests',
      value: stats?.totalRequests || 0,
      icon: <Package className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-100 dark:bg-blue-900/20',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Pending',
      value: stats?.pendingRequests || 0,
      icon: <Clock className="h-8 w-8 text-yellow-600" />,
      color: 'bg-yellow-100 dark:bg-yellow-900/20',
      subtext: 'Needs attention'
    },
    {
      title: 'Scheduled',
      value: stats?.scheduledRequests || 0,
      icon: <Calendar className="h-8 w-8 text-indigo-600" />,
      color: 'bg-indigo-100 dark:bg-indigo-900/20',
      subtext: 'Ready for pickup'
    },
    {
      title: 'In Progress',
      value: stats?.inProgressRequests || 0,
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      color: 'bg-purple-100 dark:bg-purple-900/20',
      subtext: 'Active collections'
    },
    {
      title: 'Completed',
      value: stats?.completedRequests || 0,
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      color: 'bg-green-100 dark:bg-green-900/20',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Total Weight',
      value: `${stats?.totalWeight || 0} kg`,
      icon: <Weight className="h-8 w-8 text-orange-600" />,
      color: 'bg-orange-100 dark:bg-orange-900/20',
      subtext: 'Waste collected'
    },
    {
      title: 'Registered Users',
      value: stats?.uniqueUsers || 0,
      icon: <Users className="h-8 w-8 text-pink-600" />,
      color: 'bg-pink-100 dark:bg-pink-900/20',
      subtext: 'Total users'
    },
    {
      title: 'Recent Activity',
      value: stats?.recentActivity || 0,
      icon: <Activity className="h-8 w-8 text-teal-600" />,
      color: 'bg-teal-100 dark:bg-teal-900/20',
      subtext: 'Last 7 days'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              System overview and analytics
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="success" 
              onClick={exportToPDF}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/requests')}
            >
              <Package className="h-4 w-4 mr-2" />
              All Requests
            </Button>
            <Button 
              variant="primary" 
              onClick={() => navigate('/routing')}
            >
              <MapPin className="h-4 w-4 mr-2" />
              View Routes
            </Button>
          </div>
        </div>

        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statisticsCards.map((stat, index) => (
            <Card key={index} hover className="transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </p>
                  {stat.subtext && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {stat.subtext}
                    </p>
                  )}
                  {stat.change && (
                    <p className={`text-xs font-medium mt-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} from last month
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Requests */}
          <Card title="Recent Requests" className="lg:col-span-2">
            <div className="space-y-4">
              {recentRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No requests yet</p>
                </div>
              ) : (
                recentRequests.map((request) => (
                  <div 
                    key={request._id} 
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate('/requests')}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {request.userName}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {request.wasteType.join(', ')} • {request.estimatedWeight} kg
                      </p>
                      {request.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 italic mb-1">
                          "{request.description}"
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))
              )}
              {recentRequests.length > 0 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/requests')}
                >
                  View All Requests
                </Button>
              )}
            </div>
          </Card>

          {/* Waste Type Distribution */}
          <Card title="Waste Types">
            <div className="space-y-4">
              {stats?.wasteTypeStats && stats.wasteTypeStats.length > 0 ? (
                stats.wasteTypeStats.slice(0, 4).map((item, index) => {
                  const percentage = stats.totalRequests > 0
                    ? ((item.count / stats.totalRequests) * 100).toFixed(0)
                    : 0;

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
                          {item.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getWasteTypeColor(item._id)}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No data yet</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/requests')}
              className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg hover:shadow-lg transition-all group"
            >
              <Package className="h-10 w-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Manage Requests</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View and manage all pickup requests
              </p>
            </button>

            <button
              onClick={() => navigate('/routing')}
              className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg hover:shadow-lg transition-all group"
            >
              <MapPin className="h-10 w-10 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Route Planning</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Optimize collection routes
              </p>
            </button>

            <button
              onClick={() => window.location.reload()}
              className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg hover:shadow-lg transition-all group"
            >
              <Activity className="h-10 w-10 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Refresh Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Update dashboard statistics
              </p>
            </button>
          </div>
        </Card>

        {/* System Status */}
        <div className="mt-8 flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              All systems operational
            </p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
