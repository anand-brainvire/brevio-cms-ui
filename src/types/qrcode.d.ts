export type CreateQrCode = {
	url: string;
	status: number;
};

export type FilterQrCodeProps = {
	url: string;
};
export type QrCodeProps = {
	onSearchQrCode: (values: FilterQrCodeProps) => void;
	clearSelectionQrCode: () => void;
	filterData: PaginationParams;
};
