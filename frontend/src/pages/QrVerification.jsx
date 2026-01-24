import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useParams } from 'react-router'
import {
  Award,
  CheckCircle2,
  ShieldCheck,
  User,
  BookOpen,
  Calendar,
  Building2,
  Hash
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

const QrVerification = () => {
  const { user } = useAuth()
  const { certId } = useParams()
  const [certificate, setCertificate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    if (!certId) return
    setLoading(true)
    axios
      .get(`http://localhost:5050/api/certificates/verify/${certId}`)
      .then(res => {
        setCertificate(res.data.certificate)
        setIsValid(res.data.valid)
        res.data.valid
          ? toast.success('Certificate verified successfully')
          : toast.error('Certificate is invalid')
      })
      .catch(() => {
        toast.error('Invalid certificate')
        setCertificate(null)
      })
      .finally(() => setLoading(false))
  }, [certId])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="border border-slate-200 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 pb-6">
            <CardTitle className="text-2xl text-center text-slate-800">
              Certificate Verification
            </CardTitle>
            <CardDescription className="text-center text-slate-600 mt-2">
              QR Verification Result
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8 pb-10 px-6 md:px-10">
            {loading && (
              <div className="text-center py-12 text-slate-500">
                Verifying certificate…
              </div>
            )}

            {certificate && !isValid && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-red-50 p-5 rounded-xl border border-red-200">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-8 w-8 text-red-600" />
                    <h2 className="text-2xl font-bold text-red-800">
                      Verification Failed
                    </h2>
                  </div>
                  <Badge className="text-base px-5 py-2 bg-white text-red-700 border-red-300">
                    <CheckCircle2 className="mr-1.5 h-4 w-4" />
                    INVALID CERTIFICATE
                  </Badge>
                </div>

                <div className="text-center">
                  <Button variant="outline" onClick={() => window.history.back()}>
                    Go Back
                  </Button>
                </div>
              </div>
            )}

            {certificate && isValid && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-green-50 p-5 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 text-green-600" />
                    <h2 className="text-2xl font-bold text-green-800">
                      Verified Successfully
                    </h2>
                  </div>
                  <Badge className="text-base px-5 py-2 bg-white text-green-700 border-green-300">
                    <CheckCircle2 className="mr-1.5 h-4 w-4" />
                    VALID CERTIFICATE
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-start gap-4">
                    <User className="h-6 w-6 text-indigo-600 mt-1" />
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Recipient</p>
                      <p className="font-semibold text-slate-900">{certificate.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <BookOpen className="h-6 w-6 text-indigo-600 mt-1" />
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Course</p>
                      <p className="font-semibold text-slate-900">{certificate.course}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Building2 className="h-6 w-6 text-indigo-600 mt-1" />
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Issuer</p>
                      <p className="font-semibold text-slate-900">{certificate.issuer}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Calendar className="h-6 w-6 text-indigo-600 mt-1" />
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Issue Date</p>
                      <p className="font-semibold text-slate-900">
                        {new Date(certificate.dateOfIssue).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 md:col-span-2">
                    <Hash className="h-6 w-6 text-indigo-600 mt-1" />
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Certificate ID</p>
                      <p className="font-mono font-semibold text-slate-900">
                        {certificate.certId}
                      </p>
                    </div>
                  </div>
                </div>

               
              </div>
            )}

            {!loading && !certificate && (
              <div className="text-center py-12 text-slate-500">
                <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-40" />
                Certificate not found
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4 mt-8">
          {user && (
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Issue Certificate
            </Button>
          )}

          <Button variant="outline" onClick={() => window.location.href = '/verify'}>
            Manual Verification
          </Button>

          {user && (
            <Button variant="outline" onClick={() => window.location.href = '/admin'}>
              Admin Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default QrVerification
