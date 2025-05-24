import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function RatingCard({ value, onChange }) {
  const [rating, setRating] = useState(0);
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Rate this product</CardTitle>
        <CardDescription>
          Let us know what you think about this product.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onChange(star)}
              className={`
            text-primary
            hover:text-primary-foreground
            transition-colors
            ${
              value >= star
                ? "fill-primary"
                : "fill-muted stroke-muted-foreground"
            }
          `}
            >
              <StarIcon className="w-6 h-6" />
            </button>
          ))}
        </div>
        <div className="text-primary font-medium">
          {rating > 0
            ? `You rated this ${rating} out of 5 stars`
            : "Select a rating"}
        </div>
      </CardContent>
    </Card>
  );
}

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
