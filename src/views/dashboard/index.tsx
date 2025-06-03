import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import accessibility from 'highcharts/modules/accessibility';
// import exporting from 'highcharts/modules/exporting';
// import exportData from 'highcharts/modules/export-data';
import DatePicker from '@components/datapicker/datePicker';
import { ProfileIcon } from '@components/icons/icons';
import { useQuery } from '@apollo/client';
import { FETCH_DASHBOARD_COUNT, USER_COUNT_BY_YEAR } from '@framework/graphql/queries/dashboard';
import { DashboardData, UserCountData } from '@type/dashboard';
import BottomCard from './bottomCard';
// accessibility(Highcharts);
// exporting(Highcharts);
// exportData(Highcharts);

const Dashboard = () => {
	const { t } = useTranslation();
	const { data: dashboardCount } = useQuery<DashboardData>(FETCH_DASHBOARD_COUNT);
	const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
	// const [setChartData] = useState<ChartData[]>([]);
	const { data } = useQuery<UserCountData>(USER_COUNT_BY_YEAR, {
		variables: { year: selectedYear.toString() },
	});

	useEffect(() => {
		if (data) {
			// const dataArray = Object.entries(data?.userCountByYear?.data).map(([name, y]) => ({ name, y }));
			// const filteredData = dataArray?.filter((item: { name: string }) => item.name !== '__typename');
			// setChartData(filteredData);
		}
	}, [data, selectedYear]);

	// const options = {
	// 	chart: {
	// 		type: 'column',
	// 	},
	// 	title: {
	// 		align: 'center',
	// 		text: `User Chart  ${selectedYear}`,
	// 	},
	// 	accessibility: {
	// 		announceNewData: {
	// 			enabled: true,
	// 		},
	// 	},
	// 	xAxis: {
	// 		type: 'category',
	// 	},
	// 	yAxis: {
	// 		title: {
	// 			text: 'Total User',
	// 		},
	// 	},
	// 	legend: {
	// 		enabled: false,
	// 	},
	// 	plotOptions: {
	// 		series: {
	// 			borderWidth: 0,
	// 			dataLabels: {
	// 				enabled: true,
	// 				format: '{point.y}',
	// 			},
	// 		},
	// 	},
	// 	tooltip: {
	// 		headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
	// 		pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> User<br/>',
	// 	},
	// 	series: [
	// 		{
	// 			type: 'column',
	// 			name: 'Users',
	// 			colorByPoint: true,
	// 			data: chartData,
	// 		},
	// 	],
	// };

	const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedDate = new Date(event.target.value);
		const newYear = selectedDate.getFullYear();
		setSelectedYear(newYear);
	};
	return (
		<div>
			<div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 lg:gap-x-30px gap-y-4 mb-4 [.show-menu~div_&]:grid-cols-1 [.show-menu~div_&]:md:grid-cols-2 [.show-menu~div_&]:lg:grid-cols-3'></div>
			<div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 lg:gap-x-30px [.show-menu~div_&]:grid-cols-1 [.show-menu~div_&]:md:grid-cols-2 [.show-menu~div_&]:lg:grid-cols-3'>
				<BottomCard title={t(`${'Sub-Admin'}'s`)} value={dashboardCount?.dashboardDataCount?.data?.adminCount} redirectPage={'sub-Admin'} />
				<BottomCard title={t(`${'User'}'s`)} value={dashboardCount?.dashboardDataCount?.data?.userCount} redirectPage={'manage-user'} />
				<BottomCard title={t(`${'Enquiry'}'s`)} value={dashboardCount?.dashboardDataCount?.data?.enquiryCount} redirectPage={'enquiry'} />
			</div>
			<div className='card-header flex-wrap gap-2'>
				<div className='flex items-center'>
					<span className='w-3.5 h-3.5 mr-2 text-md leading-4 inline-block svg-icon'>
						<ProfileIcon />
					</span>
					{t('User Chart')}
				</div>
				<div className='btn-group flex gap-y-2 flex-wrap'>
					<DatePicker id='dashboard-date-picker' view={'year'} onChange={handleYearChange} value={new Date(selectedYear, 0)} max={new Date()} dateFormat='yy' />
				</div>
			</div>
			{/* <HighchartsReact highcharts={Highcharts} options={options} /> */}
		</div>
	);
};
export default Dashboard;
