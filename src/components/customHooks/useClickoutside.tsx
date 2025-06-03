import { useEffect } from 'react';

const useClickOutside = (ids: string[], setState: React.Dispatch<React.SetStateAction<boolean>>, depdencies: boolean): void => {
	useEffect(() => {
		const handleClickOutside = (event: globalThis.MouseEvent) => {
			const clickedId = (event.target as HTMLElement)?.id;
			if (!ids.includes(clickedId)) {
				setState(false);
			}
		};
		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [depdencies, ids, setState]);
};

export default useClickOutside;
