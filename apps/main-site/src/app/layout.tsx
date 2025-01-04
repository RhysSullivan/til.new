import { Sidebar } from '@til/ui/sidebar';
import '../styles/globals.css';
export { metadata } from '@til/ui/layouts/root';

import { Layout } from '@til/ui/layouts/root';
import { Header } from '@til/ui/header';

export default function RootLayout(props: {
	children: React.ReactNode;
}) {
	return (
		<Layout>
			<div className="flex h-screen bg-background">
				<Sidebar />
				<div className="flex-1 flex flex-col overflow-hidden">
					<Header />
					<main className="flex min-h-screen flex-col items-center pt-0 p-24">
						{props.children}
					</main>
				</div>
			</div>
		</Layout>
	);
}
