import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import axios from 'axios'

const AddCertificate = () => {
  const [expires, setExpires] = useState('')
  const [name, setName] = useState('')
  const [course, setCourse] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [issuer, setIssuer] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [issuersData, setIssuersData] = useState([])

  useEffect(() => {
    const getIssuersData = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/auth/getallusers')
        setIssuersData(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getIssuersData()
  }, [])


  const postDetails = async()=>{
    try {
        const res = await axios.post('http://localhost:5050/api/certificates/issue',{
            name,
            course,
            issuer,
            startDate,
            endDate,
            expiryDate
        });
        console.log(res.data)
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Card className="border-slate-200 shadow-xl backdrop-blur-sm bg-white/80">
          <CardHeader className="space-y-1 pb-6 text-center sm:text-left">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 text-center">
              Issue New Certificate
            </CardTitle>
            <CardDescription className="text-base text-slate-600 text-center">
              Enter the details below to generate and issue a professional certificate.
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">
                Recipient's Full Name
              </Label>
              <Input
                placeholder="e.g. Balaji Sudarshan Reddy"
                className="h-11"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">
                Issued By (Issuer)
              </Label>
              <Select value={issuer} onValueChange={setIssuer}>
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Select issuer / organization" />
                </SelectTrigger>
                <SelectContent>
                  {issuersData.map((issuer) => (
                    <SelectItem key={issuer._id} value={issuer.organization}>
                      {issuer.organization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">
                Course / Program Name
              </Label>
              <Input
                placeholder="Full Stack Development"
                className="h-11"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-medium">
                  <CalendarIcon className="h-4 w-4" />
                  Start Date
                </Label>
                <Input
                  type="date"
                  className="h-11"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-medium">
                  <CalendarIcon className="h-4 w-4" />
                  End Date / Completion Date
                </Label>
                <Input
                  type="date"
                  className="h-11"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">
                  Does the certificate expire?
                </Label>
                <Select value={expires} onValueChange={setExpires}>
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No, it does not expire</SelectItem>
                    <SelectItem value="yes">Yes, it expires</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-medium">
                  <CalendarIcon className="h-4 w-4" />
                  Expiry Date
                </Label>
                <Input
                  type="date"
                  className="h-11"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  disabled={expires !== 'yes'}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end pt-2 pb-6 px-6">
            <Button
              size="lg"
              className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-10"
              onClick={postDetails}
            >
              Issue Certificate
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-6">
          Certificate will be generated with professional layout
        </p>
      </div>
    </div>
  )
}

export default AddCertificate
