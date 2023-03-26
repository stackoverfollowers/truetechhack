interface DurationDisplayProps {
	duration: number;
	played: number;
}

const DurationDisplay = ({ duration, played }: DurationDisplayProps) => {
	function pad(str: any) {
		return ('0' + str).slice(-2);
	}

	function format(seconds: number) {
		const date = new Date(seconds * 1000);
		const hh = date.getUTCHours();
		const mm = date.getUTCMinutes();
		const ss = pad(date.getUTCSeconds());
		if (hh) {
			return `${hh}:${pad(mm)}:${ss}`;
		}
		return `${mm}:${ss}`;
	}

	return (
		<>
			<span className="flex items-center text-sm text-white">
				<span>{format(played)}</span>
				<span>/</span>
				<span>{format(duration)}</span>
			</span>
		</>
	);
};
export default DurationDisplay;
