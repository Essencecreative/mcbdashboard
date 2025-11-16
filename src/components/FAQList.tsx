"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Button } from "./ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Edit, Trash2, Plus, Loader2, HelpCircle } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { toast } from "../hooks/use-toast"
import { useNavigate } from "react-router"
import { getFAQs, deleteFAQ } from "../lib/api"

interface FAQ {
  _id: string
  question: string
  answer: string
  position: number
  isActive: boolean
  createdAt: string
}

export default function FAQList() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getFAQs()
      setFaqs(data)
    } catch (err: any) {
      setError(err.message || "Failed to load FAQs")
      toast({
        title: "Error",
        description: err.message || "Failed to load FAQs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteFAQ(id)
      toast({
        title: "Success",
        description: "FAQ deleted successfully!",
      })
      fetchFAQs()
      setDeleteId(null)
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete FAQ",
        variant: "destructive",
      })
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
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FAQs</h1>
              <p className="text-muted-foreground mt-1">
                Manage frequently asked questions
              </p>
            </div>
            <Button onClick={() => navigate("/faqs/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}

          {faqs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No FAQs found. Create your first FAQ to get started.</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead className="max-w-md">Answer</TableHead>
                    <TableHead className="w-24">Position</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faqs.map((faq, index) => (
                    <TableRow key={faq._id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate" title={faq.question}>
                          {faq.question}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate" title={faq.answer}>
                          {faq.answer.substring(0, 100)}
                          {faq.answer.length > 100 ? "..." : ""}
                        </div>
                      </TableCell>
                      <TableCell>{faq.position}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            faq.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {faq.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/faqs/edit/${faq._id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteId(faq._id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this FAQ? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeleteId(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(faq._id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

