import { clsx, type ClassValue } from "clsx"
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function useAutoSlide(length: number, delay = 5000) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!length) return;
    const id = setInterval(() => setIdx((s) => (s + 1) % length), delay);
    return () => clearInterval(id);
  }, [length, delay]);
  return [idx, setIdx] as const;
}




