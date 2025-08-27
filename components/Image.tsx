import Image from "next/image";
export default function MyImage() {
  return (
    <Image
      src="/file.svg"
      alt="Logo"
      width={120}
      height={120}
      className="rounded"
    />
  );
}