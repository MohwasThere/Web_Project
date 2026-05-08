"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import Navitems from "./navitems";
import { ChevronDown, LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth.actions";

const Userdropdown = ({user}:{user:User}) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2.5 text-gray-400 hover:text-gray-200
                   bg-transparent border-none shadow-none cursor-pointer
                   rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-700/50
                   focus:outline-none"
      >
        <Avatar className="h-8 w-8 ring-2 ring-gray-700">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback className="bg-yellow-500 text-gray-900 text-xs font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="hidden md:flex flex-col items-start text-left">
          <span className="text-sm font-medium text-gray-300 leading-none">
            {user.name}
          </span>
        </div>

        <ChevronDown className="h-3.5 w-3.5 text-gray-600 hidden md:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="bg-gray-800 border border-gray-700 text-gray-400 
                   min-w-50 rounded-xl shadow-xl p-1"
        align="end"
        sideOffset={8}
      >
        {/* User info header */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-3 py-2.5">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 ring-2 ring-gray-700">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-yellow-500 text-gray-900 text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-gray-200 truncate">
                  {user.name}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {user.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-gray-700 my-1" />

        {/* Sign out */}
        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium
                     text-gray-300 rounded-lg cursor-pointer
                     focus:bg-red-500/10 focus:text-red-400
                     hover:bg-red-500/10 hover:text-red-400
                     transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>

        {/* Mobile nav — shown only on small screens */}
        <DropdownMenuSeparator className="sm:hidden bg-gray-700 my-1" />
        <nav className="sm:hidden px-1 pb-1">
          <Navitems />
        </nav>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Userdropdown;
