'use client';

import { useTranslations } from 'next-intl';
import {
  Package,
  ChevronRight,
  Search,
  Filter,
  ExternalLink,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const MOCK_ORDERS = [
  {
    id: 'ORD-2948',
    date: 'Dec 12, 2024',
    status: 'processing',
    total: 124.0,
    items: [
      {
        name: 'Wireless Headphones',
        price: 89.0,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&q=80',
      },
      {
        name: 'USB-C Cable',
        price: 35.0,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1541140532154-b024d715b909?w=100&h=100&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'ORD-1852',
    date: 'Nov 28, 2024',
    status: 'delivered',
    total: 210.5,
    items: [
      {
        name: 'Smart Watch Series 7',
        price: 199.0,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'ORD-0921',
    date: 'Oct 15, 2024',
    status: 'cancelled',
    total: 45.0,
    items: [
      {
        name: 'Phone Case',
        price: 45.0,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1586953101559-4d987a50ff48?w=100&h=100&fit=crop&q=80',
      },
    ],
  },
];

export default function OrdersPage() {
  const t = useTranslations('orders');

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Page Header */}
      <section className="bg-white dark:bg-zinc-900 py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {t('title')}
              </h1>
              <p className="text-muted-foreground">
                Manage your orders and track their delivery status
              </p>
            </motion.div>

            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-10 w-full md:w-[300px] rounded-full bg-muted/50 border-none"
                />
              </div>
              <Button variant="outline" size="icon" className="rounded-full">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <div className="space-y-6 max-w-4xl mx-auto">
          {MOCK_ORDERS.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-wrap items-center justify-between p-6 gap-4 bg-muted/20">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          {t('orderNumber')}
                        </p>
                        <p className="font-bold text-sm">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          {t('orderDate')}
                        </p>
                        <p className="text-sm">{order.date}</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          {t('total')}
                        </p>
                        <p className="font-bold text-sm">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                      <StatusBadge status={order.status} />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full group"
                        asChild
                      >
                        <Link href={`/orders/${order.id}`}>
                          {t('viewOrder')}
                          <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="p-6">
                    <div className="flex flex-col gap-4">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 relative rounded-lg overflow-hidden bg-muted border">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-bold leading-none mb-2">
                                {item.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-bold">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Estimated Delivery: Dec 20, 2024
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full text-xs h-8"
                      >
                        Track Shipment <ExternalLink className="h-3 w-3 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {MOCK_ORDERS.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t('noOrders')}</h2>
              <p className="text-muted-foreground mb-8">
                Start shopping to see your orders here!
              </p>
              <Button asChild className="rounded-full px-8">
                <Link href="/products">Browse products</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<
    string,
    { label: string; icon: any; className: string }
  > = {
    pending: {
      label: 'Pending',
      icon: Clock,
      className:
        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    processing: {
      label: 'Processing',
      icon: Truck,
      className:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    delivered: {
      label: 'Delivered',
      icon: CheckCircle2,
      className:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    cancelled: {
      label: 'Cancelled',
      icon: XCircle,
      className:
        'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    },
  };

  const config = configs[status] || configs.pending;

  return (
    <Badge
      className={cn(
        'px-2.5 py-0.5 rounded-full border-none shadow-none font-medium text-[10px] uppercase tracking-wider flex items-center gap-1.5',
        config.className
      )}
    >
      <config.icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
