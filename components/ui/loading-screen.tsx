"use client";

export function LoadingScreen() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
			<div className="w-64 space-y-2">
				<div className="h-1 w-full bg-primary/20 overflow-hidden">
					<div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite]" />
				</div>
				<p className="text-xs font-medium text-primary tracking-[0.2em] uppercase text-center animate-pulse">
					System Initializing...
				</p>
			</div>
			<style jsx>{`
				@keyframes loading {
					0% {
						width: 0%;
						margin-left: 0%;
					}
					50% {
						width: 100%;
						margin-left: 0%;
					}
					100% {
						width: 0%;
						margin-left: 100%;
					}
				}
			`}</style>
		</div>
	);
}
