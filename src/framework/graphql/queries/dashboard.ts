import { gql } from '@apollo/client';
import { META_FRAGMENT } from '../fragments';


export const GET_BOOK_STATS = gql`
	${META_FRAGMENT}
	query GetBookStats {
  getBookStats {
    data {
      draftBookCount
      publishedBookCount
      unpublishedBookCount
      totalBooks
      bestSellerBooks {
        book_id
        title
        read_count
      }
      topPopularBooks {
        book_id
        title
        read_count
      }
    }
    meta {
        ...MetaFragment
    }
  }
}
`;

export const GET_CATEGORY_STATS = gql`
${META_FRAGMENT}
query GetCategoryStats {
  getCategoryStats {
    data {
      topReadCategories {
        category_uuid
        name
        read_count
      }
      categoryBooks {
        category_uuid
        name
        total_books
      }
    }
    meta {
        ...MetaFragment
    }
  }
}
`;

export const GET_AUTHOR_STATS = gql`
${META_FRAGMENT}
query GetAuthorStats {
  getAuthorStats {
    data {
      author_uuid
      name
      read_count
    }
    meta {
        ...MetaFragment
    }
  }
}
`;

export const GET_FREE_BOOKS = gql`
${META_FRAGMENT}
query FindFreeBooks {
  findFreeBooks {
    total
    books {
      book_uuid
      book_version_uuid
      version_number
      slug
      status
      cover_image_url
      total_pages
      duration_in_seconds
      total_insights
      labels
      publishedDate
      title
      subtitle
      about_book
      about_authors
      authors {
        uuid
        name
      }
      categories {
        uuid
        name
        slug
        description
      }
      current_page
      learning_points
      author_names
    }
    meta {
        ...MetaFragment
    }
  }
}
`;

export const GET_RECENTLY_ADDED_BOOKS = gql`
  ${META_FRAGMENT}
query ExploreBooks($input: ExploreBooksInput!) {
  exploreBooks(input: $input) {
    total
    books {
      book_uuid
      book_version_uuid
      version_number
      slug
      status
      cover_image_url
      total_pages
      duration_in_seconds
      total_insights
      labels
      publishedDate
      title
      subtitle
      about_book
      about_authors
      authors {
        uuid
        name
      }
      categories {
        uuid
        name
        slug
        description
      }
      current_page
      learning_points
      author_names
    }
    meta {
        ...MetaFragment
    }
  }
}
`;