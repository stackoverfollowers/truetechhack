import useFontSize from '@/hooks/use-font-size';
import { useAppSelector } from '@/redux/hooks';

const DurationDisplay = () => {
	const fs = useFontSize();

	const { duration, progress } = useAppSelector(state => state.player);

	const pad = (str: any) => ('0' + str).slice(-2);

	const format = (seconds: number) => {
		const date = new Date(seconds * 1000);
		const hh = date.getUTCHours();
		const mm = date.getUTCMinutes();
		const ss = pad(date.getUTCSeconds());
		if (hh) {
			return `${hh}:${pad(mm)}:${ss}`;
		}
		return `${mm}:${ss}`;
	};

	return (
		<>
			<span className={`${fs.sm} flex items-center font-mono tracking-tighter`}>
				<span>{format(duration * progress.played)}</span>
				<span className="px-[2px]">/</span>
				<span>{format(duration)}</span>
			</span>
		</>
	);
};
export default DurationDisplay;
