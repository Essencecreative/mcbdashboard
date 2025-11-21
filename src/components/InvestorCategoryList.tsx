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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
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
import { Edit, Trash2, Plus, ExternalLink, Image as ImageIcon, Loader2 } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { toast } from "../hooks/use-toast"
import { useNavigate, useLocation } from "react-router"
import { getInvestorCategories, deleteInvestorCategory } from "../lib/api"

// Types
interface InvestorItem {
  _id: string
  id?: string
  category: string
  title: string
  description: string
  pdfUrl?: string // Optional PDF link
  createdAt: string
}

// Category mapping for titles/subtitles
const categoryMap: Record<string, { title: string; subtitle: string }> = {
  news: {
    title: "Investor News",
    subtitle: "Manage all investor announcements and updates",
  },
  agm: {
    title: "Annual General Meeting",
    subtitle: "Manage AGM documents and information",
  },
  "financial-reports": {
    title: "Financial Reports",
    subtitle: "Manage financial statements and reports",
  },
  "tariff-guide": {
    title: "Tariff Guide",
    subtitle: "Manage tariff and fee guides",
  },
  shareholding: {
    title: "Shareholding Structure",
    subtitle: "Manage shareholding information",
  },
  "share-price": {
    title: "Share Price",
    subtitle: "Manage share price data and history",
  },
  contact: {
    title: "Investor Relations Contact",
    subtitle: "Manage contact information for investor relations",
  },
}

// All categories for select
const categories = Object.keys(categoryMap)

export default function InvestorCategoryList() {
  const location = useLocation()
  const navigate = useNavigate()
  const [items, setItems] = useState<InvestorItem[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get current category from URL
  const params = new URLSearchParams(location.search)
  const currentCategory = params.get("category") || categories[0]

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getInvestorCategories(currentCategory, 1, 100) // Fetch all (adjust limit as needed)
        const fetchedItems = response.items || []
        // Map to add id for compatibility
        const mappedItems = fetchedItems.map((item: any) => ({
          ...item,
          id: item._id,
        }))
        setItems(mappedItems)
      } catch (err: any) {
        console.error("Error fetching investor category items:", err)
        setError(err.message || "Failed to fetch items")
        toast({
          title: "Error",
          description: "Failed to load items. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [currentCategory])

  // Category change handler (update URL)
  const handleCategoryChange = (value: string) => {
    navigate(`/investors?category=${value}`)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteInvestorCategory(id)
      const updated = items.filter((item) => item._id !== id && item.id !== id)
      setItems(updated)
      setDeleteId(null)
      toast({
        title: "Deleted",
        description: "Item removed successfully.",
      })
    } catch (err: any) {
      console.error("Error deleting item:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (id: string) => {
    const itemId = items.find(item => item._id === id || item.id === id)?._id || id
    navigate(`/investors/${currentCategory}/edit/${itemId}`)
  }

  const handleAddNew = () => {
    navigate(`/investors/${currentCategory}/add`)
  }

  const { title, subtitle } = categoryMap[currentCategory] || {
    title: "Investors",
    subtitle: "Manage investor information",
  }

  return (
    <DashboardLayout>
      <div className="w-full bg-background min-h-screen">
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-full overflow-x-hidden">

          {/* Header + Select + Add Button */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              <p className="text-muted-foreground mt-1">
                {subtitle}
              </p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Select value={currentCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {categoryMap[cat].title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddNew} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-4">Loading items...</p>
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
              <p className="mt-4 text-lg text-muted-foreground">No items in this category yet.</p>
              <p className="text-sm text-muted-foreground">
                Click "Add New" to create your first entry.
              </p>
            </div>
          ) : (
            <div className="w-full max-w-full overflow-x-auto">
              <div className="rounded-lg border border-border overflow-hidden shadow-sm min-w-full">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead>PDF</TableHead>
                    <TableHead className="hidden sm:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const itemId = item._id || item.id || ""
                    return (
                    <TableRow key={itemId}>

                      <TableCell className="font-medium">
                        <div className="max-w-xs">
                          <p className="truncate">{item.title}</p>
                        </div>
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        <p className="text-sm text-muted-foreground max-w-md truncate">
                          {item.description}
                        </p>
                      </TableCell>

                      <TableCell>
                        {item.pdfUrl ? (
                          <Badge 
                            variant="secondary" 
                            className="text-xs cursor-pointer" 
                            onClick={() => {
                              const pdfUrl = item.pdfUrl?.startsWith('http') 
                                ? item.pdfUrl 
                                : `http://localhost:5000/${item.pdfUrl}`
                              window.open(pdfUrl, "_blank")
                            }}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View PDF
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            No PDF
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
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
                                <AlertDialogTitle>Delete Item?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "<span className="font-medium">{item.title}</span>".
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
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}