type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  placeholder?: string;
};

export const SearchInput = ({
  value,
  onChange,
  onSearch,
  isLoading,
  placeholder,
}: SearchInputProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Zoek een liedje..."}
        className="flex-1 px-4 py-3 rounded-lg bg-black/50 border-2 border-christmas-gold
                   text-white placeholder-white/50 focus:outline-none focus:border-christmas-gold-light
                   text-lg"
      />
      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="px-6 py-3 bg-christmas-red hover:bg-christmas-red-dark
                   text-white font-bold rounded-lg disabled:opacity-50
                   transition-colors border-2 border-christmas-gold"
      >
        {isLoading ? "Zoeken..." : "Zoek"}
      </button>
    </form>
  );
};
