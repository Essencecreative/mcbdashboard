"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircle, Upload } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { createBoardMember } from "../lib/api"
import { toast } from "../hooks/use-toast"
import { useNavigate } from "react-router"
import { useLanguage } from "../contexts/language-context"

export default function BoardOfDirectorsForm() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    position: "",
    title: "",
    fullName: "",
    linkedinLink: "",
  })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (!formData.position) newErrors.push("Position is required")
    if (!formData.title) newErrors.push("Title is required")
    if (!formData.fullName) newErrors.push("Full name is required")
    if (!image) newErrors.push("Photo is required")

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    const data = new FormData()
    data.append("position", formData.position)
    data.append("title", formData.title)
    data.append("fullName", formData.fullName)
    data.append("linkedinLink", formData.linkedinLink)
    if (image) data.append("photo", image)

    try {
      await createBoardMember(data)
      toast({
        title: "Success",
        description: "Board member created successfully!",
      })
      
      navigate("/board-of-directors")
    } catch (err: any) {
      setErrors([err.message || "Something went wrong"])
      toast({
        title: "Error",
        description: err.message || "Failed to create board member",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="w-full bg-background min-h-screen">
        <div className="max-w-3xl p-6 md:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{t("team.addBoardMember")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("team.addBoardMember")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="position" className="text-base font-medium">
                {t("team.position")} <span className="text-muted-foreground text-sm">(for ordering)</span>
              </Label>
              <Input
                id="position"
                name="position"
                type="number"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="e.g., 1"
                min="0"
                disabled={submitting}
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-3">
              <Label htmlFor="photo-upload" className="text-base font-medium">
                {t("team.photo")}
              </Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                  disabled={submitting}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {t("common.choose")} {t("team.photo")}
                </Button>
                <Input
                  id="photo-upload"
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
              {imagePreview && (
                <div className="mt-4 rounded-xl overflow-hidden border border-border shadow-sm">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-base font-medium">
                {t("team.name")}
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g., John Doe"
                disabled={submitting}
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">
                {t("team.position")}
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Chief Executive Officer"
                disabled={submitting}
              />
            </div>

            {/* LinkedIn Link */}
            <div className="space-y-2">
              <Label htmlFor="linkedinLink" className="text-base font-medium">
                LinkedIn Link <span className="text-muted-foreground text-sm">(optional)</span>
              </Label>
              <Input
                id="linkedinLink"
                name="linkedinLink"
                type="url"
                value={formData.linkedinLink}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/username"
                disabled={submitting}
              />
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
                {submitting ? t("common.loading") : t("team.addBoardMember")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/board-of-directors")}
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

