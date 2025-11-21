"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, Upload, Plus, X, Loader2 } from "lucide-react";
import DashboardLayout from "./dashboard-layout";
import { getProduct, updateProduct } from "../lib/api";
import { toast } from "../hooks/use-toast";
import { useLanguage } from "../contexts/language-context";

interface Feature {
  id: string;
  text: string;
}

export default function WaysToBankEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
  });
  const [features, setFeatures] = useState<Feature[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  // Limits (same as before)
  const MAX_TITLE_WORDS = 5;
  const MAX_DESC_WORDS = 50;
  const MAX_TITLE_CHARS = 40;
  const MAX_DESC_CHARS = 300;
  const MAX_FEATURES = 5;

  // Fetch product data on mount
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setErrors(["Product ID is missing"]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const product = await getProduct(id);
        
        // Populate form with existing data
        setFormData({
          title: product.title || "",
          description: product.description || "",
          buttonText: product.buttonText || "",
          buttonLink: product.buttonLink || "",
        });

        // Set features
        if (product.features && Array.isArray(product.features)) {
          const mappedFeatures = product.features.map((text: string, index: number) => ({
            id: `feature-${index}`,
            text: text,
          }));
          setFeatures(mappedFeatures);
        }

        // Set current image URL
        if (product.image) {
          const imageUrl = product.image.startsWith('http') 
            ? product.image 
            : `http://localhost:5000/${product.image}`;
          setCurrentImageUrl(imageUrl);
          setImagePreview(imageUrl);
        }
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setErrors([err.message || "Failed to load product"]);
        toast({
          title: "Error",
          description: "Failed to load product. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addFeature = () => {
    if (!newFeature.trim() || features.length >= MAX_FEATURES) return;
    const featureId = Date.now().toString();
    setFeatures((prev) => [...prev, { id: featureId, text: newFeature.trim() }]);
    setNewFeature("");
  };

  const removeFeature = (featureId: string) => {
    setFeatures((prev) => prev.filter((f) => f.id !== featureId));
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    const titleWords = formData.title.trim().split(/\s+/).length;
    if (!formData.title) newErrors.push("Title is required");
    else if (titleWords > MAX_TITLE_WORDS || formData.title.length > MAX_TITLE_CHARS)
      newErrors.push(`Title: max ${MAX_TITLE_WORDS} words / ${MAX_TITLE_CHARS} chars`);

    const descWords = formData.description.trim().split(/\s+/).length;
    if (!formData.description) newErrors.push("Description is required");
    else if (descWords > MAX_DESC_WORDS || formData.description.length > MAX_DESC_CHARS)
      newErrors.push(`Description: max ${MAX_DESC_WORDS} words / ${MAX_DESC_CHARS} chars`);

    if (!formData.buttonText) newErrors.push("Button text is required");
    if (!formData.buttonLink) newErrors.push("Button link is required");
    // Image is optional on edit (can keep existing)
    if (features.length === 0) newErrors.push("At least one feature is required");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !id) return;

    setSubmitting(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("buttonText", formData.buttonText);
    data.append("buttonLink", formData.buttonLink);
    data.append("features", JSON.stringify(features.map((f) => f.text)));
    if (image) data.append("image", image);

    try {
      await updateProduct(id, data);
      toast({
        title: "Success",
        description: "Product updated successfully!",
      });
      
      // Navigate back to products list
      navigate("/products");
    } catch (err: any) {
      setErrors([err.message || "Something went wrong"]);
      toast({
        title: "Error",
        description: err.message || "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="w-full bg-background min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-4">Loading product...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full bg-background min-h-screen">
        <div className="max-w-4xl p-6 md:p-8 lg:p-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{t("products.editProduct")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("products.updateProduct")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload */}
            <div className="space-y-3">
              <Label className="text-base font-medium">{t("products.image")}</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image-upload")?.click()}
                  disabled={submitting}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {image ? t("common.upload") : t("common.upload") + " " + t("products.image")}
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={submitting}
                />
              </div>
              {image && (
                <p className="text-sm text-muted-foreground">
                  New image selected: <span className="font-medium">{image.name}</span>
                </p>
              )}
              {!image && currentImageUrl && (
                <p className="text-sm text-muted-foreground">
                  Current image will be kept. Upload a new image to replace it.
                </p>
              )}
              {imagePreview && (
                <div className="mt-4 rounded-xl overflow-hidden border border-border shadow-sm">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-80 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                {t("products.name")}{" "}
                <span className="text-muted-foreground text-sm">
                  (max {MAX_TITLE_WORDS} words)
                </span>
              </Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Mwalimu Mobile"
                maxLength={MAX_TITLE_CHARS}
                disabled={submitting}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                {t("products.description")}{" "}
                <span className="text-muted-foreground text-sm">
                  (max {MAX_DESC_WORDS} words)
                </span>
              </Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Explain the banking method..."
                maxLength={MAX_DESC_CHARS}
                rows={5}
                className="resize-none"
                disabled={submitting}
              />
            </div>

            {/* Features */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Features{" "}
                <span className="text-muted-foreground text-sm">
                  (max {MAX_FEATURES})
                </span>
              </Label>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                  placeholder="e.g., Anywhere, anytime."
                  maxLength={50}
                  disabled={submitting}
                />
                <Button
                  type="button"
                  onClick={addFeature}
                  disabled={
                    !newFeature.trim() ||
                    features.length >= MAX_FEATURES ||
                    submitting
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {features.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {f.text}
                    <button
                      type="button"
                      onClick={() => removeFeature(f.id)}
                      className="ml-1 hover:text-blue-900"
                      disabled={submitting}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Button Text & Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-base font-medium">Button Text</Label>
                <Input
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleInputChange}
                  placeholder="e.g., Learn More"
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base font-medium">Button Link</Label>
                <Input
                  name="buttonLink"
                  value={formData.buttonLink}
                  onChange={handleInputChange}
                  placeholder="e.g., https://mwalimubank.com"
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Please fix the following:</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 space-y-1 text-sm">
                    {errors.map((error, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <span className="text-red-600">•</span> {error}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Submit */}
            <div className="pt-4 flex gap-4">
              <Button
                type="submit"
                size="lg"
                className="px-8"
                disabled={submitting}
              >
                {submitting ? t("common.loading") : t("common.save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate("/products")}
                disabled={submitting}
              >
                {t("common.cancel")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

