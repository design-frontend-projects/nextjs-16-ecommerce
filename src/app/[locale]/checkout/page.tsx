'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Truck,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCartStore } from '@/store';
import { Link, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const checkoutSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  country: z.string().min(2),
  postalCode: z.string().min(4),
  phone: z.string().min(8),
  shippingMethod: z.enum(['standard', 'express']),
  paymentMethod: z.enum(['card', 'paypal', 'apple_pay']),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const t = useTranslations();
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const shipping = step === 1 ? 0 : subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingMethod: 'standard',
      paymentMethod: 'card',
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Order submitted:', data);
    clearCart();
    setStep(3); // Show success
    setIsSubmitting(false);
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button asChild rounded-full>
          <Link href="/products">Go Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="container mx-auto px-4 py-10">
        {/* Checkout Steps */}
        <div className="flex items-center justify-center mb-10 max-w-xl mx-auto">
          <StepItem
            number={1}
            title="Shipping"
            active={step === 1}
            completed={step > 1}
          />
          <div
            className={cn(
              'h-px w-full mx-4',
              step > 1 ? 'bg-primary' : 'bg-muted-foreground/30'
            )}
          />
          <StepItem
            number={2}
            title="Payment"
            active={step === 2}
            completed={step > 2}
          />
          <div
            className={cn(
              'h-px w-full mx-4',
              step > 2 ? 'bg-primary' : 'bg-muted-foreground/30'
            )}
          />
          <StepItem
            number={3}
            title="Success"
            active={step === 3}
            completed={step >= 3}
          />
        </div>

        {step === 3 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto text-center py-10"
          >
            <div className="h-24 w-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">
              {t('checkout.orderPlaced')}
            </h1>
            <p className="text-muted-foreground mb-10">
              {t('checkout.orderConfirmation')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                variant="outline"
                className="rounded-full"
              >
                <Link href="/orders">View Your Orders</Link>
              </Button>
              <Button size="lg" asChild className="rounded-full">
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form Side */}
            <div className="lg:col-span-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <Card className="border-none shadow-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            {t('checkout.shippingAddress')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="sm:col-span-2">
                                <FormLabel>{t('checkout.email')}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="email@example.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('checkout.firstName')}</FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('checkout.lastName')}</FormLabel>
                                <FormControl>
                                  <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem className="sm:col-span-2">
                                <FormLabel>{t('checkout.address')}</FormLabel>
                                <FormControl>
                                  <Input placeholder="123 Main St" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('checkout.city')}</FormLabel>
                                <FormControl>
                                  <Input placeholder="New York" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t('checkout.postalCode')}
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="10001" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>

                      <Card className="border-none shadow-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5 text-primary" />
                            {t('checkout.shippingMethod')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <FormField
                            control={form.control}
                            name="shippingMethod"
                            render={({ field }) => (
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid gap-4 sm:grid-cols-2"
                              >
                                <FormItem>
                                  <FormControl>
                                    <div
                                      className={cn(
                                        'flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all',
                                        field.value === 'standard'
                                          ? 'border-primary bg-primary/5'
                                          : 'hover:bg-muted'
                                      )}
                                      onClick={() => field.onChange('standard')}
                                    >
                                      <div className="flex items-center gap-3">
                                        <RadioGroupItem
                                          value="standard"
                                          id="standard"
                                        />
                                        <div className="grid gap-1">
                                          <Label
                                            htmlFor="standard"
                                            className="font-semibold cursor-pointer"
                                          >
                                            {t('checkout.standardShipping')}
                                          </Label>
                                          <span className="text-xs text-muted-foreground">
                                            3-5 business days
                                          </span>
                                        </div>
                                      </div>
                                      <span className="font-bold">Free</span>
                                    </div>
                                  </FormControl>
                                </FormItem>
                                <FormItem>
                                  <FormControl>
                                    <div
                                      className={cn(
                                        'flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all',
                                        field.value === 'express'
                                          ? 'border-primary bg-primary/5'
                                          : 'hover:bg-muted'
                                      )}
                                      onClick={() => field.onChange('express')}
                                    >
                                      <div className="flex items-center gap-3">
                                        <RadioGroupItem
                                          value="express"
                                          id="express"
                                        />
                                        <div className="grid gap-1">
                                          <Label
                                            htmlFor="express"
                                            className="font-semibold cursor-pointer"
                                          >
                                            {t('checkout.expressShipping')}
                                          </Label>
                                          <span className="text-xs text-muted-foreground">
                                            1-2 business days
                                          </span>
                                        </div>
                                      </div>
                                      <span className="font-bold">$15.00</span>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              </RadioGroup>
                            )}
                          />
                        </CardContent>
                      </Card>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          size="lg"
                          className="rounded-full px-10"
                          onClick={() => setStep(2)}
                        >
                          Continue to Payment
                          <ChevronRight className="h-5 w-5 ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStep(1)}
                        className="mb-4"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Shipping
                      </Button>

                      <Card className="border-none shadow-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            {t('checkout.paymentMethod')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid gap-4"
                              >
                                <div
                                  className={cn(
                                    'flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all',
                                    field.value === 'card'
                                      ? 'border-primary bg-primary/5'
                                      : 'hover:bg-muted'
                                  )}
                                  onClick={() => field.onChange('card')}
                                >
                                  <div className="flex items-center gap-3">
                                    <RadioGroupItem value="card" id="card" />
                                    <Label
                                      htmlFor="card"
                                      className="font-semibold cursor-pointer"
                                    >
                                      Credit / Debit Card
                                    </Label>
                                  </div>
                                  <div className="flex gap-2">
                                    <div className="w-8 h-5 bg-muted rounded"></div>
                                    <div className="w-8 h-5 bg-muted rounded"></div>
                                  </div>
                                </div>
                                <div
                                  className={cn(
                                    'flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all',
                                    field.value === 'paypal'
                                      ? 'border-primary bg-primary/5'
                                      : 'hover:bg-muted'
                                  )}
                                  onClick={() => field.onChange('paypal')}
                                >
                                  <div className="flex items-center gap-3">
                                    <RadioGroupItem
                                      value="paypal"
                                      id="paypal"
                                    />
                                    <Label
                                      htmlFor="paypal"
                                      className="font-semibold cursor-pointer"
                                    >
                                      PayPal
                                    </Label>
                                  </div>
                                  <span className="text-xl italic font-bold text-blue-800">
                                    PayPal
                                  </span>
                                </div>
                              </RadioGroup>
                            )}
                          />

                          {form.watch('paymentMethod') === 'card' && (
                            <div className="grid gap-4 p-4 bg-muted/30 rounded-xl">
                              <div className="grid gap-2">
                                <Label className="text-sm">Card Number</Label>
                                <Input placeholder="0000 0000 0000 0000" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label className="text-sm">Expiry Date</Label>
                                  <Input placeholder="MM / YY" />
                                </div>
                                <div className="grid gap-2">
                                  <Label className="text-sm">CVV</Label>
                                  <Input placeholder="123" />
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <div className="flex flex-col gap-4">
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full rounded-full h-12 text-base font-bold shadow-lg shadow-primary/20"
                          disabled={isSubmitting}
                        >
                          {isSubmitting
                            ? 'Processing...'
                            : `Pay $${total.toFixed(2)}`}
                        </Button>
                        <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                          <Lock className="h-3 w-3" />
                          Secure SSL Encrypted Payment
                        </p>
                      </div>
                    </motion.div>
                  )}
                </form>
              </Form>
            </div>

            {/* Summary Side */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-zinc-900">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t('checkout.orderSummary')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="px-6 py-4 space-y-4 max-h-[300px] overflow-y-auto">
                      {items.map((item) => (
                        <div
                          key={item.product.product_id}
                          className="flex gap-3"
                        >
                          <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop&q=80`}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                              {item.quantity}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">
                              {item.product.name}
                            </p>
                            <p className="text-sm font-bold mt-1">
                              $
                              {(
                                parseFloat(item.product.base_price) *
                                item.quantity
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="p-6 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t('cart.subtotal')}
                        </span>
                        <span className="font-medium">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t('cart.shipping')}
                        </span>
                        <span className="font-medium">
                          {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t('cart.tax')} (15%)
                        </span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>{t('cart.total')}</span>
                        <span className="text-primary">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepItem({
  number,
  title,
  active,
  completed,
}: {
  number: number;
  title: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex items-center flex-col gap-2 flex-shrink-0">
      <div
        className={cn(
          'h-10 w-10 rounded-full flex items-center justify-center font-bold transition-all border-2',
          completed
            ? 'bg-primary border-primary text-white'
            : active
              ? 'border-primary text-primary'
              : 'border-muted-foreground/30 text-muted-foreground'
        )}
      >
        {completed ? <CheckCircle2 className="h-6 w-6" /> : number}
      </div>
      <span
        className={cn(
          'text-xs font-medium',
          active || completed ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        {title}
      </span>
    </div>
  );
}

function Label({
  children,
  className,
  htmlFor,
}: {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
    >
      {children}
    </label>
  );
}
