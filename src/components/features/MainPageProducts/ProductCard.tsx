import React from 'react';
import Image from 'next/image';
import { CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Props = {
  image?: any;
  name: string;
  price: number;
  currency?: string;
  discountPrice?: number | null;
  inStock?: boolean;
  onDetails?: () => void;
  className?: string;
};

const ProductCard: React.FC<Props> = ({
  image = '/images/placeholder.png',
  name,
  price,
  currency = 'USD',
  discountPrice = null,
  inStock = true,
  onDetails,
  className,
}) => {
  const hasDiscount = typeof discountPrice === 'number' && discountPrice < price;

  const format = (value: number) =>
    new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value);

  const discountAmount = hasDiscount ? price - (discountPrice as number) : 0;
  const discountPercent = hasDiscount ? Math.round((discountAmount / price) * 100) : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          {inStock ? (
            <Badge className="inline-flex items-center gap-1" variant="default">
              <CheckCircle className="h-4 w-4 text-emerald-400" /> In stock
            </Badge>
          ) : (
            <Badge className="inline-flex items-center gap-1" variant="destructive">
              <XCircle className="h-4 w-4 text-destructive-foreground" /> Out of stock
            </Badge>
          )}

          {hasDiscount && (
            <Badge className="ml-2" variant="secondary">
              -{discountPercent}%
            </Badge>
          )}
        </div>
        <CardTitle className="mt-2">{name}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative w-full overflow-hidden rounded-md bg-muted">
          <div className="aspect-4/3 w-full relative">
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-4">
        <div>
          {hasDiscount ? (
            <div className="flex items-baseline gap-2">
              <div className="text-lg font-semibold text-foreground">{format(discountPrice as number)}</div>
              <div className="text-sm line-through text-muted-foreground">{format(price)}</div>
            </div>
          ) : (
            <div className="text-lg font-semibold">{format(price)}</div>
          )}
          {hasDiscount && (
            <div className="text-xs text-muted-foreground">You save {format(discountAmount)} ({discountPercent}%)</div>
          )}
        </div>

        <div>
          <Button size="sm" variant="default" onClick={onDetails} withAnimation>
            Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
