import Link from "next/link";

interface PaginationProps {
  pagesCount: number;
  pageNumber: number;
  route: string;
}
const Pagination = ({ pagesCount, pageNumber, route }: PaginationProps) => {
  const pagesArray = Array.from({ length: pagesCount }, (_, i) => i + 1);
  const paginationItemClasses = `border border-gray-700 text-gray-700 py-1 px-3 font-bold text-xl cursor-pointer hover:bg-gray-200 transition`;
  return (
    <div className="flex items-center justify-center mt-2 mb-10">
      {pageNumber !== 1 && (
        <Link
          href={`${route}?pageNumber=${pageNumber - 1}`}
          className={paginationItemClasses}
        >
          Prev
        </Link>
      )}
      {pagesArray.map((page) => (
        <Link
          key={page}
          href={`${route}?pageNumber=${page}`}
          className={`${
            pageNumber === page ? "bg-purple-200" : ""
          } ${paginationItemClasses}`}
        >
          {page}
        </Link>
      ))}
      {pageNumber !== pagesCount && (
        <Link
          href={`${route}?pageNumber=${pageNumber + 1}`}
          className={paginationItemClasses}
        >
          Next
        </Link>
      )}
    </div>
  );
};

export default Pagination;
