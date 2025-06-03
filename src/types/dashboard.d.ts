export type TopCardProps = {
	title: string;
	value: number | undefined;
	redirectPage?: string;
};

export type BottomCardProps = {
	title: string;
	value: number | undefined;
	redirectPage?: string;
};
export type DashboardData = {
	dashboardDataCount: {
		data: { adminCount: number; userCount: number; enquiryCount: number };
	};
};

export type ChartData = {
	name: string;
	y: number;
}

export type UserCountData = {
	userCountByYear: {
		data: {
			[key: string]: number;
		};
	};
}
y