import { cn } from "@/shared/utils/utils";
import * as React from "react";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?:
    | "hero-h1" | "hero-h2" | "hero-h3" | "hero-h4" | "hero-h5" | "hero-h6"
    | "heading-h1" | "heading-h2" | "heading-h3" | "heading-h4" | "heading-h5" | "heading-h6"
    | "body-xl" | "body-xl-regular"
    | "body-l" | "body-l-regular"
    | "body-m" | "body-m-regular"
    | "body-s" | "body-s-regular"
    | "body-xs" | "body-xs-regular"
    | "caption-l" | "caption-s"
    | "italic-l" | "italic-l-regular"
    | "italic-s" | "italic-s-regular"
    | "italic-xs" | "italic-xs-regular";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "label";
}

const variantStyles: Record<string, string> = {
  // Hero/Title Text
  "hero-h1": "text-hero-h1",
  "hero-h2": "text-hero-h2",
  "hero-h3": "text-hero-h3",
  "hero-h4": "text-hero-h4",
  "hero-h5": "text-hero-h5",
  "hero-h6": "text-hero-h6",

  // Heading Text
  "heading-h1": "text-heading-h1",
  "heading-h2": "text-heading-h2",
  "heading-h3": "text-heading-h3",
  "heading-h4": "text-heading-h4",
  "heading-h5": "text-heading-h5",
  "heading-h6": "text-heading-h6",

  // Body Text
  "body-xl": "text-body-xl",
  "body-xl-regular": "text-body-xl-regular",
  "body-l": "text-body-l",
  "body-l-regular": "text-body-l-regular",
  "body-m": "text-body-m",
  "body-m-regular": "text-body-m-regular",
  "body-s": "text-body-s",
  "body-s-regular": "text-body-s-regular",
  "body-xs": "text-body-xs",
  "body-xs-regular": "text-body-xs-regular",

  // Caption Text
  "caption-l": "text-caption-l uppercase",
  "caption-s": "text-caption-s uppercase",

  // Italic Text
  "italic-l": "text-[18px] leading-[120%] tracking-[-0.02em] font-bold italic",
  "italic-l-regular": "text-[18px] leading-[120%] tracking-[-0.02em] italic",
  "italic-s": "text-[14px] leading-[120%] tracking-[-0.02em] font-bold italic",
  "italic-s-regular": "text-[14px] leading-[120%] tracking-[-0.02em] italic",
  "italic-xs": "text-[12px] leading-[120%] tracking-[-0.02em] font-bold italic",
  "italic-xs-regular": "text-[12px] leading-[120%] tracking-[-0.02em] italic",
};

const defaultElements: Record<string, string> = {
  "hero-h1": "h1",
  "hero-h2": "h2",
  "hero-h3": "h3",
  "hero-h4": "h4",
  "hero-h5": "h5",
  "hero-h6": "h6",
  "heading-h1": "h1",
  "heading-h2": "h2",
  "heading-h3": "h3",
  "heading-h4": "h4",
  "heading-h5": "h5",
  "heading-h6": "h6",
};

/**
 * Typography component based on Plus Jakarta Sans design system
 *
 * Usage examples:
 * <Typography variant="hero-h1">Hero Heading</Typography>
 * <Typography variant="heading-h2">Page Title</Typography>
 * <Typography variant="body-m">Regular paragraph text</Typography>
 * <Typography variant="caption-l">Label Text</Typography>
 * <Typography variant="body-s" as="span" className="text-blue-600">Custom styled text</Typography>
 */
export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ variant = "body-m-regular", as, className, children, ...props }, ref) => {
    const Component = (as || defaultElements[variant] || "p") as any;

    return (
      <Component
        ref={ref}
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Typography.displayName = "Typography";

// Convenience components for common use cases
export const HeroHeading = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, "variant"> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }>(
  ({ level = 1, ...props }, ref) => (
    <Typography ref={ref as any} variant={`hero-h${level}` as any} {...props} />
  )
);
HeroHeading.displayName = "HeroHeading";

export const Heading = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, "variant"> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }>(
  ({ level = 1, ...props }, ref) => (
    <Typography ref={ref as any} variant={`heading-h${level}` as any} {...props} />
  )
);
Heading.displayName = "Heading";

export const Body = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, "variant"> & {
  size?: "xl" | "l" | "m" | "s" | "xs";
  regular?: boolean;
}>(
  ({ size = "m", regular = false, ...props }, ref) => (
    <Typography
      ref={ref as any}
      variant={`body-${size}${regular ? "-regular" : ""}` as any}
      as="p"
      {...props}
    />
  )
);
Body.displayName = "Body";

export const Caption = React.forwardRef<HTMLSpanElement, Omit<TypographyProps, "variant"> & {
  size?: "l" | "s";
}>(
  ({ size = "s", ...props }, ref) => (
    <Typography
      ref={ref as any}
      variant={`caption-${size}` as any}
      as="span"
      {...props}
    />
  )
);
Caption.displayName = "Caption";
