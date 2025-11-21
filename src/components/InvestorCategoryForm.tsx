import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircle, Upload, Loader2 } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { createInvestorCategory, getInvestorCategory, updateInvestorCategory } from "../lib/api"
import { toast } from "../hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

// Available categories (excluding investor-news)
const categories = [
  { value: "agm", label: "Annual General Meeting" },
  { value: "financial-reports", label: "Financial Reports" },
  { value: "tariff-guide", label: "Tariff Guide" },
  { value: "shareholding", label: "Shareholding Structure" },
  { value: "share-price", label: "Share Price" },
  { value: "contact", label: "Investor Relations Contact" },
]

// Category mapping for titles
const categoryMap: Record<string, { title: string; subtitle: string }> = {
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

export default function InvestorCategoryForm() {
  const { category, id } = useParams<{ category: string; id?: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    category: category || "",
    title: "",
    description: "",
    pdfUrl: "",
  })
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const isEdit = !!id

  // Get category from URL params or location search
  useEffect(() => {
    if (!category) {
      const params = new URLSearchParams(location.search)
      const urlCategory = params.get("category")
      if (urlCategory) {
        setFormData(prev => ({ ...prev, category: urlCategory }))
      }
    }
  }, [category, location.search])

  // Fetch item data if editing
  useEffect(() => {
    const fetchItem = async () => {
      if (!id || !isEdit) return

      try {
        setLoading(true)
        const item = await getInvestorCategory(id)
        
        setFormData({
          category: item.category || category || "",
          title: item.title || "",
          description: item.description || "",
          pdfUrl: item.pdfUrl || "",
        })

        if (item.pdfUrl) {
          const pdfUrl = item.pdfUrl.startsWith('http') 
            ? item.pdfUrl 
            : `http://localhost:5000/${item.pdfUrl}`
          setCurrentPdfUrl(pdfUrl)
        }
      } catch (err: any) {
        console.error("Error fetching item:", err)
        setErrors([err.message || "Failed to load item"])
        toast({
          title: "Error",
          description: "Failed to load item. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id, isEdit, category])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPdfFile(file)
    }
  }

  const validateForm = () => {
    const newErrors: string[] = []

    if (!formData.category) newErrors.push("Category is required")
    if (!formData.title.trim()) newErrors.push("Title is required")
    if (!formData.description.trim()) newErrors.push("Description is required")
    // PDF is optional

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    const data = new FormData()
    data.append("category", formData.category)
    data.append("title", formData.title)
    data.append("description", formData.description)
    if (pdfFile) {
      data.append("pdf", pdfFile)
    } else if (formData.pdfUrl && !isEdit) {
      // Only use URL if no file and it's a new item
      data.append("pdfUrl", formData.pdfUrl)
    } else if (formData.pdfUrl && isEdit) {
      // For edit, if no new file but URL is provided, use it
      data.append("pdfUrl", formData.pdfUrl)
    }

    try {
      if (isEdit && id) {
        await updateInvestorCategory(id, data)
        toast({
          title: "Success",
          description: "Item updated successfully!",
        })
      } else {
        await createInvestorCategory(data)
        toast({
          title: "Success",
          description: "Item created successfully!",
        })
      }
      
      navigate(`/investors?category=${formData.category}`)
    } catch (err: any) {
      setErrors([err.message || "Something went wrong"])
      toast({
        title: "Error",
        description: err.message || `Failed to ${isEdit ? 'update' : 'create'} item`,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const { title: categoryTitle, subtitle } = categoryMap[formData.category] || {
    title: "Investor Category",
    subtitle: "Manage investor information",
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="w-full bg-background min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-4">Loading item...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="w-full bg-background min-h-screen">
        <div className="max-w-4xl p-6 md:p-8 lg:p-10">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              {isEdit ? `Edit ${categoryTitle}` : `Add ${categoryTitle}`}
            </h1>
            <p className="text-muted-foreground mt-1">
              {subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Category Select */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-medium">Category</Label>
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
                disabled={submitting}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.category && categoryMap[formData.category] && (
                <p className="text-sm text-muted-foreground">
                  {categoryMap[formData.category].subtitle}
                </p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Title</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Annual Financial Report 2025"
                disabled={submitting}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the item..."
                rows={4}
                className="resize-none"
                disabled={submitting}
              />
            </div>

            {/* PDF Upload or URL */}
            <div className="space-y-3">
              <Label className="text-base font-medium">PDF Document</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("pdf-upload")?.click()}
                  disabled={submitting}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {pdfFile ? "Change PDF" : "Upload PDF"}
                </Button>
                <Input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handlePdfChange}
                  disabled={submitting}
                />
              </div>
              {pdfFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: <span className="font-medium">{pdfFile.name}</span>
                </p>
              )}
              {!pdfFile && currentPdfUrl && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Current PDF: <a href={currentPdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{currentPdfUrl}</a>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Upload a new PDF to replace it, or leave empty to keep current.
                  </p>
                </div>
              )}
              {!pdfFile && !currentPdfUrl && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Or enter PDF URL:</Label>
                  <Input
                    name="pdfUrl"
                    value={formData.pdfUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/document.pdf"
                    disabled={submitting}
                  />
                </div>
              )}
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Please fix the following:</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 space-y-1 text-sm">
                    {errors.map((error, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <span className="text-red-600">•</span> {error}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Submit */}
            <div className="pt-4 flex gap-3">
              <Button type="submit" size="lg" className="px-8" disabled={submitting}>
                {submitting ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Item" : "Create Item")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/investors?category=${formData.category}`)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

