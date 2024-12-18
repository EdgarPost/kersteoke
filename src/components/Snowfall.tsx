export const Snowfall = () => {
  return (
    <div className="snowfall">
      {[...Array(50)].map((_, index) => (
        <div key={index} className="snowflake" />
      ))}
    </div>
  );
};
