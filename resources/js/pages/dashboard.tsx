import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Store, Network, Activity } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold mb-2">Overview Dashboard</h1>
                
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Alfamart Lawson Stats Card */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border bg-background/50">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <Store className="h-10 w-10 mb-2 text-primary" />
                            <h3 className="text-xl font-semibold">Alfamart Lawson</h3>
                            <p className="text-muted-foreground text-sm mt-1 text-center">
                                Remote Sites: 125 | Active: 120
                            </p>
                        </div>
                    </div>
                    
                    {/* FTTH Stats Card */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border bg-background/50">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <Network className="h-10 w-10 mb-2 text-primary" />
                            <h3 className="text-xl font-semibold">FIBER TO THE HOME</h3>
                            <p className="text-muted-foreground text-sm mt-1 text-center">
                                Connections: 5,240 | Uptime: 99.8%
                            </p>
                        </div>
                    </div>
                    
                    {/* System Status Card */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border bg-background/50">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <Activity className="h-10 w-10 mb-2 text-primary" />
                            <h3 className="text-xl font-semibold">System Status</h3>
                            <p className="text-muted-foreground text-sm mt-1 text-center">
                                All systems operational
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Main Dashboard Content */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[60vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                        <h2 className="text-2xl font-bold mb-4">Artacom Customer Management System</h2>
                        <div className="max-w-2xl text-center text-muted-foreground">
                            <p className="mb-4">
                                Welcome to the unified dashboard for Artacom Customer Management. Use the sidebar navigation to access specific sections for Alfamart Lawson and FIBER TO THE HOME networks.
                            </p>
                            <p>
                                This dashboard provides an overview of the system status and key metrics. For detailed information and management tools, please navigate to the respective category sections.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}