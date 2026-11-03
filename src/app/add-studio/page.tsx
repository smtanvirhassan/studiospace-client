"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import PrivateRoute from "@/components/PrivateRoute";
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

export default function AddStudioPage() {
  return (
    <PrivateRoute>
      <AddStudioForm />
    </PrivateRoute>
  );
}

function AddStudioForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const studioData = {
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      hourlyRate: formData.get("hourlyRate") as string,
      securityDeposit: formData.get("securityDeposit") as string,
      maxCapacity: formData.get("maxCapacity") as string,
      location: formData.get("location") as string,
      imageUrl: formData.get("imageUrl") as string,
      amenities: selectedAmenities,
      overview: formData.get("overview") as string,
      ownerEmail: user?.email || "",
      ownerName: user?.displayName || "User",
    };

    try {
      const res = await authFetch(`${API_URL}/api/studios`, {
        method: "POST",
        body: JSON.stringify(studioData),
      });

      if (res.ok) {
        toast.success("Studio added successfully!");
        router.push("/my-listings");
      } else {
        toast.error("Failed to add studio");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Add New Studio</h1>
        <p className="text-gray-500 mt-2">
          List your creative workspace on StudioSpace
        </p>
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
              placeholder="Enter studio title"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Category & Rate Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Category</span>
              </label>
              <select name="category" className="select select-bordered w-full" required>
                <option value="">Select a category</option>
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
                placeholder="e.g., 50"
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
                placeholder="e.g., 100"
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
                placeholder="e.g., 10"
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
              placeholder="Enter studio location"
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
              placeholder="https://example.com/image.jpg"
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
              placeholder="Describe your studio space in detail..."
              className="textarea textarea-bordered w-full h-32"
              required
            ></textarea>
          </div>

          {/* Read-only User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Your Name</span>
              </label>
              <input
                type="text"
                value={user?.displayName || ""}
                className="input input-bordered w-full bg-base-200"
                readOnly
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Your Email</span>
              </label>
              <input
                type="email"
                value={user?.email || ""}
                className="input input-bordered w-full bg-base-200"
                readOnly
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn bg-indigo-500 text-white hover:bg-indigo-600 w-full text-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Add Studio"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
