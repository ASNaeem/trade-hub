export const itemData = {
  title: "Vintage Leather Jacket",
  price: 199.99,
  condition: "Like New",
  category: "Clothing",
  description:
    "Beautiful vintage leather jacket in excellent condition. Real leather, size M, barely worn. Features classic styling with silver hardware and multiple pockets. Perfect for any season.",
  images: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1494955464529-790512c65305?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1489286696299-aa7486820bd5?auto=format&fit=crop&q=80&w=800",
  ],
  listedDate: "2 days ago",
};

export const sellerData = {
  name: "Sarah Johnson",
  rating: 4.8,
  totalSales: 127,
  memberSince: "Jan 2023",
  responseTime: "Usually responds in 1 hour",
};

export const similarItems = [
  {
    id: 1,
    title: "Brown Leather Jacket",
    price: 175,
    image:
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Black Biker Jacket",
    price: 225,
    image:
      "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Distressed Leather Jacket",
    price: 159,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "Classic Brown Jacket",
    price: 189,
    image:
      "https://images.unsplash.com/photo-1494955464529-790512c65305?auto=format&fit=crop&q=80&w=800",
  },
];

export const initialItem = [
  {
    id: 1,
    title: "Vintage Leather Jacket",
    description:
      "Beautiful vintage leather jacket in excellent condition. Real leather, size M, barely worn. Features classic styling with silver hardware and multiple pockets. Perfect for any season.",
    price: 199.99,
    category: "Clothing",
    condition: "New",
    quantity: 1,
    isVisible: true,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: 2,
    title: "Keyboard",
    description:
      "Mechanical keyboard with RGB lighting. Barely used, like new condition.",
    price: 200,
    category: "Electronics",
    condition: "Used",
    quantity: 1,
    isVisible: true,
    images: [
      "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=400",
      "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=400",
    ],
  },
  {
    id: 3,
    title: "Vintage Camara",
    description: "Very old camera, some scratches but still works perfectly.",
    price: 999.99,
    category: "Electronics",
    condition: "Used",
    quantity: 10,
    isVisible: false,
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
    ],
  },
];

export const categories = [
  "Clothing",
  "Electronics",
  "Home & Garden",
  "Sports",
  "Collectibles",
  "Books",
  "Jewelry",
  "Automotive",
  "Toys",
  "Other",
];

export const conditions = ["New", "Like New", "Used", "Refurbished"];
