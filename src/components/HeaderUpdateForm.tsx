"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircle } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { createHeaderUpdate } from "../lib/api"
import { toast } from "../hooks/use-toast"
import { useNavigate } from "react-router"
import { Checkbox } from "./ui/checkbox"

export default function HeaderUpdateForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    text: "",
    link: "",
    isActive: true,
  })
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

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
    if (!validateForm()) return

    setSubmitting(true)

    try {
      await createHeaderUpdate(formData)
      toast({
        title: "Success",
        description: "Header update created successfully!",
      })
      
      navigate("/header-update")
    } catch (err: any) {
      setErrors([err.message || "Something went wrong"])
      toast({
        title: "Error",
        description: err.message || "Failed to create header update",
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
            <h1 className="text-3xl font-bold text-foreground">Add New Header Update</h1>
            <p className="text-muted-foreground mt-1">
              Create a new update message to display in the website header.
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
                {submitting ? "Creating..." : "Add Header Update"}
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

