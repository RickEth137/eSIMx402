<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->
- [x] Verify that the copilot-instructions.md file in the .github directory is created.

- [x] Clarify Project Requirements

- [x] Scaffold the Project

- [x] Customize the Project

- [x] Install Required Extensions

- [x] Compile the Project

- [x] Create and Run Task

- [ ] Launch the Project

- [x] Ensure Documentation is Complete

## XDATA - Global Mobile Data Marketplace

This project is a complete mobile data marketplace built with:
- **Next.js 14** with TypeScript and App Router
- **Solana x402 Protocol** for crypto payments
- **eSIM-Go API** for global mobile data plans
- **Minimalistic black/white glassmorphism design**
- **Multi-wallet Solana integration**

### Key Features Implemented:
✅ Solana wallet connection with multiple wallet support
✅ x402 payment protocol integration
✅ eSIM-Go API integration for data plans
✅ Glassmorphism UI with black/white theme
✅ Real-time purchase flow with crypto payments
✅ QR code generation for eSIM installation
✅ Webhook integration for usage monitoring
✅ Responsive design with modern animations

### API Endpoints:
- `/api/bundles` - Fetch available data plans
- `/api/purchase` - x402 protected purchase endpoint
- `/api/qr/[orderReference]` - QR code download
- `/api/webhook/esim` - Usage monitoring webhooks

### Environment Setup:
Copy `.env.example` to `.env.local` and configure:
- eSIM-Go API key
- Solana network settings
- x402 payment configuration
- Webhook security settings