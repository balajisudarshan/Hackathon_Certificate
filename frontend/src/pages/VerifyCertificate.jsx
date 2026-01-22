import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isValid,setIsValid] = useState(false);
  const successToast = (msg) => toast.success(msg, {
    duration: 4000,
    position: 'top-center',
    style: {
      border: '1px solid #10b981',
      padding: '16px',
      color: '#065f46',
      background: '#ecfdf5',
    },
    iconTheme: {
      primary: '#10b981',
      secondary: '#ffffff',
    },
  });

  const errorToast = (msg) => toast.error(msg, {
    duration: 5000,
    position: 'top-center',
    style: {
      border: '1px solid #ef4444',
      padding: '16px',
      color: '#7f1d1d',
      background: '#fef2f2',
    },
  });

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!certificateId.trim()) {
      errorToast('Please enter a certificate ID');
      return;
    }

    setLoading(true);
    setCertificate(null);

    try {
      const response = await axios.get(
        `http://localhost:5050/api/certificates/verify/${certificateId.trim()}`
      );
      
      setCertificate(response.data.certificate);
      setIsValid(response.data.valid);
      console.log(response.data);
      if(response.data.valid){
        successToast('Certificate is valid and verified!');
      }else{
        errorToast('Certificate is invalid or has been tampered with.');
      }
      // successToast('Certificate verified successfully!');
    } catch (err) {
      console.error(err);
      
      const message = 
        err.response?.data?.message || 
        'Failed to verify certificate. Please check the ID and try again.';
      
      errorToast(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <Toaster />
      
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <ShieldCheck className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Verify Certificate
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Enter the certificate ID to instantly check authenticity and view details.
          </p>
        </div>

        {/* Main Card */}
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
            {/* Form */}
            <form onSubmit={handleVerify} className="max-w-xl mx-auto mb-10">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="CERT-2026-000001"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
                    className="h-12 text-lg placeholder:text-slate-400 border-slate-300 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 shadow-sm"
                    disabled={loading}
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={loading || !certificateId.trim()}
                  className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium min-w-[140px]"
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

            {/* Result */}
            {certificate && isValid&&  (
              <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-green-50 p-5 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 text-green-600" />
                    <h2 className="text-2xl font-bold text-green-800">
                      Verified Successfully
                    </h2>
                  </div>
                  <Badge 
                    className="text-base px-5 py-2 bg-white text-green-700 border-green-300 hover:bg-white"
                  >
                    <CheckCircle2 className="mr-1.5 h-4 w-4" />
                    VALID CERTIFICATE
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-start gap-4">
                    <User className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Recipient</p>
                      <p className="font-semibold text-slate-900 break-words">
                        {certificate.name || '—'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <BookOpen className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Course</p>
                      <p className="font-semibold text-slate-900 break-words">
                        {certificate.course || '—'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Building2 className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Issuer</p>
                      <p className="font-semibold text-slate-900 break-words">
                        {certificate.issuer || '—'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Calendar className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Issue Date</p>
                      <p className="font-semibold text-slate-900">
                        {new Date(certificate.dateOfIssue).toLocaleDateString() || '—'}
                      </p>
                    </div>
                  </div>

                  {certificate.expiryDate && (
                    <div className="flex items-start gap-4">
                      <Calendar className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-slate-500 font-medium">Expiry Date</p>
                        <p className="font-semibold text-slate-900">
                          {certificate.expiryDate}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4 md:col-span-2">
                    <Hash className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Certificate ID</p>
                      <p className="font-mono font-semibold text-slate-900 tracking-wide">
                        {certificate.certId}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCertificate(null);
                      setCertificateId('');
                    }}
                    className="mt-4"
                  >
                    Verify Another Certificate
                  </Button>
                </div>
              </div>
            )}

            {!certificate && (
              <div className="text-center py-12 text-slate-500">
                <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-40" />
                <p className="text-lg">
                  Enter a certificate ID to begin verification
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-8">
          © 2026 • Certificate Verification System
        </p>
      </div>
    </div>
  );
};

export default VerifyCertificate;