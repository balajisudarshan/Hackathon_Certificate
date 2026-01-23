import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router'
import Modal from '../../Modal'

const CertificateDisplayCard = ({ cert }) => {
    const [open, setOpen] = useState(false)
    const [status,setStatus]=useState(cert.status)
    return (
        <>
            <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition">
                <div>
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-sm text-gray-600">{cert.course}</p>
                    <p className="text-xs text-gray-500">
                        ID: {cert.certId} • Issued: {cert.issuedDate}
                    </p>
                </div>

                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link to={`/view/${cert.certId}`}>View</Link>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOpen(true)}
                    >
                        Edit
                    </Button>
                </div>
            </div>

            {open && (
                <Modal>
                    <div className="w-[400px] space-y-4">
                        <h2 className="text-xl font-bold">Edit Certificate</h2>

                        <p className="text-sm text-slate-600">
                            {cert.name} — {cert.course} - {status}
                        </p>
                        {status === 'revoked' ? (
                            <Button variant="default" onClick={() => setStatus('active')}>Activate</Button>
                        ) : <Button variant="destructive" onClick={() => setStatus('revoked')}>Revoke</Button>}
                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={() => setOpen(false)}>
                                Save
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default CertificateDisplayCard
