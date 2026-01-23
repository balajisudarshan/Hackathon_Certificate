import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { usePDF } from 'react-to-pdf';
const ViewCertificate = () => {
  const { certId } = useParams();
  const apiUrl = "http://localhost:5173/verify/";
  const {toPdf,targetRef} = usePDF({filename:`certificate_${certId}.pdf`});
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  useEffect(() => {
    if (!certId) {
      setError("No certificate ID provided in the URL");
      setLoading(false);
      return;
    }

    const fetchCertificate = async () => {
      console.log(apiUrl)
      try {
        const res = await axios.get(`http://localhost:5050/api/certificates/verify/${certId}`);
        setCertificate(res.data.certificate);
        setIsValid(!!res.data.valid);
        setQrCodeData(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${apiUrl}${certId}`);

        console.log("Certificate data:", res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load certificate. It may not exist or the server is unreachable.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600 animate-pulse flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-t-indigo-600 border-gray-300 rounded-full animate-spin"></div>
          Loading certificate...
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-4">
        <div className="text-center p-10 bg-white/80 rounded-2xl shadow-xl max-w-md w-full border border-slate-200">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-slate-700 text-lg">{error || "Certificate not found"}</p>
        </div>
      </div>
    );
  }

  const {
    certId: id,
    name = "—",
    course = "—",
    issuer = "—",
    dateOfIssue,
    status = "unknown",
  } = certificate;

  const issueDate = dateOfIssue
    ? new Date(dateOfIssue).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : "—";

  const showWatermark = !isValid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-5xl mx-auto">
        <div ref={targetRef}
          className={`
            relative bg-white shadow-2xl rounded-2xl overflow-hidden border-8 border-double
            ${isValid ? 'border-amber-700' : 'border-red-700 opacity-85'}
          `}
        >

          <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#fbbf24_0%,transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#c084fc_0%,transparent_60%)]" />
          </div>

          <div className="relative px-6 py-12 md:px-16 md:py-20 text-center">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-extrabold text-amber-900 tracking-wider mb-6 md:mb-10">
              CERTIFICATE
            </h1>

            <p className="text-2xl sm:text-3xl text-gray-700 mb-8 md:mb-12">of Course Completion</p>

            <div className="my-10 md:my-16">
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 mb-6">This is to certify that</p>
              <h2 className="text-5xl sm:text-6xl md:text-8xl font-serif font-bold text-indigo-950 py-4 px-6 md:px-12 inline-block border-b-4 border-amber-600">
                {certificate.name}
              </h2>
            </div>

            <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 mb-6 md:mb-10">
              has successfully completed
            </p>

            <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif text-amber-800 mb-12 md:mb-20">
              {course}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 text-base md:text-xl mb-12 md:mb-16">
              <div>
                <p className="text-gray-600 uppercase tracking-wider text-sm md:text-base mb-1">Issued By</p>
                <p className="font-semibold">{issuer}</p>
              </div>
              <div>
                <p className="text-gray-600 uppercase tracking-wider text-sm md:text-base mb-1">Issued On</p>
                <p className="font-semibold">{issueDate}</p>
              </div>
              <div>
                <p className="text-gray-600 uppercase tracking-wider text-sm md:text-base mb-1">Cert. ID</p>
                <p className="font-mono font-semibold">{id}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center sm:items-end gap-12 sm:gap-0 mt-16 px-4 md:px-16">
              <div className="text-center">
                <div className="w-48 md:w-64 h-0.5 bg-gray-800 mx-auto mb-3 md:mb-4"></div>
                <p className="font-medium text-base md:text-lg">{issuer}</p>
                <p className="text-xs md:text-sm text-gray-600">Authorized Signatory</p>
              </div>

              <div className="text-center">
                <div className="w-48 md:w-64 h-0.5 bg-gray-800 mx-auto mb-3 md:mb-4"></div>
                <p className="font-medium text-base md:text-lg">Quantum Coders</p>
                <p className="text-xs md:text-sm text-gray-600">Official Seal</p>
              </div>
              {qrCodeData && (
                <div className="text-center">
                  <img src={qrCodeData} alt="QR Code" className="mx-auto w-32 h-32" />
                </div>
              )}
            </div>
          </div>


          {showWatermark && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20">
              <div
                className="
                  text-red-700/25 font-black uppercase tracking-[0.6em]
                  text-[min(15vw,180px)] sm:text-[min(15vw,210px)] md:text-[min(10vw,120px)]
                  transform rotate-[-40deg] leading-none drop-shadow-2xl text-center
                "
                style={{ textShadow: '6px 6px 30px rgba(0,0,0,0.25)' }}
              >
                NOT VALID
              </div>
            </div>
          )}
        </div>


        <div className="mt-8 text-center">
          {isValid ? (
            <p className="text-green-700 font-medium text-lg md:text-xl">
              ✓ This certificate is currently valid
            </p>
          ) : (
            <p className="text-red-700 font-bold text-xl md:text-2xl">
              ✗ This certificate is NOT VALID
            </p>
          )}

          <div className="flex justify-center space-x-4 mt-8">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Issue New Certificate
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/verify'}>
              Verify Another Certificate
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/admin'}>
              Admin Dashboard
            </Button>
            <Button>Download PDF</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCertificate;