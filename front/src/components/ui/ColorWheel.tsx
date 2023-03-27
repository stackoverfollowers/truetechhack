import React from 'react';

interface Props {
	type?: 'default' | 'prot' | 'deut' | 'trit';
}

const COLORS_BY_BLINDNESS_TYPE = {
	default: ['#951bc6', '#f7151d', '#f7a12d', '#ebe024', '#4ddd47', '#2667c5'],
	deut: ['#4183f1', '#b5921e', '#eec72a', '#feff20', '#d2a63e', '#0037fa'],
	prot: ['#3e69fc', '#786722', '#d1ba2c', '#ffff24', '#b4a231', '#002ac7'],
	trit: ['#cc587b', '#f9105d', '#fc9fb2', '#fdd5dd', '#51dae8', '#17a5b9'],
};

const ColorWheel: React.FC<Props> = ({ type = 'trit' }) => {
	return (
		<div className="flex flex-col w-5 h-5 rounded-full overflow-hidden">
			{COLORS_BY_BLINDNESS_TYPE[type].map((color, index) => (
				<div
					key={color}
					className="w-full h-[5px]"
					style={{ backgroundColor: color }}
				/>
			))}
		</div>
	);
};

export default ColorWheel;
