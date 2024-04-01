import { useState } from "react";
import Background from "./Background";
import Container from "./Container";
import Footer from "./Footer";
import Header from "./Header";
import { useDebounce, useSearchQuery } from "../lib/hooks";
import { Toaster } from "react-hot-toast";
import { RESULTS_PER_PAGE } from "../lib/constants";
import { PageDirection, SortBy } from "../lib/types";

function App() {
  // state
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 250);
  //for the custom hook we have the same rules
  //if the state used in the custom hook changes this component re-renders
  //if we return an array from the custom hook we can destructure it too and use other names
  const { jobItems, isLoading } = useSearchQuery(debouncedSearchText);
  const [currentPage, setCurrentPage] = useState(1);
  // console.log(currentPage);
  const [sortBy, setSortBy] = useState<SortBy>("relevant");

  //derived state from pure hook useJobItems
  const totalNumberOfResults = jobItems?.length || 0; //the second part is executed if the first part is falsy
  const totalNumberOfPages = totalNumberOfResults / RESULTS_PER_PAGE;
  const jobItemsSorted = [...(jobItems || [])].sort((a, b) => {
    if (sortBy === "relevant") {
      return (b.relevanceScore = a.relevanceScore);
    } else {
      return a.daysAgo - b.daysAgo;
    }
  });
  const jobItemsSortedAndSliced = jobItemsSorted.slice(
    currentPage * RESULTS_PER_PAGE - RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  //event handlers / actions

  const handleChangePage = (direction: PageDirection) => {
    if (direction === "next") {
      setCurrentPage(prev => prev + 1);
    } else if (direction === "previous") {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleChangeSortBy = (newSortBy: SortBy) => {
    setCurrentPage(1);
    setSortBy(newSortBy);
  };

  return (
    <>
      <Background />

      <Header searchText={searchText} setSearchText={setSearchText} />

      <Container
        jobItems={jobItemsSortedAndSliced}
        isLoading={isLoading}
        totalNumberOfResults={totalNumberOfResults}
        handleChangePage={handleChangePage}
        currentPage={currentPage}
        totalNumberOfPages={totalNumberOfPages}
        handleChangeSortBy={handleChangeSortBy}
        sortBy={sortBy}
      />

      <Footer />

      <Toaster position="top-right" />
    </>
  );
}

export default App;
