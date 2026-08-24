// In-memory db store as fallback if MongoDB is unreachable
const memoryStore = {
  customers: [
    {
      _id: '66d010000000000000000001',
      name: 'Jay Chheta',
      email: 'jaychheta06@gmail.com',
      phone: '09574361060',
      address: 'A-802 sarjan heights dabholi gam,katargam'
    }
  ],
  restaurants: [
    {
      _id: '66d020000000000000000001',
      name: 'hello',
      cuisine: 'high',
      rating: 4.0,
      isOpen: true
    },
    {
      _id: '66d020000000000000000002',
      name: 'trishiv manchurian',
      cuisine: '5',
      rating: 4.0,
      isOpen: true
    },
    {
      _id: '66d020000000000000000003',
      name: 'peptos',
      cuisine: 'burgers',
      rating: 4.0,
      isOpen: true
    },
    {
      _id: '66d020000000000000000004',
      name: 'ganesh',
      cuisine: 'dhosa',
      rating: 4.5,
      isOpen: true
    },
    {
      _id: '66d020000000000000000005',
      name: 'bhaipaji',
      cuisine: 'pavbhaji',
      rating: 4.0,
      isOpen: true
    },
    {
      _id: '66d020000000000000000006',
      name: 'janeman',
      cuisine: 'chiken biryani',
      rating: 4.0,
      isOpen: true
    }
  ],
  orders: [
    {
      _id: '66d030000000000000000001',
      customerId: {
        _id: '66d010000000000000000001',
        name: 'Jay Chheta',
        email: 'jaychheta06@gmail.com'
      },
      restaurantId: {
        _id: '66d020000000000000000002',
        name: 'trishiv manchurian',
        cuisine: '5'
      },
      items: [{ name: 'manchurian', qty: 1 }],
      totalAmount: 10,
      status: 'pending',
      createdAt: '2026-08-24T08:00:00.000Z'
    }
  ]
};

module.exports = memoryStore;
