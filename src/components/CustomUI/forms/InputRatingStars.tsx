"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { FormDescription, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import RatingStars from "@/components/ui/rating-stars";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  id?: string;
  defaultValue?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  description?: string;
};

const InputRatingStars = ({
  name,
  label,
  placeholder,
  id,
  defaultValue,
  required,
  readOnly,
  disabled,
  description,
}: Props) => {
  const { control } = useFormContext();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormItem className="relative my-2 w-full items-center gap-1.5">
          {label && (
            <Label htmlFor={name} className={`${error ? "text-red-600" : ""}`}>
              {label}
            </Label>
          )}
          <RatingStars
            onChange={field.onChange}
            value={defaultValue ?? field.value}
          />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
};

export default InputRatingStars;
