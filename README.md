# APES Bridge

A Web3 bridge application built with Next.js, React, and the Reservoir Protocol. This application allows users to bridge assets between different blockchain networks.

## Features

- Modern React application using Next.js 13
- TypeScript for type safety
- Tailwind CSS for styling
- Web3 integration with viem and wagmi
- Reservoir Protocol integration for NFT operations
- React Query for efficient data fetching
- Toast notifications for user feedback

## Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- MetaMask or other Web3 wallet

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/apes-bridge.git
cd apes-bridge
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
apes-bridge/
├── pages/          # Next.js pages
├── styles/         # Global styles and Tailwind CSS
├── lib/           # Utility functions and shared code
├── public/        # Static assets
└── components/    # React components
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## Dependencies

- Next.js 13.4.7
- React 18.2.0
- TypeScript
- Tailwind CSS
- viem & wagmi for Web3
- Reservoir Protocol SDK
- React Query
- React Hot Toast

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.