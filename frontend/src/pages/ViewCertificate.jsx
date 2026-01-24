import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image'
import signature from '@/assets/signature.jpg'
const ViewCertificate = () => {
  const { certId } = useParams();
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
  const apiUrl = `${frontendUrl}/qr/verify/${certId}`;
  // const { toPdf, targetRef } = usePDF({ filename: `certificate_${certId}.pdf` });
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);
  // const [status, setStatus] = useState('');
  const [expired, setExpired] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const targetRef = useRef(null)

  useEffect(() => {
    if (!certId) {
      setError("No certificate ID provided in the URL");
      setLoading(false);
      return;
    }



    const fetchCertificate = async () => {
      console.log(apiUrl)
      const apiBaseUrl = import.meta.env.VITE_API_URL;
      try {
        const res = await axios.get(`${apiBaseUrl}/certificates/verify/${certId}`);
        setCertificate(res.data.certificate);
        setIsValid(!!res.data.valid);
        setExpired(res.data.certificate.expired)
        const qrApi = import.meta.env.VITE_QR_API;
        setQrCodeData(`${qrApi}/?size=150x150&data=${apiUrl}`);

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

  const downloadPdf = async () => {
    if (!certificate) return

    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4')
      const w = pdf.internal.pageSize.getWidth()
      const h = pdf.internal.pageSize.getHeight()

      // ===== BACKGROUND =====
      // Elegant cream background
      pdf.setFillColor(254, 252, 248)
      pdf.rect(0, 0, w, h, 'F')

      // Subtle gradient-like corners (light golden tint)
      pdf.setFillColor(255, 250, 240)
      pdf.rect(0, 0, w, 15, 'F')
      pdf.rect(0, h - 15, w, 15, 'F')

      // ===== OUTER DECORATIVE BORDER =====
      // Main gold border (thick)
      pdf.setDrawColor(184, 134, 11)
      pdf.setLineWidth(4)
      pdf.rect(8, 8, w - 16, h - 16)

      // Inner accent border
      pdf.setDrawColor(218, 165, 32)
      pdf.setLineWidth(1.5)
      pdf.rect(12, 12, w - 24, h - 24)

      // Fine inner line
      pdf.setDrawColor(184, 134, 11)
      pdf.setLineWidth(0.5)
      pdf.rect(14, 14, w - 28, h - 28)

      // ===== DECORATIVE CORNER ELEMENTS =====
      const cornerSize = 8
      const margin = 15

      // Top-left corner
      pdf.setFillColor(184, 134, 11)
      pdf.circle(margin, margin, cornerSize * 0.4, 'F')

      // Top-right corner
      pdf.circle(w - margin, margin, cornerSize * 0.4, 'F')

      // Bottom-left corner
      pdf.circle(margin, h - margin, cornerSize * 0.4, 'F')

      // Bottom-right corner
      pdf.circle(w - margin, h - margin, cornerSize * 0.4, 'F')

      // ===== HEADER ORNAMENT =====
      // Decorative line above title
      pdf.setDrawColor(218, 165, 32)
      pdf.setLineWidth(0.5)
      pdf.line(w / 2 - 40, 28, w / 2 + 40, 28)

      // ===== MAIN TITLE =====
      pdf.setFont('courier', 'bold')
      pdf.setFontSize(52)
      pdf.setTextColor(184, 134, 11)
      pdf.text('CERTIFICATE', w / 2, 42, { align: 'center' })

      // Decorative line below title
      pdf.setDrawColor(218, 165, 32)
      pdf.setLineWidth(0.5)
      pdf.line(w / 2 - 40, 50, w / 2 + 40, 50)

      // ===== SUBTITLE =====
      pdf.setFont('times', 'italic')
      pdf.setFontSize(24)
      pdf.setTextColor(139, 69, 19)
      pdf.text('of Completion', w / 2, 62, { align: 'center' })

      // ===== INTRODUCTION TEXT =====
      pdf.setFont('times', 'normal')
      pdf.setFontSize(14)
      pdf.setTextColor(80, 80, 80)
      pdf.text('This is to certify that', w / 2, 78, { align: 'center' })

      // ===== CERTIFICATE HOLDER NAME - HIGHLIGHTED =====
      pdf.setFont('courier', 'bold')
      pdf.setFontSize(38)
      pdf.setTextColor(25, 25, 112)

      // Light background box for name
      const nameWidth = pdf.getStringUnitWidth(certificate.name.toUpperCase()) * 38 / pdf.internal.getFontSize()
      pdf.setFillColor(240, 248, 255)
      pdf.rect((w - nameWidth) / 2 - 8, 88, nameWidth + 16, 14, 'F')

      // Name text
      pdf.text(certificate.name.toUpperCase(), w / 2, 99, { align: 'center' })

      // ===== COMPLETION TEXT =====
      pdf.setFont('times', 'normal')
      pdf.setFontSize(14)
      pdf.setTextColor(80, 80, 80)
      pdf.text('has successfully completed the course', w / 2, 115, { align: 'center' })

      // ===== COURSE NAME - EMPHASIZED =====
      pdf.setFont('courier', 'bold')
      pdf.setFontSize(26)
      pdf.setTextColor(139, 69, 19)
      pdf.text(course.toUpperCase(), w / 2, 135, { align: 'center' })

      // ===== HORIZONTAL DIVIDER =====
      pdf.setDrawColor(218, 165, 32)
      pdf.setLineWidth(1)
      pdf.line(30, 143, w - 30, 143)

      // ===== DETAILS SECTION =====
      pdf.setFont('times', 'normal')
      pdf.setFontSize(11)
      pdf.setTextColor(100, 100, 100)

      const detailsY = 158
      const spacing = (w - 60) / 3

      // Issued By
      pdf.setFont('times', 'bold')
      pdf.setFontSize(9)
      pdf.setTextColor(139, 69, 19)
      pdf.text('ISSUED BY', 30, detailsY)

      pdf.setFont('times', 'normal')
      pdf.setFontSize(11)
      pdf.setTextColor(60, 60, 60)
      pdf.text(issuer, 30, detailsY + 8)

      // Date
      pdf.setFont('times', 'bold')
      pdf.setFontSize(9)
      pdf.setTextColor(139, 69, 19)
      pdf.text('DATE ISSUED', 30 + spacing, detailsY)

      pdf.setFont('times', 'normal')
      pdf.setFontSize(11)
      pdf.setTextColor(60, 60, 60)
      pdf.text(issueDate, 30 + spacing, detailsY + 8)

      // Certificate ID
      pdf.setFont('times', 'bold')
      pdf.setFontSize(9)
      pdf.setTextColor(139, 69, 19)
      pdf.text('CERTIFICATE ID', 30 + spacing * 2, detailsY)

      pdf.setFont('times', 'normal')
      pdf.setFontSize(10)
      pdf.setTextColor(60, 60, 60)
      pdf.text(id, 30 + spacing * 2, detailsY + 8)

      // ===== BOTTOM SIGNATURE & QR SECTION =====
      const bottomY = h - 48

      // ===== LEFT: SIGNATURE AREA =====
      const sigX = 30

      // Signature line
      pdf.setDrawColor(80, 80, 80)
      pdf.setLineWidth(1)
      pdf.line(sigX, bottomY, sigX + 50, bottomY)

      // Signature details
      pdf.setFont('times', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(100, 100, 100)
      pdf.text('_______________________', sigX + 25, bottomY + 6, { align: 'center' })

      pdf.setFont('times', 'bold')
      pdf.setFontSize(10)
      pdf.setTextColor(80, 80, 80)
      pdf.text('Authorized Signatory', sigX + 25, bottomY + 14, { align: 'center' })

      pdf.setFont('times', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(100, 100, 100)
      pdf.text(issuer, sigX + 25, bottomY + 20, { align: 'center' })

      // ===== RIGHT: QR CODE WITH FRAME =====
      if (qrCodeData) {
        const qrImage = new Image()
        qrImage.src = qrCodeData

        await new Promise((resolve, reject) => {
          qrImage.onload = () => resolve()
          qrImage.onerror = () => reject(new Error('QR code failed to load'))
          setTimeout(() => reject(new Error('QR code timeout')), 3000)
        })

        const qrSize = 28
        const qrX = w - qrSize - 28
        const qrY = bottomY - 5

        // QR Frame
        pdf.setDrawColor(184, 134, 11)
        pdf.setLineWidth(1.5)
        pdf.rect(qrX - 3, qrY - 3, qrSize + 6, qrSize + 6)

        // Add QR image
        pdf.addImage(qrImage, 'PNG', qrX, qrY, qrSize, qrSize)

        // QR label
        pdf.setFont('times', 'normal')
        pdf.setFontSize(8)
        pdf.setTextColor(100, 100, 100)
        pdf.text('Scan to verify this certificate', w - qrSize / 2 - 14, bottomY + 26, { align: 'center' })
      }

      // ===== WATERMARK STATUS =====
      if (!isValid) {
        pdf.setTextColor(220, 20, 60)
        pdf.setFont('courier', 'bold')
        pdf.setFontSize(70)
        pdf.text('NOT VALID', w / 2, h / 2 - 10, {
          align: 'center',
          angle: -45,
        })
        pdf.setGState(new pdf.GState({ opacity: 0.08 }))
        pdf.rect(0, 0, w, h, 'F')
        pdf.setGState(new pdf.GState({ opacity: 1 }))
      } else if (status === 'revoked') {
        pdf.setTextColor(220, 20, 60)
        pdf.setFont('courier', 'bold')
        pdf.setFontSize(70)
        pdf.text('REVOKED', w / 2, h / 2 - 10, {
          align: 'center',
          angle: -45,
        })
        pdf.setGState(new pdf.GState({ opacity: 0.08 }))
        pdf.rect(0, 0, w, h, 'F')
        pdf.setGState(new pdf.GState({ opacity: 1 }))
      } else if (expired) {
        pdf.setTextColor(220, 20, 60)
        pdf.setFont('courier', 'bold')
        pdf.setFontSize(70)
        pdf.text('EXPIRED', w / 2, h / 2 - 10, {
          align: 'center',
          angle: -45,
        })
        pdf.setGState(new pdf.GState({ opacity: 0.08 }))
        pdf.rect(0, 0, w, h, 'F')
        pdf.setGState(new pdf.GState({ opacity: 1 }))
      }

      // ===== FOOTER ORNAMENT =====
      pdf.setDrawColor(218, 165, 32)
      pdf.setLineWidth(0.5)
      pdf.line(w / 2 - 30, h - 12, w / 2 + 30, h - 12)

      pdf.save(`certificate_${certId}.pdf`)
    } catch (error) {
      console.error('PDF download failed:', error)
      alert('Failed to download PDF. Please try again.')
    }
  }


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
  const showRevoked = status === 'revoked';
  // const isExpired = expired === true
  // return (
  //   <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 py-10 px-4 sm:px-6 lg:px-8">
  //     <div className="relative max-w-5xl mx-auto">
  //       <div ref={targetRef}
  //         className={`
  //           relative bg-white shadow-2xl rounded-2xl overflow-hidden border-8 border-double
  //           ${isValid ? 'border-amber-700' : 'border-red-700 opacity-85'}
  //         `}
  //       >

  //         <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
  //           <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#fbbf24_0%,transparent_60%)]" />
  //           <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#c084fc_0%,transparent_60%)]" />
  //         </div>

  //         <div className="relative px-6 py-12 md:px-16 md:py-20 text-center">
  //           <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-extrabold text-amber-900 tracking-wider mb-6 md:mb-10">
  //             CERTIFICATE
  //           </h1>

  //           <p className="text-2xl sm:text-3xl text-gray-700 mb-8 md:mb-12">of Course Completion</p>

  //           <div className="my-10 md:my-16">
  //             <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 mb-6">This is to certify that</p>
  //             <h2 className="text-5xl sm:text-3xl md:text-5xl font-serif font-bold text-indigo-950 py-4 px-6 md:px-12 inline-block border-b-4 border-amber-600">
  //               {certificate.name.toUpperCase()}
  //             </h2>
  //           </div>

  //           <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 mb-6 md:mb-10">
  //             has successfully completed
  //           </p>

  //           <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif text-amber-800 mb-12 md:mb-20">
  //             {course}
  //           </h3>

  //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 text-base md:text-xl mb-12 md:mb-16">
  //             <div>
  //               <p className="text-gray-600 uppercase tracking-wider text-sm md:text-base mb-1">Issued By</p>
  //               <p className="font-semibold">{issuer}</p>
  //             </div>
  //             <div>
  //               <p className="text-gray-600 uppercase tracking-wider text-sm md:text-base mb-1">Issued On</p>
  //               <p className="font-semibold">{issueDate}</p>
  //             </div>
  //             <div>
  //               <p className="text-gray-600 uppercase tracking-wider text-sm md:text-base mb-1">Cert. ID</p>
  //               <p className="font-mono font-semibold">{id}</p>
  //             </div>
  //           </div>

  //           <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center sm:items-end gap-12 sm:gap-0 mt-16 px-4 md:px-16">
  //             <div className="text-center">
  //               <div className="w-48 md:w-64 h-0.5 bg-gray-800 mx-auto mb-3 md:mb-4"></div>
  //               <p className="font-medium text-base md:text-lg">{issuer}</p>
  //               <p className="text-xs md:text-sm text-gray-600">Authorized Signatory</p>
  //             </div>


  //             {qrCodeData && (
  //               <div className="text-center">
  //                 <img src={qrCodeData} alt="QR Code" className="mx-auto w-32 h-32" />
  //               </div>
  //             )}
  //           </div>
  //         </div>


  //         {showWatermark && (
  //           <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20">
  //             <div
  //               className="
  //                 text-red-700/25 font-black uppercase tracking-[0.6em]
  //                 text-[min(15vw,180px)] sm:text-[min(15vw,210px)] md:text-[min(10vw,120px)]
  //                 transform rotate-[-40deg] leading-none drop-shadow-2xl text-center
  //               "
  //               style={{ textShadow: '6px 6px 30px rgba(0,0,0,0.25)' }}
  //             >
  //               NOT VALID
  //             </div>
  //           </div>
  //         )}
  //         {showRevoked && (
  //           <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20">
  //             <div
  //               className="
  //                 text-red-700/30 font-black uppercase tracking-[0.6em]
  //                 text-[min(15vw,180px)] sm:text-[min(15vw,210px)] md:text-[min(10vw,120px)]
  //                 transform rotate-[-40deg] leading-none drop-shadow-2xl text-center
  //               "
  //               style={{ textShadow: '6px 6px 30px rgba(0,0,0,0.25)' }}
  //             >
  //               REVOKED
  //             </div>
  //           </div>
  //         )}
  //         {expired && (
  //           <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20">
  //             <div
  //               className="
  //                 text-red-700/30 font-black uppercase tracking-[0.6em]
  //                 text-[min(15vw,180px)] sm:text-[min(15vw,210px)] md:text-[min(10vw,120px)]
  //                 transform rotate-[-40deg] leading-none drop-shadow-2xl text-center
  //               "
  //               style={{ textShadow: '6px 6px 30px rgba(0,0,0,0.25)' }}
  //             >
  //               EXPIRED
  //             </div>
  //           </div>
  //         )}
  //       </div>


  //       <div className="mt-8 text-center">
  //         {isValid && status !== 'revoked' && !expired ? (
  //           <p className="text-green-700 font-medium text-lg md:text-xl">
  //             ✓ This certificate is currently valid
  //           </p>
  //         ) : (
  //           <p className="text-red-700 font-bold text-xl md:text-2xl">
  //             ✗ This certificate is NOT VALID
  //           </p>
  //         )}

  //         <div className="flex justify-center space-x-4 mt-8">
  //           <Button variant="outline" onClick={() => window.location.href = '/'}>
  //             Issue New Certificate
  //           </Button>
  //           <Button variant="outline" onClick={() => window.location.href = '/verify'}>
  //             Verify Another Certificate
  //           </Button>
  //           <Button variant="outline" onClick={() => window.location.href = '/admin'}>
  //             Admin Dashboard
  //           </Button>
  //           <Button>Download PDF</Button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );




  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-4xl lg:max-w-5xl">
        <div
          ref={targetRef}
          className="relative bg-white px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-10 md:py-12 lg:py-15 rounded-lg shadow-xl text-center"
        >
          <div className="absolute inset-4 sm:inset-5 md:inset-6 border border-neutral-300 rounded-md"></div>

          <div className="relative mb-3 md:mb-4">
            <p className="uppercase tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm text-neutral-500 mb-2 md:mb-4">
              Certificate
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-neutral-900">
              Certificate of Completion
            </h1>
          </div>

          <p className="text-neutral-600 text-base sm:text-lg mb-3 md:mb-5">
            This is to certify that
          </p>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-neutral-900 border-b border-neutral-400 inline-block px-4 sm:px-6 md:px-10 pb-1 md:pb-2 mb-6 md:mb-12">
            {certificate.name.toUpperCase()}
          </h2>

          <p className="text-neutral-600 text-base sm:text-lg mb-2 md:mb-3">
            has successfully completed the course
          </p>

          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-neutral-800 mb-6 md:mb-10">
            {course}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12 text-xs sm:text-sm md:text-base text-neutral-700 mb-8 md:mb-10">
            <div>
              <p className="uppercase tracking-wider text-neutral-400 mb-1 text-xs">
                Issued By
              </p>
              <p className="font-medium text-sm md:text-base">{issuer}</p>
            </div>

            <div>
              <p className="uppercase tracking-wider text-neutral-400 mb-1 text-xs">
                Date
              </p>
              <p className="font-medium text-sm md:text-base">{issueDate}</p>
            </div>

            <div>
              <p className="uppercase tracking-wider text-neutral-400 mb-1 text-xs">
                Certificate ID
              </p>
              <p className="font-mono text-xs sm:text-sm md:text-base">{id}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 md:gap-8">
            <div className="text-left">
              <img src={signature} className='w-32 sm:w-40 md:w-48 lg:w-52' />
              <div className="w-32 sm:w-40 md:w-48 lg:w-52 h-px bg-neutral-800 mb-2"></div>
              <p className="font-medium text-sm md:text-base">{issuer}</p>
              <p className="text-xs text-neutral-500">
                Authorized Signatory
              </p>
            </div>

            {qrCodeData && (
              <div className="flex flex-col items-center gap-2">
                <a href={`${frontendUrl}/qr/verify/${certId}`} className='link text-blue-950 underline text-xs md:text-sm' target="_blank" rel="noopener noreferrer">Verify it here</a>
                <img
                  src={qrCodeData}
                  alt="QR Code"
                  className="w-20 h-20 sm:w-24 sm:h-24"
                />
              </div>
            )}
          </div>

          {!isValid && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-red-600/10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold rotate-[-25deg] tracking-widest">
                NOT VALID
              </span>
            </div>
          )}

          {status === 'revoked' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-red-600/10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold rotate-[-25deg] tracking-widest">
                REVOKED
              </span>
            </div>
          )}

          {expired && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-red-600/10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold rotate-[-25deg] tracking-widest">
                EXPIRED
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 md:mt-10 flex flex-wrap justify-center gap-2 md:gap-4">
          <Button variant="outline" onClick={() => window.location.href = '/'} className="text-xs sm:text-sm">
            Issue New
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/verify'} className="text-xs sm:text-sm">
            Verify Another
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/admin'} className="text-xs sm:text-sm">
            Admin
          </Button>
          <Button onClick={downloadPdf} className="text-xs sm:text-sm">
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  )



};

export default ViewCertificate;