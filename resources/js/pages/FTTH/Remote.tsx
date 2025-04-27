import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Fiber to the Home',
        href: '#',
    },
    {
        title: 'Remote Site',
        href: '/dashboard/alfamart/remote-site',
    },
];

export default function RemoteSite() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Alfamart Remote Site" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Ftth Remote Site</h1>
                
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h3 className="text-xl font-semibold">Remote Site Data 1</h3>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h3 className="text-xl font-semibold">Remote Site Data 2</h3>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h3 className="text-xl font-semibold">Remote Site Data 3</h3>
                        </div>
                    </div>
                </div>
                
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[60vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-2xl font-bold">Remote Site Details</h2>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}