"use client";
import { Cog, FileCog, Home, UserCog } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Logout from "./logout";
import GenericToolTip from "../utils/generic-tool-tip";

export default function AdminSideBar() {
  const pathName = usePathname();
  const router = useRouter();

  const links = [
    {
      icon: <Home />,
      path: "/admin",
      toolTipContent: "Todos os tickets",
      key: 1,
    },
    {
      icon: <UserCog />,
      path: "/admin/users-managment",
      toolTipContent: "Gestão de usuários",
      key: 2,
    },
    {
      icon: <FileCog />,
      path: "/admin/ticket-configs",
      toolTipContent: "Configuração de ticket",
      key: 3,
    },
    {
      icon: <Cog />,
      path: "/admin/user-settings",
      toolTipContent: "Configuração de usuário",
      key: 4,
    },
  ];
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-y-6 px-2 sm:py-5">
          {links.map((link) =>
            pathName === link.path ? (
              <GenericToolTip
                content={link.toolTipContent}
                icon={link.icon}
                path={link.path}
                variant="default"
                key={link.key}
              />
            ) : (
              <GenericToolTip
                content={link.toolTipContent}
                icon={link.icon}
                path={link.path}
                variant="ghost"
                key={link.key}
              />
            )
          )}
          {/* logout icon - method */}
          <Logout />
        </nav>
      </aside>
    </>
  );
}
