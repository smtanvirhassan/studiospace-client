"use client";

interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({ text = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
      <span className="loading loading-spinner loading-lg text-indigo-500"></span>
      {text && <p className="text-sm text-base-content/70">{text}</p>}
    </div>
  );
}
