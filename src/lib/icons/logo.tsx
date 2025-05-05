import { Component } from "solid-js";

interface LogoProps {
    variant: 1 | 2;
}

export const Logo: Component<LogoProps> = ({
    variant,
}: LogoProps) => {
    switch (variant) {
        case 1:
            return (
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="80" height="80" fill="#1e293b" rx="10" />
                    <rect x="20" y="20" width="20" height="20" fill="#334155" />
                    <rect x="60" y="20" width="20" height="20" fill="#334155" />
                    <rect x="20" y="60" width="20" height="20" fill="#334155" />
                    <rect x="60" y="60" width="20" height="20" fill="#334155" />
                    <rect x="40" y="40" width="20" height="20" fill="#e2e8f0" />
                </svg>
            );
        case 2: return (
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" fill="#1e293b" />
                <path d="M50 30L40 70L60 70Z" fill="#e2e8f0" />
                <circle cx="50" cy="50" r="10" fill="#334155" />
            </svg>
        );
    }
};