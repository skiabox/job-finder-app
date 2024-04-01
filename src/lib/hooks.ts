import { useState, useEffect, useContext } from "react";
import { JobItem, JobItemExpanded } from "./types";
import { BASE_API_URL } from "./constants";
import { useQueries, useQuery } from "@tanstack/react-query";
import { handleError } from "./utils";
import { BookmarksContext } from "../contexts/BookmarksContextProvider";

// export const useJobItem = (id: number | null) => {
//   //job item details
//   const [jobItem, setJobItem] = useState<JobItemExpanded | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     //if active id is still null, don't do anything, just return
//     if (!id) return;

//     //async function fetchData declaration
//     const fetchData = async () => {
//       setIsLoading(true);
//       const response = await fetch(`${BASE_API_URL}/${id}`);
//       const data = await response.json();
//       setIsLoading(false);
//       // console.log(data);
//       setJobItem(data.jobItem);
//     };

//     //call the async function fetchData
//     fetchData();
//   }, [id]);

//   return { jobItem, isLoading } as const;
// };

type JobItemApiResponse = {
  public: boolean;
  jobItem: JobItemExpanded;
};

type JobItemsApiResponse = {
  public: boolean;
  sorted: boolean;
  jobItems: JobItem[];
};

//helper functions
const fetchJobItem = async (id: number): Promise<JobItemApiResponse> => {
  try {
    const response = await fetch(`${BASE_API_URL}/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description);
    }
    const data = await response.json();
    console.log("Inside fetchJobItem, data:", data);
    return data;
  } catch (error: unknown) {
    handleError(error);
    throw error;
  }
};

const fetchJobItems = async (
  searchText: string
): Promise<JobItemsApiResponse> => {
  try {
    const response = await fetch(`${BASE_API_URL}?search=${searchText}`);
    // 4xx or 5xx
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description);
    }
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    handleError(error);
    throw error;
  }
};

export const useJobItem = (id: number | null) => {
  const { data, isLoading } = useQuery({
    queryKey: ["job-item", id],
    queryFn: () => (id ? fetchJobItem(id) : null),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: Boolean(id)
  });

  //we need to return an object with jobItem first because we are destructuring it in the JobItemContent component
  // const jobItem = data?.jobItem;
  return { jobItem: data?.jobItem, isLoading } as const;
};

// ------------------------------------------------------------------------------------

export const useJobItems = (ids: number[]) => {
  const results = useQueries({
    queries: ids.map(id => ({
      queryKey: ["job-item", id],
      queryFn: () => fetchJobItem(id),
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(id)
    }))
  });

  // console.log(results);

  //the question mark prevents application from crashing if the data is undefined
  //so we should also filter out possible undefined values
  //cast here, a rare moment when we know better than TypeScript
  //without casting the type was (JobItemExpanded | undefined)[]
  const jobItems = results
    .map(result => result.data?.jobItem)
    .filter(jobItem => jobItem !== undefined) as JobItemExpanded[];

  // console.log(
  //   "Inside useJobItems hook, jobItems after removing undefined items: ",
  //   jobItems
  // );
  const isLoading = results.some(result => result.isLoading);

  return {
    jobItems,
    isLoading
  };
};

// ------------------------------------------------------------------------------------
export const useSearchQuery = (searchText: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["jobItems", searchText],
    queryFn: () => fetchJobItems(searchText),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: Boolean(searchText)
  });

  // const jobItems = data?.jobItems;

  return { jobItems: data?.jobItems, isLoading } as const;
};

// ------------------------------------------------------------------------------------

export const useDebounce = <T>(value: T, delay = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  //useEffect for debouncing the search text
  //whenever the searchText changes, we set the debouncedSearchText after 1000ms
  //this way we don't make a request for every letter the user types
  //we only make a request after the user stops typing for 1000ms
  //this is called debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useActiveId = () => {
  const [activeId, setActiveId] = useState<number | null>(null);

  // console.log(window.location.hash.slice(1));
  // listen to the event of the hash change
  useEffect(() => {
    const handleHashChange = () => {
      //whatever we get from the url is always a string
      //so we need to convert it to a number with a plus before the window.location.hash.slice(1)
      const id = +window.location.hash.slice(1);
      setActiveId(id);
    };
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  //return only one value, the activeId
  return activeId;
};

//generic local storage hook
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  //when setting the initial state with an arrow function, it only runs once
  const [value, setValue] = useState(() =>
    JSON.parse(localStorage.getItem(key) || JSON.stringify(initialValue))
  );

  //save to local storage
  //it needs the data to be in json format
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  //order matters
  return [value, setValue] as const;
};

// ------------------------------------------------------------------------------------

export const useBookmarksContext = () => {
  const context = useContext(BookmarksContext);

  if (!context) {
    throw new Error(
      "useContext(BookmarksContext) must be used within a BookmarksContextProvider"
    );
  }

  return context;
};
