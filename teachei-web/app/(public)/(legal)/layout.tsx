export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
      <div className="bg-surface border border-border rounded-2xl p-6 lg:p-10 shadow-sm">
        {children}
      </div>
    </div>
  );
}
