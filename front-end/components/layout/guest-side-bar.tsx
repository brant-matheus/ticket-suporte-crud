"use client";
import { Home, Cog, Send } from "lucide-react";
import Logout from "./logout";
import { usePathname } from "next/navigation";
import GenericToolTip from "../utils/generic-tool-tip";
interface NavItemProps {
  icon: any;
  path: string;
  toolTipContent: string;
  key: number;
}
export const GuestNavBar = () => {
  const pathName = usePathname();
  const links: NavItemProps[] = [
    { icon: <Home />, path: "/guest", toolTipContent: "meus tickets", key: 1 },
    {
      icon: <Send />,
      path: "/guest/send-ticket",
      toolTipContent: "enviar ticket",
      key: 2,
    },
    {
      icon: <Cog />,
      path: "/guest/user-settings",
      toolTipContent: "configuração de usuário",
      key: 3,
    },
  ];
  return (
    <div>
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
          <Logout />
        </nav>
      </aside>
    </div>
  );
};
