import { getArticles } from "@/apiCalls/articleApiCalls";
import ArticleCard from "@/components/application/articles/ArticleItem";
import Pagination from "@/components/application/articles/Pagination";
import SearchArticleInput from "@/components/application/articles/SearchArticleInput";
import { Article } from "@prisma/client";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { Metadata } from "next";
import { prisma } from "@/utils/db";

interface ArticlesPageProps {
  searchParams: Promise<{ pageNumber: string }>;
}

const ArticlesPage = async ({ searchParams }: ArticlesPageProps) => {
  const pageNumber = (await searchParams).pageNumber || "1";
  const count = await prisma.article.count();
  const pages = Math.ceil(count / ARTICLE_PER_PAGE);
  const articles: Article[] = await getArticles(pageNumber);
  return (
    <section className="container fix-height px-5">
      <SearchArticleInput />
      <h1 className="text-3xl font-bold text-gray-800 mb-5 text-center">
        Articles
      </h1>
      <div className="flex items-stretch justify-center flex-wrap gap-7">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      <Pagination
        pagesCount={pages}
        pageNumber={Number(pageNumber)}
        route={"/articles"}
      />
    </section>
  );
};

export default ArticlesPage;

export const metadata: Metadata = {
  title: "Articles Page",
  description: "Articles about programming",
};
