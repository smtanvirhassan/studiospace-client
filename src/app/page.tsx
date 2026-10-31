"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  FaStar,
  FaMapMarkerAlt,
  FaCamera,
  FaFilm,
  FaMicrophone,
  FaMusic,
  FaPaintBrush,
  FaSearch,
  FaClock,
  FaCalendarCheck,
  FaRocket,
  FaShieldAlt,
  FaUserCheck,
  FaTools,
  FaHeadset,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
  rating: number;
  createdAt: string;
}

export default function HomePage() {
  const [featuredStudios, setFeaturedStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_URL}/api/studios/featured`);
        const data = await res.json();
        setFeaturedStudios(data);
      } catch (error) {
        console.error("Failed to fetch featured studios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const slides = [
    {
      bg: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600",
      headline: "Your Creative Vision Starts Here",
      subtext:
        "Book premium studios for photography, film, music, and more",
      showCTA: true,
    },
    {
      bg: "https://images.unsplash.com/photo-1524685794168-52985e79c1f8?w=1600",
      headline: "Professional Studios On Demand",
      subtext:
        "Access world-class creative spaces at affordable hourly rates",
      showCTA: false,
    },
    {
      bg: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=1600",
      headline: "Connect. Create. Produce.",
      subtext:
        "Join thousands of creators who trust StudioSpace",
      showCTA: false,
    },
  ];

  const categories = [
    {
      name: "Photo Studios",
      icon: <FaCamera className="text-4xl text-indigo-500" />,
      description: "Professional photography spaces with lighting and backdrops",
      query: "Photo Studio",
    },
    {
      name: "Sound Stages",
      icon: <FaFilm className="text-4xl text-indigo-500" />,
      description: "Spacious stages for film, video, and commercial production",
      query: "Film Stage",
    },
    {
      name: "Podcast Rooms",
      icon: <FaMicrophone className="text-4xl text-indigo-500" />,
      description: "Acoustically treated rooms for podcasting and voice recording",
      query: "Podcast Lounge",
    },
    {
      name: "Music Suites",
      icon: <FaMusic className="text-4xl text-indigo-500" />,
      description: "Fully equipped studios for music recording and production",
      query: "Music Suite",
    },
    {
      name: "Art Workshops",
      icon: <FaPaintBrush className="text-4xl text-indigo-500" />,
      description: "Creative workshop spaces for art, crafts, and design",
      query: "Workshop",
    },
  ];

  const steps = [
    {
      num: 1,
      icon: <FaSearch className="text-3xl text-white" />,
      title: "Discover Spaces",
      description: "Browse hundreds of creative studios near you",
    },
    {
      num: 2,
      icon: <FaClock className="text-3xl text-white" />,
      title: "Select Hours",
      description: "Choose your preferred date and time slots",
    },
    {
      num: 3,
      icon: <FaCalendarCheck className="text-3xl text-white" />,
      title: "Book Instantly",
      description: "Secure your booking with instant confirmation",
    },
    {
      num: 4,
      icon: <FaRocket className="text-3xl text-white" />,
      title: "Create & Produce",
      description: "Bring your creative vision to life",
    },
  ];

  const features = [
    {
      icon: <FaShieldAlt className="text-4xl text-indigo-500" />,
      title: "Liability Protection",
      description:
        "Full coverage for equipment and space during your booking",
    },
    {
      icon: <FaUserCheck className="text-4xl text-indigo-500" />,
      title: "Verified Profiles",
      description:
        "Every host and creator is identity-verified for safety",
    },
    {
      icon: <FaTools className="text-4xl text-indigo-500" />,
      title: "Equipment Safety",
      description:
        "All studio equipment is inspected and maintained regularly",
    },
    {
      icon: <FaHeadset className="text-4xl text-indigo-500" />,
      title: "24/7 Support",
      description:
        "Round-the-clock assistance for hosts and creators",
    },
  ];

  return (
    <div>
      {/* SECTION 1 - Hero Banner Slider */}
      <section>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="min-h-[70vh] bg-cover bg-center relative flex items-center justify-center"
                style={{ backgroundImage: `url('${slide.bg}')` }}
              >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 text-center text-white px-4 max-w-3xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                    {slide.headline}
                  </h1>
                  <p className="text-lg md:text-xl mb-8 text-gray-200">
                    {slide.subtext}
                  </p>
                  {slide.showCTA && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        href="/studios"
                        className="btn btn-primary btn-lg"
                      >
                        Explore Studios
                      </Link>
                      <Link
                        href="/add-studio"
                        className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-black"
                      >
                        Host Your Space
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* SECTION 2 - Featured Studios */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Featured Studios
            </h2>
            <p className="text-gray-500 text-lg">
              Discover our top-rated creative spaces
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : featuredStudios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStudios.map((studio) => (
                <div
                  key={studio._id}
                  className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow"
                >
                  <figure className="relative">
                    <img
                      src={studio.imageUrl}
                      alt={studio.title}
                      className="w-full h-56 object-cover"
                    />
                    <span className="absolute top-3 right-3 bg-indigo-500 text-white px-3 py-1 rounded-full text-sm">
                      {studio.category}
                    </span>
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title">{studio.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-semibold text-primary">
                        ${studio.hourlyRate} / hr
                      </span>
                      <span className="flex items-center gap-1 text-yellow-500">
                        <FaStar />
                        <span className="text-base-content">
                          {studio.rating}
                        </span>
                      </span>
                    </div>
                    <p className="flex items-center gap-1 text-gray-500">
                      <FaMapMarkerAlt className="text-indigo-500" />
                      {studio.location}
                    </p>
                    <div className="card-actions justify-end mt-2">
                      <Link
                        href={`/studios/${studio._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-xl">No studios available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3 - Browse by Studio Categories */}
      <section className="py-16 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Browse by Category
            </h2>
            <p className="text-gray-500 text-lg">
              Find the perfect space for your next project
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/studios?category=${encodeURIComponent(cat.query)}`}
                className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow p-6 text-center cursor-pointer"
              >
                <div className="flex justify-center mb-4">{cat.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{cat.name}</h3>
                <p className="text-gray-500 text-sm">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - How Booking Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center relative">
                    {step.icon}
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-white text-sm font-bold rounded-full flex items-center justify-center">
                      {step.num}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 - Host Guarantee & Creator Support */}
      <section id="about-us" className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Why Choose StudioSpace?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card bg-base-100 shadow-md p-6 text-center"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
