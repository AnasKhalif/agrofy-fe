export interface Article {
  id: number;
  user_id: number;
  title: string;
  slug: string | null;
  category: string | null;
  excerpt: string | null;
  body: string;
  image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ArticleListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  published?: boolean;
}

export interface CreateArticleRequest {
  title: string;
  slug?: string;
  category?: string;
  excerpt?: string;
  body: string;
  image?: string | null;
  published?: boolean;
}

export type UpdateArticleRequest = Partial<CreateArticleRequest>;
