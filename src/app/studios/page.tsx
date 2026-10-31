"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaStar,
  FaMapMarkerAlt,
  FaSearch,
  FaFilter,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/providers/AuthProvider";
import { API_URL, authFetch } from "@/lib/api";
import toast from "react-hot-toast";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  imageUrl: string;
  rating: number;
}

const categories = [
  "all",
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

function StudiosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchStudios();
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    if (user?.email) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await authFetch(`${API_URL}/api/wishlist`);
      if (res.ok) {
        const data = await res.json();
        setWishlistIds(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      // ignore
    }
  };

  const toggleWishlist = async (studioId: string) => {
    if (!user) {
      toast.error("Please login to save to wishlist");
      router.push("/login");
      return;
    }
    try {
      const res = await authFetch(`${API_URL}/api/wishlist`, {
        method: "POST",
        body: JSON.stringify({ studioId }),
      });
      const data = await res.json();
      if (data.saved) {
        setWishlistIds((prev) => [...prev, studioId]);
      } else {
        setWishlistIds((prev) => prev.filter((id) => id !== studioId));
      }
      toast.success(data.message);
    } catch (e) {
      toast.error("Failed to update wishlist");
    }
  };

  const fetchStudios = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/studios?sort=${sortBy}`;
      if (selectedCategory !== "all") {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setStudios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching studios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudios();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-3">Explore Studios</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Discover the perfect creative workspace for your next production
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search studios by title or city..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              className="select select-bordered"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          <select
            className="select select-bordered"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Studios Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : studios.length === 0 ? (
        <div className="text-center py-20 bg-base-200 rounded-2xl">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-2xl font-semibold mb-2">No Studios Found</h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search query or filters to find what you&apos;re looking for.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSortBy("newest");
            }}
            className="btn bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map((studio) => (
            <div
              key={studio._id}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300 border border-base-200 overflow-hidden"
            >
              <figure className="relative h-56">
                <img
                  src={studio.imageUrl}
                  alt={studio.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                  {studio.category}
                </span>
                <button
                  onClick={() => toggleWishlist(studio._id)}
                  className="absolute top-3 left-3 bg-base-100/80 backdrop-blur p-2 rounded-full hover:scale-110 transition-transform shadow-md text-sm"
                  aria-label="Save to Wishlist"
                >
                  {wishlistIds.includes(studio._id) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-600" />
                  )}
                </button>
              </figure>
              <div className="card-body p-5">
                <h2 className="card-title text-lg font-bold leading-snug">
                  {studio.title}
                </h2>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <FaMapMarkerAlt className="text-indigo-500 shrink-0" />
                  <span className="truncate">{studio.location}</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-base-200">
                  <span className="text-xl font-extrabold text-indigo-600">
                    ${studio.hourlyRate}{" "}
                    <span className="text-xs text-gray-400 font-normal">
                      / hr
                    </span>
                  </span>
                  <div className="flex items-center gap-1 text-sm">
                    <FaStar className="text-yellow-400" />
                    <span className="font-bold">{studio.rating}</span>
                  </div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <Link
                    href={`/studios/${studio._id}`}
                    className="btn bg-indigo-600 text-white hover:bg-indigo-700 btn-sm w-full"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StudiosPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <StudiosContent />
    </Suspense>
  );
}
