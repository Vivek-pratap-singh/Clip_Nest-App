// src/components/ResponsiveViewPaste.jsx
import React from "react";
import useWindowSize from "./useWindowSize";
import ViewPaste from "./ViewPaste";
import SmallViewPaste from "./SmallViewPaste";

const ResponsiveViewPaste = () => {
  const { width } = useWindowSize();
  return width < 768 ? <SmallViewPaste /> : <ViewPaste />;
};

export default ResponsiveViewPaste;
