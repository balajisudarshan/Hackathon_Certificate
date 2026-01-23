import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const Modal = ({ children }) => {
    const modalRef = useRef(document.createElement('div'))

    useEffect(() => {
        const modalRoot = document.getElementById('modal')
        modalRoot.appendChild(modalRef.current)
        return () => {
            modalRoot.removeChild(modalRef.current)
        }
    }, [])

    return createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 shadow-xl">
                {children}
            </div>
        </div>,
        modalRef.current
    )
}

export default Modal
