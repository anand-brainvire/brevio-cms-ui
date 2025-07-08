import React from 'react';
import moment from 'moment';

interface Book {
  title?: string;
  categories?: { name: string }[];
  publishedDate?: string | number;
  [key: string]: any;
}

interface BookListTableProps {
  books: Book[];
  fieldsToDisplay: Array<'title' | 'categories' | 'publishedDate'>;
  title: string;
}

const getFormattedValue = (book: Book, field: string): string => {
  switch (field) {
    case 'title':
      return book.title || '-';

    case 'categories':
      return book.categories?.map((cat) => cat.name).join(', ') || '-';

    case 'publishedDate':
      return book.publishedDate
        ? moment(Number(book.publishedDate)).format('DD MMM YYYY')
        : '-';

    default:
      return '-';
  }
};

const getFieldLabel = (field: string) => {
  switch (field) {
    case 'title':
      return 'Book Name';
    case 'categories':
      return 'Categories';
    case 'publishedDate':
      return 'Published Date';
    default:
      return field;
  }
};

const List: React.FC<BookListTableProps> = ({
  books,
  fieldsToDisplay,
  title,
}) => {
  return (
    <div className='flex flex-col bg-white rounded-lg shadow-md h-full'>
      <div className='px-4 py-3 border-b'>
        <h5 className='text-md font-semibold text-left'>{title}</h5>
      </div>

      <div className='overflow-y-auto max-h-[400px]'>
        <ul className='divide-y'>
          {/* Header row */}
          <li className='flex px-4 py-2 bg-gray-100 font-semibold text-sm text-gray-700 sticky top-0'>
            {fieldsToDisplay.map((field) => (
              <div
                key={field}
                className='flex-1 pr-4'
              >
                {getFieldLabel(field)}
              </div>
            ))}
          </li>

          {/* Data rows */}
          {books.length > 0 ? (
            books.map((book, idx) => (
              <li
                key={idx}
                className='flex px-4 py-2 text-sm text-gray-800 hover:bg-gray-50'
              >
                {fieldsToDisplay.map((field) => (
                  <div
                    key={field}
                    className='flex-1 pr-4'
                  >
                    {getFormattedValue(book, field)}
                  </div>
                ))}
              </li>
            ))
          ) : (
            <li className='px-4 py-4 text-center text-gray-500'>
              No books found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default List;
