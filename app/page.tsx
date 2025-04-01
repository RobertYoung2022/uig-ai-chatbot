import Chat from '@/app/components/Chat';
import MarketData from '@/app/components/MarketData';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Chat />
          </div>
          <div className="lg:col-span-1">
            <MarketData />
          </div>
        </div>
      </div>
    </main>
  );
} 