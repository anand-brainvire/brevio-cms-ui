import React, { createContext, ReactNode, useState, useEffect } from 'react';
import DecryptionFunction from 'src/services/decryption';
interface IRoleBaseGuardProps {
	children?: ReactNode;
	permissions?: string[];
}
const RoleContext = createContext(false);
const RoleBaseGuard = ({ children, permissions }: IRoleBaseGuardProps) => {
	const [view, setView] = useState<boolean>(false);
	const EncryptedPermissions = localStorage.getItem('permissions');
	const DecryptedPermissions = EncryptedPermissions && DecryptionFunction(EncryptedPermissions);
	const userPermissions = Permissions && JSON.parse(DecryptedPermissions); // globlly available current user permissions
	useEffect(() => {
		if (userPermissions && userPermissions.length > 0 && !userPermissions.includes('All')) {
			if (permissions?.some((perm) => userPermissions.includes(perm))) {
				setView(true);
			}
		} else {
			setView(true);
		}
	}, [userPermissions, permissions]);
	return <RoleContext.Provider value={view}>{view ? children : null}</RoleContext.Provider>;
};
export default RoleBaseGuard;
