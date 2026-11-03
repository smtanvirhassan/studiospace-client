"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import PrivateRoute from "@/components/PrivateRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import { API_URL, authFetch } from "@/lib/api";
import toast from "react-hot-toast";

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Art Workshop",
];

const amenityOptions = [
  "WiFi",
  "Air Conditioning",
  "Parking",
  "Green Screen",
  "Lighting Kit",
  "Sound System",
  "Projector",
  "Whiteboard",
  "Kitchen",
  "Restroom",
  "Wheelchair Access",
  "Storage",
  "Makeup Room",
  "Changing Room",
  "Soundproofing",
];

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
  ownerEmail: string;
  ownerName: string;
}

export default function UpdateStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <PrivateRoute>
      <UpdateStudioForm id={id} />
    </PrivateRoute>
  );
}

function UpdateStudioForm({ id }: { id: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  useEffect(() => {
    fetchStudio();
  }, [id]);

  const fetchStudio = async () => {
    try {
      const res = await fetch(`${API_URL}/api/studios/${id}`);
      const data = await res.json();
      setStudio(data);
      setSelectedAmenities(data.amenities || []);
    } catch (error) {
      console.error("Error fetching studio:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const updatedData = {
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      hourlyRate: formData.get("hourlyRate") as string,
      securityDeposit: formData.get("securityDeposit") as string,
      maxCapacity: formData.get("maxCapacity") as string,
      location: formData.get("location") as string,
      imageUrl: formData.get("imageUrl") as string,
      amenities: selectedAmenities,
      overview: formData.get("overview") as string,
    };

    try {
      const res = await authFetch(`${API_URL}/api/studios/${id}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        toast.success("Studio updated successfully!");
        router.push("/my-listings");
      } else {
        toast.error("Failed to update studio");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!studio)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Studio not found</h2>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Update Studio</h1>
        <p className="text-gray-500 mt-2">Edit your studio listing details</p>
      </div>

      <div className="card bg-base-100 shadow-lg border border-base-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Studio Title</span>
            </label>
            <input
              type="text"
              name="title"
              defaultValue={studio.title}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Category & Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Category</span>
              </label>
              <select
                name="category"
                defaultValue={studio.category}
                className="select select-bordered w-full"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Hourly Rate ($)</span>
              </label>
              <input
                type="number"
                name="hourlyRate"
                defaultValue={studio.hourlyRate}
                className="input input-bordered w-full"
                min="1"
                required
              />
            </div>
          </div>

          {/* Security Deposit & Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Security Deposit ($)
                </span>
              </label>
              <input
                type="number"
                name="securityDeposit"
                defaultValue={studio.securityDeposit}
                className="input input-bordered w-full"
                min="0"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Max Capacity</span>
              </label>
              <input
                type="number"
                name="maxCapacity"
                defaultValue={studio.maxCapacity}
                className="input input-bordered w-full"
                min="1"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Location / Address</span>
            </label>
            <input
              type="text"
              name="location"
              defaultValue={studio.location}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Image URL */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Image URL</span>
            </label>
            <input
              type="url"
              name="imageUrl"
              defaultValue={studio.imageUrl}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Amenities */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Amenities</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((amenity) => (
                <label
                  key={amenity}
                  className={`cursor-pointer px-3 py-2 rounded-full border text-sm transition-colors ${
                    selectedAmenities.includes(amenity)
                      ? "bg-indigo-500 text-white border-indigo-500"
                      : "border-base-300 hover:border-indigo-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          {/* Overview */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Detailed Overview</span>
            </label>
            <textarea
              name="overview"
              defaultValue={studio.overview}
              className="textarea textarea-bordered w-full h-32"
              required
            ></textarea>
          </div>

          {/* Read-only Host Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Host Name</span>
              </label>
              <input
                type="text"
                value={studio.ownerName || user?.displayName || ""}
                className="input input-bordered w-full bg-base-200"
                readOnly
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Host Email</span>
              </label>
              <input
                type="email"
                value={studio.ownerEmail || user?.email || ""}
                className="input input-bordered w-full bg-base-200"
                readOnly
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn bg-indigo-500 text-white hover:bg-indigo-600 w-full text-lg"
            disabled={submitting}
          >
            {submitting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Update Studio"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
