"use client"

import { useEffect, useState, useRef } from "react"
import type { ApiResponse } from "@/lib/api-client"

interface UseApiOptions {
  autoFetch?: boolean
}

export function useApi<T>(
  fetchFn: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = { autoFetch: true },
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)

  const fetch = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      if (result.error) {
        console.log("[API Hook] Error (using fallback if available):", result.error)
        // Even if there's an error, we might have fallback data
        if (result.data) {
          setData(result.data)
          setError(null) // Don't show error if we have fallback data
        } else {
          setError(result.error)
          setData(null)
        }
      } else {
        setData(result.data || null)
        setError(null)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      console.error("[API Hook] Exception:", errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only fetch once on mount if autoFetch is enabled
    if (options.autoFetch && !hasFetched.current) {
      hasFetched.current = true
      fetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - only run on mount

  return { data, loading, error, refetch: fetch }
}
