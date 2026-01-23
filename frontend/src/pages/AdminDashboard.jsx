import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalCertificates: 1250,
    activeCertificates: 1180,
    expiredCertificates: 45,
    pendingVerifications: 25,
    totalUsers: 320,
    newUsersThisMonth: 45
  };

  const recentCertificates = [
    { id: 'CERT-001', name: 'John Doe', course: 'React Development', status: 'Active', issuedDate: '2024-01-15' },
    { id: 'CERT-002', name: 'Jane Smith', course: 'Node.js Backend', status: 'Active', issuedDate: '2024-01-14' },
    { id: 'CERT-003', name: 'Bob Johnson', course: 'Python Data Science', status: 'Expired', issuedDate: '2023-12-01' },
    { id: 'CERT-004', name: 'Alice Brown', course: 'UI/UX Design', status: 'Active', issuedDate: '2024-01-13' },
    { id: 'CERT-005', name: 'Charlie Wilson', course: 'DevOps', status: 'Pending', issuedDate: '2024-01-12' }
  ];

  const pendingVerifications = [
    { id: 'CERT-006', name: 'David Lee', course: 'Machine Learning', submittedDate: '2024-01-20' },
    { id: 'CERT-007', name: 'Eva Garcia', course: 'Cloud Computing', submittedDate: '2024-01-19' },
    { id: 'CERT-008', name: 'Frank Miller', course: 'Cybersecurity', submittedDate: '2024-01-18' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeTab === 'overview' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </Button>
                <Button
                  variant={activeTab === 'certificates' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('certificates')}
                >
                  Certificates
                </Button>
                <Button
                  variant={activeTab === 'users' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('users')}
                >
                  Users
                </Button>
                <Button
                  variant={activeTab === 'verifications' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('verifications')}
                >
                  Verifications
                </Button>
                <Button
                  variant={activeTab === 'settings' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('settings')}
                >
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalCertificates}</div>
                      <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Certificates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.activeCertificates}</div>
                      <p className="text-xs text-muted-foreground">+8% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Expired Certificates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.expiredCertificates}</div>
                      <p className="text-xs text-muted-foreground">-2% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
                      <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalUsers}</div>
                      <p className="text-xs text-muted-foreground">+15% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">New Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.newUsersThisMonth}</div>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Certificates</CardTitle>
                    <CardDescription>Latest certificate issuances and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentCertificates.map((cert) => (
                        <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{cert.name}</p>
                            <p className="text-sm text-gray-600">{cert.course}</p>
                            <p className="text-xs text-gray-500">ID: {cert.id} • Issued: {cert.issuedDate}</p>
                          </div>
                          <Badge variant={cert.status === 'Active' ? 'default' : cert.status === 'Expired' ? 'destructive' : 'secondary'}>
                            {cert.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'certificates' && (
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Management</CardTitle>
                  <CardDescription>Search, filter, and manage certificates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="search">Search Certificates</Label>
                      <Input id="search" placeholder="Search by name, course, or ID..." />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {recentCertificates.map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm text-gray-600">{cert.course}</p>
                          <p className="text-xs text-gray-500">ID: {cert.id} • Issued: {cert.issuedDate}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant={cert.status === 'Active' ? 'default' : cert.status === 'Expired' ? 'destructive' : 'secondary'}>
                            {cert.status}
                          </Badge>
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'verifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Verifications</CardTitle>
                  <CardDescription>Review and approve certificate submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingVerifications.map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm text-gray-600">{cert.course}</p>
                          <p className="text-xs text-gray-500">ID: {cert.id} • Submitted: {cert.submittedDate}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Review</Button>
                          <Button size="sm">Approve</Button>
                          <Button variant="destructive" size="sm">Reject</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'users' && (
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">User management interface would go here.</p>
                </CardContent>
              </Card>
            )}

            {activeTab === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure system preferences and defaults</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Settings interface would go here.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;