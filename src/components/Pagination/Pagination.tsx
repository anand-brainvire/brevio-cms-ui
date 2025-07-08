import Button from '@components/button/button';
import { BackwardIcon, AngleLeftIcon, AngleRightIcon, ForwordIcon } from '@components/icons/icons';
import { AccesibilityNames, MAX_DISPLAY_PAGE_COUNT } from '@config/constant';
import { PaginationProps } from '@type/common';
import React, { useCallback } from 'react';

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
	const handlePageClick = (page: number) => {
		onPageChange(page);
	};
	const renderPageNumbers = () => {
		const PAGE_NUMBER_CMN: number[] = [];
		const leftPageBoundary = Math.max(1, currentPage - Math.floor(MAX_DISPLAY_PAGE_COUNT / 2));
		const rightPageBoundary = Math.min(totalPages, leftPageBoundary + MAX_DISPLAY_PAGE_COUNT - 1);

		for (let i = leftPageBoundary; i <= rightPageBoundary; i++) {
			PAGE_NUMBER_CMN.push(i);
		}
		return PAGE_NUMBER_CMN?.map((dataPageNumber) => (
			<button key={dataPageNumber} onClick={() => handlePageClick(dataPageNumber)} className={`mr-2 mx-1 w-6 h-rise-2 rounded-sm text-xs ${dataPageNumber === currentPage ? 'font-bold bg-primary text-white w-5 text-center' : ''}`}>
				{dataPageNumber}
			</button>
		));
	};

	const handleFirstPageClick = () => {
		handlePageClick(1);
	};

	const handlePrevPageClick = useCallback(() => {
		if (currentPage > 1) {
			handlePageClick(currentPage - 1);
		}
	}, [currentPage, handlePageClick]);

	const handleNextPageClick = useCallback(() => {
		if (currentPage < totalPages) {
			handlePageClick(currentPage + 1);
		}
	}, [currentPage, totalPages]);

	const handleLastPageClick = () => {
		handlePageClick(totalPages);
	};
	return (
		<div className='pagination flex items-center'>
			<div className='flex items-center '>
				<Button title={AccesibilityNames.goToFirst} onClick={handleFirstPageClick} disabled={currentPage <= 0 || currentPage == 1} className={currentPage === 1 ? 'cursor-not-allowed' : ''}>
					<div className='px-1.5 mx-1 my-1'>
						<span className='w-2 h-2 text-gray-800 inline-block svg-icon '>
							<BackwardIcon />
						</span>
					</div>
				</Button>
				<Button title={AccesibilityNames.previous} onClick={handlePrevPageClick} disabled={currentPage <= 0} className={currentPage === 1 ? 'cursor-not-allowed' : ''}>
					<div className='px-1.5 mx-1 my-1'>
						<span className='w-2 h-2 text-gray-800 inline-block svg-icon '>
							<AngleLeftIcon />
						</span>
					</div>
				</Button>
				<div className='flex items-center my-1 flex-wrap'>{renderPageNumbers()}</div>
				<Button title={AccesibilityNames.next} onClick={handleNextPageClick} disabled={currentPage === totalPages} className={currentPage === totalPages ? 'cursor-not-allowed' : ''}>
					<div className='px-1.5 mx-1 my-1'>
						<span className='w-2 h-2 text-gray-800 inline-block svg-icon '>
							<AngleRightIcon />
						</span>
					</div>
				</Button>
				<Button title={AccesibilityNames.gotoEnd} onClick={handleLastPageClick} disabled={currentPage === totalPages} className={currentPage === totalPages ? 'cursor-not-allowed' : ''}>
					<div className='px-1.5 mx-1 my-1'>
						<span className='w-2 h-2 text-gray-800 inline-block svg-icon'>
							<ForwordIcon />
						</span>
					</div>
				</Button>
			</div>
		</div>
	);
};

export default Pagination;
