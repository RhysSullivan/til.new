
import { Button } from "./ui/button";

export function Header() {
	return (
		<header className="max-h-12 min-h-12 border-b flex items-center px-4 justify-between">
			{/* Empty header */}
			<div className='invisible'>
			</div>
			<Button 
			variant='ghost'
			size='sm'
			asChild
			>
				{/* tweet to @rhyssullivan with the text: "@rhyssullivan til.new feedback: " */}
				<a target="_blank" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("@rhyssullivan til.new feedback: ")}`}>
					Feedback
				</a>
			</Button>
		</header>
	);
}
