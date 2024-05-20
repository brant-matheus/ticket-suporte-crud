"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import { Button } from "../ui/button";
import { authInstance } from "@/app/axios-config";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/authentication-context";

const Logout = () => {
  const router = useRouter();
  const { userLogout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Settings className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <DropdownMenuLabel
            className="cursor-pointer"
            onClick={async () => userLogout()}
          >
            Logout
          </DropdownMenuLabel>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Logout;
