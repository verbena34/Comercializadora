import React from "react";

export default function Badge({
  children,
  color = "gray",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  const bg = color === "red" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700";
  return <span className={`px-2 py-1 rounded-full text-xs ${bg}`}>{children}</span>;
}
