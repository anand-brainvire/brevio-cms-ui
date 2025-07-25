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
  GET_RECENTLY_ADDED_BOOKS,
} from '@framework/graphql/queries/dashboard';
import { AuthorStatItem, BookStats, CategoryStats } from '@type/dashboard';
import BarChartCard from './charts';
import { toast } from 'react-toastify';
import mobileClient from '@framework/graphql/apolloMobileClient';
import { Loader } from '@components/index';
import List from './list';
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
  const [freeBooks, setFreeBooks] = React.useState<AuthorStatItem[]>([]);
  const [recentlyAddedBooks, setRecentlyAddedBooks] = React.useState<
    AuthorStatItem[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookRes, categoryRes, authorRes, freeBooks, recentlyAddedBook] =
          await Promise.allSettled([
            bookStats(),
            fetchCategoryStats(),
            fetchAuthorStats(),
            mobileClient.query({
              query: GET_FREE_BOOKS,
            }),
            mobileClient.query({
              query: GET_RECENTLY_ADDED_BOOKS,
              variables: {
                input: {
                  limit: 10,
                },
              },
            }),
          ]);

        if (bookRes.status === 'fulfilled') {
          const bookStatsData = bookRes.value?.data?.getBookStats?.data;
          if (bookStatsData) {
            setBookData(bookStatsData);
          }
        }

        if (categoryRes.status === 'fulfilled') {
          const categoryStatsData =
            categoryRes.value?.data?.getCategoryStats?.data;
          if (categoryStatsData) {
            setCategoryData(categoryStatsData);
          }
        }

        if (authorRes.status === 'fulfilled') {
          const authorStatsData = authorRes.value?.data?.getAuthorStats?.data;
          if (authorStatsData) {
            setAuthorData(authorStatsData);
          }
        }

        if (freeBooks.status === 'fulfilled') {
          const freeBooksData = freeBooks.value?.data?.findFreeBooks?.books;
          if (freeBooksData) {
            setFreeBooks(freeBooksData);
          }
        }

        if (recentlyAddedBook.status === 'fulfilled') {
          const recentlyAddedBooksData =
            recentlyAddedBook.value?.data?.exploreBooks?.books;
          if (recentlyAddedBooksData) {
            setRecentlyAddedBooks(recentlyAddedBooksData);
          }
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
      <div className='mt-6 grid grid-cols-1 md:grid-cols-1 gap-4 mb-4'>
        <BarChartCard
          title='Top 10 Best Seller Books'
          data={bookData.bestSellerBooks}
          xKey='title'
          yKey='read_count'
          yLabel='Read Count'
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-1 gap-4 mb-4'>
        <BarChartCard
          title='Top 10 Popular Books'
          data={bookData.topPopularBooks}
          xKey='title'
          yKey='read_count'
          yLabel='Read Count'
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-1 gap-4 mb-4'>
        <BarChartCard
          title='Most Read Categories'
          data={categoryData.topReadCategories}
          xKey='name'
          yKey='read_count'
          yLabel='Read Count'
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-1 gap-4 mb-4'>
        <BarChartCard
          title='Top 10 Best Seller Authors'
          data={authorData}
          xKey='name'
          yKey='read_count'
          yLabel='Read Count'
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-1 gap-4 mb-4'>
        <BarChartCard
          title='Categoriy wise No. of Books Published'
          data={categoryData.categoryBooks}
          xKey='name'
          yKey='total_books'
          yLabel='Total Books'
          responsive={true}
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 item-start'>
        <div>
          <List
            books={freeBooks}
            fieldsToDisplay={['title', 'categories']}
            title='List of Free Books'
          />
        </div>
        <div>
          <List
            books={recentlyAddedBooks}
            fieldsToDisplay={['title', 'categories', 'publishedDate']}
            title='List of Recently Added Books'
          />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
