import React from "react";

export default function CorrectIcon({
  className,
}: {
  className?: string | undefined;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <circle cx="12" cy="12" r="9" fill="transparent" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.5 10l2.5 2.5M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}