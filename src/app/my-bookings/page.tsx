"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import PrivateRoute from "@/components/PrivateRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaTimesCircle,
  FaFilePdf,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Booking {
  _id: string;
  studioTitle: string;
  studioImage: string;
  studioCategory: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  totalAmount: number;
  status: string;
  userEmail: string;
  userName?: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  Pending: "badge-warning",
  Confirmed: "badge-success",
  Completed: "badge-info",
  Cancelled: "badge-error",
};

export default function MyBookingsPage() {
  return (
    <PrivateRoute>
      <MyBookingsContent />
    </PrivateRoute>
  );
}

function MyBookingsContent() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/bookings?email=${encodeURIComponent(user?.email || "")}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: `Are you sure you want to cancel your reservation for "${title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "Keep Booking",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/api/bookings/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: "Cancelled" }),
        });
        if (res.ok) {
          toast.success("Booking cancelled successfully!");
          setBookings((prev) =>
            prev.map((b) =>
              b._id === id ? { ...b, status: "Cancelled" } : b
            )
          );
        } else {
          toast.error("Failed to cancel booking");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };

  // Optional Requirement: PDF Booking Invoice Generator
  const handleDownloadInvoice = (booking: Booking) => {
    const invoiceWindow = window.open("", "_blank");
    if (!invoiceWindow) {
      toast.error("Please allow popups to download your invoice");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>StudioSpace Invoice #${booking._id.slice(-6).toUpperCase()}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #4f46e5; }
          .status { background: #dcfce7; color: #15803d; padding: 6px 14px; border-radius: 9999px; font-weight: bold; font-size: 14px; }
          .details { margin: 30px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .section-title { font-weight: bold; font-size: 14px; color: #64748b; text-transform: uppercase; margin-bottom: 8px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
          .table th { background: #f8fafc; font-size: 14px; color: #475569; }
          .total { margin-top: 30px; text-align: right; }
          .total-amount { font-size: 24px; font-weight: bold; color: #4f46e5; }
          .footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">StudioSpace — Booking Invoice</div>
          <div class="status">Confirmed & Paid</div>
        </div>
        <div class="details">
          <div>
            <div class="section-title">Billed To</div>
            <div><strong>${booking.userName || "Valued Creator"}</strong></div>
            <div>${booking.userEmail}</div>
          </div>
          <div style="text-align: right;">
            <div class="section-title">Invoice Details</div>
            <div>Invoice ID: <strong>#INV-${booking._id.slice(-6).toUpperCase()}</strong></div>
            <div>Date of Issue: <strong>${new Date().toLocaleDateString()}</strong></div>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Studio & Service</th>
              <th>Date & Hours</th>
              <th>Duration</th>
              <th style="text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${booking.studioTitle}</strong><br>
                <small style="color: #64748b;">Category: ${booking.studioCategory}</small>
              </td>
              <td>${booking.date} (${booking.startTime} - ${booking.endTime})</td>
              <td>${booking.totalHours} hrs</td>
              <td style="text-align: right;">$${booking.totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <div class="total">
          <div style="color: #64748b; font-size: 14px;">Total Paid</div>
          <div class="total-amount">$${booking.totalAmount.toFixed(2)}</div>
        </div>
        <div class="footer">
          <p>Thank you for creating with StudioSpace. For 24/7 host support, contact support@studiospace.com</p>
          <button class="no-print" style="margin-top: 10px; padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer;" onclick="window.print()">Print / Save as PDF</button>
        </div>
      </body>
      </html>
    `;

    invoiceWindow.document.write(htmlContent);
    invoiceWindow.document.close();
    toast.success("Opening invoice receipt...");
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-gray-500 mt-1">
          View and manage your studio reservations
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-2xl font-semibold mb-2">No Bookings Yet</h3>
          <p className="text-gray-500 mb-6">
            Explore our studios and book your first creative session!
          </p>
          <Link
            href="/studios"
            className="btn bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Explore Studios
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="card bg-base-100 shadow-md border border-base-200 hover:shadow-lg transition-shadow"
            >
              <figure className="h-44">
                <img
                  src={booking.studioImage}
                  alt={booking.studioTitle}
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title text-lg">{booking.studioTitle}</h2>
                  <span
                    className={`badge ${
                      statusColors[booking.status] || "badge-ghost"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm mt-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <FaCalendarAlt className="text-indigo-500" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <FaClock className="text-indigo-500" />
                    <span>
                      {booking.startTime} - {booking.endTime} (
                      {booking.totalHours.toFixed(1)} hrs)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <FaDollarSign className="text-indigo-500" />
                    <span className="font-semibold text-base-content">
                      ${booking.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="card-actions justify-end mt-4 gap-2">
                  {booking.status === "Pending" && (
                    <button
                      onClick={() =>
                        handleCancel(booking._id, booking.studioTitle)
                      }
                      className="btn btn-sm btn-error btn-outline gap-1"
                    >
                      <FaTimesCircle /> Cancel Booking
                    </button>
                  )}
                  {booking.status === "Confirmed" && (
                    <button
                      onClick={() => handleDownloadInvoice(booking)}
                      className="btn btn-sm bg-indigo-600 text-white hover:bg-indigo-700 gap-1"
                    >
                      <FaFilePdf /> Download Invoice
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
