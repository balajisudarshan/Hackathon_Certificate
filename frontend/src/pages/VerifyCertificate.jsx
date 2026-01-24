import React, { useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Award,
  User,
  BookOpen,
  Calendar,
  Building2,
  Hash
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const VerifyCertificate = () => {
  const { user } = useAuth()
  const [certificateId, setCertificateId] = useState('')
  const [certificate, setCertificate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isValid, setIsValid] = useState(false)

  const successToast = msg =>
    toast.success(msg, {
      duration: 4000,
      position: 'top-center',
      style: {
        border: '1px solid #10b981',
        padding: '16px',
        color: '#065f46',
        background: '#ecfdf5'
      }
    })

  const errorToast = msg =>
    toast.error(msg, {
      duration: 5000,
      position: 'top-center',
      style: {
        border: '1px solid #ef4444',
        padding: '16px',
        color: '#7f1d1d',
        background: '#fef2f2'
      }
    })

  const handleVerify = async e => {
    e.preventDefault()

    if (!certificateId.trim()) {
      errorToast('Please enter a certificate ID')
      return
    }

    setLoading(true)
    setCertificate(null)

    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.get(
        `${apiUrl}/certificates/verify/${certificateId.trim()}`
      )

      setCertificate(response.data.certificate)
      setIsValid(response.data.valid)

      response.data.valid
        ? successToast('Certificate is valid and verified!')
        : errorToast('Certificate is invalid or has been tampered with.')
    } catch (err) {
      errorToast(
        err.response?.data?.message ||
        'Failed to verify certificate. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <Toaster />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <ShieldCheck className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Verify Certificate
          </h1>
          <p className="text-lg text-slate-600">
            Enter the certificate ID to check authenticity
          </p>
        </div>

        <Card className="border border-slate-200 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 pb-6">
            <CardTitle className="text-2xl text-center text-slate-800">
              Certificate Verification
            </CardTitle>
            <CardDescription className="text-center text-slate-600 mt-2">
              Secure • Instant • Reliable
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8 pb-10 px-6 md:px-10">
            <form onSubmit={handleVerify} className="max-w-xl mx-auto mb-10">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="text"
                  placeholder="CERT-2026-000001"
                  value={certificateId}
                  onChange={e =>
                    setCertificateId(e.target.value.toUpperCase())
                  }
                  disabled={loading}
                  className="h-12 text-lg"
                />

                <Button
                  type="submit"
                  disabled={loading || !certificateId.trim()}
                  className="h-12 px-8 bg-indigo-600 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify'
                  )}
                </Button>
              </div>
            </form>

            {certificate && isValid && (
              <div className="space-y-8">
                <div className="flex justify-between bg-green-50 p-5 rounded-xl border border-green-200">
                  <div className="flex gap-3">
                    <Award className="h-8 w-8 text-green-600" />
                    <h2 className="text-2xl font-bold text-green-800">
                      Verified Successfully
                    </h2>
                  </div>
                  <Badge className="bg-white text-green-700 border-green-300">
                    <CheckCircle2 className="mr-1.5 h-4 w-4" />
                    VALID
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border">
                  <div className="flex gap-4">
                    <User className="text-indigo-600" />
                    <p>{certificate.name}</p>
                  </div>
                  <div className="flex gap-4">
                    <BookOpen className="text-indigo-600" />
                    <p>{certificate.course}</p>
                  </div>
                  <div className="flex gap-4">
                    <Building2 className="text-indigo-600" />
                    <p>{certificate.issuer}</p>
                  </div>
                  <div className="flex gap-4">
                    <Calendar className="text-indigo-600" />
                    <p>
                      {new Date(
                        certificate.dateOfIssue
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-4 md:col-span-2">
                    <Hash className="text-indigo-600" />
                    <p className="font-mono">{certificate.certId}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4 mt-8">
          {user && (
            <Button variant="outline" onClick={() => (window.location.href = '/')}>
              Issue Certificate
            </Button>
          )}

          {user && (
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/admin')}
            >
              Admin Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyCertificate
