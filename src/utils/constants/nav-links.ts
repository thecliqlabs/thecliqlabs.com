import { HeadphonesIcon, LayoutTemplateIcon, LineChartIcon, PaletteIcon, SparklesIcon, UsersIcon } from "lucide-react";

export const NAV_LINKS = [
    {
        title: "Features",
        href: "/features",
        menu: [
            {
                title: "Theme Builder",
                tagline: "Brand your GHL platform in one click.",
                href: "/features/theme-builder",
                icon: PaletteIcon,
            },
            {
                title: "24/7 Support",
                tagline: "White-label support for your clients.",
                href: "/features/support",
                icon: HeadphonesIcon,
            },
            {
                title: "Client Onboarding",
                tagline: "Done-for-you onboarding under your brand.",
                href: "/features/onboarding",
                icon: UsersIcon,
            },
            {
                title: "Snapshots",
                tagline: "Industry-ready GHL builds, plug and play.",
                href: "/features/snapshots",
                icon: LayoutTemplateIcon,
            },
        ],
    },
    {
        title: "Pricing",
        href: "/pricing",
    },
    {
        title: "Theme Builder",
        href: "/theme-builder",
    },
    {
        title: "Resources",
        href: "/resources",
        menu: [
            {
                title: "Blog",
                tagline: "GHL tips, growth strategies, and guides.",
                href: "/resources/blog",
                icon: SparklesIcon,
            },
            {
                title: "Help",
                tagline: "Get answers to your questions.",
                href: "/resources/help",
                icon: HeadphonesIcon,
            },
        ]
    },
    {
        title: "Changelog",
        href: "/changelog",
    },
];
