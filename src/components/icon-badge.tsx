import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const backgroundVariants = cva("rounded-full flex items-center jutify-center", {
  variants: {
    variant: {
      default: "bg-sky-100",
      success: "bg-emerald-100",
    },
    IconVariant: {
      default: "text-sky-700",
      success: "text-emerald-700",
    },
    size: {
      default: "p-4",
      sm: "p-2",
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
});

const IconVariants = cva("", {
  variants: {
    variant: {
      default: "text-sky-700",
      success: "text-emerald-700",
    },
    size: {
      default: "h-10 w-10",
      sm: "h-8 w-8",
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
});

type BackgroundVariantProps = VariantProps<typeof backgroundVariants>;
type IconVariantProps = VariantProps<typeof IconVariants>;

interface IconBadgeProps extends BackgroundVariantProps, IconVariantProps {
  icon: LucideIcon;
}

export const IconBadge = ({ icon: Icon, variant, size }: IconBadgeProps) => {
  return (
    <div className={cn(backgroundVariants({ variant, size }))}>
      <Icon className={cn(IconVariants({ variant, size }))} />
    </div>
  );
};
