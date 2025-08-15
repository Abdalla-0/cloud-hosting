"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const SearchArticleInput = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchText.trim() === "") return toast.error("Please write something");

    router.push(`/articles/search?searchText=${searchText}`);
  };

  return (
    <form
      onSubmit={formSubmitHandler}
      className="bg-white my-5 w-full md:w-2/3 m-auto"
    >
      <input
        className="w-full p-3 rounded text-xl border-none text-gray-900"
        type="search"
        placeholder="Search for article"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </form>
  );
};

export default SearchArticleInput;
