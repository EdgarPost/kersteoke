type KaraokeLineProps = {
  children: string;
};

export const KaraokeLine = ({ children }: KaraokeLineProps) => {
  return <p style={{ fontSize: 60 }}>{children}</p>;
};
