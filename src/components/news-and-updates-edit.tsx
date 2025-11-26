import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircle, Upload, Loader2, CalendarIcon } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { RichTextEditor } from "./ui/editor"
import { getNewsAndUpdate, updateNewsAndUpdate } from "../lib/api"
import { toast } from "../hooks/use-toast"
import { useLanguage } from "../contexts/language-context"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Calendar } from "./ui/calendar"
import { format } from "date-fns"
import { cn } from "../lib/utils"

export default function NewsAndUpdateEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    content: "",
  })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [bannerPhoto, setBannerPhoto] = useState<File | null>(null)
  const [bannerPhotoPreview, setBannerPhotoPreview] = useState<string | null>(null)
  const [currentBannerPhotoUrl, setCurrentBannerPhotoUrl] = useState<string | null>(null)
  const [publishedDate, setPublishedDate] = useState<Date>(new Date())
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  // Limits
  const MAX_TITLE_CHARS = 80
  const MAX_DESC_CHARS = 200

  // Fetch news and update data on mount
  useEffect(() => {
    const fetchNewsAndUpdate = async () => {
      if (!id) {
        setErrors(["News & Update ID is missing"])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const newsAndUpdate = await getNewsAndUpdate(id)
        
        // Populate form with existing data
        setFormData({
          title: newsAndUpdate.title || "",
          shortDescription: newsAndUpdate.shortDescription || "",
          content: newsAndUpdate.content || "",
        })

        // Set current image URL
        if (newsAndUpdate.image) {
          const imageUrl = newsAndUpdate.image.startsWith('http') 
            ? newsAndUpdate.image 
            : `${process.env.REACT_APP_API_URL || "https://service.mwalimubank.co.tz"}/${newsAndUpdate.image}`
          setCurrentImageUrl(imageUrl)
          setImagePreview(imageUrl)
        }

        // Set current banner photo URL
        if (newsAndUpdate.bannerPhoto) {
          const bannerPhotoUrl = newsAndUpdate.bannerPhoto.startsWith('http') 
            ? newsAndUpdate.bannerPhoto 
            : `${process.env.REACT_APP_API_URL || "https://service.mwalimubank.co.tz"}/${newsAndUpdate.bannerPhoto}`
          setCurrentBannerPhotoUrl(bannerPhotoUrl)
          setBannerPhotoPreview(bannerPhotoUrl)
        }

        // Set published date
        if (newsAndUpdate.publishedDate) {
          setPublishedDate(new Date(newsAndUpdate.publishedDate))
        } else if (newsAndUpdate.createdAt) {
          setPublishedDate(new Date(newsAndUpdate.createdAt))
        }
      } catch (err: any) {
        console.error("Error fetching news & update:", err)
        setErrors([err.message || "Failed to load news & update"])
        toast({
          title: "Error",
          description: "Failed to load news & update. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchNewsAndUpdate()
  }, [id])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleBannerPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => setBannerPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors: string[] = []

    if (!formData.title.trim()) newErrors.push("Title is required")
    if (formData.title.length > MAX_TITLE_CHARS)
      newErrors.push(`Title: max ${MAX_TITLE_CHARS} characters`)

    if (!formData.shortDescription.trim()) newErrors.push("Short description is required")
    if (formData.shortDescription.length > MAX_DESC_CHARS)
      newErrors.push(`Short description: max ${MAX_DESC_CHARS} characters`)

    if (!formData.content.trim()) newErrors.push("News content is required")
    // Image is optional on edit (can keep existing)

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !id) return

    setSubmitting(true)
    const data = new FormData()
    data.append("title", formData.title)
    data.append("shortDescription", formData.shortDescription)
    data.append("content", formData.content)
    data.append("publishedDate", publishedDate.toISOString())
    if (image) data.append("image", image)
    if (bannerPhoto) data.append("bannerPhoto", bannerPhoto)

    try {
      await updateNewsAndUpdate(id, data)
      toast({
        title: t("common.success"),
        description: t("news.saved"),
      })
      
      navigate("/news-and-updates")
    } catch (err: any) {
      setErrors([err.message || "Something went wrong"])
      toast({
        title: t("common.error"),
        description: err.message || t("news.saveError"),
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="w-full bg-background min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-4">{t("news.loading")}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="w-full bg-background min-h-screen">
        <div className="p-6 md:p-8 lg:p-10">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{t("news.editArticle")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("news.updateArticle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Image Upload */}
            <div className="space-y-3">
              <Label className="text-base font-medium">{t("news.image")}</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image-upload")?.click()}
                  disabled={submitting}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {image ? t("common.upload") : t("common.upload") + " " + t("news.image")}
                </Button>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={submitting}
                />
              </div>
              {image && (
                <p className="text-sm text-muted-foreground">
                  New image selected: <span className="font-medium">{image.name}</span>
                </p>
              )}
              {!image && currentImageUrl && (
                <p className="text-sm text-muted-foreground">
                  Current image will be kept. Upload a new image to replace it.
                </p>
              )}
              {imagePreview && (
                <div className="mt-4 rounded-xl overflow-hidden border border-border shadow-sm">
                  <img src={imagePreview} alt="Preview" className="w-full h-80 object-cover" />
                </div>
              )}
            </div>

            {/* Banner Photo Upload */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Blog Banner Photo</Label>
              <p className="text-sm text-muted-foreground">
                This image will be displayed at the top of the blog post page, before the title.
              </p>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("banner-photo-upload")?.click()}
                  disabled={submitting}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {bannerPhoto ? "Change Banner Photo" : "Upload Banner Photo"}
                </Button>
                <Input
                  id="banner-photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerPhotoChange}
                  disabled={submitting}
                />
              </div>
              {bannerPhoto && (
                <p className="text-sm text-muted-foreground">
                  New banner photo selected: <span className="font-medium">{bannerPhoto.name}</span>
                </p>
              )}
              {!bannerPhoto && currentBannerPhotoUrl && (
                <p className="text-sm text-muted-foreground">
                  Current banner photo will be kept. Upload a new image to replace it.
                </p>
              )}
              {bannerPhotoPreview && (
                <div className="mt-4 rounded-xl overflow-hidden border border-border shadow-sm">
                  <img src={bannerPhotoPreview} alt="Banner Preview" className="w-full h-80 object-cover" />
                </div>
              )}
            </div>

            {/* Published Date */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Publication Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !publishedDate && "text-muted-foreground"
                    )}
                    disabled={submitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {publishedDate ? format(publishedDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={publishedDate}
                    onSelect={(date: Date | undefined) => date && setPublishedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                {t("news.titleLabel")} <span className="text-muted-foreground text-sm">(max {MAX_TITLE_CHARS} chars)</span>
              </Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Q3 2025 Financial Results Announced"
                maxLength={MAX_TITLE_CHARS}
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.title.length}/{MAX_TITLE_CHARS}
              </p>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                {t("news.content")} <span className="text-muted-foreground text-sm">(max {MAX_DESC_CHARS} chars)</span>
              </Label>
              <Textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder="Brief summary for list view..."
                maxLength={MAX_DESC_CHARS}
                rows={3}
                className="resize-none"
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.shortDescription.length}/{MAX_DESC_CHARS}
              </p>
            </div>

            {/* Rich Text Editor */}
            <div className="space-y-2">
              <Label className="text-base font-medium">News Content</Label>
              <div className="border rounded-lg overflow-hidden">
                <RichTextEditor
                  value={formData.content}
                  onChange={handleEditorChange}
                  placeholder="Write your news & update content here..."
                />
              </div>
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
                {submitting ? t("common.loading") : t("common.save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/news-and-updates")}
                disabled={submitting}
              >
                {t("common.cancel")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

