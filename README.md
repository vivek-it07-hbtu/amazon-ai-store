# 🛒 Amazon Clone - Full Stack E-Commerce Platform

A comprehensive e-commerce platform built with modern technologies, demonstrating full-stack development, computer science fundamentals, and scalable architecture.

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with SSR/SSG
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **Framer Motion** - Animations

### Backend
- **Node.js & Express.js** - REST API server
- **MongoDB** - Product catalog & reviews (NoSQL)
- **PostgreSQL** - User data & orders (SQL)
- **Redis** - Caching layer
- **JWT** - Authentication

### Microservices
- **Python + Flask** - ML-based recommendation engine
- **C++** - High-performance search & compression modules

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📋 Features

### Customer Features
✅ User authentication & authorization (JWT)
✅ Product browsing with filters & search
✅ Shopping cart management
✅ Order placement & tracking
✅ Product reviews & ratings
✅ Personalized recommendations
✅ Price trend analysis
✅ Advanced search with autocomplete

### Admin Features
✅ Product management (CRUD)
✅ Order management
✅ User management
✅ Analytics dashboard
✅ Inventory tracking

### Technical Features
✅ **DSA Implementations:**
  - Trie for autocomplete search
  - Heap for top-rated products
  - Hash maps for O(1) lookups
  - Sorting algorithms (Quick, Merge)
  - Graph-based recommendations
  - Huffman compression

✅ **Database Concepts:**
  - ACID properties (PostgreSQL)
  - Indexing for query optimization
  - Transactions
  - Relationships (One-to-Many, Many-to-Many)
  - NoSQL document storage (MongoDB)

✅ **OOP Principles:**
  - Encapsulation in models
  - Inheritance in components
  - Polymorphism in services
  - Abstraction in APIs

## 🛠️ Setup Instructions

### Prerequisites
- Node.js >= 18.0.0
- Python >= 3.9
- C++ Compiler (g++ or MSVC)
- MongoDB
- PostgreSQL
- Redis (optional)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd "Amazon Clone"
```

2. **Install Node.js dependencies**
```bash
npm install
```

3. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

4. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. **Start databases with Docker**
```bash
docker-compose up -d
```

Or install MongoDB, PostgreSQL, and Redis manually.

6. **Seed the database** (optional)
```bash
node server/scripts/seed.js
```

### Running the Application

#### Development Mode (All services)
```bash
npm run dev
```

This starts:
- Next.js frontend on http://localhost:3000
- Express backend on http://localhost:5000
- Python service on http://localhost:8000

#### Individual Services

**Frontend only:**
```bash
npm run dev:next
```

**Backend only:**
```bash
npm run dev:server
```

**Python service:**
```bash
python services/recommendation_service.py
```

**C++ modules:**
```bash
# Compile
npm run build:cpp

# Run search engine
./bin/search_engine

# Run compression module
./bin/compression
```

### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
Amazon Clone/
├── components/          # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── Layout.tsx
├── pages/              # Next.js pages
│   ├── index.tsx       # Home page
│   ├── _app.tsx
│   └── _document.tsx
├── server/             # Express backend
│   ├── index.js        # Main server file
│   ├── config/         # Database configs
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── middleware/     # Auth & validation
├── services/           # Microservices
│   ├── recommendation_service.py  # Python ML service
│   └── cpp/            # C++ modules
│       ├── search_engine.cpp
│       └── compression.cpp
├── lib/                # Utilities & state
│   ├── store.ts        # Redux store
│   └── slices/         # Redux slices
├── styles/             # CSS files
├── docker-compose.yml  # Docker config
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/featured/list` - Get featured products
- `GET /api/products/:id/recommendations` - Get recommendations

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:productId` - Update quantity
- `DELETE /api/cart/remove/:productId` - Remove item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review

### Admin (Requires admin role)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/stats` - Get dashboard stats

## 🧪 Testing

```bash
npm test
```

## 📊 Database Schema

### MongoDB (Products & Reviews)
- **Products Collection**: Product catalog with specifications
- **Reviews Collection**: User reviews and ratings

### PostgreSQL (Users & Orders)
- **Users Table**: User accounts and authentication
- **Orders Table**: Order history and tracking

## 🎯 Computer Science Concepts Demonstrated

### Data Structures & Algorithms
1. **Trie** - Autocomplete search
2. **Hash Maps** - Fast product lookup
3. **Heaps/Priority Queues** - Top-rated products
4. **Sorting Algorithms** - Product ordering
5. **Binary Search** - Price range filtering
6. **Huffman Coding** - Data compression
7. **Graph Algorithms** - Recommendation system

### Object-Oriented Programming
- Classes and objects in models
- Encapsulation in API design
- Inheritance in React components
- Polymorphism in service layer

### Database Management
- **ACID Transactions** (PostgreSQL)
- **Indexing** for performance
- **Joins** for relational data
- **Aggregation** in MongoDB
- **Query Optimization**

### Operating Systems Concepts
- **Process Management** - Microservices
- **Threading** - Async operations
- **Memory Management** - Caching with Redis
- **File Systems** - Image storage

### Computer Networks
- **HTTP/HTTPS** protocols
- **RESTful API** design
- **WebSockets** for real-time updates
- **Load Balancing** concepts
- **API Rate Limiting**

## 🚀 Future Improvements & Extensions

### High Priority
1. **Payment Integration**
   - Stripe payment processing
   - PayPal integration
   - Cryptocurrency payments

2. **Real-time Features**
   - Live order tracking with WebSockets
   - Real-time inventory updates
   - Live chat support

3. **Advanced Search**
   - Elasticsearch integration
   - Voice search
   - Image-based search

4. **Mobile App**
   - React Native mobile application
   - Push notifications
   - Offline mode

### Medium Priority
5. **Social Features**
   - Wish lists
   - Product sharing
   - Social login (Google, Facebook)

6. **Analytics & ML**
   - Advanced recommendation algorithms
   - Customer behavior analysis
   - Demand forecasting
   - A/B testing framework

7. **Performance Optimization**
   - CDN for static assets
   - Server-side caching
   - Database query optimization
   - Image lazy loading

8. **Security Enhancements**
   - Two-factor authentication
   - Rate limiting
   - CSRF protection
   - SQL injection prevention

### Low Priority
9. **Multi-vendor Support**
   - Vendor registration
   - Vendor dashboard
   - Commission system

10. **Internationalization**
    - Multi-language support
    - Multi-currency
    - Regional pricing

11. **Advanced Features**
    - AR product preview
    - Video product demos
    - Live streaming shopping
    - Subscription service

12. **DevOps & Infrastructure**
    - Kubernetes deployment
    - CI/CD pipeline
    - Automated testing
    - Monitoring & logging (Prometheus, Grafana)
    - Auto-scaling

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- SQL injection prevention
- XSS protection
- CORS configuration
- Environment variable protection
- Rate limiting (future)

## 📈 Performance Optimizations

- Database indexing
- Redis caching
- Code splitting (Next.js)
- Image optimization
- Lazy loading
- API response compression
- C++ modules for intensive operations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is for educational purposes.

## 👨‍💻 Author

Built to demonstrate full-stack development skills and computer science fundamentals.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB and PostgreSQL communities
- Open source contributors

---

**Note**: This is an educational project demonstrating various technologies and CS concepts. For production use, additional security measures, testing, and optimizations would be required.

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Happy Coding! 🚀**
