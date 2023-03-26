import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import ThemeSwitch from '@/components/ui/ThemeSwitch';
import dynamic from 'next/dynamic';
// import VideoPlayer from '@/components/VideoPlayer';
import { ReactElement, useRef } from 'react';
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
	ssr: false,
});

const Home = () => {
	const playerRef = useRef();

	return (
		<div className="w-full max-w-7xl">
			<ThemeSwitch />
			<VideoPlayer playerRef={playerRef} />
		</div>
	);
};

Home.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};
export default Home;
