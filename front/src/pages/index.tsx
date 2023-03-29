import Layout from '@/components/Layout';
import VideoList from '@/components/VideoList';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { ReactElement, useRef } from 'react';
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
	ssr: false,
});

const Home = () => {
	const playerRef = useRef();

	return (
		<>
			<Head>
				<title>Главная – stackoverfollowers</title>
			</Head>
			<div className="w-full max-w-7xl">
				<VideoPlayer playerRef={playerRef} />
				<br />
				<VideoList />
			</div>
		</>
	);
};

Home.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default Home;
