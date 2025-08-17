import AddArticleForm from "./AddArticleForm";

const AdminPage = async () => {
  return (
    <div className="flex items-center justify-center px-5 lg:px-20 mt-5">
      <div className="shadow p-4 bg-purple-200 rounded w-full">
        <h2 className="text-xl lg:text-2xl text-gray-700 font-semibold mb-4">
          Add New Article
        </h2>
        <AddArticleForm />
      </div>
    </div>
  );
};

export default AdminPage;
