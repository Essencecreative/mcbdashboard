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
import { Edit, Trash2, Plus, Loader2, User } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { toast } from "../hooks/use-toast"
import { useNavigate } from "react-router"
import { getManagementMembers, deleteManagementMember } from "../lib/api"
import { useLanguage } from "../contexts/language-context"
import { usePagination } from "../hooks/use-pagination"
import { Pagination } from "./ui/pagination"

interface ManagementMember {
  _id: string
  position: number
  title: string
  fullName: string
  linkedinLink?: string
  photo?: string
  createdAt: string
}

export default function ManagementList() {
  const [members, setMembers] = useState<ManagementMember[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { currentPage, itemsPerPage, handlePageChange } = usePagination(10)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getManagementMembers(currentPage, itemsPerPage)
        setMembers(response.members || [])
        setTotalPages(response.totalPages || 1)
        setTotalCount(response.totalCount || 0)
      } catch (err: any) {
        console.error("Error fetching management members:", err)
        setError(err.message || "Failed to fetch management members")
        toast({
          title: "Error",
          description: "Failed to load management members. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [currentPage, itemsPerPage])

  const handleDelete = async (id: string) => {
    try {
      await deleteManagementMember(id)
      // Refetch data to update pagination
      const response = await getManagementMembers(currentPage, itemsPerPage)
      setMembers(response.members || [])
      setTotalPages(response.totalPages || 1)
      setTotalCount(response.totalCount || 0)
      setDeleteId(null)
      toast({
        title: t("team.deleted"),
        description: t("team.deleted"),
      })
    } catch (err: any) {
      console.error("Error deleting management member:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to delete management member",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (id: string) => {
    navigate(`/management/edit/${id}`)
  }

  const handleAddNew = () => {
    navigate("/management/new")
  }

  return (
    <DashboardLayout>
      <div className="w-full bg-background min-h-screen">
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-full overflow-x-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("team.management")}</h1>
              <p className="text-muted-foreground mt-1">
                {t("team.manageManagement")}
              </p>
            </div>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("team.addManagement")}
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-4">Loading management members...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm text-red-600">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg text-muted-foreground">No management members yet.</p>
              <p className="text-sm text-muted-foreground">
                {t("team.createFirst")}
              </p>
            </div>
          ) : (
            <div className="w-full max-w-full overflow-x-auto">
              <div className="rounded-lg border border-border overflow-hidden shadow-sm min-w-full">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Position</TableHead>
                    <TableHead className="w-16">Photo</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">LinkedIn</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell className="font-medium">
                        {member.position}
                      </TableCell>
                      <TableCell>
                        <div className="w-12 h-12 rounded overflow-hidden border">
                          <img
                            src={member.photo?.startsWith('http') ? member.photo : `${process.env.REACT_APP_API_URL || "https://service.mwalimubank.co.tz"}/${member.photo}`}
                            alt={member.fullName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/48"
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {member.fullName}
                      </TableCell>
                      <TableCell>
                        {member.title}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {member.linkedinLink ? (
                          <a
                            href={member.linkedinLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View Profile
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(member._id)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setDeleteId(member._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Management Member?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete "
                                  <span className="font-medium">{member.fullName}</span>".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeleteId(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(deleteId!)}
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
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {t("table.showing")} {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} {t("table.of")} {totalCount} {t("table.results")}
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

