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
import { Edit, Trash2, Plus, CheckCircle2, Image as ImageIcon, Loader2 } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { toast } from "../hooks/use-toast"
import { useNavigate } from "react-router"
import { getProducts, deleteProduct } from "../lib/api"
import { useLanguage } from "../contexts/language-context"
import { usePagination } from "../hooks/use-pagination"
import { Pagination } from "./ui/pagination"

// Types
interface WaysToBankItem {
  _id: string
  id?: string
  title: string
  description: string
  features: string[]
  buttonText: string
  buttonLink: string
  image: string
  createdAt: string
}

export default function WaysToBankList() {
  const [items, setItems] = useState<WaysToBankItem[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { currentPage, itemsPerPage, handlePageChange } = usePagination(10)

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getProducts(currentPage, itemsPerPage)
        const products = response.products || []
        // Map products to match component structure
        const mappedProducts = products.map((product: any) => ({
          ...product,
          id: product._id, // Add id for compatibility
        }))
        setItems(mappedProducts)
        setTotalPages(response.totalPages || 1)
        setTotalCount(response.totalCount || 0)
      } catch (err: any) {
        console.error("Error fetching products:", err)
        setError(err.message || "Failed to fetch products")
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage, itemsPerPage])

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id)
      // Refetch data to update pagination
      const response = await getProducts(currentPage, itemsPerPage)
      const products = response.products || []
      const mappedProducts = products.map((product: any) => ({
        ...product,
        id: product._id,
      }))
      setItems(mappedProducts)
      setTotalPages(response.totalPages || 1)
      setTotalCount(response.totalCount || 0)
      setDeleteId(null)
        toast({
          title: t("table.deleted"),
          description: t("products.deleted"),
        })
    } catch (err: any) {
      console.error("Error deleting product:", err)
        toast({
          title: t("common.error"),
          description: err.message || t("products.deleteError"),
          variant: "destructive",
        })
    }
  }

  const handleEdit = (id: string) => {
    navigate(`/products/edit/${id}`)
  }

  const handleAddNew = () => {
    navigate("/products/create")
  }

  return (
    <DashboardLayout>
      <div className="w-full bg-background min-h-screen">
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-full overflow-x-hidden">

          {/* Header + Add Button */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("products.title")}</h1>
              <p className="text-muted-foreground mt-1">
                {t("products.manage")}
              </p>
            </div>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("products.addNew")}
            </Button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-4">{t("products.loading")}</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm text-red-600">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {t("products.createFirst")}
              </p>
            </div>
          ) : (
            <div className="w-full max-w-full overflow-x-auto">
              <div className="rounded-lg border border-border overflow-hidden shadow-sm min-w-full">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">{t("products.image")}</TableHead>
                    <TableHead>{t("products.name")}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t("products.description")}</TableHead>
                    <TableHead>{t("common.status")}</TableHead>
                    <TableHead>{t("carousel.buttonText")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("settings.lastUpdated")}</TableHead>
                    <TableHead className="text-right">{t("table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const itemId = item._id || item.id || ""
                    return (
                    <TableRow key={itemId}>
                      {/* Image */}
                      <TableCell>
                        <div className="w-12 h-12 rounded overflow-hidden border">
                          <img
                            src={item.image?.startsWith('http') ? item.image : `http://localhost:5000/${item.image}`}
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
                        <div className="max-w-xs">
                          <p className="truncate">{item.title}</p>
                        </div>
                      </TableCell>

                      {/* Description (lg+) */}
                      <TableCell className="hidden lg:table-cell">
                        <p className="text-sm text-muted-foreground max-w-md truncate">
                          {item.description}
                        </p>
                      </TableCell>

                      {/* Features */}
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.features.slice(0, 2).map((f, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {f}
                            </Badge>
                          ))}
                          {item.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.features.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Button */}
                      <TableCell>
                        <Badge variant="default" className="text-xs">
                          {item.buttonText}
                        </Badge>
                      </TableCell>

                      {/* Created At */}
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(itemId)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">{t("table.edit")}</span>
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
                                <span className="sr-only">{t("table.delete")}</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t("table.delete")} {t("products.title")}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t("table.confirmDelete")}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeleteId(null)}>
                                  {t("common.cancel")}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(deleteId!)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {t("table.delete")}
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
        </div>
      </div>
    </DashboardLayout>
  )
}