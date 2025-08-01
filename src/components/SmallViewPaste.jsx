// src/components/SmallViewPaste.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SmallViewPaste = () => {
  const { id } = useParams();
  const allPastes = useSelector((state) => state.paste.pastes);
  const paste = allPastes.find((p) => p._id === id);

  if (!paste) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl px-4 text-center">
        Paste not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white px-4 py-6">
      <h1 className="text-2xl font-bold mb-2 text-blue-500 text-center">Paste Viewer</h1>
      <h2 className="text-md font-semibold mb-6 text-gray-300 text-center">Read-Only Mode</h2>

      {/* Title */}
      <input
        type="text"
        value={paste.title}
        disabled
        className="w-full h-10 rounded-xl bg-gray-700 px-3 mb-4 text-white placeholder-gray-300 outline-none"
      />

      {/* Content */}
      <textarea
        value={paste.content}
        disabled
        rows={15}
        className="w-full h-[300px] rounded-xl p-3 bg-gray-900 text-white placeholder-gray-400 resize-none outline-none"
      />
    </div>
  );
};

export default SmallViewPaste;
