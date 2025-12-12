import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { eventService } from "../services/eventService";
import { Event, PageResponse } from "../types/event";

const PAGE_SIZE = 20;

export function useInfiniteEvents() {
  return useInfiniteQuery<PageResponse<Event>, Error, InfiniteData<PageResponse<Event>>, ["events"], number>({
    queryKey: ["events"] as const,
    queryFn: ({ pageParam = 0 }) => eventService.list(pageParam, PAGE_SIZE),
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    initialPageParam: 0,
  });
}
