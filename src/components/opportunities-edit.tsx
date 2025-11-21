import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import DashboardLayout from "./dashboard-layout"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { FileIcon, SaveIcon, Loader2 } from "lucide-react"
import { toast } from "../hooks/use-toast"

export default function EditOpportunityPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [existingDocumentUrl, setExistingDocumentUrl] = useState<string>("")

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:5000/opportunities/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) throw new Error("Failed to fetch opportunity")
        const data = await res.json()
        setTitle(data.title || "")
        setDescription(data.description || "")
        setExistingDocumentUrl(data.documentUrl || "")
      } catch (err: any) {
        console.error(err)
        toast({
          title: "Error",
          description: err.message || "Failed to load opportunity",
          variant: "destructive",
        })
        navigate("/opportunities")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchOpportunity()
    }
  }, [id, navigate])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const token = localStorage.getItem("token")
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("category", "job")
    if (existingDocumentUrl) {
      formData.append("existingDocumentUrl", existingDocumentUrl)
    }
    if (file) {
      formData.append("document", file)
    }

    try {
      const res = await fetch(`http://localhost:5000/opportunities/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) throw new Error("Failed to update opportunity")

      toast({
        title: "Success",
        description: "Opportunity updated successfully!",
      })
      setIsSubmitting(false)
      navigate("/opportunities")
    } catch (err: any) {
      console.error(err)
      setIsSubmitting(false)
      toast({
        title: "Error",
        description: err.message || "Failed to update opportunity",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading opportunity...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Opportunity</h1>
          <p className="text-muted-foreground">Update job vacancy listing details.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter opportunity title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value="Job Vacancy"
                  disabled
                  className="bg-muted"
                />
                <input type="hidden" name="category" value="job" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the opportunity..."
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Upload Document (PDF, DOCX)</Label>
                {existingDocumentUrl && (
                  <div className="mb-2">
                    <p className="text-sm text-muted-foreground mb-1">Current document:</p>
                    <a
                      href={existingDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {existingDocumentUrl}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    disabled={isSubmitting}
                  />
                  <Button type="button" variant="outline" size="icon" disabled={isSubmitting}>
                    <FileIcon className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave empty to keep existing document, or upload a new one to replace it.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => navigate("/opportunities")} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Updating...</>
                ) : (
                  <>
                    <SaveIcon className="mr-2 h-4 w-4" />
                    Update Opportunity
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}

