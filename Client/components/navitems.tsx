"use client";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { usePathname } from "next/navigation";

const Navitems = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-8 font-medium">
      {NAV_ITEMS.map(({ href, label }) => (
        <li key={href}>
          <Link
            href={href}
            className={[
              "text-sm transition-colors duration-150 relative py-1",
              "hover:text-yellow-400",
              isActive(href)
                ? "text-gray-100 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-yellow-500 after:rounded-full"
                : "text-gray-500",
            ].join(" ")}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Navitems;
