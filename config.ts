
export const MONETIZATION_CONFIG = {
  // =================================================================
  // 💰 AD CONFIGURATION
  // This controls the ad shown before the user downloads their PDF.
  // =================================================================

  ads: {
    // 1. THE LINK: Where the user goes when they click the ad
    // Example: An affiliate link to an Interview Prep course or Career Coaching service.
    downloadModalAdUrl: "https://coachvox.ai/?via=himanshu", 
    
    // 2. THE IMAGE: URL of the banner image to display
    downloadModalAdImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    
    // 3. TEXT: Title and description for the ad
    downloadModalAdTitle: "Ace Your Interview",
    downloadModalAdDescription: "Get 1-on-1 coaching with expert mentors.",
    downloadModalAdLabel: "SPONSORED",
  },

  // =================================================================
  // 📊 TRAFFIC DATA (Google Analytics)
  // =================================================================
  analytics: {
    // INSTRUCTIONS:
    // 1. Go to analytics.google.com and sign in.
    // 2. Create a property and choose "Web".
    // 3. Copy the "Measurement ID" (It looks like 'G-123456789').
    // 4. Paste it inside the quotes below.
    googleAnalyticsId: "G-PE2EH7ETNS", 
  }
};
