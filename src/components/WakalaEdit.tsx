"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { getWakala, updateWakala } from "../lib/api"
import { toast } from "../hooks/use-toast"
import { regions, getDistrictsByRegion } from "../utils/tanzaniaRegions"

export default function WakalaEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    district: "",
    address: "",
    phone: "",
    isActive: true,
  })
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([])

  useEffect(() => {
    const fetchWakala = async () => {
      try {
        setLoading(true)
        const wakala = await getWakala(id!)
        setFormData({
          name: wakala.name || "",
          region: wakala.region || "",
          district: wakala.district || "",
          address: wakala.address || "",
          phone: wakala.phone || "",
          isActive: wakala.isActive !== undefined ? wakala.isActive : true,
        })
        // Load districts for the region
        if (wakala.region) {
          const districts = getDistrictsByRegion(wakala.region)
          setAvailableDistricts(districts)
        }
      } catch (err: any) {
        console.error("Error fetching wakala location:", err)
        toast({
          title: "Error",
          description: err.message || "Failed to load wakala location",
          variant: "destructive",
        })
        navigate("/wakala")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchWakala()
    }
  }, [id, navigate])

  useEffect(() => {
    if (formData.region) {
      const districts = getDistrictsByRegion(formData.region)
      setAvailableDistricts(districts)
      // Reset district if it's not in the new region's districts
      if (formData.district && !districts.includes(formData.district)) {
        setFormData(prev => ({ ...prev, district: "" }))
      }
    } else {
      setAvailableDistricts([])
    }
  }, [formData.region])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const validateForm = () => {
    const newErrors: string[] = []

    if (!formData.name.trim()) newErrors.push("Name is required")
    if (!formData.region.trim()) newErrors.push("Region is required")
    if (!formData.district.trim()) newErrors.push("District is required")
    if (!formData.address.trim()) newErrors.push("Address is required")
    if (!formData.phone.trim()) newErrors.push("Phone is required")

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      await updateWakala(id!, formData)
      toast({
        title: "Success",
        description: "Wakala location updated successfully!",
      })
      navigate("/wakala")
    } catch (err: any) {
      setErrors([err.message || "Something went wrong"])
      toast({
        title: "Error",
        description: err.message || "Failed to update wakala location",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
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
        <div className="max-w-3xl p-6 md:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Wakala Location</h1>
            <p className="text-muted-foreground mt-1">
              Update wakala location information.
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
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                Wakala Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Mwalimu Wakala - Kirumba"
                required
                disabled={submitting}
              />
            </div>

            {/* Region */}
            <div className="space-y-2">
              <Label htmlFor="region" className="text-base font-medium">
                Region <span className="text-red-500">*</span>
              </Label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select Region</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="space-y-2">
              <Label htmlFor="district" className="text-base font-medium">
                District <span className="text-red-500">*</span>
              </Label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                required
                disabled={submitting || !formData.region}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">{formData.region ? "Select District" : "Select Region First"}</option>
                {availableDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-base font-medium">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="e.g., Sam Nujoma Road, City Center"
                required
                disabled={submitting}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-medium">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g., +255 715 987 654"
                required
                disabled={submitting}
              />
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
                className="h-4 w-4 rounded border-gray-300"
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
                onClick={() => navigate("/wakala")}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Updating..." : "Update Wakala Location"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

