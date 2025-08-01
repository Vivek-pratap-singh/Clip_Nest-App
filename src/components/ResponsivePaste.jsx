// src/components/ResponsivePaste.jsx
import React from "react";
import useWindowSize from "./useWindowSize";
import Paste from "./Paste";
import SmallPaste from "./SmallPaste";

const ResponsivePaste = () => {
  const { width } = useWindowSize();

  return width < 768 ? <SmallPaste /> : <Paste />;
};

export default ResponsivePaste;
