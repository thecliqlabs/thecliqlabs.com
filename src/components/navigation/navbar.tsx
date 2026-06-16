"use client";
import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/ui/logo";
import { NAV_LINKS } from "@/utils";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, MenuIcon, XIcon } from "lucide-react";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between max-w-7xl mx-auto px-4 md:px-8">
                <Logo />
                <nav className="hidden md:flex items-center gap-6">
                    {NAV_LINKS.map((link) => (
                        <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            {link.title}
                        </Link>
                    ))}
                </nav>
                <div className="hidden md:flex items-center gap-3">
                    <Button variant="ghost" asChild><Link href="/auth/sign-in">Login</Link></Button>
                    <Button asChild><Link href="/auth/sign-up">Get Started</Link></Button>
                </div>
                <button className="md:hidden" onClick={() => setOpen(!open)}>
                    {open ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
                </button>
            </div>
            {open && (
                <div className="md:hidden border-t border-border px-4 py-4 flex flex-col gap-4 bg-background">
                    {NAV_LINKS.map((link) => (
                        <Link key={link.href} href={link.href} className="text-sm font-medium" onClick={() => setOpen(false)}>
                            {link.title}
                        </Link>
                    ))}
                    <Button asChild className="w-full"><Link href="/auth/sign-up">Get Started</Link></Button>
                </div>
            )}
        </header>
    );
};
export default Navbar;
