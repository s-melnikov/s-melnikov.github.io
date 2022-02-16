import React from "react";

const Link = ({ to, children, className }) => {
  return (
    <a href={`#${to}`} className={className}>
      {children}
    </a>
  );
};

export default Link;
