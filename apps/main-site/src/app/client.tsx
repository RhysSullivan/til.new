import { Header } from '@til/ui/header';
import { MainContent } from '@til/ui/main-content';
import { Sidebar } from '@til/ui/sidebar';

export function Client() {
	return (
		<div className="flex h-screen bg-background">
			<Sidebar />
			<div className="flex-1 flex flex-col overflow-hidden">
				<Header />
				<MainContent />
			</div>
		</div>
	);
}
