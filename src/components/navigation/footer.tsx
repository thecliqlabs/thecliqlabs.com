import Link from "next/link";
import Logo from "@/components/ui/logo";

const Footer = () => {
    return (
        <footer className="border-t border-border/40 bg-background">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <Logo />
                <div className="flex gap-6 text-sm text-muted-foreground">
                    <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
                    <Link href="/features" className="hover:text-foreground transition-colors">Features</Link>
                    <Link href="/resources/blog" className="hover:text-foreground transition-colors">Blog</Link>
                    <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                </div>
                <p className="text-sm text-muted-foreground">© 2026 CliqLabs. All rights reserved.</p>
            </div>
        </footer>
    );
};
export default Footer;
