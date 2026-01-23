import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router'
import Modal from '../../Modal'
import axios from 'axios'
import toast from 'react-hot-toast'


const CertificateDisplayCard = ({ cert }) => {
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState(cert.status)
    const handleStatusChange = async () => {
        try {
            const res = await axios.put(`http://localhost:5050/api/certificates/status/${cert.certId}`, { status })
            toast.success("Status updated successfully")

            setOpen(false)
        } catch (error) {
            toast.error("Failed to update status")
            console.log(error)
        }
    }
    const handleDelete = async () => {
        try {
            const res = await axios.delete(`http://localhost:5050/api/certificates/delete/${cert.certId}`)
            toast.success("Certificate deleted successfully")
            res.filter((resu)=>resu.id !== id)
            setOpen(false)
        } catch (error) {
            toast.error("Failed to delete certificate")
            console.log(error)
        }
    }
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
                    <Button variant="outline" size="sm" onClick={handleDelete}>Delete</Button>
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
                            <Button onClick={(e) => handleStatusChange()}>
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
