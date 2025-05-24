import { useDebounce } from "use-debounce"
import { useMemo } from "react"
import { searchWithFuse } from "@/utils"

export const useSearchList = <T>({
  searchTerm,
  list,
  keys = ["name"],
}: {
  searchTerm: string
  list?: T[]
  keys?: string[]
}) => {
  const [debounceSearch] = useDebounce(searchTerm, 1000)

  return useMemo(() => {
    return !debounceSearch
      ? list
      : searchWithFuse({ data: list, query: searchTerm, keys })
  }, [debounceSearch, keys, list])
}
