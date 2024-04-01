import { JobItem, PageDirection, SortBy } from "../lib/types";
import JobList from "./JobList";
import PaginationControls from "./PaginationControls";
import ResultsCount from "./ResultsCount";
import SortingControls from "./SortingControls";

type SidebarProps = {
  jobItems: JobItem[];
  isLoading: boolean;
  totalNumberOfResults: number;
  handleChangePage: (direction: PageDirection) => void;
  currentPage: number;
  totalNumberOfPages: number;
  handleChangeSortBy: (newSortBy: SortBy) => void;
  sortBy: SortBy;
};

export default function Sidebar({
  jobItems,
  isLoading,
  totalNumberOfResults,
  handleChangePage,
  currentPage,
  totalNumberOfPages,
  handleChangeSortBy,
  sortBy
}: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="sidebar__top">
        <ResultsCount totalNumberOfResults={totalNumberOfResults} />
        <SortingControls onClick={handleChangeSortBy} sortBy={sortBy} />
      </div>

      <JobList jobItems={jobItems} isLoading={isLoading} />

      <PaginationControls
        currentPage={currentPage}
        onClick={handleChangePage}
        totalNumberOfPages={totalNumberOfPages}
      />
    </div>
  );
}
