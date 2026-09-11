import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function OrderConfirmationPage() {
  // Generate random order number for mock
  const orderNumber = `CB-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="min-h-[70vh] bg-core-bg pt-32 pb-24 px-6 flex flex-col items-center justify-center text-center">
      <CheckCircle2 className="w-16 h-16 text-core-accent mb-6" />
      <h1 className="font-heading text-4xl text-core-ink mb-4">Thank you for your order!</h1>
      <p className="text-core-muted-foreground mb-8 max-w-md mx-auto">
        Your order <span className="font-medium text-core-ink">{orderNumber}</span> has been confirmed. 
        We'll send you an email with shipping details once your items are on the way.
      </p>
      
      <div className="bg-[#EBE7DF] p-8 rounded-sm max-w-md w-full mb-10 text-left">
        <h3 className="font-medium text-core-ink mb-4">Estimated Delivery</h3>
        <p className="text-core-muted-foreground text-sm">
          Usually arrives in 2-4 business days via FedEx Ground.
        </p>
      </div>

      <Link href="/shop" className={buttonVariants({ className: "bg-core-ink text-white hover:bg-core-ink/90 rounded-sm h-12 px-10 uppercase tracking-widest text-xs font-semibold" })}>Continue Shopping</Link>
    </div>
  );
}
