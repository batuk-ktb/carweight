"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function Menu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="bg-gray-600 text-white px-4 py-2 rounded">
          Menu
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="bg-white shadow-md rounded p-2">
        <DropdownMenu.Item className="px-4 py-2 hover:bg-gray-100 rounded">
          Option 1
        </DropdownMenu.Item>
        <DropdownMenu.Item className="px-4 py-2 hover:bg-gray-100 rounded">
          Option 2
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
