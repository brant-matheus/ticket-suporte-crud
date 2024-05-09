"use client";
import React from "react";
import { Home, Settings, FileCog, UserCog, User2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Link from "next/link";
import { Button } from "../ui/button";

/* 
1. icons: Home: ticket visualization; Settings: User settings; Filecog: defacul ticket form; UserCog: users managment
2. tooltip: hoover the name of page when mouse click on icon
3. Link: redirecting

*/
interface onPage {
  onPage: string;
}

const AdminSideBar = ({ onPage }: onPage) => {
  return (
    <div>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        {/* 
            aside: side bar, nav: navigation
                TooltipProvider: tag which embraces all tooltips
                Tooptip: single unit
                tooltiptrigger: our icon
                tooltipcontent: page's name
            */}

        {/* fixed all left, from bottom to top.
                    sm: responsive design,
                    w-14: side bar 56px width

                    nav:
                        px: padding left and right,
                        flex, flex col: column,
                        gap-y-6: verticall gap between items
                        items-center: center in the x-axis

            */}
        <nav className="flex flex-col items-center gap-y-6 px-2 sm:py-5">
          <TooltipProvider>
            {/* todos os  tickets - home*/}
            <Tooltip>
              <TooltipTrigger asChild>
                {/*h height, w width */}
                {onPage === "home" ? (
                  <Button className="h-7 rounded-full">
                    <Link href="/suporte">
                      <Home className="h-6 w-6 " />
                    </Link>
                  </Button>
                ) : (
                  <Button variant={"ghost"}>
                    <Link href="/suporte">
                      <Home className="h-6 w-6 " />
                    </Link>
                  </Button>
                )}
              </TooltipTrigger>
              {/* pops up to right */}
              <TooltipContent side="right">Todos Tickets</TooltipContent>
            </Tooltip>
            {/* users managment*/}
            <Tooltip>
              <TooltipTrigger asChild>
                {/*h height, w width */}
                {onPage === "users-managment" ? (
                  <Button className="h-7  rounded-full">
                    <Link href="/suporte/gestao-usuario">
                      <UserCog className="h-6 w-6 " />
                    </Link>
                  </Button>
                ) : (
                  <Button variant={"ghost"}>
                    <Link href="/suporte/gestao-usuarios">
                      <UserCog className="h-6 w-6 " />
                    </Link>
                  </Button>
                )}
              </TooltipTrigger>
              {/* pops up to right */}
              <TooltipContent side="right">Gestão de usuários</TooltipContent>
            </Tooltip>
            {/* set ticket*/}
            <Tooltip>
              <TooltipTrigger asChild>
                {/*h height, w width */}
                {onPage === "set-ticket" ? (
                  <Button className="h-7 rounded-full">
                    <Link href="/suporte/definir-ticket">
                      <FileCog className="h-6 w-6 " />
                    </Link>
                  </Button>
                ) : (
                  <Button variant={"ghost"}>
                    <Link href="/suporte/definir-ticket">
                      <FileCog className="h-6 w-6 " />
                    </Link>
                  </Button>
                )}
              </TooltipTrigger>
              {/* pops up to right */}
              <TooltipContent side="right">Definir Ticket</TooltipContent>
            </Tooltip>
            {/* user settings*/}
            <Tooltip>
              <TooltipTrigger asChild>
                {/*h height, w width */}
                {onPage === "user-settings" ? (
                  <Button className="h-7 rounded-full">
                    <Link href="/suporte/configuracao-usuario">
                      <Settings className="h-6 w-6 " />
                    </Link>
                  </Button>
                ) : (
                  <Button variant={"ghost"}>
                    <Link href="/suporte/configuracao-usuario">
                      <Settings className="h-6 w-6 " />
                    </Link>
                  </Button>
                )}
              </TooltipTrigger>
              {/* pops up to right */}
              <TooltipContent side="right">
                Configuração de usário
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
    </div>
  );
};

export default AdminSideBar;
