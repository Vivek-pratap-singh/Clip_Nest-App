import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromPaste } from '../redux/pasteSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { NavLink } from 'react-router-dom'; 


const Paste = () => {
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = pastes.filter((paste) =>
    paste.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleDelete(pasteId) {
    dispatch(removeFromPaste(pasteId));
    toast.success("Paste deleted.");
  }

  function handleCopy(content) {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  }

  function handleEdit(pasteId) {
    navigate(`/?pasteId=${pasteId}`);
  }

  function handleView(paste) {
    toast(paste.content || "No content");
  }

  function handleShare(paste) {
    const url = `${window.location.origin}/?pasteId=${paste._id}`;
    navigator.clipboard.writeText(url);
    toast.success('Share link copied!');
  }

  return (
    <div className="w-[900px] bg-[#1e1e1e] text-white px-10 py-12 rounded-2xl mt-1 border border-gray-950">
      <h1 className="text-4xl font-bold mb-2 text-blue-500">All Pastes</h1>
      <h2 className="text-2xl font-semibold mb-8 text-gray-300">Explore Your Saved Notes</h2>

      <input
        className="w-[800px] h-12 rounded-2xl bg-gray-600 px-5 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 mb-8"
        type="search"
        placeholder="Search pastes by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="flex flex-col gap-6 w-[800px]">
        {filteredData.length > 0 ? (
          filteredData.map((paste) => (
            <div
              key={paste._id}
              className="bg-gray-800 p-5 rounded-2xl shadow-md hover:shadow-blue-500/20 transition-all"
            >
              <h3 className="text-xl font-semibold text-blue-400 mb-2">
                {paste.title || 'Untitled'}
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                {paste.content?.slice(0, 120) + (paste.content?.length > 120 ? '...' : '')}
              </p>

              <div className="flex flex-wrap gap-3 mt-2">
                
                <button className="px-4 py-2 rounded-lg hover:bg-blue-600"> <NavLink to={`/?pasteId=${paste?._id}`}>edit</NavLink></button>
                
                <button className="px-4 py-2  rounded-lg hover:bg-green-700"><NavLink to={`/view/${paste._id}`}>view</NavLink></button>

                <button className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600" onClick={() => handleDelete(paste._id)}>
                  Delete
                </button>

                <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-800" onClick={() => handleCopy(paste.content)}>
                  Copy
                </button>

                <button className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600" onClick={() => handleShare(paste)}>
                  Share
                </button>
              </div>

              <p className="text-gray-500 mt-4 text-sm">
                Created at: {new Date(paste.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-lg">No pastes found.</p>
        )}
      </div>
    </div>
  );
};

export default Paste;
