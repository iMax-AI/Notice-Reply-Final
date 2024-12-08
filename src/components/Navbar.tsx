"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

interface UserProfileIconProps {
  username: string;
  size?: 'sm' | 'md' | 'lg';
}

const UserProfileIcon: React.FC<UserProfileIconProps> = ({ username, size = 'md' }) => {
  const names = username.split(' ');
  const firstInitial = names[0] ? names[0][0].toUpperCase() : '';
  const lastInitial = names.length > 1 ? names[names.length - 1][0].toUpperCase() : '';
  const initials = firstInitial + lastInitial;
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full ${sizeClasses[size]}`}>
      <span className="font-medium text-white">{initials}</span>
    </div>
  );
};

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const currentPath = usePathname();

  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const href = event.currentTarget.getAttribute('href');
    if (href && href !== currentPath) {
      setIsLoading(true);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.refresh();
    }
  }, [status, router]);

  const links = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/aboutUs" },
    { title: "Your History", href: "/history" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed w-full z-50 bg-gray-200 shadow-md">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-700 border-solid"></div>
        </div>
      )}
      <div className="container mx-auto flex items-center justify-between py-4 px-6 md:px-12 relative">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            className="hover:opacity-80 transition-opacity duration-300"
            width={55}
            height={55}
          />
        </Link>

        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              onClick={handleNavigation}
              className="text-base font-medium text-black transition duration-300 hover:text-[#333]"
            >
              {link.title}
            </Link>
          ))}
        </div>

        {/* Session Status */}
        <div className="hidden md:flex items-center space-x-4 absolute right-6">
          {!session ? (
            <Link href="/auth/sign-in" onClick={handleNavigation}>
              <button
                className="cursor-pointer px-5 py-2 bg-[#222] text-white rounded-lg font-medium hover:bg-[#333] transition-all duration-[300ms]"
                aria-label="Sign In"
              >
                Sign In
              </button>
            </Link>
          ) : (
            <div className="flex items-center space-x-3">
              <p className="text-sm font-semibold text-black whitespace-nowrap">
                Hi, {session.user?.fullname}
              </p>
              <Link href="/profile" onClick={handleNavigation}>
                <UserProfileIcon username={session.user?.fullname || ''} size="md" />
              </Link>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-black focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-200 border-t">
          <div className="flex flex-col items-center space-y-4 py-4">
            {links.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-base font-medium text-black hover:text-[#333]"
                onClick={() => setIsOpen(false)}
              >
                {link.title}
              </Link>
            ))}
            {!session ? (
              <Link href="/auth/sign-in" onClick={handleNavigation}>
                <button
                  className="px-5 py-2 bg-[#222] text-white rounded-lg font-medium hover:bg-[#333] transition-all duration-[300ms]"
                  aria-label="Mobile Sign In"
                >
                  Sign In
                </button>
              </Link>
            ) : (
              <Link href="/profile" onClick={handleNavigation}>
                <div
                  className="flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <p className="text-sm font-semibold text-black whitespace-nowrap">
                    Hi, {session.user?.fullname}
                  </p>
                  <UserProfileIcon username={session.user?.fullname || ''} size="sm" />
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
