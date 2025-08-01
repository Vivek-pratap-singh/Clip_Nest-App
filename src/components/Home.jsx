import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToPastes, updateToPastes } from "../redux/pasteSlice"; // adjust path as needed
import home from "../images/home.png";
import useWindowSize from "./useWindowSize";


const Home = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [searchParams] = useSearchParams();
  const pasteId = searchParams.get("pasteId");
  const dispatch = useDispatch();
  const allPastes = useSelector((state) => state.paste.pastes);
  const { width, height } = useWindowSize();
  const isMobile = width < 768; // Tailwind md breakpoint


  function createPaste() {
    const paste = {
      title: title,
      content: value,
      _id: pasteId || Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    if (pasteId) {
      dispatch(updateToPastes(paste));
    } else {
      dispatch(addToPastes(paste));
    }

    // after creation or updation, clear the input fields
    setTitle("");
    setValue("");
    searchParams({});
  }

  useEffect(() => {
    if (pasteId) {
      const paste = allPastes.find((p) => p._id === pasteId);
      setTitle(paste.title);
      setValue(paste.content);
    }
  }, [pasteId]);

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white px-10 py-12 rounded-2xl mt-1 border-1 border-gray-950 md:flex-row">
      {/* Heading */}
     <div>
  <div className="flex items-center">
    <h1 className="text-4xl font-bold text-blue-500 mr-4">Home</h1>
    <img src={home} alt="Home Logo" className="h-10 w-10" />
  </div>
</div>


      <div className={`flex ${isMobile ? 'flex-col w-full' : 'flex-row w-[1000px]'} justify-between gap-6 mb-6 mt-10`}>
        <input
          type="text"
          value={title}
          placeholder="Enter Title Here"
          onChange={(e) => setTitle(e.target.value)}
          className={`${
    isMobile ? 'w-full' : 'w-[700px]'
  } h-12 rounded-2xl bg-gray-600 px-4 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300`}
        />

        <button
          className={`${
    isMobile ? 'w-full' : 'w-[250px]'
  } h-12 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:scale-105 transition-transform duration-200`}
          onClick={createPaste}
        >
          {pasteId ? "Update My Paste" : "Create New Paste"}
        </button>
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        placeholder="Enter Content Here"
        onChange={(e) => setValue(e.target.value)}
        rows={20}
        className={`${
    isMobile ? 'w-full' : 'w-[1000px]'
  } h-[500px] rounded-2xl p-4 bg-gray-950 text-white placeholder-gray-400 resize-none outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300`}
      />
    </div>
  );
};

export default Home;
