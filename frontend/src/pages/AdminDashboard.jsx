import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Navbar from '../components/Navbar';
import { Link } from 'react-router';
import axios from 'axios';
import CertificateDisplayCard from '@/components/ui/CertificateDisplayCard';
import toast from 'react-hot-toast';
import Modal from '../Modal'
// import { s } from 'react-router/dist/development/index-react-server-client-gGyf-7Xp';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [recentCertificates, setRecentCertificates] = useState([]);
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [organization, setOrganization] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    useEffect(() => {
        const getAllCertificates = async () => {
            try {
                const res = await axios.get("http://localhost:5050/api/certificates/getAll", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                console.log(res.data)
                setRecentCertificates(res.data);
            } catch (error) {
                console.log(error)
            }

        }
        const getAllUsers = async () => {
            try {
                const res = await axios.get("http://localhost:5050/api/auth/getallusers")
                console.log(res.data)
                setUsers(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        getAllCertificates()
        getAllUsers()
    }, [])


    const handleAddUser = async () => {
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5050/api/auth/register", { name, email, organization, password }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            console.log(res.data);
            setName("");
            setEmail("");
            setOrganization("");
            setPassword("");
            toast.success("User added successfully");
        } catch (error) {
            console.log(error);
            setErrors(error.response?.data.errors || []);
            toast.error(error.response?.data.errors?.[0] || "Failed to add user");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <Card className="border-slate-200 shadow-xl bg-white/80">
                            <CardHeader>
                                <CardTitle className="text-slate-900">Navigation</CardTitle>
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


                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-3">
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <Card className="border-slate-200 shadow-xl bg-white/80">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium text-slate-900">Total Certificates</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-slate-900">{recentCertificates.length}</div>
                                        </CardContent>
                                    </Card>



                                    <Card className="border-slate-200 shadow-xl bg-white/80">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium text-slate-900">Total Users</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-slate-900">{users.length}</div>
                                            {/* <p className="text-xs text-slate-600">+15% from last month</p> */}
                                        </CardContent>
                                    </Card>

                                </div>

                                <Card className="border-slate-200 shadow-xl bg-white/80">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900">Recent Certificates</CardTitle>
                                        <CardDescription className="text-slate-600">Latest certificate issuances and updates</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {recentCertificates.map((cert) => (
                                                <CertificateDisplayCard key={cert._id} cert={cert} />
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'certificates' && (
                            <Card className="border-slate-200 shadow-xl bg-white/80">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-slate-900">Certificate Management</CardTitle>
                                        <Button className="bg-gradient-to-r from-sky-600 to-indigo-600"><Link to='/issue-certificate'>Issue New Certificate</Link></Button>
                                    </div>
                                    <CardDescription className="text-slate-600">Search, filter, and manage certificates</CardDescription>
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
                                            <CertificateDisplayCard key={cert._id} cert={cert} />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}



                        {activeTab === 'users' && (
                            <>
                                <Card className="border-slate-200 shadow-xl bg-white/80">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900">User Management</CardTitle>
                                        <CardDescription className="text-slate-600">Manage user accounts and permissions</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Add User</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className='flex flex-col gap-5'>
                                                    <div className='flex flex-col gap-2'>
                                                        <Label htmlFor="user-email">Email</Label>
                                                        <Input id="user-email" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                                    </div>
                                                    <div className='flex flex-col gap-2'>
                                                        <Label htmlFor="user-name">Name</Label>
                                                        <Input id="user-name" type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
                                                    </div>
                                                    <div className='flex flex-col gap-2'>
                                                        <Label htmlFor="user-org">Organization Name</Label>
                                                        <Input id="user-org" type="text" placeholder="Enter organization name" value={organization} onChange={(e) => setOrganization(e.target.value)} />
                                                    </div>
                                                    <div className='flex flex-col gap-2'>
                                                        <Label htmlFor="user-pass">Password</Label>
                                                        <Input id="user-pass" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                                    </div>
                                                    <div className='w-full'>
                                                        <Button variant="outline" className="mt-4 w-full bg-blue-500" onClick={handleAddUser}>Add User</Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </CardContent>

                                </Card>
                                <div className="overflow-x-auto mt-6 rounded-xl border border-slate-200 shadow-sm bg-white">
                                    <table className="w-full table-auto border-collapse">
                                        <thead className="bg-slate-100">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide border-b">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide border-b">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide border-b">
                                                    Organization
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-200">
                                            {users.map(user => (
                                                <tr
                                                    key={user._id}
                                                    className="hover:bg-slate-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 text-slate-900 font-medium">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-700">
                                                        {user.organization}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {activeTab === 'settings' && (
                            <Card className="border-slate-200 shadow-xl bg-white/80">
                                <CardHeader>
                                    <CardTitle className="text-slate-900">System Settings</CardTitle>
                                    <CardDescription className="text-slate-600">Configure system preferences and defaults</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600">Settings interface would go here.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                <div className="flex justify-center space-x-4 mt-8">
                    <Button variant="outline" onClick={() => window.location.href = '/issue-certificate'}>
                        Issue Certificate
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = '/verify'}>
                        Verify Certificate
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;