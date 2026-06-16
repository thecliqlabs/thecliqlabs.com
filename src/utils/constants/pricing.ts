export const WORKSPACE_LIMIT = 2;

export const PLANS = [
    {
        name: "Core",
        info: "Launch and brand your GHL agency",
        price: { monthly: 197, yearly: Math.round(197 * 12 * 0.85) },
        features: [
            { text: "GHL Theme Builder — unlimited themes", tooltip: "" },
            { text: "White-label knowledge base (1,000+ articles)", tooltip: undefined },
            { text: "Interactive guided tours", tooltip: undefined },
            { text: "OG SaaS Snapshot + Demo Snapshot", tooltip: undefined },
            { text: "Brandable demo video & slide deck", tooltip: undefined },
            { text: "10+ weekly coaching calls", tooltip: undefined },
            { text: "A2P 10DLC compliance training", tooltip: undefined },
        ],
        btn: { text: "Get started", href: "/auth/sign-up?plan=core", variant: "default" }
    },
    {
        name: "VIP",
        info: "Add real 24/7 human support",
        price: { monthly: 397, yearly: Math.round(397 * 12 * 0.85) },
        features: [
            { text: "Everything in Core", tooltip: undefined },
            { text: "24/7 branded support for up to 10 clients", tooltip: undefined },
            { text: "Chat, phone & video support", tooltip: undefined },
            { text: "Unlimited group onboarding (13-week)", tooltip: undefined },
            { text: "On-demand A2P support & DFY registration", tooltip: undefined },
            { text: "Support via Zoom & tickets", tooltip: undefined },
        ],
        btn: { text: "Get started", href: "/auth/sign-up?plan=vip", variant: "purple" }
    },
    {
        name: "Elite",
        info: "Scale to 100+ clients",
        price: { monthly: 997, yearly: Math.round(997 * 12 * 0.85) },
        features: [
            { text: "Everything in VIP", tooltip: undefined },
            { text: "24/7 support for UNLIMITED clients", tooltip: undefined },
            { text: "5 free client onboarding calls/month", tooltip: undefined },
            { text: "4 DFY A2P registrations monthly", tooltip: undefined },
            { text: "Access to GHL University", tooltip: undefined },
            { text: "40+ niche-specific snapshots", tooltip: undefined },
        ],
        btn: { text: "Get started", href: "/auth/sign-up?plan=elite", variant: "default" }
    }
];

export const PRICING_FEATURES = [
    { text: "Theme Builder", tooltip: "One-click GHL themes" },
    { text: "White-label support", tooltip: "Your brand, our team" },
    { text: "Client onboarding", tooltip: "Done-for-you under your brand" },
    { text: "Knowledge base", tooltip: "1,000+ articles always updated" },
    { text: "Coaching calls", tooltip: "10+ weekly calls with GHL experts" },
    { text: "Niche snapshots", tooltip: "Plug-and-play GHL builds" },
    { text: "A2P compliance", tooltip: "DFY registration and support" },
];
