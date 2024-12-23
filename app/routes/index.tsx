import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { convexQuery } from '@convex-dev/react-query';
import { api } from 'convex/_generated/api';
import { Loader } from '@/components/loader';

export const Route = createFileRoute('/')({
	component: Home,
	pendingComponent: () => <Loader />,
});

function Home() {
	return (
		<div className="p-8 space-y-2">
			<h1 className="text-2xl font-black">Boards</h1>
			<ul className="flex flex-wrap list-disc">
				
			</ul>
		</div>
	);
}
