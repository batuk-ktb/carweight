type ToggleButtonProps = {
  onText: string;
  offText: string;
  value: boolean;
  onToggle: () => void;
};

export default function ToggleButton({
  onText,
  offText,
  value,
  onToggle,
}: ToggleButtonProps) {
  return (
    <button
      onClick={()=>onToggle()}
      className={`px-6 py-2 rounded-full font-semibold transition-all 
        ${value ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}
    >
      {value ? onText : offText}
    </button>
  );
}
