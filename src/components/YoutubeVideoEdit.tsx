"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { getYoutubeVideo, updateYoutubeVideo } from "../lib/api"
import { toast } from "../hooks/use-toast"

// Helper to extract YouTube video ID from various link formats
function extractYoutubeId(input: string): string {
  const trimmed = input.trim()
  if (trimmed.length === 11 && !trimmed.includes("/") && !trimmed.includes("?")) {
    return trimmed
  }
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = trimmed.match(regExp)
  
  return (match && match[2].length === 11) ? match[2] : trimmed
}

export default function YoutubeVideoEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeInput: "", // Temporary input that can be URL or ID
    category: "",
    position: 0,
    isActive: true,
  })
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true)
        const video = await getYoutubeVideo(id!)
        setFormData({
          title: video.title || "",
          description: video.description || "",
          youtubeInput: video.youtubeId || "",
          category: video.category || "",
          position: video.position !== undefined ? video.position : 0,
          isActive: video.isActive !== undefined ? video.isActive : true,
        })
      } catch (err: any) {
        console.error("Error fetching YouTube video:", err)
        toast({
          title: "Error",
          description: err.message || "Failed to load YouTube video",
          variant: "destructive",
        })
        navigate("/youtube-videos")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchVideo()
    }
  }, [id, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (name === "position" ? parseInt(value) || 0 : value),
    }))
  }

  const validateForm = () => {
    const newErrors: string[] = []

    if (!formData.title.trim()) newErrors.push("Title is required")
    if (!formData.youtubeInput.trim()) {
      newErrors.push("YouTube Video URL or ID is required")
    } else {
      const extractedId = extractYoutubeId(formData.youtubeInput)
      if (extractedId.length !== 11) {
        newErrors.push("Invalid YouTube URL or Video ID. It must contain an 11-digit video identifier.")
      }
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const extractedId = extractYoutubeId(formData.youtubeInput)
      const submitData = {
        title: formData.title,
        description: formData.description,
        youtubeId: extractedId,
        category: formData.category,
        position: formData.position,
        isActive: formData.isActive,
      }
      
      await updateYoutubeVideo(id!, submitData)
      toast({
        title: "Success",
        description: "YouTube video updated successfully!",
      })
      navigate("/youtube-videos")
    } catch (err: any) {
      setErrors([err.message || "Something went wrong"])
      toast({
        title: "Error",
        description: err.message || "Failed to update YouTube video",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="w-full bg-white min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="w-full bg-white min-h-screen">
        <div className="max-w-3xl p-6 md:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit YouTube Video</h1>
            <p className="text-muted-foreground mt-1">
              Update YouTube video information.
            </p>
          </div>

          {errors.length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">
                Video Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Mwalimu Commercial Bank - Your Trusted Partner"
                required
                disabled={submitting}
              />
            </div>

            {/* YouTube Link / ID */}
            <div className="space-y-2">
              <Label htmlFor="youtubeInput" className="text-base font-medium">
                YouTube URL or Video ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="youtubeInput"
                name="youtubeInput"
                value={formData.youtubeInput}
                onChange={handleInputChange}
                placeholder="e.g., https://www.youtube.com/watch?v=vfhzo499OeA or vfhzo499OeA"
                required
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground">
                You can paste the entire YouTube link (e.g. from browser address bar or share sheet) and we will automatically extract the ID.
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-medium">
                Category
              </Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., About Us, Digital Banking, Savings"
                disabled={submitting}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter video description..."
                disabled={submitting}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="position" className="text-base font-medium">
                Position
              </Label>
              <Input
                id="position"
                name="position"
                type="number"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="0"
                disabled={submitting}
              />
              <p className="text-sm text-muted-foreground">
                Lower numbers appear first. Default is 0.
              </p>
            </div>

            {/* Is Active */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                disabled={submitting}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isActive" className="text-base font-medium">
                Active
              </Label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/youtube-videos")}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Updating..." : "Update YouTube Video"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
