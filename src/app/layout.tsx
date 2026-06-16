import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "CliqLabs | The GHL Agency OS",
    description: "Everything your HighLevel agency needs to scale — white-label support, client onboarding, theme builder, snapshots and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"/>
            </head>
            <body style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                {children}
            </body>
        </html>
    );
}
