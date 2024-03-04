import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async (pageParam: number) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          // for pagination
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );

    const res = await fetch(url);
    return res.json();
  };

  // this is tanstack-query V5 approch
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: ({ pageParam }) => fetchMessages(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      // use polling if web socket failed to connect

      // refetchInterval: isConnected ? false : 1000,
      refetchInterval: 1000,
      maxPages: 10,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
