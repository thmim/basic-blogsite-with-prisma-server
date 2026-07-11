import Stripe from "stripe"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"
import { SubscriptionStatus } from "../../../generated/prisma/enums"

const subscriptionCreateToDb = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.users.findUniqueOrThrow({
      where: {
        id: userId
      },
      include: {
        subscription: true
      }
    })

    let stripeCustomerId = user.subscription?.stripeCustomerId

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id
        }
      })

      stripeCustomerId = customer.id
    }

    //  create checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_product_price_id,
          quantity: 1
        }
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/premium?success=true`,
      cancel_url: `${config.app_url}/payment?success=false`,
      metadata: { userId: user.id }
    })
    // console.log(session.url)
    return session.url


  })
  return {
    paymentUrl: transactionResult
  }

}



// handle web hook service

const handleWebhookFromDb = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_secret_webhook!

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret
  );
  //   console.log("event",event)
  //   handle the event here
  switch (event.type) {
    case 'checkout.session.completed':
      //Occurs whenever a subscription changes (e.g., switching from one plan to another, or changing the status from trial to active).

      //   console.log("match",event.data.object);
      const session = event.data.object;
      await handleCheckOutComplete(session)

      break;
    case 'customer.subscription.updated':
      //Occurs whenever a customer’s subscription ends

      const sessionSubscription = event.data.object;
      await handleSubscriptionChange(sessionSubscription)

      break;

    case 'customer.subscription.deleted':
      //Occurs whenever a customer’s subscription ends
      const sessionSubscriptiondel = event.data.object;
      await handleSubscriptionChange(sessionSubscriptiondel)

    default:
      // Unexpected event type
      console.log(`No event matched. Unhandled event type ${event.type}.`);
  }

}

// get subscription end time
const getSubscriptionEndTime = async (payload: Stripe.Subscription) => {
  const subscriptionEndInMiliSec = payload.items.data[0]?.current_period_end!

  const subscriptionEnd = new Date(subscriptionEndInMiliSec * 1000)
  return subscriptionEnd;
}

const handleCheckOutComplete = async (session: Stripe.Checkout.Session) => {
  const userId = session.metadata?.userId

  const stripeCustomerId = session.customer as string
  const stripeSubscriptionId = session.subscription as string;
  // console.log("id:", userId, "CustomerId:", stripeCustomerId, "subsId", stripeSubscriptionId)

  if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
    console.log("webhook can not work")
    return;
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)
  // console.log(stripeSubscription.items.data[0])

  // const subscriptionEndInMiliSec = stripeSubscription.items.data[0]?.current_period_end!

  const subscriptionEnd = getSubscriptionEndTime(stripeSubscription)

  // const subscriptionEnd = new Date(subscriptionEndInMiliSec * 1000)
  // console.log("end",subscriptionEnd)
  await prisma.subscription.upsert({
    where: {
      userId

    },
    create: {
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      currentPeriodEnd: subscriptionEnd
    },
    update: {
      stripeCustomerId,
      stripeSubscriptionId,
      currentPeriodEnd: subscriptionEnd
    }
  })

}

// subscription status changed function
const handleSubscriptionChange = async (payload: Stripe.Subscription) => {
  const stripeSubscriptionId = payload.id;
  const status = (payload.status === "active" || payload.status === "trialing") ? SubscriptionStatus.ACTIVE : payload.status === "canceled" ? SubscriptionStatus.CANCELED : SubscriptionStatus.EXPIRED
  const currentPeriodEnd = await getSubscriptionEndTime(payload);

  const isSubscriptionExist = await prisma.subscription.findUnique({
    where: {
      stripeSubscriptionId
    }
  })

  if (!isSubscriptionExist) {
    console.log(`webhook does not find any subscription from id:${stripeSubscriptionId}`)
    return;
  }

  await prisma.subscription.update({
    where: {
      stripeSubscriptionId
    },
    data: {
      status,
      currentPeriodEnd
    }
  })

}

export const subscriptionServices = {
  subscriptionCreateToDb,
  handleWebhookFromDb
}