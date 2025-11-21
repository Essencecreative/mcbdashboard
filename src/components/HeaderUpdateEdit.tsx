"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { getHeaderUpdate, updateHeaderUpdate } from "../lib/api"
import { toast } from "../hooks/use-toast"
import { useNavigate, useParams } from "react-router"
import { Checkbox } from "./ui/checkbox"

export default function HeaderUpdateEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    text: "",
    link: "",
    isActive: false,
  })
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUpdate = async () => {
      if (!id) return

      try {
        setLoading(true)
        const update = await getHeaderUpdate(id)
        setFormData({
          text: update.text || "",
          link: update.link || "",
          isActive: update.isActive || false,
        })
      } catch (err: any) {
        console.error("Error fetching header update:", err)
        toast({
          title: "Error",
          description: err.message || "Failed to load header update",
          variant: "destructive",
        })
        navigate("/header-update")
      } finally {
        setLoading(false)
      }
    }

    fetchUpdate()
  }, [id, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const validateForm = () => {
    const newErrors: string[] = []

    if (!formData.text.trim()) newErrors.push("Update text is required")
    if (formData.text.length > 200) newErrors.push("Update text cannot exceed 200 characters")

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !id) return

    setSubmitting(true)

    try {
      await updateHeaderUpdate(id, formData)
      toast({
        title: "Success",
        description: "Header update updated successfully!",
      })
      
      navigate("/header-update")
    } catch (err: any) {
      setErrors([err.message || "Something went wrong"])
      toast({
        title: "Error",
        description: err.message || "Failed to update header update",
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
            <p className="text-sm text-muted-foreground mt-4">Loading header update...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="w-full bg-background min-h-screen">
        <div className="max-w-3xl p-6 md:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Edit Header Update</h1>
            <p className="text-muted-foreground mt-1">
              Update the header update message.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Update Text */}
            <div className="space-y-2">
              <Label htmlFor="text" className="text-base font-medium">
                Update Text <span className="text-muted-foreground text-sm">(max 200 characters)</span>
              </Label>
              <Input
                id="text"
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                placeholder="e.g., Mwalimu Commercial Bank AGM 2025."
                maxLength={200}
                disabled={submitting}
              />
              <p className="text-sm text-muted-foreground">
                {formData.text.length}/200 characters
              </p>
            </div>

            {/* Link */}
            <div className="space-y-2">
              <Label htmlFor="link" className="text-base font-medium">
                Link <span className="text-muted-foreground text-sm">(optional)</span>
              </Label>
              <Input
                id="link"
                name="link"
                type="url"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="https://example.com or /page-path"
                disabled={submitting}
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleCheckboxChange}
                disabled={submitting}
              />
              <Label htmlFor="isActive" className="text-base font-medium cursor-pointer">
                Set as active update
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Only one update can be active at a time. Setting this as active will deactivate all other updates.
            </p>

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
                {submitting ? "Updating..." : "Update Header Update"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/header-update")}
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

