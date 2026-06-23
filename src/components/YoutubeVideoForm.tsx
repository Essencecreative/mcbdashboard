"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertCircle } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { createYoutubeVideo } from "../lib/api"
import { toast } from "../hooks/use-toast"
import { useNavigate } from "react-router"

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

export default function YoutubeVideoForm() {
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
      
      await createYoutubeVideo(submitData)
      toast({
        title: "Success",
        description: "YouTube video added successfully!",
      })
      navigate("/youtube-videos")
    } catch (err: any) {
      setErrors([err.message || "Something went wrong"])
      toast({
        title: "Error",
        description: err.message || "Failed to add YouTube video",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="w-full bg-white min-h-screen">
        <div className="max-w-3xl p-6 md:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Add New YouTube Video</h1>
            <p className="text-muted-foreground mt-1">
              Add a YouTube video to show in the homepage video gallery.
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
                {submitting ? "Adding..." : "Add YouTube Video"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
