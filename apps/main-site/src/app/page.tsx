"use client"
import dynamic from "next/dynamic";

const Client = dynamic(() => import('./client').then(mod => mod.Client), { ssr: false })

export default function Home() {
	return <Client />
}
