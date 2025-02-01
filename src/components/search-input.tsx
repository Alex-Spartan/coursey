"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import queryString from "query-string";

const SearchInput = () => {
  const [searchValue, setSearchValue] = useState("");
  const debounceValue = useDebounce(searchValue);

  const router = useRouter();
  const pathName = usePathname();
  const searchParam = useSearchParams();

  const categoryId = searchParam.get("categoryId");

  useEffect(() => {
    const url = queryString.stringifyUrl({
      url: pathName,
      query: {
        title: debounceValue,
        categoryId: categoryId,
      },
    });
    router.push(url);
  }, [debounceValue, categoryId]);
  return (
    <div className="relative">
      <Suspense fallback={<div>Loading...</div>}>
        <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
        <Input
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search for courses"
          className="w-full md:w-[300px] pl-9 rounded-full bg-slate-200 focus-visible:ring-slate-200 "
        />
      </Suspense>
    </div>
  );
};

export default SearchInput;
