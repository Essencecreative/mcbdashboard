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
import { Badge } from "./ui/badge"
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
import { Edit, Trash2, Plus, Loader2, Megaphone } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { toast } from "../hooks/use-toast"
import { useNavigate } from "react-router"
import { getHeaderUpdates, deleteHeaderUpdate } from "../lib/api"
import { useLanguage } from "../contexts/language-context"
import { usePagination } from "../hooks/use-pagination"
import { Pagination } from "./ui/pagination"

interface HeaderUpdate {
  _id: string
  text: string
  link?: string
  isActive: boolean
  createdAt: string
}

export default function HeaderUpdateList() {
  const [updates, setUpdates] = useState<HeaderUpdate[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { currentPage, itemsPerPage, handlePageChange } = usePagination(10)

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getHeaderUpdates(currentPage, itemsPerPage)
        setUpdates(response.updates || [])
        setTotalPages(response.totalPages || 1)
        setTotalCount(response.totalCount || 0)
      } catch (err: any) {
        console.error("Error fetching header updates:", err)
        setError(err.message || "Failed to fetch header updates")
        toast({
          title: "Error",
          description: "Failed to load header updates. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUpdates()
  }, [currentPage, itemsPerPage])

  const handleDelete = async (id: string) => {
    try {
      await deleteHeaderUpdate(id)
      // Refetch data to update pagination
      const response = await getHeaderUpdates(currentPage, itemsPerPage)
      setUpdates(response.updates || [])
      setTotalPages(response.totalPages || 1)
      setTotalCount(response.totalCount || 0)
      setDeleteId(null)
      toast({
        title: t("header.deleted"),
        description: t("header.deleted"),
      })
    } catch (err: any) {
      console.error("Error deleting header update:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to delete header update",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (id: string) => {
    navigate(`/header-update/edit/${id}`)
  }

  const handleAddNew = () => {
    navigate("/header-update/new")
  }

  return (
    <DashboardLayout>
      <div className="w-full bg-background min-h-screen">
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-full overflow-x-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("header.updates")}</h1>
              <p className="text-muted-foreground mt-1">
                {t("header.manage")}
              </p>
            </div>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("header.addUpdate")}
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-4">Loading header updates...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm text-red-600">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          ) : updates.length === 0 ? (
            <div className="text-center py-12">
              <Megaphone className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg text-muted-foreground">No header updates yet.</p>
              <p className="text-sm text-muted-foreground">
                {t("header.addUpdate")}
              </p>
            </div>
          ) : (
            <div className="w-full max-w-full overflow-x-auto">
              <div className="rounded-lg border border-border overflow-hidden shadow-sm min-w-full">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Update Text</TableHead>
                    <TableHead className="hidden md:table-cell">Link</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {updates.map((update) => (
                    <TableRow key={update._id}>
                      <TableCell className="font-medium">
                        <div className="max-w-[200px] sm:max-w-md">
                          <p className="truncate">{update.text}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {update.link ? (
                          <a
                            href={update.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View Link
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={update.isActive ? "default" : "secondary"}>
                          {update.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {new Date(update.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(update._id)}
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
                                onClick={() => setDeleteId(update._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Header Update?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this header update.
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
                  ))}
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
        </div>
      </div>
    </DashboardLayout>
  )
}

