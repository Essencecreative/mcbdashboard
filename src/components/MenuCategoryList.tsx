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
import { Edit, Trash2, Plus, Layers, Loader2 } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { toast } from "../hooks/use-toast"
import { useNavigate } from "react-router"
import { getMenuCategories, deleteMenuCategory } from "../lib/api"

interface MenuCategory {
  _id: string
  id?: string
  name: string
  displayName: string
  position: number
  isActive: boolean
  subcategories: Array<{
    name: string
    displayName: string
    position: number
    route: string
    isActive: boolean
  }>
  createdAt: string
}

export default function MenuCategoryList() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getMenuCategories()
        const mappedCategories = data.map((item: any) => ({
          ...item,
          id: item._id,
        }))
        setCategories(mappedCategories)
      } catch (err: any) {
        console.error("Error fetching menu categories:", err)
        setError(err.message || "Failed to fetch menu categories")
        toast({
          title: "Error",
          description: "Failed to load menu categories. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteMenuCategory(id)
      const updated = categories.filter((item) => item._id !== id && item.id !== id)
      setCategories(updated)
      setDeleteId(null)
      toast({
        title: "Deleted",
        description: "Menu category removed successfully.",
      })
    } catch (err: any) {
      console.error("Error deleting menu category:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to delete menu category",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (id: string) => {
    const itemId = categories.find(item => item._id === id || item.id === id)?._id || id
    navigate(`/menu-categories/edit/${itemId}`)
  }

  const handleAddNew = () => {
    navigate("/menu-categories/new")
  }

  return (
    <DashboardLayout>
      <div className="w-full bg-white min-h-screen">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Menu Categories</h1>
              <p className="text-muted-foreground mt-1">
                Manage main menu categories and their subcategories.
              </p>
            </div>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Category
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
              <p className="text-sm text-muted-foreground mt-4">Loading menu categories...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm text-red-600">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <Layers className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-lg text-gray-600">No menu categories yet.</p>
              <p className="text-sm text-muted-foreground">
                Click "Add New Category" to create your first menu category.
              </p>
            </div>
          ) : (
            <div className="w-full rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Position</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Display Name</TableHead>
                    <TableHead className="hidden md:table-cell">Subcategories</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => {
                    const itemId = category._id || category.id || ""
                    return (
                      <TableRow key={itemId}>
                        <TableCell className="font-medium">
                          {category.position}
                        </TableCell>
                        <TableCell className="font-medium">
                          <Badge variant="outline">{category.name}</Badge>
                        </TableCell>
                        <TableCell>
                          {category.displayName}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="secondary">
                            {category.subcategories?.length || 0} subcategories
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={category.isActive ? "default" : "secondary"}>
                            {category.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
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
                                  <AlertDialogTitle>Delete Menu Category?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete "
                                    <span className="font-medium">{category.displayName}</span>" and all its menu items.
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

