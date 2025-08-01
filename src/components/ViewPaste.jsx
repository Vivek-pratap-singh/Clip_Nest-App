import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ViewPaste = () => {
  const { id } = useParams(); // moved inside component
  const allPastes = useSelector((state) => state.paste.pastes); // moved inside component
  const paste = allPastes.find((p) => p._id === id);

  if (!paste) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-2xl">
        Paste not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white px-10 py-12 rounded-2xl mt-1 border-1 border-gray-950">
      {/* Heading */}
      <h1 className="text-4xl font-bold mb-2 text-blue-500">Paste Viewer</h1>
      <h2 className="text-2xl font-semibold mb-8 text-gray-300">Read-Only Mode</h2>

      {/* Title */}
      <div className="flex flex-row justify-between gap-6 w-[1000px] mb-6">
        <input
          type="text"
          value={paste.title}
          disabled
          className="w-[700px] h-12 rounded-2xl bg-gray-600 px-4 text-white placeholder-gray-300 outline-none"
        />
      </div>

      {/* Content */}
      <textarea
        value={paste.content}
        disabled
        rows={20}
        className="w-[1000px] h-[500px] rounded-2xl p-4 bg-gray-950 text-white placeholder-gray-400 resize-none outline-none"
      />
    </div>
  );
};

export default ViewPaste;
