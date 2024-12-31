import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import {  useConvexAuth } from "convex/react";


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
	const data = useQuery(convexQuery(api.github.getReposForUser, {}))
	console.log("data",data.data);
	return data;
}

export function useAuthedUser() {
	const user = useQuery(convexQuery(api.auth.currentUser, {}))
	console.log("user",user);
	return user;
}

export function useIsAuthenticated() {
	const { isAuthenticated } = useConvexAuth();
	return isAuthenticated;
}

export function save(note: {
	title: string;
	value: string;
}) {
	console.log(note);
}
