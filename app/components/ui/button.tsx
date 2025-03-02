"use client"

import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variantStyles = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-700",
      destructive: "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:border-gray-600 dark:hover:bg-gray-700",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-gray-700 dark:hover:bg-gray-600",
      ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700",
      link: "underline-offset-4 hover:underline text-primary dark:text-blue-400",
    };

    const sizeStyles = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md text-xs",
      lg: "h-11 px-8 rounded-md",
      icon: "h-10 w-10",
    };

    const Comp = asChild ? (props.children as React.ReactElement) : "button";
    
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ""}`;

    return (
      <button
        className={combinedClassName}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button }; 