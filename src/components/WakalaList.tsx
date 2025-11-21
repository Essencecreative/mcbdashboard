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
import { Edit, Trash2, Plus, Loader2, MapPin } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { toast } from "../hooks/use-toast"
import { useNavigate } from "react-router"
import { getWakalas, deleteWakala } from "../lib/api"
import { useLanguage } from "../contexts/language-context"
import { usePagination } from "../hooks/use-pagination"
import { Pagination } from "./ui/pagination"

interface Wakala {
  _id: string
  name: string
  region: string
  district: string
  address: string
  phone: string
  isActive: boolean
  createdAt: string
}

export default function WakalaList() {
  const [wakalas, setWakalas] = useState<Wakala[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { currentPage, itemsPerPage, handlePageChange } = usePagination(10)

  useEffect(() => {
    const fetchWakalas = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getWakalas(currentPage, itemsPerPage)
        setWakalas(response.wakalas || [])
        setTotalPages(response.totalPages || 1)
        setTotalCount(response.totalCount || 0)
      } catch (err: any) {
        console.error("Error fetching wakala locations:", err)
        setError(err.message || "Failed to fetch wakala locations")
        toast({
          title: "Error",
          description: "Failed to load wakala locations. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWakalas()
  }, [currentPage, itemsPerPage])

  const handleDelete = async (id: string) => {
    try {
      await deleteWakala(id)
      // Refetch data to update pagination
      const response = await getWakalas(currentPage, itemsPerPage)
      setWakalas(response.wakalas || [])
      setTotalPages(response.totalPages || 1)
      setTotalCount(response.totalCount || 0)
      setDeleteId(null)
      toast({
        title: t("wakala.deleted"),
        description: t("wakala.deleted"),
      })
    } catch (err: any) {
      console.error("Error deleting wakala location:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to delete wakala location",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (id: string) => {
    navigate(`/wakala/edit/${id}`)
  }

  const handleAddNew = () => {
    navigate("/wakala/new")
  }

  return (
    <DashboardLayout>
      <div className="w-full bg-background min-h-screen">
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-full overflow-x-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("wakala.title")}</h1>
              <p className="text-muted-foreground mt-1">{t("wakala.manage")}</p>
            </div>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("wakala.addNew")}
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          ) : wakalas.length === 0 ? (
            <div className="bg-muted border border-border rounded-lg p-8 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{t("wakala.title")} {t("table.noData")}</p>
              <Button onClick={handleAddNew} variant="outline">
                {t("wakala.addNewLocation")}
              </Button>
            </div>
          ) : (
            <div className="w-full max-w-full overflow-x-auto">
              <div className="border rounded-lg overflow-hidden shadow-sm min-w-full">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wakalas.map((wakala) => (
                    <TableRow key={wakala._id}>
                      <TableCell className="font-medium">{wakala.name}</TableCell>
                      <TableCell>{wakala.region}</TableCell>
                      <TableCell>{wakala.district}</TableCell>
                      <TableCell className="max-w-xs truncate" title={wakala.address}>
                        {wakala.address}
                      </TableCell>
                      <TableCell>
                        <a href={`tel:${wakala.phone}`} className="text-blue-600 hover:underline">
                          {wakala.phone}
                        </a>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          wakala.isActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {wakala.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(wakala._id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => setDeleteId(wakala._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            {deleteId === wakala._id && (
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Wakala Location</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{wakala.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setDeleteId(null)}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(wakala._id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            )}
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

