const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-slate-500 h-full flex items-center justify-center">
      {children}
    </div>
  );
};

export default PageLayout;
