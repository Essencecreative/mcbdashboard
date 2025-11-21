"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { getFAQ, updateFAQ } from "../lib/api"
import { toast } from "../hooks/use-toast"
import { useLanguage } from "../contexts/language-context"

export default function FAQEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    position: 0,
    isActive: true,
  })
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        setLoading(true)
        const faq = await getFAQ(id!)
        setFormData({
          question: faq.question || "",
          answer: faq.answer || "",
          position: faq.position !== undefined ? faq.position : 0,
          isActive: faq.isActive !== undefined ? faq.isActive : true,
        })
      } catch (err: any) {
        console.error("Error fetching FAQ:", err)
        toast({
          title: "Error",
          description: err.message || "Failed to load FAQ",
          variant: "destructive",
        })
        navigate("/faqs")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchFAQ()
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

    if (!formData.question.trim()) newErrors.push(t("faq.question") + " " + t("common.required"))
    if (!formData.answer.trim()) newErrors.push(t("faq.answer") + " " + t("common.required"))

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      await updateFAQ(id!, formData)
      toast({
        title: t("common.success"),
        description: t("faq.saved"),
      })
      navigate("/faqs")
    } catch (err: any) {
      setErrors([err.message || "Something went wrong"])
      toast({
        title: t("common.error"),
        description: err.message || t("faq.saveError"),
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
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="w-full bg-background min-h-screen">
        <div className="max-w-3xl p-6 md:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{t("faq.editFaq")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("faq.updateFaq")}
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
            {/* Question */}
            <div className="space-y-2">
              <Label htmlFor="question" className="text-base font-medium">
                {t("faq.question")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="question"
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                placeholder="e.g., Huduma za MCB zinapatikana wapi na wapi?"
                required
                disabled={submitting}
              />
            </div>

            {/* Answer */}
            <div className="space-y-2">
              <Label htmlFor="answer" className="text-base font-medium">
                {t("faq.answer")} <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="answer"
                name="answer"
                value={formData.answer}
                onChange={handleInputChange}
                placeholder="Enter the answer to the question..."
                required
                disabled={submitting}
                rows={8}
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
                className="h-4 w-4 rounded border-border"
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
                onClick={() => navigate("/faqs")}
                disabled={submitting}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? t("common.loading") : t("common.save")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

