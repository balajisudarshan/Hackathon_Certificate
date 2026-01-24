import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select'
import Navbar from '../components/Navbar'
import { Link } from 'react-router'
import axios from 'axios'
import CertificateDisplayCard from '@/components/ui/CertificateDisplayCard'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview')

    const [allCertificates, setAllCertificates] = useState([])
    const [filteredCertificates, setFilteredCertificates] = useState([])
    const [users, setUsers] = useState([])

    const [keyword, setKeyword] = useState('')
    const [status, setStatus] = useState('all')

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [organization, setOrganization] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const certRes = await axios.get(
                    'http://localhost:5050/api/certificates/getAll',
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                )

                setAllCertificates(certRes.data)
                setFilteredCertificates(certRes.data)

                const userRes = await axios.get(
                    'http://localhost:5050/api/auth/getallusers'
                )
                setUsers(userRes.data)
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        let result = allCertificates

        if (keyword.trim()) {
            const q = keyword.toLowerCase()
            result = result.filter(
                (c) =>
                    c.name.toLowerCase().includes(q) ||
                    c.course.toLowerCase().includes(q) ||
                    c.certId.toLowerCase().includes(q)
            )
        }

        if (status !== 'all') {
            result = result.filter((c) => c.status === status)
        }

        setFilteredCertificates(result)
    }, [keyword, status, allCertificates])

    const handleAddUser = async () => {
        setLoading(true)
        try {
            await axios.post(
                'http://localhost:5050/api/auth/register',
                { name, email, organization, password },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            )

            setName('')
            setEmail('')
            setOrganization('')
            setPassword('')
            toast.success('User added successfully')
        } catch {
            toast.error('Failed to add user')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Navigation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button className="w-full" onClick={() => setActiveTab('overview')}>
                            Overview
                        </Button>
                        <Button className="w-full" onClick={() => setActiveTab('certificates')}>
                            Certificates
                        </Button>
                        <Button className="w-full" onClick={() => setActiveTab('users')}>
                            Users
                        </Button>
                    </CardContent>
                </Card>

                <div className="lg:col-span-3 space-y-6">
                    {activeTab === 'overview' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Total Certificates</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-2xl font-bold">
                                        {allCertificates.length}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Total Users</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-2xl font-bold">
                                        {users.length}
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Certificates</CardTitle>
                                    <CardDescription>
                                        Latest issued certificates
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {allCertificates.slice(0, 5).map((cert) => (
                                        <CertificateDisplayCard key={cert._id} cert={cert} />
                                    ))}
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {activeTab === 'certificates' && (
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Certificate Management</CardTitle>
                                    <Button>
                                        <Link to="/issue-certificate">Issue New</Link>
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <Label>Search</Label>
                                        <Input
                                            placeholder="Name, Course, or ID"
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label>Status</Label>
                                        <Select value={status} onValueChange={setStatus}>
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="All" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="expired">Expired</SelectItem>
                                                <SelectItem value="revoked">Revoked</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {filteredCertificates.map((cert) => (
                                        <CertificateDisplayCard
                                            key={cert._id}
                                            cert={cert}
                                            onDelete={(id) =>
                                                setAllCertificates((prev) =>
                                                    prev.filter((c) => c.certId !== id)
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'users' && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Add User</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                                    <Input placeholder="Organization" value={organization} onChange={(e) => setOrganization(e.target.value)} />
                                    <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <Button disabled={loading} onClick={handleAddUser}>
                                        Add User
                                    </Button>
                                </CardContent>
                            </Card>
                            <table className="w-full table-auto border-collapse"> <thead className="bg-slate-100"> <tr> <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide border-b"> Name </th> <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide border-b"> Email </th> <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide border-b"> Organization </th> </tr> </thead> <tbody className="divide-y divide-slate-200"> {users.map(user => (<tr key={user._id} className="hover:bg-slate-50 transition-colors" > <td className="px-6 py-4 text-slate-900 font-medium"> {user.name} </td> <td className="px-6 py-4 text-slate-600"> {user.email} </td> <td className="px-6 py-4 text-slate-700"> {user.organization} </td> </tr>))} </tbody> </table>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
