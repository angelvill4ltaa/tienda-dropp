const FloatingInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  className = "",
  rightElement,
  inputMode,
  pattern, 
  maxLength,
}) => {
  return (
    <div className="space-y-1">
      <div
        className={`relative h-14 rounded-2xl border transition-all duration-300
        ${
          error ? "border-red-400" : "border-gray-300"
        }
        focus-within:shadow-[0_0_0_4px_rgba(0,0,0,0.025)]
        ${className}`}
      >
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          inputMode={inputMode}
          pattern={pattern}
          maxLength={maxLength}
          placeholder=" "
          className="peer h-full w-full bg-transparent px-4 pt-4 text-sm outline-none"
        />

        <label
          className="
            pointer-events-none absolute left-4 top-1/2
            -translate-y-1/2 text-sm text-gray-400
            transition-all duration-200

            peer-focus:top-2.5
            peer-focus:translate-y-0
            peer-focus:text-[11px]

            peer-[:not(:placeholder-shown)]:top-2.5
            peer-[:not(:placeholder-shown)]:translate-y-0
            peer-[:not(:placeholder-shown)]:text-[11px]
          "
        >
          {label}
        </label>

        {rightElement}
      </div>

      {error && (
        <p className="pl-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default FloatingInput;