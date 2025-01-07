import type { Metadata } from 'next';
import { Montserrat, Source_Sans_3 } from 'next/font/google';
import React from 'react';
import { Providers } from './providers';

export const metadata: Metadata = {
	title: 'til.new - Quick Developer Notes',
	metadataBase: new URL('https://www.til.new/'),
	description:
		'Create and share quick developer notes and TILs (Today I Learned) directly from your browser. Instantly save to GitHub with markdown support.',
	openGraph: {
		type: 'website',
		title: 'til.new - Quick Developer Notes',
		siteName: 'til.new',
		description:
			'Create and share quick developer notes and TILs (Today I Learned) directly from your browser. Instantly save to GitHub with markdown support.',
		images: [
			{
				url: 'https://www.til.new/banner.png',
				width: 1200,
				height: 630,
			},
		],
	},
};
const montserrat = Montserrat({
	subsets: ['latin'],
	display: 'swap',
	weight: ['400', '500', '600', '700'],
	variable: '--font-montserrat',
});
const sourceSans3 = Source_Sans_3({
	subsets: ['latin'],
	display: 'swap',
	weight: ['400', '500', '600', '700'],
	variable: '--font-source-sans-3',
});

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		// suppressHydrationWarning makes next themes doesn't error, other hydration errors are still shown
		<html
			lang="en"
			suppressHydrationWarning
			className={'dark'}
			style={{
				colorScheme: 'dark',
			}}
		>
			<body className={`${montserrat.variable} ${sourceSans3.variable}`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
