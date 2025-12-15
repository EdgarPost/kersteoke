type KaraokeLineProps = {
  children: string;
};

export const KaraokeLine = ({ children }: KaraokeLineProps) => {
  return (
    <p
      className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center"
      style={{
        textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
      }}
    >
      {children}
    </p>
  );
};
