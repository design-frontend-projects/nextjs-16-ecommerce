"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "./button";

export default function RatingStars({
  onChange,
  onBlur,
  value,
  disabled = false,
}: {
  value?: number;
  onChange?: (rating: number) => void;
  onBlur?: () => void;
  disabled?: boolean;
} = {}) {
  const [rating, setRating] = useState(value ?? 0);
  const [hover, setHover] = useState(0);

  const handleClick = (index: number) => {
    setRating(index);
    if (onChange) {
      onChange(index);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Button
        className={`flex  ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        variant={"ghost"}
        disabled={disabled}
      >
        {[1, 2, 3, 4, 5].map((index) => (
          <Star
            key={index}
            size={14}
            className={`w-5 h-5 cursor-pointer transition-all ${
              index <= (hover || rating)
                ? "text-[#0DC4D7] fill-[#0DC4D7]"
                : "text-gray-300"
            }`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(0)}
            onBlur={onBlur}
          />
        ))}
      </Button>
      {/* <p className="text-sm text-gray-500">
        {rating
          ? `You rated this ${rating} star${rating !== 1 ? "s" : ""}`
          : "Rate our app"}
      </p> */}
    </div>
  );
}
