"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import PrivateRoute from "@/components/PrivateRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import { API_URL, authFetch } from "@/lib/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus, FaMapMarkerAlt } from "react-icons/fa";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  imageUrl: string;
  rating: number;
}

export default function MyListingsPage() {
  return (
    <PrivateRoute>
      <MyListingsContent />
    </PrivateRoute>
  );
}

function MyListingsContent() {
  const { user } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchMyStudios();
    }
  }, [user]);

  const fetchMyStudios = async () => {
    try {
      const res = await authFetch(
        `${API_URL}/api/my-studios?email=${encodeURIComponent(user?.email || "")}`
      );
      const data = await res.json();
      setStudios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching studios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete "${title}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await authFetch(`${API_URL}/api/studios/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          toast.success("Studio deleted successfully!");
          setStudios((prev) => prev.filter((s) => s._id !== id));
        } else {
          toast.error("Failed to delete studio");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Studio Listings</h1>
          <p className="text-gray-500 mt-1">
            Manage your listed creative spaces
          </p>
        </div>
        <Link
          href="/add-studio"
          className="btn bg-indigo-500 text-white hover:bg-indigo-600 mt-4 sm:mt-0 gap-2"
        >
          <FaPlus /> Add New Studio
        </Link>
      </div>

      {studios.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-2xl font-semibold mb-2">No Studios Listed Yet</h3>
          <p className="text-gray-500 mb-6">
            Start sharing your creative space with the world.
          </p>
          <Link
            href="/add-studio"
            className="btn bg-indigo-500 text-white hover:bg-indigo-600 gap-2"
          >
            <FaPlus /> List Your First Studio
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200">
                <th></th>
                <th>Studio</th>
                <th>Category</th>
                <th>Rate</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {studios.map((studio, index) => (
                <tr key={studio._id} className="hover">
                  <td>{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={studio.imageUrl} alt={studio.title} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{studio.title}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-ghost">{studio.category}</span>
                  </td>
                  <td className="font-semibold text-indigo-600">
                    ${studio.hourlyRate}/hr
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-sm">
                      <FaMapMarkerAlt className="text-indigo-500" />
                      {studio.location}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Link
                        href={`/studios/edit/${studio._id}`}
                        className="btn btn-sm btn-ghost text-indigo-500"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(studio._id, studio.title)}
                        className="btn btn-sm btn-ghost text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
