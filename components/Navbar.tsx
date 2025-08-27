"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }); // cookie устгах
    router.push("/login"); // login руу шилжүүлэх
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <div className="font-bold text-lg">MyApp</div>
      <div className="flex items-center gap-4">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-800">
              ☰
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white text-black shadow-md rounded p-2 mt-2">
            <DropdownMenu.Item className="px-3 py-1 hover:bg-gray-100 rounded">
              <Link href="/">Тохиргоо</Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item className="px-3 py-1 hover:bg-gray-100 rounded">
              <Link href="/">Нууц үг солих</Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item className="px-3 py-1 hover:bg-gray-100 rounded">
              <Link href="/">Бидний тухай</Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item className="px-3 py-1 hover:bg-gray-100 rounded">
              <button onClick={handleLogout}>Logout</button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </nav>
  );
}
