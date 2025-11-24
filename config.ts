
export const MONETIZATION_CONFIG = {
  // =================================================================
  // 💰 MONETIZATION CONFIGURATION
  // Paste your real affiliate and payment links below to start earning.
  // =================================================================

  // 1. Affiliate Links (Displayed in the Editor Sidebar)
  // Sign up for affiliate programs like TopResume, Resume.io, or LinkedIn Learning to get these links.
  affiliate: {
    resumeReview: "https://www.topresume.com/?ref=YOUR_ID", // e.g., TopResume
    linkedinOptimization: "https://www.linkedin.com/learning/?ref=YOUR_ID", // e.g., LinkedIn Learning
    jobBoard: "https://weworkremotely.com/?ref=YOUR_ID", // e.g., WeWorkRemotely or ZipRecruiter
  },

  // 2. Payment Links (Displayed in the "Go Pro" Modal)
  // Create a payment link in Stripe Dashboard (https://dashboard.stripe.com/payment-links) or use PayPal/BuyMeACoffee.
  payment: {
    stripeCheckoutUrl: "https://buy.stripe.com/YOUR_STRIPE_LINK_HERE", 
    buyMeCoffeeUrl: "https://www.buymeacoffee.com/YOUR_USERNAME",
  },

  // 3. Ad Interstitial (Displayed before Download)
  // You can point this to a specific high-paying affiliate offer or your own consulting service.
  ads: {
    downloadModalAdUrl: "https://www.interview-prep-service.com/?ref=YOUR_ID",
    downloadModalAdImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    downloadModalAdTitle: "Premium Career Coaching",
    downloadModalAdDescription: "Double your interview chances with 1-on-1 coaching.",
    downloadModalAdLabel: "FEATURED",
  }
};
