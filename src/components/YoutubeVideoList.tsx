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
import { Edit, Trash2, Plus, Loader2, Youtube } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { toast } from "../hooks/use-toast"
import { useNavigate } from "react-router"
import { getYoutubeVideos, deleteYoutubeVideo } from "../lib/api"

interface YoutubeVideo {
  _id: string
  title: string
  description?: string
  youtubeId: string
  category?: string
  position: number
  isActive: boolean
  createdAt: string
}

export default function YoutubeVideoList() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getYoutubeVideos()
      setVideos(data)
    } catch (err: any) {
      setError(err.message || "Failed to load YouTube videos")
      toast({
        title: "Error",
        description: err.message || "Failed to load YouTube videos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteYoutubeVideo(id)
      toast({
        title: "Success",
        description: "YouTube video deleted successfully!",
      })
      fetchVideos()
      setDeleteId(null)
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete YouTube video",
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
              <h1 className="text-3xl font-bold text-gray-900">YouTube Videos</h1>
              <p className="text-muted-foreground mt-1">
                Manage YouTube videos displayed in the homepage gallery
              </p>
            </div>
            <Button onClick={() => navigate("/youtube-videos/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}

          {videos.length === 0 ? (
            <div className="text-center py-12">
              <Youtube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No YouTube videos found. Add your first video to get started.</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>YouTube ID</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="w-24">Position</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.map((video, index) => (
                    <TableRow key={video._id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate font-semibold" title={video.title}>
                          {video.title}
                        </div>
                        {video.description && (
                          <div className="truncate text-xs text-gray-500" title={video.description}>
                            {video.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{video.youtubeId}</TableCell>
                      <TableCell>
                        {video.category ? (
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold">
                            {video.category}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell>{video.position}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            video.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {video.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/youtube-videos/edit/${video._id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteId(video._id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete YouTube Video</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this YouTube video? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeleteId(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    if (deleteId) handleDelete(deleteId)
                                  }}
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
