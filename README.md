# XDATA - Global Mobile Data Marketplace

![XDATA Banner](https://via.placeholder.com/800x200/000000/FFFFFF?text=XDATA+-+Global+Mobile+Data+Marketplace)

> **Instant eSIM delivery worldwide. Pay with cryptocurrency via x402 protocol on Solana.**

XDATA is a revolutionary mobile data marketplace that enables users to purchase eSIM data plans globally using Solana cryptocurrency through the innovative x402 payment protocol. Built with Next.js, TypeScript, and featuring a minimalistic black & white glassmorphism design.

## 🌟 Key Features

- **🌍 Global Coverage**: Access eSIM data plans for 190+ countries
- **⚡ Instant Delivery**: Receive QR codes immediately after purchase
- **🔐 Crypto Payments**: Pay with Solana using x402 protocol
- **📱 eSIM Technology**: No physical SIM cards needed
- **🎨 Minimalist Design**: Clean, modern glassmorphism interface
- **🔗 Solana Integration**: Full wallet adapter support
- **📊 Real-time Monitoring**: Usage tracking and notifications

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   x402 Protocol │    │   eSIM-Go API   │
│   (Next.js)     │◄──►│   (Solana)      │◄──►│   (Provider)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Wallet Adapter  │    │ Payment Handler │    │ Order Fulfillment│
│ (Multi-wallet)  │    │ (Micropayments) │    │ (QR Generation) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### Blockchain
- **Solana Web3.js** - Solana blockchain interaction
- **Wallet Adapter** - Multi-wallet support (Phantom, Solflare, etc.)
- **x402 Protocol** - HTTP 402 payment standard for APIs

### Backend & APIs
- **eSIM-Go API** - Global eSIM provider integration
- **Next.js API Routes** - Server-side functionality
- **Webhook Integration** - Real-time usage monitoring

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- eSIM-Go API key ([Get one here](https://portal.esim-go.com/))

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/RickEth137/eSIMx402.git
   cd eSIMx402
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   # Solana Configuration
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # eSIM-Go API
   ESIM_GO_API_KEY=your-esim-go-api-key-here
   ESIM_GO_API_URL=https://api.esim-go.com/v2.4
   
   # x402 Protocol
   NEXT_PUBLIC_X402_ENDPOINT=https://api.x402.io
   X402_API_KEY=your-x402-api-key
   
   # Webhook Security
   WEBHOOK_SECRET=your-webhook-secret-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 💡 How It Works

### For Users
1. **Connect Wallet**: Use any Solana-compatible wallet
2. **Browse Plans**: Explore data plans by country/region
3. **Select Plan**: Choose data amount, duration, and coverage
4. **Pay with Crypto**: Automatic x402 payment via Solana
5. **Receive eSIM**: Instant QR code download for installation

### For Developers
1. **x402 Integration**: HTTP 402 responses trigger automatic payments
2. **eSIM Fulfillment**: Backend orders eSIMs from provider API
3. **Wallet Abstraction**: Support for multiple Solana wallets
4. **Real-time Updates**: Webhook integration for usage monitoring

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/bundles` - Fetch available data plans
- `GET /api/bundles?country=US` - Filter by country
- `POST /api/orders/validate` - Validate order before payment

### Protected Endpoints (x402)
- `POST /api/purchase` - Purchase data plan (requires payment)
- `GET /api/qr/[orderReference]` - Download eSIM QR code

### Webhook Endpoints
- `POST /api/webhook/esim` - eSIM usage notifications

## 🎨 Design System

XDATA features a minimalistic black and white design with glassmorphism effects:

- **Colors**: Pure black background with white/gray text
- **Glass Effects**: Backdrop blur with subtle transparency
- **Typography**: Clean, readable fonts with proper hierarchy
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design approach

## 🔐 Security Features

- **API Key Management**: Secure environment variable handling
- **Wallet Security**: Non-custodial wallet integration
- **Payment Verification**: HMAC signature validation
- **CORS Protection**: Proper cross-origin resource sharing
- **Input Validation**: Server-side request validation

## 📊 Business Model

### Revenue Streams
1. **Markup on Plans**: 20% markup on eSIM-Go wholesale prices
2. **Payment Processing**: x402 transaction fees
3. **Premium Features**: Advanced analytics and monitoring

### Cost Structure
- eSIM-Go wholesale costs (paid in USD)
- Solana transaction fees (minimal)
- Infrastructure and hosting

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Manual Deployment
```bash
npm run build
npm start
```

### Environment Variables
Ensure all production environment variables are set:
- Production eSIM-Go API key
- Mainnet Solana configuration
- Webhook security secrets

## 🔄 Development Roadmap

### Phase 1 ✅
- [x] Basic Next.js setup with TypeScript
- [x] Solana wallet integration
- [x] eSIM-Go API integration
- [x] x402 payment protocol
- [x] Minimalist UI design

### Phase 2 🚧
- [ ] User account system
- [ ] Order history and management
- [ ] Advanced filtering and search
- [ ] Mobile app (React Native)

### Phase 3 📋
- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] AI-powered plan recommendations
- [ ] Enterprise API access
- [ ] White-label solutions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **eSIM-Go** for global eSIM infrastructure
- **x402 Protocol** for revolutionary payment standard
- **Solana** for fast, low-cost transactions
- **Next.js** for amazing developer experience

## 📞 Support

- **Documentation**: [docs.xdata.app](https://docs.xdata.app)
- **Discord**: [Join our community](https://discord.gg/xdata)
- **Email**: support@xdata.app
- **Issues**: [GitHub Issues](https://github.com/RickEth137/eSIMx402/issues)

---

**Made with ❤️ for the global mobile data revolution**

*XDATA - Connecting the world, one eSIM at a time.*