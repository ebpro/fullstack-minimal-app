/**
 * Mock Review Data
 * Simulates reviews from multiple e-commerce platforms
 */

const generateReviewId = (source, num) => `${source.toUpperCase()}_${String(num).padStart(4, '0')}`;

const mockReviews = {
  // Product 1: USB-C Fast Charger 30W
  '1': {
    amazon: [
      {
        review_id: generateReviewId('AMZ', 1),
        source: 'Amazon',
        author: 'John Smith',
        rating: 5,
        title: 'Excellent fast charger!',
        body: 'This charger is amazing. Charges my phone super fast and the build quality is solid. Highly recommend!',
        created_at: '2025-09-15T10:30:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 2),
        source: 'Amazon',
        author: 'Emily Johnson',
        rating: 4,
        title: 'Good but runs warm',
        body: 'Works well and charges quickly, but it does get noticeably warm during use. Not a dealbreaker though.',
        created_at: '2025-09-18T14:20:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 3),
        source: 'Amazon',
        author: 'Michael Brown',
        rating: 5,
        title: 'Perfect for travel',
        body: 'Compact design, powerful charging. Perfect for my travel bag. Worth every penny.',
        created_at: '2025-09-22T08:45:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 4),
        source: 'Amazon',
        author: 'Sarah Davis',
        rating: 3,
        title: 'Decent charger',
        body: 'It works fine, nothing special. Expected more for the price.',
        created_at: '2025-09-25T16:10:00Z',
        verified_purchase: false
      },
      {
        review_id: generateReviewId('AMZ', 5),
        source: 'Amazon',
        author: 'David Wilson',
        rating: 5,
        title: 'Best charger I\'ve owned',
        body: 'Super fast charging, reliable, and the cable is high quality. This is my third purchase!',
        created_at: '2025-09-28T11:30:00Z',
        verified_purchase: true
      }
    ],
    bestbuy: [
      {
        review_id: generateReviewId('BB', 1),
        source: 'BestBuy',
        author: 'Jessica Martinez',
        rating: 4,
        title: 'Solid performer',
        body: 'Good charging speed and build quality. Only downside is the price point.',
        created_at: '2025-09-16T13:00:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('BB', 2),
        source: 'BestBuy',
        author: 'Robert Taylor',
        rating: 5,
        title: 'Charges my laptop too!',
        body: 'Not only charges my phone quickly, but also works great with my USB-C laptop. Very versatile.',
        created_at: '2025-09-20T09:15:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('BB', 3),
        source: 'BestBuy',
        author: 'Linda Anderson',
        rating: 4,
        title: 'Reliable and compact',
        body: 'Does what it promises. Compact size is great for daily carry.',
        created_at: '2025-09-27T15:45:00Z',
        verified_purchase: true
      }
    ],
    walmart: [
      {
        review_id: generateReviewId('WM', 1),
        source: 'Walmart',
        author: 'Thomas Moore',
        rating: 3,
        title: 'Works but overpriced',
        body: 'It charges fine, but I think you can find cheaper alternatives with similar performance.',
        created_at: '2025-09-17T10:20:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('WM', 2),
        source: 'Walmart',
        author: 'Karen White',
        rating: 5,
        title: 'Great value',
        body: 'Fast charging, durable cable, and the price was better than other retailers. Very happy!',
        created_at: '2025-09-24T12:30:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('WM', 3),
        source: 'Walmart',
        author: 'James Harris',
        rating: 4,
        title: 'Good purchase',
        body: 'Charges my devices quickly. No complaints so far.',
        created_at: '2025-09-29T17:00:00Z',
        verified_purchase: false
      }
    ]
  },

  // Product 2: Wireless Bluetooth Headphones
  '2': {
    amazon: [
      {
        review_id: generateReviewId('AMZ', 101),
        source: 'Amazon',
        author: 'Alex Thompson',
        rating: 4,
        title: 'Great sound quality',
        body: 'Sound quality is impressive for the price. Battery life could be better though.',
        created_at: '2025-09-10T09:00:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 102),
        source: 'Amazon',
        author: 'Maria Garcia',
        rating: 5,
        title: 'Love these headphones!',
        body: 'Comfortable, great sound, easy to pair. Best headphones I\'ve tried in this price range.',
        created_at: '2025-09-14T14:30:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 103),
        source: 'Amazon',
        author: 'Chris Lee',
        rating: 2,
        title: 'Disappointed',
        body: 'Connection keeps dropping. Sound is okay but not worth the hassle.',
        created_at: '2025-09-19T11:45:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 104),
        source: 'Amazon',
        author: 'Patricia King',
        rating: 5,
        title: 'Perfect for workouts',
        body: 'Stay in place during exercise, sweat resistant, and great audio quality. Highly recommend!',
        created_at: '2025-09-26T16:20:00Z',
        verified_purchase: true
      }
    ],
    bestbuy: [
      {
        review_id: generateReviewId('BB', 101),
        source: 'BestBuy',
        author: 'Daniel Scott',
        rating: 4,
        title: 'Good but not great',
        body: 'Sound quality is good, but the fit could be better. Still a decent purchase.',
        created_at: '2025-09-12T10:30:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('BB', 102),
        source: 'BestBuy',
        author: 'Jennifer Adams',
        rating: 5,
        title: 'Amazing value!',
        body: 'Can\'t believe the quality for this price. Bass is punchy, highs are clear. Very impressed.',
        created_at: '2025-09-21T13:15:00Z',
        verified_purchase: true
      }
    ],
    walmart: [
      {
        review_id: generateReviewId('WM', 101),
        source: 'Walmart',
        author: 'William Turner',
        rating: 3,
        title: 'Average headphones',
        body: 'They work fine for casual listening. Nothing special.',
        created_at: '2025-09-13T15:00:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('WM', 102),
        source: 'Walmart',
        author: 'Nancy Phillips',
        rating: 4,
        title: 'Comfortable and clear',
        body: 'Very comfortable for long listening sessions. Sound is clear and balanced.',
        created_at: '2025-09-23T09:45:00Z',
        verified_purchase: true
      }
    ]
  },

  // Product 3: Smart LED Light Bulb
  '3': {
    amazon: [
      {
        review_id: generateReviewId('AMZ', 201),
        source: 'Amazon',
        author: 'Steven Clark',
        rating: 5,
        title: 'Easy setup, works perfectly',
        body: 'Setup was a breeze. App is intuitive. Love being able to control lights from my phone!',
        created_at: '2025-09-08T12:00:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 202),
        source: 'Amazon',
        author: 'Barbara Rodriguez',
        rating: 4,
        title: 'Good smart bulb',
        body: 'Works well with Alexa. Brightness levels are good. Only issue is occasional WiFi disconnection.',
        created_at: '2025-09-15T10:30:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 203),
        source: 'Amazon',
        author: 'Kevin Lewis',
        rating: 3,
        title: 'App needs improvement',
        body: 'Bulb itself is fine, but the app is clunky and slow to respond.',
        created_at: '2025-09-22T14:15:00Z',
        verified_purchase: false
      }
    ],
    bestbuy: [
      {
        review_id: generateReviewId('BB', 201),
        source: 'BestBuy',
        author: 'Michelle Walker',
        rating: 5,
        title: 'Love the color options!',
        body: 'So many color options! Great for setting the mood. Quality is excellent.',
        created_at: '2025-09-11T11:20:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('BB', 202),
        source: 'BestBuy',
        author: 'Brian Hall',
        rating: 4,
        title: 'Works as advertised',
        body: 'Good brightness, easy to install, integrates well with smart home setup.',
        created_at: '2025-09-25T16:45:00Z',
        verified_purchase: true
      }
    ],
    walmart: [
      {
        review_id: generateReviewId('WM', 201),
        source: 'Walmart',
        author: 'Sandra Allen',
        rating: 5,
        title: 'Best smart bulb for the price',
        body: 'Tried several brands, this one is the best value. Reliable and feature-rich.',
        created_at: '2025-09-18T13:30:00Z',
        verified_purchase: true
      }
    ]
  }
};

module.exports = mockReviews;
