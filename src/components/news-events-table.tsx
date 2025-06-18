import { useEffect, useState } from "react"
import { Link } from "react-router"
import {
  ArrowDownIcon, ArrowUpIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon,
  ExternalLinkIcon, ImageIcon, MicIcon, NewspaperIcon, RadioIcon,
  SearchIcon, UsersIcon, PlusIcon, EditIcon, Trash2Icon
} from "lucide-react"
import { format } from "date-fns"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Skeleton } from "./ui/skeleton"
import { useAuth } from "../auth-context"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "./ui/dialog"
import { Trash } from "lucide-react"

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "Media News", label: "Media News" },
  { value: "General News", label: "General News" },
  { value: "Events and Trainings", label: "Events and Trainings" },
  { value: "Radio Programmes", label: "Radio Programmes" },
  { value: "Photo Gallery", label: "Photo Gallery" },
]

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Media News": return <NewspaperIcon className="h-4 w-4 text-blue-500" />
    case "General News": return <NewspaperIcon className="h-4 w-4 text-gray-500" />
    case "Events and Trainings": return <UsersIcon className="h-4 w-4 text-green-500" />
    case "Radio Programmes": return <RadioIcon className="h-4 w-4 text-purple-500" />
    case "Photo Gallery": return <ImageIcon className="h-4 w-4 text-amber-500" />
    default: return <NewspaperIcon className="h-4 w-4" />
  }
}

const getCategoryVariant = (category: string): "default" | "outline" | "secondary" | "destructive" => {
  switch (category) {
    case "Media News": return "default"
    case "General News": return "secondary"
    case "Events and Trainings": return "outline"
    case "Radio Programmes": return "destructive"
    case "Photo Gallery": return "secondary"
    default: return "default"
  }
}

export default function NewsEventsTable() {
  const { token } = useAuth()
  const [newsItems, setNewsItems] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

  const itemsPerPage = 5

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      try {
        const res = await fetch(`https://forlandservice.onrender.com/news?page=${currentPage}&limit=${itemsPerPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        setNewsItems(data.news)
        setTotalPages(data.totalPages)
      } catch (error) {
        console.error("Failed to fetch news:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [token, currentPage])

  const filteredItems = newsItems.filter((item: any) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      const res = await fetch(`https://forlandservice.onrender.com/news/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Failed to delete item")
      setNewsItems(newsItems.filter((item) => item._id !== id))
      setDeleteId(null)
    } catch (error) {
      console.error("Error deleting item:", error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search news and events..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link to="/newsnew">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add News
            </Link>
          </Button>
        </div>

        <Select value={selectedCategory} onValueChange={value => setSelectedCategory(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%]">Title</TableHead>
                <TableHead className="w-[15%]">Date</TableHead>
                <TableHead className="w-[15%]">Category</TableHead>
                <TableHead className="w-[25%]">Description</TableHead>
                <TableHead className="w-[10%]">Cover</TableHead>
                <TableHead className="w-[15%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(itemsPerPage)].map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell colSpan={6}>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {format(new Date(item.publicationDate), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getCategoryVariant(item.category)} className="flex w-fit items-center gap-1">
                        {getCategoryIcon(item.category)}
                        <span>{item.category}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.description}</TableCell>
                    <TableCell className="text-center">
                      {item.photo ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setPreviewImageUrl(item.photo)}>
                              <ImageIcon className="h-4 w-4 text-blue-600" />
                            </Button>
                          </DialogTrigger>
                          {previewImageUrl === item.photo && (
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Cover Photo</DialogTitle>
                              </DialogHeader>
                              <div className="flex justify-center">
                                <img src={item.photo} alt="Cover" className="max-h-[300px] rounded-md" />
                              </div>
                            </DialogContent>
                          )}
                        </Dialog>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">No image</span>
                      )}
                    </TableCell>
                    <TableCell className="flex gap-2 justify-center">
                      <Button variant="outline" size="icon">
                        <Link to={`/news-and-events/${item._id}/edit`}>
                          <EditIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="icon" onClick={() => setDeleteId(item._id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        {deleteId === item._id && (
                          <DialogContent>
                            <DialogHeader>
                              <h4 className="text-lg font-semibold">Confirm Deletion</h4>
                              <p className="text-sm text-muted-foreground">Are you sure you want to delete this publication?</p>
                            </DialogHeader>
                            <DialogFooter className="mt-4 flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(item._id)}
                                disabled={deleting}
                              >
                                {deleting ? "Deleting..." : "Yes, Delete"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        )}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No news or events found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
