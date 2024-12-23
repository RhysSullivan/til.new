import { Header } from '@/components/header';
import { MainContent } from '@/components/main-content';
import { Sidebar } from '@/components/sidebar';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: IndexComponent,
});

function IndexComponent() {
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
