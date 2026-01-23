import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const AddCertificate = () => {
  const [expires, setExpires] = useState('')
  const [name, setName] = useState('')
  const [course, setCourse] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [issuer, setIssuer] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [issuersData, setIssuersData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios
      .get('http://localhost:5050/api/auth/getallusers')
      .then(res => setIssuersData(res.data))
      .catch(() => toast.error('Failed to load issuers'))
  }, [])

  const resetForm = () => {
    setExpires('')
    setName('')
    setCourse('')
    setStartDate('')
    setEndDate('')
    setIssuer('')
    setExpiryDate('')
  }

  const postDetails = async () => {
    if (!name || !course || !issuer || !startDate || !endDate) {
      toast.error('Please fill all required fields')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5050/api/certificates/issue', {
        name,
        course,
        issuer,
        startDate,
        endDate,
        expiryDate: expires === 'yes' ? expiryDate : null
      })

      toast.success('Certificate issued successfully')
      resetForm()
      console.log(res.data)
    } catch (error) {
      toast.error('Failed to issue certificate')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 py-10 px-4">
      <div className="mx-auto max-w-2xl">
        <Card className="border-slate-200 shadow-xl bg-white/80">
          <CardHeader className="pb-6 text-center">
            <CardTitle className="text-3xl font-bold text-slate-900">
              Issue New Certificate
            </CardTitle>
            <CardDescription className="text-slate-600">
              Enter the details below to generate and issue a certificate
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Recipient's Full Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Issued By (Issuer)</Label>
              <Select value={issuer} onValueChange={setIssuer}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select issuer" />
                </SelectTrigger>
                <SelectContent>
                  {issuersData.map(i => (
                    <SelectItem key={i._id} value={i.organization}>
                      {i.organization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Course / Program Name</Label>
              <Input value={course} onChange={e => setCourse(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Start Date
                </Label>
                <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  End Date
                </Label>
                <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Does the certificate expire?</Label>
                <Select value={expires} onValueChange={setExpires}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Expiry Date
                </Label>
                <Input
                  type="date"
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                  disabled={expires !== 'yes'}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end pb-6">
            <Button
              size="lg"
              onClick={postDetails}
              disabled={loading}
              className="px-10 bg-gradient-to-r from-sky-600 to-indigo-600"
            >
              {loading ? 'Issuing…' : 'Issue Certificate'}
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-6">
          Certificate will be generated with professional layout
        </p>

        <div className="flex justify-center space-x-4 mt-8">
          <Button variant="outline" onClick={() => window.location.href = '/verify'}>
            Verify Certificate
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/admin'}>
            Admin Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddCertificate
