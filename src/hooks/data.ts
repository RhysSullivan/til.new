interface Repository {
	name: string;
	files: string[];
}

// Example data - in real app, this would come from your git integration
const repositories: Repository[] = [
	{
		name: 'my-project',
		files: ['README.md', 'package.json', 'src/index.ts'],
	},
	{
		name: 'docs',
		files: ['getting-started.md', 'api-reference.md'],
	},
];

export function useRepositories() {
	return {
		repositories: repositories as Repository[],
	};
}

export function useIsAuthenticated() {
	return true;
}

export function save(note: {
	title: string;
	value: string;
}) {
	console.log(note);
}
