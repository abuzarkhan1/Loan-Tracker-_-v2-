import { useState } from "react";

export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const goToPage = (targetPage: number) => setPage(targetPage);

  return {
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    goToPage,
  };
};

export default usePagination;
