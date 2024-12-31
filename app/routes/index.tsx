import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { convexQuery } from '@convex-dev/react-query';
import { api } from 'convex/_generated/api';
import { Loader } from '@/components/loader';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { MainContent } from '@/components/main-content';

export const Route = createFileRoute('/')({
	component: Home,
});

function Home() {
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
