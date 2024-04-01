import { JobItem, PageDirection, SortBy } from "../lib/types";
import JobItemContent from "./JobItemContent";
import Sidebar from "./Sidebar";

type ContainerProps = {
  jobItems: JobItem[];
  isLoading: boolean;
  // jobItem: JobItemExpanded | null;
  totalNumberOfResults: number;
  handleChangePage: (direction: PageDirection) => void;
  currentPage: number;
  totalNumberOfPages: number;
  handleChangeSortBy: (newSortBy: SortBy) => void;
  sortBy: SortBy;
};

export default function Container({
  jobItems,
  isLoading,
  totalNumberOfResults,
  handleChangePage,
  currentPage,
  totalNumberOfPages,
  handleChangeSortBy,
  sortBy
}: ContainerProps) {
  return (
    <div className="container">
      <Sidebar
        jobItems={jobItems}
        isLoading={isLoading}
        totalNumberOfResults={totalNumberOfResults}
        handleChangePage={handleChangePage}
        currentPage={currentPage}
        totalNumberOfPages={totalNumberOfPages}
        handleChangeSortBy={handleChangeSortBy}
        sortBy={sortBy}
      />
      <JobItemContent />
    </div>
  );
}
