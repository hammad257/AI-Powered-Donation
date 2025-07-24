'use client';

import { useState } from 'react';

export default function StatusModal({ isOpen, onClose, onSubmit, status }) {
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(notes);
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Confirm <span className="capitalize text-blue-600">{status}</span> Status
        </h2>
        <textarea
          placeholder="Add notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full border p-2 rounded"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
