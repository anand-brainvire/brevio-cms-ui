import filterServiceProps from '../components/filter/filter';

/**
 *Custom hook used to check filter data in local storage 
 and return in filterdata 
 * @returns localfilterData function
 */
const useSaveFilterData = () => {
	const localFilterData = (moduleName: string) => {
		const savedFilterDataJSONEnquiry = filterServiceProps.getState(moduleName, JSON.stringify({}));
		if (savedFilterDataJSONEnquiry) {
			const savedFilterData = JSON.parse(savedFilterDataJSONEnquiry);
			return Object.keys(savedFilterData).length === 0 ? null : savedFilterData;
		}
	};
	return {
		localFilterData,
	};
};

export default useSaveFilterData;
