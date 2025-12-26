import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart2, CheckCircle, Heart, Share2, XCircle } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

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
  const hasDiscount =
    typeof discountPrice === 'number' && discountPrice < price;

  const format = (value: number) =>
    new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value);

  const discountAmount = hasDiscount ? price - (discountPrice as number) : 0;
  const discountPercent = hasDiscount
    ? Math.round((discountAmount / price) * 100)
    : 0;

  return (
    <Card className={className}>
      <div className="flex flex-row gap-4 p-4 items-stretch">
        {/* Small screens: image + details split 50/50. Large screens: image small left, details take remaining space */}
        <div className="w-1/2 lg:w-36 shrink-0">
          <div className="relative h-40 lg:h-56 w-full overflow-hidden rounded-md bg-muted">
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 768px) 40vw, 33vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="w-1/2 lg:flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {inStock ? (
                  <Badge
                    className="inline-flex items-center gap-1"
                    variant="default"
                  >
                    <CheckCircle className="h-4 w-4 text-emerald-400" /> In
                    stock
                  </Badge>
                ) : (
                  <Badge
                    className="inline-flex items-center gap-1"
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 text-destructive-foreground" />{' '}
                    Out of stock
                  </Badge>
                )}

                {hasDiscount && (
                  <Badge className="ml-2" variant="secondary">
                    -{discountPercent}%
                  </Badge>
                )}
              </div>
            </div>

            <h3 className="mt-2 text-base font-medium">{name}</h3>
          </div>

          <div className="mt-4">
            <div>
              {hasDiscount ? (
                <div className="flex flex-col gap-1">
                  <span className="text-sm line-through text-muted-foreground">
                    {format(price)}
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    {format(discountPrice as number)}
                  </span>
                </div>
              ) : (
                <div className="text-lg font-semibold">{format(price)}</div>
              )}

              {hasDiscount && (
                <div className="text-xs text-muted-foreground">
                  You save {format(discountAmount)} ({discountPercent}%)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-row sm:items-center justify-between gap-3 px-2 sm:px-4">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" aria-label="favorite">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" aria-label="stats">
            <BarChart2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" aria-label="share">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <div>
          <Button size="sm" variant="default" onClick={onDetails} withAnimation>
            Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
