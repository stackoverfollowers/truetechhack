import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const ThemeSwitch = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<select value={theme} onChange={e => setTheme(e.target.value)}>
			<option value="default">default</option>
			<option value="prot">prot</option>
			<option value="deut">deut</option>
			<option value="trit">trit</option>
		</select>
	);
};

export default ThemeSwitch;
