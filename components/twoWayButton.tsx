type ToggleButtonProps = {
  onText: string;
  offText: string;
  value: boolean;
  onToggle: () => void;
  disabled?: boolean; // ✅ нэмэв
};

export default function ToggleButton({
  onText,
  offText,
  value,
  onToggle,
  disabled = false,
}: ToggleButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={() => {
        if (!disabled) onToggle();
      }}
      className={`
        px-6 py-2 rounded-full font-semibold transition-all duration-200
        ${value ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}
        ${disabled 
          ? "opacity-40 cursor-not-allowed"
          : "hover:scale-105 active:scale-95 cursor-pointer"
        }
      `}
    >
      {value ? onText : offText}
    </button>
  );
}
