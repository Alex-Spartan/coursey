import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/prisma";


async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  if (!userId || !courseId) {
    throw new Error("Missing metadata");
  }

  // Create purchase record
  await db.purchase.create({
    data: {
      courseId,
      userId,
    }
  });
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature");
  
  if (!signature) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (error) {
    console.log(`⚠️  Webhook signature verification failed.`, error);
    return new NextResponse(`Webhook Error: ${error}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.log("Error processing webhook:", error);
    return new NextResponse(`Webhook Error: ${error}`, { status: 400 });
  }

  return new NextResponse(null, { status: 200 });
}