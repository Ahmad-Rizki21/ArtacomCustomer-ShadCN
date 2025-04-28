import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { 
  LayoutGrid, 
  Store, 
  Network, 
  ChevronDown, 
  Server, 
  Database, 
  Users, 
  FileText, 
  Globe,
  Settings,
  Shield
} from 'lucide-react';
import AppLogo from './app-logo';
import React, { useState, useEffect } from 'react';

// Define a type for menu state
type MenuState = {
  alfamartLawsonGroup: boolean;
  ftthGroup: boolean;
  settingsGroup: boolean; // Menambahkan settingsGroup
};

export function AppSidebar() {
  const { url } = usePage();

  // Initial state with type annotation
  const [openMenus, setOpenMenus] = useState<MenuState>({
    alfamartLawsonGroup: url.includes('/dashboard/alfamart/'),
    ftthGroup: url.includes('/dashboard/ftth/'),
    settingsGroup: url.includes('/settings/') // Inisialisasi settingsGroup
  });

  // Type-safe toggle dropdown
  const toggleDropdown = (menuKey: keyof MenuState) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  // Check if menu is active
  const isMenuActive = (href: string) => {
    return url === href || 
           url.startsWith(href + '/') || 
           (href !== '/' && url.includes(href));
  };

  // Auto-expand dropdown based on current route
  useEffect(() => {
    setOpenMenus({
      alfamartLawsonGroup: url.includes('/dashboard/alfamart/'),
      ftthGroup: url.includes('/dashboard/ftth/'),
      settingsGroup: url.includes('/settings/') // Perbarui settingsGroup saat URL berubah
    });
  }, [url]);

  // Menu items configuration with type and icons
  const menuItems = {
    alfamartLawson: [
      { href: '/dashboard/alfamart/remote-site', label: 'Remote Site', icon: Server },
      { href: '/dashboard/alfamart/dc', label: 'DC', icon: Database },
      { href: '/dashboard/alfamart/customer', label: 'Customer', icon: Users }
    ],
    ftth: [
      { href: '/dashboard/ftth/data-pelanggan', label: 'Data Pelanggan', icon: FileText },
      { href: '/dashboard/ftth/layanan-paket', label: 'Layanan/Paket', icon: Globe },
      { href: '/dashboard/ftth/remote', label: 'Remote Site', icon: Server }
    ],
    settings: [
      { href: '/settings/user-management', label: 'User Management', icon: Users },
      { href: '/settings/role-management', label: 'Role Management', icon: Shield } // Tambahkan menu Role Management
    ]
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Platform Section */}
        <div className="space-y-1 px-3 py-2">
          <h3 className="mb-2 px-4 text-sm font-semibold text-foreground/70">Platform</h3>
          <Link
            href="/dashboard"
            className={`flex items-center rounded-md px-3 py-2 text-sm ${
              isMenuActive('/dashboard')
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-muted'
            }`}
          >
            <LayoutGrid className="mr-2 h-5 w-5" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Alfamart Lawson Group */}
        <div className="space-y-1 px-3 py-2">
          <h3 className="mb-2 px-4 text-sm font-semibold text-foreground/70">Alfamart Lawson</h3>
          <div>
            <button
              onClick={() => toggleDropdown('alfamartLawsonGroup')}
              className={`flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-muted ${
                url.includes('/dashboard/alfamart/')
                  ? 'bg-primary/10 text-primary font-medium'
                  : ''
              }`}
            >
              <Store className="mr-2 h-5 w-5" />
              <span className="flex-grow">Data Customer Alfa</span>
              <ChevronDown 
                className={`h-4 w-4 transform transition-transform duration-200 ${
                  openMenus.alfamartLawsonGroup ? 'rotate-180' : ''
                }`} 
              />
            </button>
            {openMenus.alfamartLawsonGroup && (
              <div className="pl-6 mt-1 space-y-1">
                {menuItems.alfamartLawson.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center rounded-md px-3 py-2 text-sm ${
                      isMenuActive(item.href)
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fiber To The Home Group */}
        <div className="space-y-1 px-3 py-2">
          <h3 className="mb-2 px-4 text-sm font-semibold text-foreground/70">Fiber To The Home</h3>
          <div>
            <button
              onClick={() => toggleDropdown('ftthGroup')}
              className={`flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-muted ${
                url.includes('/dashboard/ftth/')
                  ? 'bg-primary/10 text-primary font-medium'
                  : ''
              }`}
            >
              <Network className="mr-2 h-5 w-5" />
              <span className="flex-grow">Data Customer FTTH</span>
              <ChevronDown 
                className={`h-4 w-4 transform transition-transform duration-200 ${
                  openMenus.ftthGroup ? 'rotate-180' : ''
                }`} 
              />
            </button>
            {openMenus.ftthGroup && (
              <div className="pl-6 mt-1 space-y-1">
                {menuItems.ftth.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center rounded-md px-3 py-2 text-sm ${
                      isMenuActive(item.href)
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Settings Group - Menambahkan bagian ini */}
        <div className="space-y-1 px-3 py-2">
          <h3 className="mb-2 px-4 text-sm font-semibold text-foreground/70">Pengaturan</h3>
          <div>
            <button
              onClick={() => toggleDropdown('settingsGroup')}
              className={`flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-muted ${
                url.includes('/settings/')
                  ? 'bg-primary/10 text-primary font-medium'
                  : ''
              }`}
            >
              <Settings className="mr-2 h-5 w-5" />
              <span className="flex-grow">Pengaturan Sistem</span>
              <ChevronDown 
                className={`h-4 w-4 transform transition-transform duration-200 ${
                  openMenus.settingsGroup ? 'rotate-180' : ''
                }`} 
              />
            </button>
            {openMenus.settingsGroup && (
              <div className="pl-6 mt-1 space-y-1">
                {menuItems.settings.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center rounded-md px-3 py-2 text-sm ${
                      isMenuActive(item.href)
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}