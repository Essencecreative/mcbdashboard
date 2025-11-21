"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircle, Upload, Loader2 } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { getCarousel, updateCarousel } from "../lib/api"
import { toast } from "../hooks/use-toast"
import { useNavigate, useParams } from "react-router"
import { useLanguage } from "../contexts/language-context"

export default function CarouselEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    buttonTitle: "",
    link: "",
  })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  const MAX_TITLE_WORDS = 6
  const MAX_DESC_WORDS = 15
  const MAX_TITLE_CHARS = 50
  const MAX_DESC_CHARS = 150

  // Fetch carousel item data
  useEffect(() => {
    const fetchCarousel = async () => {
      if (!id) return

      try {
        setLoading(true)
        const carousel = await getCarousel(id)
        setFormData({
          title: carousel.title || "",
          description: carousel.description || "",
          buttonTitle: carousel.buttonTitle || "",
          link: carousel.link || "",
        })
        
        if (carousel.image) {
          const imageUrl = carousel.image.startsWith('http') 
            ? carousel.image 
            : `http://localhost:5000/${carousel.image}`
          setCurrentImageUrl(imageUrl)
        }
      } catch (err: any) {
        console.error("Error fetching carousel:", err)
        toast({
          title: "Error",
          description: err.message || "Failed to load carousel item",
          variant: "destructive",
        })
        navigate("/carousel")
      } finally {
        setLoading(false)
      }
    }

    fetchCarousel()
  }, [id, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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

  const validateForm = () => {
    const newErrors: string[] = []

    const titleWords = formData.title.trim().split(/\s+/).length
    if (titleWords > MAX_TITLE_WORDS || formData.title.length > MAX_TITLE_CHARS) {
      newErrors.push(`Title: max ${MAX_TITLE_WORDS} words / ${MAX_TITLE_CHARS} chars`)
    }

    const descWords = formData.description.trim().split(/\s+/).length
    if (descWords > MAX_DESC_WORDS || formData.description.length > MAX_DESC_CHARS) {
      newErrors.push(`Description: max ${MAX_DESC_WORDS} words / ${MAX_DESC_CHARS} chars`)
    }

    if (!formData.title) newErrors.push("Title is required")
    if (!formData.description) newErrors.push("Description is required")
    if (!formData.buttonTitle) newErrors.push("Button title is required")
    if (!formData.link) newErrors.push("Link is required")
    // Image is optional on edit

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !id) return

    setSubmitting(true)
    const data = new FormData()
    data.append("title", formData.title)
    data.append("description", formData.description)
    data.append("buttonTitle", formData.buttonTitle)
    data.append("link", formData.link)
    if (image) data.append("image", image)

    try {
      await updateCarousel(id, data)
      toast({
        title: "Success",
        description: "Carousel item updated successfully!",
      })
      
      navigate("/carousel")
    } catch (err: any) {
      setErrors([err.message || "Something went wrong"])
      toast({
        title: "Error",
        description: err.message || "Failed to update carousel item",
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
            <p className="text-sm text-muted-foreground mt-4">Loading carousel item...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Full-width White Background */}
      <div className="w-full bg-background min-h-screen">
        {/* Left-Aligned Form Container */}
        <div className="max-w-3xl p-6 md:p-8 lg:p-10">
          
          {/* Header - Left Aligned */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{t("carousel.editSlide")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("carousel.updateSlide")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Image Upload */}
            <div className="space-y-3">
              <Label htmlFor="image-upload" className="text-base font-medium">
                {t("carousel.backgroundImage")} <span className="text-muted-foreground text-sm">(optional - leave unchanged if not updating)</span>
              </Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={() => document.getElementById("image-upload")?.click()}
                  disabled={submitting}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {image ? t("common.upload") : t("common.upload")}
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
                  Selected: <span className="font-medium">{image.name}</span>
                </p>
              )}
              {(imagePreview || currentImageUrl) && (
                <div className="mt-4 rounded-xl overflow-hidden border border-border shadow-sm">
                  <img
                    src={imagePreview || currentImageUrl || ""}
                    alt="Preview"
                    className="w-full h-64 md:h-80 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x400"
                    }}
                  />
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">
                {t("carousel.titleLabel")} <span className="text-muted-foreground text-sm">(max {MAX_TITLE_WORDS} words)</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Lipa Luku kwa urahisi kiganjani mwako!"
                maxLength={MAX_TITLE_CHARS}
                className="text-lg"
                disabled={submitting}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                {t("carousel.description")} <span className="text-muted-foreground text-sm">(max {MAX_DESC_WORDS} words)</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g., Mwalimu Mobile inakurahisisha kufanya malipo ya bill mbalimbali..."
                maxLength={MAX_DESC_CHARS}
                rows={4}
                className="resize-none"
                disabled={submitting}
              />
            </div>

            {/* Button Title & Link - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="buttonTitle" className="text-base font-medium">
                  {t("carousel.buttonText")}
                </Label>
                <Input
                  id="buttonTitle"
                  name="buttonTitle"
                  value={formData.buttonTitle}
                  onChange={handleInputChange}
                  placeholder="e.g., Make An Appointment"
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link" className="text-base font-medium">
                  {t("carousel.buttonLink")}
                </Label>
                <Input
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="e.g., /appointment"
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Validation Errors */}
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Please fix the following:</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 space-y-1 text-sm">
                    {errors.map((error, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <span className="text-red-600">•</span> {error}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="pt-4 flex gap-3">
              <Button type="submit" size="lg" className="w-full md:w-auto px-8" disabled={submitting}>
                {submitting ? t("common.loading") : t("common.save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/carousel")}
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

