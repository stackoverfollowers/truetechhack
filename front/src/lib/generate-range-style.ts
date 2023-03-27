export default function generateRangeStyle(value: number) {
	return {
		background: `linear-gradient(to right, rgb(var(--primary-color)) ${
			value * 100
		}%, rgb(var(--accents-5)) ${value * 100}% 100%)`,
	};
}
