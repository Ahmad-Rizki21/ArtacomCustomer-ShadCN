import AuthLayoutTemplate from '@/layouts/auth/auth-split-layout'; 
import { Head } from '@inertiajs/react';

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <>
            <Head title={title} />
            <AuthLayoutTemplate title={title} description={description} {...props}>
                {children}
            </AuthLayoutTemplate>
        </>
    );
}