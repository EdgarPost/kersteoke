export const Snowfall = () => {
  const snowflakes = [...Array(300)].map((_, index) => {
    const left = Math.random() * 100;
    const duration = 8 + Math.random() * 10;
    const delay = Math.random() * 10;
    const size = 4 + Math.random() * 8;
    const opacity = 0.4 + Math.random() * 0.6;

    return (
      <div
        key={index}
        className="snowflake"
        style={{
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          opacity,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      />
    );
  });

  return <div className="snowfall">{snowflakes}</div>;
};
