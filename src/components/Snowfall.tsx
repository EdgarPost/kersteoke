export const Snowfall = () => {
  return (
    <div className="snowfall">
      {[...Array(200)].map((_, index) => (
        <div key={index} className="snowflake" />
      ))}
    </div>
  );
};
