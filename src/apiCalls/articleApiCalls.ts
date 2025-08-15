import { Article } from "@prisma/client";
import { SingleArticle } from "@/utils/types";

// get articles by page number
export const getArticles = async (
  pageNumber: string | undefined
): Promise<Article[]> => {
  const response = await fetch(
    `http://localhost:3000/api/articles?pageNumber=${pageNumber}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }
  return response.json();
};

// get articles by page number (no use in this project)
// export const getArticlesCount = async () => {
//   const response = await fetch(`http://localhost:3000/api/articles/count`, {
//     cache: "no-store",
//   });

//   if (!response.ok) {
//     throw new Error("Failed to get articles count");
//   }

//   const { count } = await response.json();

//   return count;
// };

// get articles by id
export const getSingleArticle = async (id: string): Promise<SingleArticle> => {
  const response = await fetch(`http://localhost:3000/api/articles/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to get article");
  }

  return response.json();
};

// get articles by search text
export const getArticlesBySearchText = async (
  searchText: string
): Promise<Article[]> => {
  const response = await fetch(
    `http://localhost:3000/api/articles/search?searchText=${searchText}`
  );

  if (!response.ok) {
    throw new Error("Failed to get articles");
  }

  return await response.json();
};
