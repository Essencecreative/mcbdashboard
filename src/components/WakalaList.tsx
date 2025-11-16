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
import { Edit, Trash2, Plus, Loader2, MapPin } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { toast } from "../hooks/use-toast"
import { useNavigate } from "react-router"
import { getWakalas, deleteWakala } from "../lib/api"

interface Wakala {
  _id: string
  name: string
  region: string
  district: string
  address: string
  phone: string
  isActive: boolean
  createdAt: string
}

export default function WakalaList() {
  const [wakalas, setWakalas] = useState<Wakala[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchWakalas = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getWakalas()
        setWakalas(response || [])
      } catch (err: any) {
        console.error("Error fetching wakala locations:", err)
        setError(err.message || "Failed to fetch wakala locations")
        toast({
          title: "Error",
          description: "Failed to load wakala locations. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWakalas()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteWakala(id)
      setWakalas(wakalas.filter((wakala) => wakala._id !== id))
      setDeleteId(null)
      toast({
        title: "Deleted",
        description: "Wakala location removed successfully.",
      })
    } catch (err: any) {
      console.error("Error deleting wakala location:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to delete wakala location",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (id: string) => {
    navigate(`/wakala/edit/${id}`)
  }

  const handleAddNew = () => {
    navigate("/wakala/new")
  }

  return (
    <DashboardLayout>
      <div className="w-full bg-white min-h-screen">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Wakala Locations</h1>
              <p className="text-gray-600 mt-1">Manage Mwalimu Wakala locations</p>
            </div>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Wakala
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          ) : wakalas.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No wakala locations found.</p>
              <Button onClick={handleAddNew} variant="outline">
                Add Your First Wakala Location
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wakalas.map((wakala) => (
                    <TableRow key={wakala._id}>
                      <TableCell className="font-medium">{wakala.name}</TableCell>
                      <TableCell>{wakala.region}</TableCell>
                      <TableCell>{wakala.district}</TableCell>
                      <TableCell className="max-w-xs truncate" title={wakala.address}>
                        {wakala.address}
                      </TableCell>
                      <TableCell>
                        <a href={`tel:${wakala.phone}`} className="text-blue-600 hover:underline">
                          {wakala.phone}
                        </a>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          wakala.isActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {wakala.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(wakala._id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => setDeleteId(wakala._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            {deleteId === wakala._id && (
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Wakala Location</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{wakala.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setDeleteId(null)}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(wakala._id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            )}
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

