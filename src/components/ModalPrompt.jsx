import React, { useEffect } from 'react';
import './ModalPrompt.css';

export default function ModalPrompt({
  isOpen,
  title,
  message,
  placeholder,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  value,
  onChange,
  onConfirm,
  onCancel
}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card">
        <h3 id="modal-title">{title}</h3>
        {message && <p className="modal-message">{message}</p>}
        <input
          className="modal-input"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoFocus
        />
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel} type="button">
            {cancelLabel}
          </button>
          <button className="btn-primary" onClick={onConfirm} type="button">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
