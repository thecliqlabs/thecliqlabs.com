import { HeadphonesIcon, LayoutTemplateIcon, PaletteIcon, UsersIcon, BookOpenIcon, PhoneCallIcon } from "lucide-react";

export const DEFAULT_AVATAR_URL = "https://api.dicebear.com/8.x/initials/svg?backgroundType=gradientLinear&backgroundRotation=0,360&seed=";
export const PAGINATION_LIMIT = 10;
export const WORKSPACE_LIMIT = 2;

export const COMPANIES = [
    { name: "Bold Media", logo: "/assets/company-01.svg" },
    { name: "IOI Ventures", logo: "/assets/company-02.svg" },
    { name: "DPC Platform", logo: "/assets/company-03.svg" },
    { name: "PushPressGrow", logo: "/assets/company-04.svg" },
    { name: "InstaScale", logo: "/assets/company-05.svg" },
    { name: "Serie A Elite", logo: "/assets/company-06.svg" },
] as const;

export const PROCESS = [
    {
        title: "Install in 10 Minutes",
        description: "Paste one line of code into your GHL white-label settings. Your theme builder and support widget appear instantly.",
        icon: PhoneCallIcon,
    },
    {
        title: "Brand Your Platform",
        description: "Use the Theme Builder to apply your colors, fonts, and style across your entire GHL platform in seconds.",
        icon: PaletteIcon,
    },
    {
        title: "We Handle Your Clients",
        description: "Onboarding, support, knowledge base — all white-labeled under your brand. Your clients think you built it all.",
        icon: UsersIcon,
    },
] as const;

export const FEATURES = [
    { title: "24/7 White-Label Support", description: "Real agents, your brand, any time of day via chat, email, and Zoom." },
    { title: "GHL Theme Builder", description: "One-click themes for your entire sub-account base. No code needed." },
    { title: "White-Label Knowledge Base", description: "1,000+ support articles under your brand, always updated." },
    { title: "Done-For-You Onboarding", description: "2-call white-labeled onboarding handled entirely by us." },
    { title: "Premium Niche Snapshots", description: "Plug-and-play GHL builds for every industry, ready to launch." },
    { title: "A2P 10DLC Compliance", description: "On-demand compliance help and DFY registration so you never get blocked." },
] as const;

export const REVIEWS = [
    {
        name: "Marcus Thompson",
        username: "@marcust_ghl",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        rating: 5,
        review: "The theme builder alone was worth it. My clients think I spent months building a custom platform. Setup took 10 minutes. Absolutely incredible."
    },
    {
        name: "Sarah Kim",
        username: "@sarahk_agency",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        rating: 5,
        review: "CliqLabs handles all my client support 24/7. I used to dread the support messages. Now I don't even think about it. Game changer."
    },
    {
        name: "Ryan Davis",
        username: "@ryand_saas",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        rating: 5,
        review: "Onboarding used to take me 3 hours per client. Now CliqLabs does it for me and my clients actually show up ready to go. Insane ROI."
    },
    {
        name: "Priya Patel",
        username: "@priyap_hl",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        rating: 5,
        review: "The white-label support is seamless. My clients have no idea it's not my own team. CliqLabs is the backbone of my entire agency."
    },
    {
        name: "James Walker",
        username: "@jamesw_agency",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        rating: 5,
        review: "Went from 10 clients to 60 in 4 months because I could finally scale without hiring. CliqLabs made that possible."
    },
    {
        name: "Olivia Chen",
        username: "@oliviac_ghl",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        rating: 4,
        review: "Snapshots are incredibly well built. I launched a dental client in under 20 minutes. The quality blew me away."
    },
    {
        name: "David Okafor",
        username: "@davido_saas",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        rating: 5,
        review: "100% recommend. CliqLabs over delivers. The branded support alone is worth 10x the price. My churn dropped significantly."
    },
    {
        name: "Emma Rodriguez",
        username: "@emmar_hl",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        rating: 5,
        review: "I've tried HL Pro Tools and Extendly. CliqLabs is sharper, faster to set up, and actually listens to what agencies need."
    },
    {
        name: "Chris Bennett",
        username: "@chrisb_agency",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
        rating: 5,
        review: "The weekly coaching calls alone are worth the subscription. Real experts, real tactics. My agency revenue doubled in 6 months."
    },
] as const;

export const PLANS = [
    {
        name: "Core",
        info: "Launch and brand your GHL agency",
        price: { monthly: 197, yearly: Math.round(197 * 12 * 0.85) },
        features: [
            { text: "GHL Theme Builder — unlimited themes" },
            { text: "White-label knowledge base (1,000+ articles)" },
            { text: "Interactive guided tours" },
            { text: "OG SaaS Snapshot" },
            { text: "Demo Snapshot" },
            { text: "Brandable demo video & slide deck" },
            { text: "10+ weekly coaching calls" },
            { text: "A2P 10DLC compliance training" },
        ],
        btn: { text: "Get started", href: "/auth/sign-up?plan=core", variant: "default" }
    },
    {
        name: "VIP",
        info: "Add real 24/7 human support",
        price: { monthly: 397, yearly: Math.round(397 * 12 * 0.85) },
        features: [
            { text: "Everything in Core" },
            { text: "24/7 branded support for up to 10 clients" },
            { text: "Chat, phone & video support" },
            { text: "Unlimited group onboarding (13-week)" },
            { text: "On-demand A2P support & DFY registration" },
            { text: "Support via Zoom & tickets" },
        ],
        btn: { text: "Get started", href: "/auth/sign-up?plan=vip", variant: "purple" }
    },
    {
        name: "Elite",
        info: "Scale to 100+ clients",
        price: { monthly: 997, yearly: Math.round(997 * 12 * 0.85) },
        features: [
            { text: "Everything in VIP" },
            { text: "24/7 support for UNLIMITED clients" },
            { text: "5 free client onboarding calls/month" },
            { text: "4 DFY A2P registrations monthly" },
            { text: "Access to GHL University" },
            { text: "40+ niche-specific snapshots" },
        ],
        btn: { text: "Get started", href: "/auth/sign-up?plan=elite", variant: "default" }
    }
];

export const PRICING_FEATURES = [
    { text: "Theme Builder", tooltip: "One-click GHL themes for your entire platform" },
    { text: "White-label support", tooltip: "Your brand, our team" },
    { text: "Client onboarding", tooltip: "Done-for-you under your brand" },
    { text: "Knowledge base", tooltip: "1,000+ articles, always updated" },
    { text: "Coaching calls", tooltip: "10+ weekly calls with GHL experts" },
    { text: "Niche snapshots", tooltip: "Plug-and-play GHL builds" },
    { text: "A2P compliance", tooltip: "DFY registration and support" },
];
