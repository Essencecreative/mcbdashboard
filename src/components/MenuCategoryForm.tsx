"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertCircle, Plus, Trash2 } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { createMenuCategory, updateMenuCategory, getMenuCategory } from "../lib/api"
import { toast } from "../hooks/use-toast"
import { useNavigate, useParams } from "react-router"

export default function MenuCategoryForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    position: 1,
    isActive: true,
    subcategories: [] as Array<{
      name: string
      displayName: string
      position: number
      route: string
      isActive: boolean
    }>,
  })
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (isEdit && id) {
      const fetchCategory = async () => {
        try {
          setLoading(true)
          const data = await getMenuCategory(id)
          setFormData({
            name: data.name || "",
            displayName: data.displayName || "",
            position: data.position || 1,
            isActive: data.isActive !== undefined ? data.isActive : true,
            subcategories: data.subcategories || [],
          })
        } catch (err: any) {
          toast({
            title: "Error",
            description: err.message || "Failed to load menu category",
            variant: "destructive",
          })
          navigate("/menu-categories")
        } finally {
          setLoading(false)
        }
      }
      fetchCategory()
    }
  }, [id, isEdit, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: name === "position" ? parseInt(value) || 0 : value }))
  }

  const handleSubcategoryChange = (index: number, field: string, value: any) => {
    const updated = [...formData.subcategories]
    updated[index] = { ...updated[index], [field]: field === "position" ? parseInt(value) || 0 : value }
    setFormData((prev) => ({ ...prev, subcategories: updated }))
  }

  const addSubcategory = () => {
    setFormData((prev) => ({
      ...prev,
      subcategories: [
        ...prev.subcategories,
        { name: "", displayName: "", position: prev.subcategories.length + 1, route: "", isActive: true },
      ],
    }))
  }

  const removeSubcategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index),
    }))
  }

  const validateForm = () => {
    const newErrors: string[] = []
    if (!formData.name) newErrors.push("Name is required")
    if (!formData.displayName) newErrors.push("Display name is required")
    if (formData.position < 1) newErrors.push("Position must be at least 1")
    
    formData.subcategories.forEach((sub, index) => {
      if (!sub.name) newErrors.push(`Subcategory ${index + 1}: Name is required`)
      if (!sub.displayName) newErrors.push(`Subcategory ${index + 1}: Display name is required`)
      if (!sub.route) newErrors.push(`Subcategory ${index + 1}: Route is required`)
    })

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      if (isEdit && id) {
        await updateMenuCategory(id, formData)
        toast({
          title: "Success",
          description: "Menu category updated successfully!",
        })
      } else {
        await createMenuCategory(formData)
        toast({
          title: "Success",
          description: "Menu category created successfully!",
        })
      }
      navigate("/menu-categories")
    } catch (err: any) {
      setErrors([err.message || "Something went wrong"])
      toast({
        title: "Error",
        description: err.message || "Failed to save menu category",
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
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="w-full bg-background min-h-screen">
        <div className="max-w-4xl p-6 md:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              {isEdit ? "Edit Menu Category" : "Add New Menu Category"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEdit ? "Update menu category details." : "Create a new menu category with subcategories."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="personal"
                  disabled={isEdit || submitting}
                />
                <p className="text-xs text-muted-foreground">e.g., personal, business, bancassurance</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="Personal"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  name="position"
                  type="number"
                  value={formData.position}
                  onChange={handleInputChange}
                  min="1"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2 flex items-center">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isActive: checked as boolean }))
                  }
                  disabled={submitting}
                />
                <Label htmlFor="isActive" className="ml-2 cursor-pointer">
                  Active
                </Label>
              </div>
            </div>

            {/* Subcategories */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Subcategories</Label>
                <Button type="button" onClick={addSubcategory} variant="outline" size="sm" disabled={submitting}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subcategory
                </Button>
              </div>

              {formData.subcategories.map((sub, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-base">Subcategory {index + 1}</Label>
                    <Button
                      type="button"
                      onClick={() => removeSubcategory(index)}
                      variant="ghost"
                      size="sm"
                      disabled={submitting}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input
                        value={sub.name}
                        onChange={(e) => handleSubcategoryChange(index, "name", e.target.value)}
                        placeholder="Transactional Account"
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Display Name *</Label>
                      <Input
                        value={sub.displayName}
                        onChange={(e) => handleSubcategoryChange(index, "displayName", e.target.value)}
                        placeholder="Transactional Account"
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Route *</Label>
                      <Input
                        value={sub.route}
                        onChange={(e) => handleSubcategoryChange(index, "route", e.target.value)}
                        placeholder="/Transactional-Account"
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Input
                        type="number"
                        value={sub.position}
                        onChange={(e) => handleSubcategoryChange(index, "position", e.target.value)}
                        min="1"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      checked={sub.isActive}
                      onCheckedChange={(checked) =>
                        handleSubcategoryChange(index, "isActive", checked)
                      }
                      disabled={submitting}
                    />
                    <Label className="ml-2 cursor-pointer">Active</Label>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/menu-categories")} disabled={submitting}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

