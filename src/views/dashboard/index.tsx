import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';
import {
  BestSellerIcon,
  DraftBookIcon,
  PopularBookIcon,
  PublishedBookIcon,
  TotalBooksIcon,
} from '@components/icons/icons';
import TopCard from './topCards';
import { useQuery } from '@apollo/client';
import {
  GET_AUTHOR_STATS,
  GET_BOOK_STATS,
  GET_CATEGORY_STATS,
  GET_FREE_BOOKS,
} from '@framework/graphql/queries/dashboard';
import { AuthorStatItem, BookStats, CategoryStats } from '@type/dashboard';
import BarChartCard from './charts';
import { toast } from 'react-toastify';
import mobileClient from '@framework/graphql/apolloMobileClient';
import { Loader } from '@components/index';
const Dashboard = () => {
  const { refetch: bookStats, loading: bookStateLoader } = useQuery(
    GET_BOOK_STATS,
    {
      fetchPolicy: 'network-only',
    }
  );
  const { refetch: fetchCategoryStats, loading: categoryStateLoader } =
    useQuery(GET_CATEGORY_STATS, {
      fetchPolicy: 'network-only',
      skip: true, // prevents it from running immediately
    });

  const { refetch: fetchAuthorStats, loading: authorStateLoader } = useQuery(
    GET_AUTHOR_STATS,
    {
      fetchPolicy: 'network-only',
      skip: true, // prevents it from running immediately
    }
  );
  const { t } = useTranslation();
  const [bookData, setBookData] = React.useState<BookStats>({} as BookStats);
  const [categoryData, setCategoryData] = React.useState<CategoryStats>(
    {} as CategoryStats
  );
  const [authorData, setAuthorData] = React.useState<AuthorStatItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookRes, categoryRes, authorRes] = await Promise.all([
          bookStats(),
          fetchCategoryStats(),
          fetchAuthorStats(),

          mobileClient.query({
            query: GET_FREE_BOOKS,
          }),
        ]);
        const bookStatsData = bookRes?.data?.getBookStats?.data;
        const categoryStatsData = categoryRes?.data?.getCategoryStats?.data;
        const authorStatsData = authorRes?.data?.getAuthorStats?.data;
        if (bookStatsData) {
          setBookData(bookStatsData);
        }

        if (categoryStatsData) {
          setCategoryData(categoryStatsData);
        }

        if (authorStatsData) {
          setAuthorData(authorStatsData);
        }
      } catch {
        toast.error(t('Something went wrong while fetching data'));
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {(bookStateLoader || categoryStateLoader || authorStateLoader) && (
        <Loader />
      )}
      {/* 🟦 Horizontal row of cards */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full'>
        <TopCard
          label='Total Books'
          value={bookData.totalBooks}
          icon={<TotalBooksIcon />}
        />
        <TopCard
          label='Total Books in Draft'
          value={bookData.draftBookCount}
          icon={<DraftBookIcon />}
        />
        <TopCard
          label='Total Published Books'
          value={bookData.publishedBookCount}
          icon={<PublishedBookIcon />}
        />
        <TopCard
          label='Total Best Seller Book'
          value={bookData?.bestSellerBooks?.length}
          icon={<BestSellerIcon />}
        />
        <TopCard
          label='Total Popular Books'
          value={bookData?.topPopularBooks?.length}
          icon={<PopularBookIcon />}
        />
      </div>
      <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        <BarChartCard
          title='Top 10 Popular Books'
          data={bookData.topPopularBooks}
          xKey='title'
          yKey='read_count'
        />
        <BarChartCard
          title='Top 10 Best Seller Books'
          data={bookData.bestSellerBooks}
          xKey='title'
          yKey='read_count'
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        <BarChartCard
          title='Most Read Categories'
          data={categoryData.topReadCategories}
          xKey='name'
          yKey='read_count'
        />
        <BarChartCard
          title='Categoriy wise No. of Books Published'
          data={categoryData.categoryBooks}
          xKey='name'
          yKey='total_books'
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        <BarChartCard
          title='Top 10 Best Seller Authors'
          data={authorData}
          xKey='name'
          yKey='read_count'
        />
      </div>
    </div>
  );
};
export default Dashboard;
