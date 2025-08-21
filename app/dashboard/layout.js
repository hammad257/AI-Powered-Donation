'use client';

import { useEffect, useMemo, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import LogoutButton from '../components/LogoutButton';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { apiRequest } from '../services/api';
import { setProfilePicture } from '../redux/features/authSlice';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { token } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dispatch = useDispatch();
  const { data: session } = useSession();
  const pathname = usePathname();

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiRequest('/profile/me', 'GET', null, token);
        setProfile(data);
        dispatch(setProfilePicture(data));
      } catch (err) {
        console.error('Failed to load profile:', err?.message || err);
      }
    };
    if (token) fetchProfile();
  }, [token, dispatch]);

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Prevent background scroll when drawer open (mobile)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [sidebarOpen]);

  // Build the nav links list based on role (so we can compute the best active match)
  const links = useMemo(() => {
    if (!profile?.role) return [];

    const common = [{ href: '/dashboard/profile', label: 'Profile' }];
    if (profile.role === 'admin') {
      return [
        { href: '/dashboard/admin', label: 'Admin Dashboard' },
        { href: '/dashboard/admin/users', label: 'Manage Users' },
        { href: '/dashboard/admin/requests', label: 'Needy Requests' },
        { href: '/dashboard/admin/money-donations', label: 'Manage Money Donation' },
        { href: '/dashboard/admin/food-delivered', label: 'Delivered Pickups' },
        { href: '/dashboard/admin/dropoff', label: 'DropOff Center' },
        
      ];
    }
    if (profile.role === 'donor') {
      return [
        { href: '/dashboard/donor', label: 'Donor Dashboard' },
        { href: '/dashboard/donor/food-donation', label: 'Food Donations' },
        { href: '/dashboard/donor/money-donation', label: 'Money Donations' },
       
      ];
    }
    if (profile.role === 'volunteer') {
      return [
        { href: '/dashboard/volunteer', label: 'Volunteer Dashboard' },
        { href: '/dashboard/volunteer/available-pickups', label: 'Available Pickup' },
        { href: '/dashboard/volunteer/my-pickups', label: 'My Pickups' },
        { href: '/dashboard/volunteer/my-deliveries', label: 'My Deliveries' },
        
      ];
    }
    if (profile.role === 'needy') {
      return [
        { href: '/dashboard/needy', label: 'Needy Dashboard' },
        { href: '/dashboard/needy/myRequest', label: 'My Request' },
        { href: '/dashboard/needy/submitRequest', label: 'Submit Request' },
       
      ];
    }
    return common;
  }, [profile]);

  // Compute the single best active href:
  const activeHref = useMemo(() => {
    if (!pathname || links.length === 0) return links[0]?.href ?? '';
    // find longest href that is a prefix of pathname (prefer exact matches)
    let best = '';
    for (const l of links) {
      const href = l.href;
      if (pathname === href) {
        best = href;
        break;
      }
      if (pathname.startsWith(href) && href.length > best.length) {
        best = href;
      }
    }
    // if none matches, default to first
    return best || links[0]?.href || '';
  }, [pathname, links]);

  const linkClasses = (href) =>
    `block px-3 py-2 rounded transition text-sm ${
      activeHref === href
        ? 'bg-blue-600 text-white font-semibold'
        : 'hover:bg-gray-700 text-white/90'
    }`;

  // Custom NavLink that also closes drawer on click
  const NavLink = ({ href, children }) => {
    return (
      <Link
        href={href}
        onClick={() => {
          setSidebarOpen(false);
        }}
        className={linkClasses(href)}
      >
        {children}
      </Link>
    );
  };

  const SidebarContent = () => (
    <>
      <div>
        <h2 className="text-xl font-bold mb-4">AI Powered Donation</h2>

        {profile && (
          <div className="mb-6 flex items-center gap-3">
            <img
              src={
                session ? session.user.image || '/default-user.png' : profile.profilePic || '/default-user.png'
              }
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div className="overflow-hidden">
              <p className="font-semibold break-words max-w-[10rem] leading-snug">{profile.name}</p>
              <p className="text-sm text-gray-300">{profile.role}</p>
              {profile.phone && <p className="text-xs text-gray-400">{profile.phone}</p>}
              {profile.address && <p className="text-xs text-gray-400">{profile.address}</p>}
            </div>
          </div>
        )}

        <nav className="flex flex-col gap-2">
          {links.map((l) => (
            <NavLink key={l.href} href={l.href}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        {/* Keep profile & logout at bottom */}
        <div className={linkClasses('/dashboard/profile')}>
          <Link href="/dashboard/profile" onClick={() => setSidebarOpen(false)}>
            Profile
          </Link>
        </div>

        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className="w-full mt-2 bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Logout (Google)
          </button>
        ) : token ? (
          <div className="mt-2">
            <LogoutButton />
          </div>
        ) : null}
      </div>
    </>
  );

  return (
    <ProtectedRoute>
    <div className="flex min-h-screen">
  {/* Mobile top bar button (always above map) */}
  <div className="md:hidden fixed top-3 left-3 z-[9999]">
    <button
      aria-label="Open menu"
      onClick={() => setSidebarOpen(true)}
      className="p-2 rounded bg-gray-800 text-white shadow-md hover:bg-gray-700"
    >
      <Menu size={20} />
    </button>
  </div>

  {/* Desktop sidebar */}
  <aside className="hidden md:flex md:w-64 bg-gray-800 text-white p-4 flex-col justify-between">
    <SidebarContent />
  </aside>

  {/* Mobile drawer (slide-in) */}
  <div
    className={`fixed inset-y-0 left-0 z-[9998] w-64 transform bg-gray-800 text-white p-4 transition-transform duration-200 ease-in-out md:hidden
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold">Menu</h3>
      <button
        aria-label="Close menu"
        onClick={() => setSidebarOpen(false)}
        className="p-1 rounded hover:bg-gray-700"
      >
        <X size={18} />
      </button>
    </div>
    <SidebarContent />
  </div>

  {/* overlay for mobile */}
  {sidebarOpen && (
    <div
      className="fixed inset-0 z-[9997] bg-black bg-opacity-40 md:hidden"
      onClick={() => setSidebarOpen(false)}
    />
  )}

  {/* Main content */}
  <main className="flex-1 p-6 bg-gray-100 min-h-screen">{children}</main>
</div>

    </ProtectedRoute>
  );
}
