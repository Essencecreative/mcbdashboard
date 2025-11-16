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
  const navigate = useNavigate()

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getProducts(1, 100) // Fetch all products (adjust limit as needed)
        const products = response.products || []
        // Map products to match component structure
        const mappedProducts = products.map((product: any) => ({
          ...product,
          id: product._id, // Add id for compatibility
        }))
        setItems(mappedProducts)
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
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id)
      const updated = items.filter((item) => item._id !== id && item.id !== id)
      setItems(updated)
      setDeleteId(null)
      toast({
        title: "Deleted",
        description: "Product removed successfully.",
      })
    } catch (err: any) {
      console.error("Error deleting product:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to delete product",
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
      <div className="w-full bg-white min-h-screen">
        <div className=" p-6 md:p-8 lg:p-10">

          {/* Header + Add Button */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-muted-foreground mt-1">
                Manage all Products.
              </p>
            </div>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Product
            </Button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
              <p className="text-sm text-muted-foreground mt-4">Loading products...</p>
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
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-sm text-muted-foreground">
                Click "Add New Product" to create your first product.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden lg:table-cell">Description</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Button</TableHead>
                    <TableHead className="hidden md:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                                <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "<span className="font-medium">{item.title}</span>".
                                  This action cannot be undone.
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
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}