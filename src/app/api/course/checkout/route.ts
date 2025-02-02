import { db } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    const { courseId } = await req.json();
    if (!courseId) {
        NextResponse.json({ error: "Missing Course ID" }, { status: 400 });
    }
    try {

        const { getUser } = getKindeServerSession();
        const user = await getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId
                }
            }
        })
        
        if (purchase) {
            return NextResponse.json({ error: "Course already purchased" }, { status: 400 });
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId
            }
        })

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }
        
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
            quantity: 1,
            price_data: {
                currency: 'inr',
                product_data: {
                    name: course.title,
                    description: course.description!,
                },
                unit_amount: course.price! * 100
            },
        }];

        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: {
                userId: user.id
            },
            select: {
                stripeCustomerId: true,
            }
        });

        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.email!,
            });

            stripeCustomer = await db.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id
                }
            });
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items,
            mode: 'payment',
            billing_address_collection: 'required',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?cancel=1`,
            metadata: {
                courseId: courseId,
                userId: user.id
            }
        });

        return NextResponse.json({ url: session.url }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 });
    }
}