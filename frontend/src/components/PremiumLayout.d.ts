import React from 'react';
import '../styles/globals.css';
interface PremiumLayoutProps {
    children: React.ReactNode;
    className?: string;
}
export declare const PremiumLayout: React.FC<PremiumLayoutProps>;
interface PremiumHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}
export declare const PremiumHeader: React.FC<PremiumHeaderProps>;
interface PremiumCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}
export declare const PremiumCard: React.FC<PremiumCardProps>;
interface PremiumButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}
export declare const PremiumButton: React.FC<PremiumButtonProps>;
interface PremiumInputProps {
    label?: string;
    placeholder?: string;
    type?: string;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    icon?: string;
}
export declare const PremiumInput: React.FC<PremiumInputProps>;
interface StatBoxProps {
    value: string | number;
    label: string;
    icon?: string;
}
export declare const StatBox: React.FC<StatBoxProps>;
export default PremiumLayout;
//# sourceMappingURL=PremiumLayout.d.ts.map