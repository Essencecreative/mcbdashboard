import { useState, useEffect } from "react"

export const usePagination = (defaultItemsPerPage: number = 10) => {
  const [itemsPerPage, setItemsPerPage] = useState<number>(defaultItemsPerPage)
  const [currentPage, setCurrentPage] = useState<number>(1)

  useEffect(() => {
    // Load items per page from settings
    const savedSettings = localStorage.getItem("dashboardSettings")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        if (settings.itemsPerPage) {
          setItemsPerPage(Number(settings.itemsPerPage))
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
      }
    }
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const resetPagination = () => {
    setCurrentPage(1)
  }

  return {
    currentPage,
    itemsPerPage,
    handlePageChange,
    resetPagination,
  }
}

