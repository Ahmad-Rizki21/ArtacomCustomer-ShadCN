import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { quote } = usePage<SharedData>().props;

    return (
        <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-2">
            {/* Side Left */}
            <div className="relative hidden h-full flex-col p-10 lg:flex bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-20">
                    <svg className="h-full w-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

               {/* Logo */}
                <div className="relative z-20 mb-10 flex justify-center mt-20">
                    <Link href={route('home')} className="flex items-center space-x-2">
                        <div className="bg-white rounded-md p-2">
                            <img src="/images/artacom.png" alt="Artacom Logo" className="h-8" />
                        </div>
                        <span className="text-xl font-semibold tracking-wide">Artacom Customer</span>
                    </Link>
                </div>




                {/* Center Content */}
                <div className="relative z-20 flex flex-col justify-center items-center flex-grow text-center">
                    <h2 className="text-3xl font-bold mb-4 leading-tight">Customer Management Platform</h2>
                    <p className="max-w-md text-neutral-300 mb-8">
                        Platform terintegrasi untuk mengelola customer Alfamart, Lawson, dan FTTH.
                        Semua dalam satu dashboard.
                    </p>

                    {/* Fancy Card */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg flex flex-col items-center space-y-4">
                        <img src="/images/At the office-amico.svg" alt="Illustration" className="h-32" /> {/* gunakan ilustrasi modern */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-bold">100+</span>
                                <span className="text-xs text-neutral-300">Remote Sites</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-bold">5,000+</span>
                                <span className="text-xs text-neutral-300">FTTH Users</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-bold">99.9%</span>
                                <span className="text-xs text-neutral-300">Uptime</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quote */}
                {quote && (
                    <div className="relative z-20 mt-10 text-center">
                        {/* <p className="italic">&ldquo;{quote.message}&rdquo;</p>
                        <p className="text-xs text-neutral-400 mt-1">— {quote.author}</p> */}
                        <p className="text-xs text-neutral-400 mt-4">© 2025 Copyright by Ahmad Rizki - Artacomindo Jejaring Nusa</p>
                    </div>
                )}
            </div>

            {/* Side Right */}
            <div className="relative flex flex-col justify-center items-center px-8 py-12">
                {/* Mobile Logo */}
                <div className="absolute top-8 left-8 lg:hidden">
                    <Link href={route('home')}>
                        <img src="/images/artacom.png" alt="Artacom Logo" className="h-8" />
                    </Link>
                </div>

                <div className="w-full max-w-md space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <p className="text-muted-foreground text-sm">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
