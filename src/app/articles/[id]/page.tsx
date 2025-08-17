import { getSingleArticle } from "@/apiCalls/articleApiCalls";
import AddCommentForm from "@/components/application/comments/AddCommentForm";
import CommentItem from "@/components/application/comments/CommentItem";
import { verifyTokenForPage } from "@/utils/token";
import { SingleArticle } from "@/utils/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface SingleArticlePageProps {
  params: Promise<{ id: string }>;
}

const SingleArticlePage = async ({ params }: SingleArticlePageProps) => {
  const token = await verifyTokenForPage(
    (await cookies()).get("token")?.value || ""
  );

  const article: SingleArticle = await getSingleArticle((await params).id);

  if (!article) return redirect("/not-found");

  return (
    <section className="fix-height container m-auto w-full px-5 pt-8 md:w-3/4">
      <div className="bg-white p-7 rounded-lg mb-7">
        <h1 className="text-3xl font-bold text-gray-700 mb-2">
          {article.title}
        </h1>
        <div className="text-gray-400">
          {new Date(article.createdAt).toDateString()}
        </div>
        <p className="text-gray-800 text-xl mt-5">{article.description}</p>
      </div>
      <div className="mt-7">
        {token ? (
          <AddCommentForm articleId={article.id} />
        ) : (
          <p className="text-blue-600 md:text-xl">
            to write a comment you should log in first
          </p>
        )}
      </div>
      <h4 className="text-xl text-gray-800 ps-1 font-semibold mb-2 mt-7">
        Comments
      </h4>
      {article.comments.length > 0 ? (
        article.comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} userId={token?.id} />
        ))
      ) : (
        <p className="text-gray-500">No comments</p>
      )}
    </section>
  );
};

export default SingleArticlePage;
