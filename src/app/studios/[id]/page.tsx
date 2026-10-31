"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  FaStar,
  FaMapMarkerAlt,
  FaUsers,
  FaDollarSign,
  FaShieldAlt,
  FaCheck,
  FaArrowLeft,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { useAuth } from "@/providers/AuthProvider";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Review {
  id?: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  images?: string[];
  amenities: string[];
  overview: string;
  ownerEmail: string;
  ownerName: string;
  rating: number;
  reviews?: Review[];
  createdAt: string;
}

export default function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchStudio();
    if (user?.email) {
      checkWishlist();
    }
  }, [id, user]);

  const fetchStudio = async () => {
    try {
      const res = await fetch(`${API_URL}/api/studios/${id}`);
      const data = await res.json();
      setStudio(data);
    } catch (error) {
      console.error("Error fetching studio:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    try {
      const res = await fetch(`${API_URL}/api/wishlist`, { credentials: "include" });
      if (res.ok) {
        const list: string[] = await res.json();
        setIsWishlisted(list.includes(id));
      }
    } catch (e) {
      // ignore
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to save to wishlist");
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ studioId: id }),
      });
      const data = await res.json();
      setIsWishlisted(data.saved);
      toast.success(data.message);
    } catch (e) {
      toast.error("Failed to update wishlist");
    }
  };

  const calculateHours = () => {
    if (!startTime || !endTime) return 0;
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const hours = endH + endM / 60 - (startH + startM / 60);
    return Math.max(0, hours);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }

    const hours = calculateHours();
    if (hours <= 0) {
      toast.error("End time must be after start time");
      return;
    }

    setBookingLoading(true);
    try {
      const bookingData = {
        studioId: studio!._id,
        studioTitle: studio!.title,
        studioImage: studio!.imageUrl,
        studioCategory: studio!.category,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || "User",
        date: bookingDate,
        startTime,
        endTime,
        totalHours: hours,
        totalAmount: hours * studio!.hourlyRate,
        hostEmail: studio!.ownerEmail,
      };

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bookingData),
      });

      if (res.status === 409) {
        const data = await res.json();
        toast.error(data.message);
        return;
      }

      if (res.ok) {
        toast.success("Booking submitted successfully with status Pending!");
        setShowBookingModal(false);
        setBookingDate("");
        setStartTime("");
        setEndTime("");
        router.push("/my-bookings");
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to submit booking");
      }
    } catch (error) {
      toast.error("Failed to submit booking");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!studio)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Studio not found</h2>
        <Link href="/studios" className="btn bg-indigo-500 text-white mt-4">
          Back to Studios
        </Link>
      </div>
    );

  const hours = calculateHours();
  const galleryImages =
    studio.images && studio.images.length > 0
      ? studio.images
      : [studio.imageUrl];

  const reviewsList =
    studio.reviews && studio.reviews.length > 0
      ? studio.reviews
      : [
          {
            id: "rev1",
            user: "Jordan Peterson",
            rating: 5,
            date: "2025-10-12",
            comment:
              "Exceptional space! Acoustic setup was crystal clear and the lighting kit was well-calibrated.",
          },
          {
            id: "rev2",
            user: "Maria Rodriguez",
            rating: 4.8,
            date: "2025-09-28",
            comment:
              "Spacious, clean, and the host was extremely helpful with our load-in. Will definitely book again.",
          },
        ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Top Bar with Back and Wishlist */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/studios" className="btn btn-ghost gap-2">
          <FaArrowLeft /> Back to Studios
        </Link>
        <button
          onClick={toggleWishlist}
          className={`btn btn-circle ${
            isWishlisted ? "btn-error text-white" : "btn-outline border-base-300"
          }`}
          aria-label="Save to Wishlist"
        >
          {isWishlisted ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Gallery Carousel */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6 bg-base-300">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="h-[420px] w-full"
            >
              {galleryImages.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <div className="relative w-full h-full">
                    <img
                      src={img}
                      alt={`${studio.title} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <span className="absolute top-4 right-4 z-10 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
              {studio.category}
            </span>
          </div>

          {/* Title & Specifications Badges */}
          <h1 className="text-3xl font-extrabold mb-3">{studio.title}</h1>
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <FaMapMarkerAlt className="text-indigo-500" /> {studio.location}
            </span>
            <span className="flex items-center gap-1.5">
              <FaStar className="text-yellow-400" /> {studio.rating} (
              {reviewsList.length} reviews)
            </span>
            <span className="flex items-center gap-1.5">
              <FaUsers className="text-indigo-500" /> Up to {studio.maxCapacity}{" "}
              people
            </span>
          </div>

          {/* Full Workspace Specifications */}
          <div className="card bg-base-200 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Workspace Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-base-100 p-4 rounded-xl border border-base-300">
                <span className="text-xs uppercase text-gray-500 font-semibold block">
                  Category
                </span>
                <span className="text-base font-bold text-indigo-600">
                  {studio.category}
                </span>
              </div>
              <div className="bg-base-100 p-4 rounded-xl border border-base-300">
                <span className="text-xs uppercase text-gray-500 font-semibold block">
                  Max Capacity
                </span>
                <span className="text-base font-bold">
                  {studio.maxCapacity} Guests
                </span>
              </div>
              <div className="bg-base-100 p-4 rounded-xl border border-base-300">
                <span className="text-xs uppercase text-gray-500 font-semibold block">
                  Hourly Rate
                </span>
                <span className="text-base font-bold text-green-600">
                  ${studio.hourlyRate}/hr
                </span>
              </div>
              <div className="bg-base-100 p-4 rounded-xl border border-base-300">
                <span className="text-xs uppercase text-gray-500 font-semibold block">
                  Deposit
                </span>
                <span className="text-base font-bold">
                  ${studio.securityDeposit}
                </span>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3">Detailed Overview</h2>
            <p className="text-base-content/80 leading-relaxed whitespace-pre-line">
              {studio.overview}
            </p>
          </div>

          {/* Amenities List */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3">Included Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {studio.amenities?.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-base-200 border border-base-300 text-sm font-medium"
                >
                  <FaCheck className="text-green-500 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Host Details */}
          <div className="card bg-base-200 p-6 mb-8 border border-base-300">
            <h2 className="text-xl font-bold mb-3">Host Information</h2>
            <div className="flex items-center gap-4">
              <div className="avatar placeholder">
                <div className="bg-indigo-600 text-white rounded-full w-14 ring ring-indigo-300">
                  <span className="text-xl font-bold">
                    {studio.ownerName?.charAt(0).toUpperCase() || "H"}
                  </span>
                </div>
              </div>
              <div>
                <p className="font-bold text-lg">{studio.ownerName}</p>
                <p className="text-sm text-gray-500">{studio.ownerEmail}</p>
                <span className="badge badge-success badge-sm text-white mt-1">
                  Verified Host
                </span>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Creator Reviews</h2>
              <div className="flex items-center gap-1.5 font-semibold">
                <FaStar className="text-yellow-400" />
                <span>{studio.rating} / 5.0</span>
              </div>
            </div>
            <div className="space-y-4">
              {reviewsList.map((rev, index) => (
                <div
                  key={rev.id || index}
                  className="card bg-base-100 p-5 rounded-xl border border-base-300 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-base">{rev.user}</p>
                      <p className="text-xs text-gray-400">{rev.date}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <FaStar />
                      <span className="font-bold text-base-content">
                        {rev.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-base-content/80">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Booking Card */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-xl border border-base-200 sticky top-24 p-6 rounded-2xl">
            <div className="text-center mb-4">
              <span className="text-4xl font-extrabold text-indigo-600">
                ${studio.hourlyRate}
              </span>
              <span className="text-gray-500 font-medium"> / hour</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4 bg-base-200 py-2 rounded-lg">
              <FaShieldAlt className="text-indigo-500" />
              <span>Security Deposit: ${studio.securityDeposit}</span>
            </div>
            <div className="divider my-2"></div>
            <div className="space-y-2.5 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Category</span>
                <span className="font-semibold">{studio.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Capacity</span>
                <span className="font-semibold">{studio.maxCapacity} people</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Rating</span>
                <span className="font-semibold flex items-center gap-1">
                  <FaStar className="text-yellow-400" /> {studio.rating}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Instant Booking</span>
                <span className="badge badge-primary badge-sm">Supported</span>
              </div>
            </div>
            <button
              onClick={() => {
                if (!user) {
                  toast.error("Please login to book a studio");
                  router.push("/login");
                  return;
                }
                setShowBookingModal(true);
              }}
              className="btn bg-indigo-600 text-white hover:bg-indigo-700 w-full text-lg shadow-md"
            >
              Book Workspace Now
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg rounded-2xl">
            <h3 className="font-bold text-2xl mb-1">Book Workspace</h3>
            <p className="text-sm text-gray-500 mb-4">{studio.title}</p>
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Reservation Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Start Time</span>
                  </label>
                  <input
                    type="time"
                    className="input input-bordered w-full"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">End Time</span>
                  </label>
                  <input
                    type="time"
                    className="input input-bordered w-full"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              {hours > 0 && (
                <div className="bg-base-200 p-4 rounded-xl border border-base-300">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Shoot Duration</span>
                    <span className="font-medium">{hours.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Hourly Rate</span>
                    <span className="font-medium">${studio.hourlyRate} / hr</span>
                  </div>
                  <div className="divider my-1"></div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Estimated Total</span>
                    <span className="text-indigo-600">
                      ${(hours * studio.hourlyRate).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Booking As</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full bg-base-200"
                  value={user?.email || ""}
                  readOnly
                />
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowBookingModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-indigo-600 text-white hover:bg-indigo-700"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Confirm Reservation"
                  )}
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowBookingModal(false)}
          ></div>
        </div>
      )}
    </div>
  );
}
