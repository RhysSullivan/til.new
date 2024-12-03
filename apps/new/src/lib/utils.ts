import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function sanitizeFileName(
	str: string,
	options?: { replacement: string },
): string {
	return str
		.replace(/[^a-z0-9]/gi, options?.replacement || '-') // Replace non-alphanumeric chars with hyphens
		.replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
		.replace(/^-|-$/g, '') // Remove leading/trailing hyphens
		.toLowerCase();
}
