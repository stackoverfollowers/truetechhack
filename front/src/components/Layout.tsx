import { ReactNode } from 'react';
import Header from './Header';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<Header />
			<main className="mx-auto flex max-w-7xl items-center lg:px-8">
				{children}
			</main>
		</>
	);
}
