"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertCircle, Plus, Trash2, Upload } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { createMenuItem, updateMenuItem, getMenuItem, getMenuCategories } from "../lib/api"
import { toast } from "../hooks/use-toast"
import { useNavigate, useParams } from "react-router"
import { RichTextEditor } from "./ui/editor"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

export default function MenuItemForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    menuCategory: "",
    subcategory: "",
    route: "",
    name: "",
    position: 1,
    isActive: true,
    breadcrumbTitle: "",
    breadcrumbSubTitle: "",
    title: "",
    description: "",
    bannerImage: "",
    features: [] as Array<{ text: string }>,
    benefits: [] as Array<{ text: string }>,
    accordionItems: [] as Array<{ title: string; content: string; position: number }>,
    additionalContent: "",
  })
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getMenuCategories()
        // Handle both paginated response and direct array
        const categoriesArray = Array.isArray(data) ? data : (data.categories || [])
        setCategories(categoriesArray)
      } catch (err) {
        console.error("Error fetching categories:", err)
        setCategories([]) // Set empty array on error to prevent crashes
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (isEdit && id) {
      const fetchItem = async () => {
        try {
          setLoading(true)
          const data = await getMenuItem(id)
          const pageContent = data.pageContent || {}
          setFormData({
            menuCategory: data.menuCategory || "",
            subcategory: data.subcategory || "",
            route: data.route || "",
            name: data.name || "",
            position: data.position || 1,
            isActive: data.isActive !== undefined ? data.isActive : true,
            breadcrumbTitle: pageContent.breadcrumbTitle || "",
            breadcrumbSubTitle: pageContent.breadcrumbSubTitle || "",
            title: pageContent.title || "",
            description: pageContent.description || "",
            bannerImage: pageContent.bannerImage || "",
            features: pageContent.features || [],
            benefits: pageContent.benefits || [],
            accordionItems: pageContent.accordionItems || [],
            additionalContent: pageContent.additionalContent || "",
          })
          if (pageContent.bannerImage && !pageContent.bannerImage.startsWith('http')) {
            setBannerPreview(`${process.env.REACT_APP_API_URL || "https://service.mwalimubank.co.tz"}/${pageContent.bannerImage}`)
          } else if (pageContent.bannerImage) {
            setBannerPreview(pageContent.bannerImage)
          }
        } catch (err: any) {
          toast({
            title: "Error",
            description: err.message || "Failed to load menu item",
            variant: "destructive",
          })
          navigate("/menu-items")
        } finally {
          setLoading(false)
        }
      }
      fetchItem()
    }
  }, [id, isEdit, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: name === "position" ? parseInt(value) || 0 : value }))
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setBannerPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, { text: "" }] }))
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }))
  }

  const updateFeature = (index: number, text: string) => {
    const updated = [...formData.features]
    updated[index] = { text }
    setFormData((prev) => ({ ...prev, features: updated }))
  }

  const addBenefit = () => {
    setFormData((prev) => ({ ...prev, benefits: [...prev.benefits, { text: "" }] }))
  }

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== index) }))
  }

  const updateBenefit = (index: number, text: string) => {
    const updated = [...formData.benefits]
    updated[index] = { text }
    setFormData((prev) => ({ ...prev, benefits: updated }))
  }

  const addAccordionItem = () => {
    setFormData((prev) => ({
      ...prev,
      accordionItems: [
        ...prev.accordionItems,
        { title: "", content: "", position: prev.accordionItems.length + 1 },
      ],
    }))
  }

  const removeAccordionItem = (index: number) => {
    setFormData((prev) => ({ ...prev, accordionItems: prev.accordionItems.filter((_, i) => i !== index) }))
  }

  const updateAccordionItem = (index: number, field: string, value: any) => {
    const updated = [...formData.accordionItems]
    updated[index] = { ...updated[index], [field]: field === "position" ? parseInt(value) || 0 : value }
    setFormData((prev) => ({ ...prev, accordionItems: updated }))
  }

  const validateForm = () => {
    const newErrors: string[] = []
    if (!formData.menuCategory) newErrors.push("Menu category is required")
    if (!formData.subcategory) newErrors.push("Subcategory is required")
    if (!formData.route) newErrors.push("Route is required")
    if (!formData.name) newErrors.push("Name is required")
    if (!formData.title) newErrors.push("Title is required")
    if (!formData.breadcrumbTitle) newErrors.push("Breadcrumb title is required")
    if (formData.position < 1) newErrors.push("Position must be at least 1")
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    const data = new FormData()
    data.append("menuCategory", formData.menuCategory)
    data.append("subcategory", formData.subcategory)
    data.append("route", formData.route)
    data.append("name", formData.name)
    data.append("position", formData.position.toString())
    data.append("isActive", formData.isActive.toString())
    data.append("breadcrumbTitle", formData.breadcrumbTitle)
    data.append("breadcrumbSubTitle", formData.breadcrumbSubTitle)
    data.append("title", formData.title)
    data.append("description", formData.description)
    data.append("features", JSON.stringify(formData.features))
    data.append("benefits", JSON.stringify(formData.benefits))
    data.append("accordionItems", JSON.stringify(formData.accordionItems))
    data.append("additionalContent", formData.additionalContent)
    if (bannerFile) {
      data.append("bannerImage", bannerFile)
    } else if (formData.bannerImage) {
      data.append("bannerImage", formData.bannerImage)
    }

    try {
      if (isEdit && id) {
        await updateMenuItem(id, data)
        toast({
          title: "Success",
          description: "Menu item updated successfully!",
        })
      } else {
        await createMenuItem(data)
        toast({
          title: "Success",
          description: "Menu item created successfully!",
        })
      }
      navigate("/menu-items")
    } catch (err: any) {
      setErrors([err.message || "Something went wrong"])
      toast({
        title: "Error",
        description: err.message || "Failed to save menu item",
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

  const selectedCategory = Array.isArray(categories) ? categories.find(c => c.name === formData.menuCategory) : null
  const subcategories = selectedCategory?.subcategories || []

  return (
    <DashboardLayout>
      <div className="w-full bg-background min-h-screen">
        <div className="max-w-5xl p-6 md:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              {isEdit ? "Edit Menu Item" : "Add New Menu Item"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEdit ? "Update menu item and page content." : "Create a new menu item with page content."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
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

            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="menuCategory">Menu Category *</Label>
                  <Select
                    value={formData.menuCategory}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, menuCategory: value, subcategory: "" }))
                    }}
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat.name}>
                          {cat.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory *</Label>
                  {subcategories.length > 0 ? (
                    <Select
                      value={formData.subcategory}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, subcategory: value }))}
                      disabled={submitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map((sub: any) => (
                          <SelectItem key={sub.name} value={sub.name}>
                            {sub.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="subcategory"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      placeholder="Enter subcategory"
                      disabled={submitting}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="route">Route *</Label>
                  <Input
                    id="route"
                    name="route"
                    value={formData.route}
                    onChange={handleInputChange}
                    placeholder="/Transactional-Account"
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Personal Current"
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

                <div className="space-y-2 flex items-center pt-8">
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
            </div>

            {/* Page Content */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Page Content</h2>

              <div className="space-y-2">
                <Label htmlFor="banner-upload">Banner Image</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("banner-upload")?.click()}
                    disabled={submitting}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Banner
                  </Button>
                  <Input
                    id="banner-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerChange}
                    disabled={submitting}
                  />
                  {bannerPreview && (
                    <img src={bannerPreview} alt="Banner preview" className="h-20 w-auto rounded" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="breadcrumbTitle">Breadcrumb Title *</Label>
                  <Input
                    id="breadcrumbTitle"
                    name="breadcrumbTitle"
                    value={formData.breadcrumbTitle}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breadcrumbSubTitle">Breadcrumb Subtitle</Label>
                  <Input
                    id="breadcrumbSubTitle"
                    name="breadcrumbSubTitle"
                    value={formData.breadcrumbSubTitle}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Features</Label>
                <Button type="button" onClick={addFeature} variant="outline" size="sm" disabled={submitting}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature.text}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="Feature description"
                    disabled={submitting}
                  />
                  <Button
                    type="button"
                    onClick={() => removeFeature(index)}
                    variant="ghost"
                    size="icon"
                    disabled={submitting}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Benefits</Label>
                <Button type="button" onClick={addBenefit} variant="outline" size="sm" disabled={submitting}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Benefit
                </Button>
              </div>
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={benefit.text}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    placeholder="Benefit description"
                    disabled={submitting}
                  />
                  <Button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    variant="ghost"
                    size="icon"
                    disabled={submitting}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Accordion Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Accordion Items</Label>
                <Button type="button" onClick={addAccordionItem} variant="outline" size="sm" disabled={submitting}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Accordion Item
                </Button>
              </div>
              {formData.accordionItems.map((item, index) => (
                <div key={index} className="border border-border rounded-lg p-4 space-y-4 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Accordion Item {index + 1}</Label>
                    <Button
                      type="button"
                      onClick={() => removeAccordionItem(index)}
                      variant="ghost"
                      size="sm"
                      disabled={submitting}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => updateAccordionItem(index, "title", e.target.value)}
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Input
                        type="number"
                        value={item.position}
                        onChange={(e) => updateAccordionItem(index, "position", e.target.value)}
                        min="1"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Content *</Label>
                    <RichTextEditor
                      value={item.content}
                      onChange={(content) => updateAccordionItem(index, "content", content)}
                      placeholder="Enter accordion content..."
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Content */}
            <div className="space-y-2">
              <Label htmlFor="additionalContent">Additional Content</Label>
              <RichTextEditor
                value={formData.additionalContent}
                onChange={(content) => setFormData((prev) => ({ ...prev, additionalContent: content }))}
                placeholder="Enter any additional content (HTML supported)..."
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : isEdit ? "Update Item" : "Create Item"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/menu-items")} disabled={submitting}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

