import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Aperture } from "lucide-react";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "About Us", href: "/#about-us" },
];

const categories = [
  { label: "Photo Studios", href: "/studios?category=Photo%20Studio" },
  { label: "Sound Stages", href: "/studios?category=Film%20Stage" },
  { label: "Podcast Rooms", href: "/studios?category=Podcast%20Lounge" },
  { label: "Music Suites", href: "/studios?category=Music%20Suite" },
  { label: "Art Workshops", href: "/studios?category=Workshop" },
];

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Mission */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <Aperture className="text-indigo-400 size-6" />
              <span>StudioSpace</span>
            </Link>
            <p className="text-sm opacity-80 leading-relaxed">
              Connecting creators with the perfect studio spaces worldwide.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-circle btn-sm btn-ghost hover:bg-indigo-500 hover:text-white"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-circle btn-sm btn-ghost hover:bg-indigo-500 hover:text-white"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-circle btn-sm btn-ghost hover:bg-indigo-500 hover:text-white"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-circle btn-sm btn-ghost hover:bg-indigo-500 hover:text-white"
                aria-label="X"
              >
                <FaXTwitter />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-title text-base mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link link-hover text-sm opacity-80 hover:opacity-100 hover:text-indigo-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="footer-title text-base mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="link link-hover text-sm opacity-80 hover:opacity-100 hover:text-indigo-400 transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer-title text-base mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm opacity-80">
                <MdEmail className="text-indigo-400" />
                <span>hello@studiospace.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm opacity-80">
                <MdPhone className="text-indigo-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2 text-sm opacity-80">
                <MdLocationOn className="text-indigo-400 mt-0.5" />
                <span>123 Creative Blvd, Suite 100, Los Angeles, CA 90001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-10 pt-8 border-t border-neutral-content/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">Subscribe to our Newsletter</h3>
              <p className="text-sm opacity-70">
                Stay updated with the latest studios and creative spaces.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="input input-bordered input-sm w-64 bg-neutral-focus text-neutral-content placeholder:text-neutral-content/50"
              />
              <button className="btn btn-sm bg-indigo-500 hover:bg-indigo-600 text-white border-none">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-content/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm opacity-70">
          <p>&copy; 2025 StudioSpace. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="link link-hover hover:text-indigo-400">
              Terms
            </a>
            <a href="#" className="link link-hover hover:text-indigo-400">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
