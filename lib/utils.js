import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}



export const maskEmail = (email) => {
  const [local, domain] = email.split('@');
  const masked = local.slice(0, 3) + '*'.repeat(local.length - 3);
  return `${masked}@${domain}`;
};   