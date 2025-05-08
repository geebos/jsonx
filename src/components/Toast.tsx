import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    duration?: number;
    onClose: () => void;
    id: number;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 1000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="json-toast">
            {message}
        </div>
    );
};

export default Toast; 