// src/components/SmallPaste.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromPaste } from "../redux/pasteSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SmallPaste = () => {
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = pastes.filter((paste) =>
    paste.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#1e1e1e] text-white p-4 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-500 text-center mb-4">All Pastes</h1>

      <input
        type="text"
        placeholder="Search by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-6 px-4 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-300 outline-none"
      />

      {filteredData.length > 0 ? (
        filteredData.map((paste) => (
          <div
            key={paste._id}
            className="bg-gray-800 p-4 rounded-xl mb-4 shadow-md"
          >
            <h3 className="text-lg font-semibold text-blue-400 mb-1">
              {paste.title || "Untitled"}
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              {paste.content?.slice(0, 60) + (paste.content?.length > 60 ? "..." : "")}
            </p>

            <div className="flex flex-wrap gap-2 justify-between">
              <button
                onClick={() => navigate(`/?pasteId=${paste._id}`)}
                className="bg-blue-600 px-3 py-1 rounded-lg text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => navigate(`/view/${paste._id}`)}
                className="bg-green-600 px-3 py-1 rounded-lg text-sm"
              >
                View
              </button>

              <button
                onClick={() => {
                  dispatch(removeFromPaste(paste._id));
                  toast.success("Deleted");
                }}
                className="bg-red-600 px-3 py-1 rounded-lg text-sm"
              >
                Delete
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(paste.content);
                  toast.success("Copied");
                }}
                className="bg-gray-700 px-3 py-1 rounded-lg text-sm"
              >
                Copy
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400 mt-4">No pastes found.</p>
      )}
    </div>
  );
};

export default SmallPaste;
