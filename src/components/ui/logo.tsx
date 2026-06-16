import Link from "next/link";

const Logo = () => {
    return (
        <Link href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="36" height="36">
                <ellipse cx="36" cy="36" rx="28" ry="11" fill="none" stroke="#4A90D9" strokeWidth="2.5"/>
                <ellipse cx="36" cy="36" rx="28" ry="11" fill="none" stroke="#2ECC71" strokeWidth="2.5" transform="rotate(60 36 36)"/>
                <ellipse cx="36" cy="36" rx="28" ry="11" fill="none" stroke="#a78bfa" strokeWidth="2.5" transform="rotate(120 36 36)"/>
                <circle cx="36" cy="36" r="5.5" fill="#a78bfa"/>
                <circle cx="64" cy="36" r="4" fill="#4A90D9"/>
                <circle cx="22" cy="12" r="4" fill="#2ECC71"/>
            </svg>
            <span className="text-xl font-bold font-heading text-foreground">CliqLabs</span>
        </Link>
    );
};

export default Logo;
