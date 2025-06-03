
	
	
	
const persistPageWiseFilter = true;

const FilterStorageService = {
  saveState: (key: string, value: string, forceFullySave = true): void => {

    if (persistPageWiseFilter && forceFullySave) {
  
    sessionStorage.setItem(key, JSON.stringify(value))}
  },
    
  getState: (key: string, value: string, forcefullyGet = false): string => {

    if (!persistPageWiseFilter && forcefullyGet) {
 
      return value; 
    }
  
    const data = sessionStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    } else {
      return value; 
    }
  },
  
  saveSingleState: (key: string, value: string, forceFullySave: boolean): void => {
    if (!persistPageWiseFilter && !forceFullySave){
    sessionStorage.setItem(key, value)}
  },
  
  getSingleState: (key: string, defaultValue: string, forceFullyGet: boolean): string => {
    if (!persistPageWiseFilter && !forceFullyGet) {return defaultValue}
    const data = sessionStorage.getItem(key);
    if (data) {
      return data;
    } else {
      return defaultValue;
    }
  }
};

export default FilterStorageService;