"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Button } from "./ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Edit, Trash2, Plus, Calendar, Image as ImageIcon, Loader2, Eye } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { toast } from "../hooks/use-toast"
import { useNavigate } from "react-router"
import { getInvestorNews, deleteInvestorNews } from "../lib/api"
import { useLanguage } from "../contexts/language-context"
import { usePagination } from "../hooks/use-pagination"
import { Pagination } from "./ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

// Types
interface InvestorNews {
  _id: string
  id?: string
  title: string
  shortDescription: string
  content: string
  image: string
  createdAt: string
}

export default function InvestorNewsList() {
  const [news, setNews] = useState<InvestorNews[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [viewItem, setViewItem] = useState<InvestorNews | null>(null)
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { currentPage, itemsPerPage, handlePageChange } = usePagination(10)

  // Fetch investor news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getInvestorNews(currentPage, itemsPerPage)
        const investorNews = response.investorNews || []
        // Map to add id for compatibility
        const mappedNews = investorNews.map((item: any) => ({
          ...item,
          id: item._id,
        }))
        setNews(mappedNews)
        setTotalPages(response.totalPages || 1)
        setTotalCount(response.totalCount || 0)
      } catch (err: any) {
        console.error("Error fetching investor news:", err)
        setError(err.message || "Failed to fetch investor news")
        toast({
          title: "Error",
          description: "Failed to load investor news. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [currentPage, itemsPerPage])

  const handleDelete = async (id: string) => {
    try {
      await deleteInvestorNews(id)
      // Refetch data to update pagination
      const response = await getInvestorNews(currentPage, itemsPerPage)
      const investorNews = response.investorNews || []
      const mappedNews = investorNews.map((item: any) => ({
        ...item,
        id: item._id,
      }))
      setNews(mappedNews)
      setTotalPages(response.totalPages || 1)
      setTotalCount(response.totalCount || 0)
      setDeleteId(null)
      toast({
        title: t("investors.deleted"),
        description: t("investors.deleted"),
      })
    } catch (err: any) {
      console.error("Error deleting investor news:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to delete investor news",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (id: string) => {
    const newsId = news.find(item => item._id === id || item.id === id)?._id || id
    navigate(`/investorsnews/edit/${newsId}`)
  }

  const handleAddNew = () => {
    navigate("/investorsnews/create")
  }

  return (
    <DashboardLayout>
      <div className="w-full bg-background min-h-screen">
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-full overflow-x-hidden">

          {/* Header + Add Button */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("investors.title")}</h1>
              <p className="text-muted-foreground mt-1">
                {t("investors.manage")}
              </p>
            </div>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("investors.addNew")}
            </Button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-4">Loading investor news...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm text-red-600">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg text-muted-foreground">{t("investors.noNews")}</p>
              <p className="text-sm text-muted-foreground">
                {t("investors.createFirst")}
              </p>
            </div>
          ) : (
            <div className="w-full max-w-full overflow-x-auto">
              <div className="rounded-lg border border-border overflow-hidden shadow-sm min-w-full">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden lg:table-cell">Description</TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Published
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {news.map((item) => {
                    const itemId = item._id || item.id || ""
                    return (
                    <TableRow key={itemId}>
                      {/* Image */}
                      <TableCell>
                        <div className="w-12 h-12 rounded overflow-hidden border">
                          <img
                            src={item.image?.startsWith('http') ? item.image : `${process.env.REACT_APP_API_URL || "https://service.mwalimubank.co.tz"}/${item.image}`}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/48"
                            }}
                          />
                        </div>
                      </TableCell>

                      {/* Title */}
                      <TableCell className="font-medium">
                        <div className="max-w-[200px] sm:max-w-xs">
                          <button
                            onClick={() => setViewItem(item)}
                            className="text-left hover:text-primary transition-colors"
                          >
                            <p className="truncate">{item.title}</p>
                          </button>
                        </div>
                      </TableCell>

                      {/* Description (lg+) */}
                      <TableCell className="hidden lg:table-cell">
                        <button
                          onClick={() => setViewItem(item)}
                          className="text-left hover:text-primary transition-colors w-full"
                        >
                          <p className="text-sm text-muted-foreground max-w-md truncate">
                            {item.shortDescription}
                          </p>
                        </button>
                      </TableCell>

                      {/* Published Date */}
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setViewItem(item)}
                            className="h-8 w-8"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(itemId)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setDeleteId(itemId)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Investor News?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "
                                  <span className="font-medium">{item.title}</span>
                                  ". This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeleteId(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(deleteId!)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {t("table.showing")} {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} {t("table.of")} {totalCount} {t("table.results")}
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
              </div>
            </div>
          )}

          {/* View Details Dialog */}
          <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{viewItem?.title}</DialogTitle>
                <DialogDescription>
                  Published: {viewItem?.createdAt ? new Date(viewItem.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) : "N/A"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {viewItem?.image && (
                  <div className="w-full h-48 rounded-lg overflow-hidden border">
                    <img
                      src={viewItem.image?.startsWith('http') ? viewItem.image : `${process.env.REACT_APP_API_URL || "https://service.mwalimubank.co.tz"}/${viewItem.image}`}
                      alt={viewItem.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200"
                      }}
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-semibold mb-2">Short Description</h4>
                  <p className="text-sm text-muted-foreground">{viewItem?.shortDescription}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Content</h4>
                  <div 
                    className="text-sm text-muted-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: viewItem?.content || "" }}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DashboardLayout>
  )
}