// src/pages/ReportedPostsPage.tsx
import React, { useState, useEffect } from 'react';
import adminApi from '../../utils/adminApi';

// Mock users
const mockUsers= [
  {
    _id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    _id: '2',
    username: 'janedoe',
    email: 'jane@example.com',
    profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    _id: '3',
    username: 'bobsmith',
    email: 'bob@example.com',
    profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    _id: '4',
    username: 'alicejones',
    email: 'alice@example.com',
    profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    _id: '5',
    username: 'mikebrown',
    email: 'mike@example.com',
    profilePicture: 'https://randomuser.me/api/portraits/men/5.jpg'
  }
];

// Mock posts
const mockPosts = [
  {
    _id: '101',
    platform: 'twittwr',
    title: '',
    content: 'Just saw the worst product ever. Totally garbage! Don\'t waste your money on these scammers. #scam #fraud',
    author: {
      name: 'Bob Smith',
      username: 'bobsmith'
    },
    mediaUrls: [],
    postedAt: '2025-05-05T08:30:00Z'
  },
  {
    _id: '102',
    platform: 'reddit',
    title: 'This company is stealing people\'s money',
    content: 'I\'ve been investigating this company and found they\'re running a huge scam operation. They take your money and never deliver the product. Someone needs to report them to authorities!',
    author: {
      name: 'Mike Brown',
      username: 'mikebrown'
    },
    mediaUrls: [],
    postedAt: '2025-05-04T16:45:00Z'
  },
  {
    _id: '103',
    platform: 'linkedin',
    title: '',
    content: 'Just found a major security vulnerability in this application. DM me if you want to know how to exploit it before they patch it!',
    author: {
      name: 'Alice Jones',
      username: 'alicejones'
    },
    mediaUrls: [],
    postedAt: '2025-05-03T12:15:00Z'
  },
  {
    _id: '104',
    platform: 'twitter',
    title: '',
    content: '@johndoe is the worst developer I\'ve ever worked with. Totally incompetent and should be fired immediately!',
    author: {
      name: 'Jane Doe',
      username: 'janedoe'
    },
    mediaUrls: ['https://picsum.photos/id/237/200/300'],
    postedAt: '2025-05-02T09:20:00Z'
  },
  {
    _id: '105',
    platform: 'reddit',
    title: 'Leaked confidential information about upcoming product',
    content: 'I work at this company and found some confidential documents about their upcoming product launch. Here are all the details before the official announcement...',
    author: {
      name: 'John Doe',
      username: 'johndoe'
    },
    mediaUrls: ['https://picsum.photos/id/1/200/300', 'https://picsum.photos/id/2/200/300'],
    postedAt: '2025-05-01T14:50:00Z'
  }
];

// Mock reported posts
const mockReportedPosts= [
  {
    _id: '1001',
    reportedBy: mockUsers[0], // John Doe
    reportedUser: mockUsers[2], // Bob Smith
    postId: mockPosts[0], // Twitter post about worst product
    reason: 'This post contains false information about our company and is damaging our reputation',
    status: 'pending',
    createdAt: '2025-05-06T10:30:00Z',
    updatedAt: '2025-05-06T10:30:00Z'
  },
  {
    _id: '1002',
    reportedBy: mockUsers[1], // Jane Doe
    reportedUser: mockUsers[4], // Mike Brown
    postId: mockPosts[1], // Reddit post about company stealing money
    reason: 'This user is making false accusations without evidence and is harming our business',
    status: 'reviewed',
    adminNotes: 'Reviewed the post and found it does contain unverified claims. Contacting the user.',
    createdAt: '2025-05-05T16:45:00Z',
    updatedAt: '2025-05-06T09:15:00Z'
  },
  {
    _id: '1003',
    reportedBy: mockUsers[2], // Bob Smith
    reportedUser: mockUsers[3], // Alice Jones
    postId: mockPosts[2], // LinkedIn post about security vulnerability
    reason: 'This post is encouraging people to exploit a security vulnerability',
    status: 'resolved',
    adminNotes: 'Contacted the user and had them remove the post. Also notified our security team about the vulnerability.',
    createdAt: '2025-05-04T11:20:00Z',
    updatedAt: '2025-05-05T14:30:00Z'
  },
  {
    _id: '1004',
    reportedBy: mockUsers[0], // John Doe
    reportedUser: mockUsers[1], // Jane Doe
    postId: mockPosts[3], // Twitter post about John being the worst developer
    reason: 'This is a personal attack on me and contains false information about my work',
    status: 'pending',
    createdAt: '2025-05-03T15:10:00Z',
    updatedAt: '2025-05-03T15:10:00Z'
  },
  {
    _id: '1005',
    reportedBy: mockUsers[4], // Mike Brown
    reportedUser: mockUsers[0], // John Doe
    postId: mockPosts[4], // Reddit post about leaked confidential information
    reason: 'This user is sharing confidential company information that was obtained without authorization',
    status: 'dismissed',
    adminNotes: 'After investigation, we found the information was already public in a press release.',
    createdAt: '2025-05-02T13:40:00Z',
    updatedAt: '2025-05-04T10:25:00Z'
  }
];

export const getMockData = () => {
  return {
    users: mockUsers,
    posts: mockPosts,
    reportedPosts: mockReportedPosts
  };
};




const ReportedPostsPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'resolved' | 'dismissed'>('all');
  const [adminNotes, setAdminNotes] = useState<string>('');

  useEffect(() => {
    // In a real app, you would fetch from your API
    const fetchReports = async () => {
      setIsLoading(true);
      try {

        const response = await adminApi.get('/socialAuth/reports')
        console.log(response, 'response report')
        setTimeout(() => {
          setReports(mockReportedPosts);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleSelectReport = (report: any) => {
    setSelectedReport(report);
    setAdminNotes(report.adminNotes || '');
  };

  const handleUpdateStatus = (status: any['status']) => {
    if (!selectedReport) return;

    // In a real app, you would make an API call here
    const updatedReport = {
      ...selectedReport,
      status,
      adminNotes,
      updatedAt: new Date().toISOString()
    };

    setReports(reports.map(report => 
      report._id === updatedReport._id ? updatedReport : report
    ));
    
    setSelectedReport(updatedReport);
  };

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(report => report.status === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-gray-900">Reported Posts Admin</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left panel - Reports list */}
            <div className="md:w-1/3">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Reports</h3>
                    <div className="relative">
                      <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                      >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="resolved">Resolved</option>
                        <option value="dismissed">Dismissed</option>
                      </select>
                    </div>
                  </div>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {filteredReports.length} reports
                  </p>
                </div>
                <ul className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <li
                        key={report._id}
                        className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${
                          selectedReport?._id === report._id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleSelectReport(report)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              Report by {report.reportedBy.username}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              Against {report.reportedUser.username}
                            </p>
                          </div>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              report.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : report.status === 'reviewed'
                                ? 'bg-blue-100 text-blue-800'
                                : report.status === 'resolved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {report.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 truncate">
                          {formatDate(report.createdAt)}
                        </p>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-6 text-center text-sm text-gray-500">
                      No reports found
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Right panel - Report details */}
            <div className="md:w-2/3">
              <div className="bg-white shadow rounded-lg">
                {selectedReport ? (
                  <div className="p-6">
                    <div className="flex justify-between border-b pb-4">
                      <h2 className="text-xl font-semibold text-gray-900">Report Details</h2>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          selectedReport.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : selectedReport.status === 'reviewed'
                            ? 'bg-blue-100 text-blue-800'
                            : selectedReport.status === 'resolved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {selectedReport.status}
                      </span>
                    </div>

                    <div className="py-4 border-b">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Reported By</h3>
                          <div className="mt-1 flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {selectedReport.reportedBy.profilePicture ? (
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={selectedReport.reportedBy.profilePicture}
                                  alt=""
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-500">
                                    {selectedReport.reportedBy.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {selectedReport.reportedBy.username}
                              </p>
                              <p className="text-sm text-gray-500">
                                {selectedReport.reportedBy.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Reported User</h3>
                          <div className="mt-1 flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {selectedReport.reportedUser.profilePicture ? (
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={selectedReport.reportedUser.profilePicture}
                                  alt=""
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-500">
                                    {selectedReport.reportedUser.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {selectedReport.reportedUser.username}
                              </p>
                              <p className="text-sm text-gray-500">
                                {selectedReport.reportedUser.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="py-4 border-b">
                      <h3 className="text-sm font-medium text-gray-500">Report Reason</h3>
                      <p className="mt-1 text-sm text-gray-900">{selectedReport.reason}</p>
                    </div>

                    <div className="py-4 border-b">
                      <h3 className="text-sm font-medium text-gray-500">Reported Post</h3>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-500">
                                  {selectedReport.postId.author.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {selectedReport.postId.author.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(selectedReport.postId.postedAt)}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              selectedReport.postId.platform === 'twitter'
                                ? 'bg-blue-100 text-blue-800'
                                : selectedReport.postId.platform === 'reddit'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-indigo-100 text-indigo-800'
                            }`}
                          >
                            {selectedReport.postId.platform}
                          </span>
                        </div>
                        {selectedReport.postId.title && (
                          <p className="mt-2 text-sm font-medium text-gray-900">
                            {selectedReport.postId.title}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                          {selectedReport.postId.content}
                        </p>
                        {selectedReport.postId.mediaUrls && selectedReport.postId.mediaUrls.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selectedReport.postId.mediaUrls.map((url:any, index:number) => (
                              <div key={index} className="h-24 w-24 rounded-md overflow-hidden">
                                <img
                                  src={url}
                                  alt="Post media"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="py-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Admin Notes</h3>
                      <textarea
                        rows={4}
                        className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                        placeholder="Add notes about this report..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="mt-4 flex space-x-3">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => handleUpdateStatus('reviewed')}
                      >
                        Mark as Reviewed
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        onClick={() => handleUpdateStatus('resolved')}
                      >
                        Resolve
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        onClick={() => handleUpdateStatus('dismissed')}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">Select a report to view details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportedPostsPage;