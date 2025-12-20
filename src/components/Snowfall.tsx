export const Snowfall = () => {
  // Background snowflakes (behind lyrics)
  const backgroundSnowflakes = [...Array(300)].map((_, index) => {
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

  // Foreground snowflakes (in front of lyrics, large and blurred)
  const foregroundSnowflakes = [...Array(5)].map((_, index) => {
    const left = Math.random() * 100;
    const duration = 4 + Math.random() * 14;
    const delay = Math.random() * 12;
    const size = 80 + Math.random() * 120;
    const opacity = 0.01 + Math.random() * 0.02;
    const blur = 30 + Math.random() * 30;

    return (
      <div
        key={`fg-${index}`}
        className="snowflake"
        style={{
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          opacity,
          filter: `blur(${blur}px)`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      />
    );
  });

  return (
    <>
      <div className="snowfall">{backgroundSnowflakes}</div>
      <div className="snowfall snowfall-foreground">{foregroundSnowflakes}</div>
    </>
  );
};
