let reviewsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

const demoReviews = {
  rating: 4.6,
  totalReviews: 284,
  reviews: [
    {
      author_name: 'Rajesh Sharma',
      rating: 5,
      relative_time_description: '2 weeks ago',
      text: 'Best Alphonso mangoes I have ever tasted! Fresh, juicy, and the aroma was incredible. FreshCart delivery was super fast to Mumbai. Will definitely order again!',
      profile_photo_url: '',
    },
    {
      author_name: 'Priya Patel',
      rating: 5,
      relative_time_description: '1 month ago',
      text: 'Ordered the Kesar mango gift box for my parents. They were thrilled! The packaging was beautiful and every mango was perfectly ripe. Great service!',
      profile_photo_url: '',
    },
    {
      author_name: 'Amit Kumar',
      rating: 4,
      relative_time_description: '1 month ago',
      text: 'Good quality Dasheri mangoes. Very sweet and no fibres at all. Delivery was on time. Only giving 4 stars because two mangoes were slightly bruised.',
      profile_photo_url: '',
    },
    {
      author_name: 'Sneha Reddy',
      rating: 5,
      relative_time_description: '2 months ago',
      text: 'The Hapus gift box is premium quality! Sent it as a Diwali gift and my in-laws loved it. The mangoes were hand-picked and absolutely delicious. Worth every rupee!',
      profile_photo_url: '',
    },
    {
      author_name: 'Vikram Singh',
      rating: 4,
      relative_time_description: '3 months ago',
      text: 'Organic Chausa mangoes lived up to the hype. So sweet and aromatic! My kids loved them. FreshCart is now our go-to for mango season. Great customer support too.',
      profile_photo_url: '',
    },
  ],
};

export const getGoogleReviews = async () => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  // Return demo data if no API key or placeholder key
  if (!apiKey || apiKey.startsWith('your_') || !placeId || placeId.startsWith('your_')) {
    return demoReviews;
  }

  // Check cache
  if (reviewsCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return reviewsCache;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&key=${apiKey}`
    );
    const data = await response.json();

    if (data.result) {
      reviewsCache = {
        rating: data.result.rating || 0,
        totalReviews: data.result.user_ratings_total || 0,
        reviews: data.result.reviews || [],
      };
      cacheTimestamp = Date.now();
      return reviewsCache;
    }

    return demoReviews;
  } catch (error) {
    console.error('Google Reviews API error:', error.message);
    return demoReviews;
  }
};
