import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
