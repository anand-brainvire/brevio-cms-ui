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

export type BookStatItem = {
  __typename: 'BookStatItem';
  book_id: number;
  title: string;
  read_count: number;
}

export type BookStats = {
  __typename: 'BookStats';
  draftBookCount: number;
  publishedBookCount: number;
  unpublishedBookCount: number;
  totalBooks: number;
  bestSellerBooks: BookStatItem[];
  topPopularBooks: BookStatItem[];
}

export type CategoryReadStat = {
  __typename: 'CategoryReadStat';
  category_uuid: string;
  name: string;
  read_count: number;
}

export type CategoryBookStat = {
  __typename: 'CategoryBookStat';
  category_uuid: string;
  name: string;
  total_books: number;
}

export type CategoryStats = {
  __typename: 'CategoryStats';
  topReadCategories: CategoryReadStat[];
  categoryBooks: CategoryBookStat[];
}

export type AuthorStatItem = {
  __typename: 'AuthorStatItem';
  author_uuid: string;
  name: string;
  read_count: number;
}


