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

const Logout = () => {
  const router = useRouter();
  async function logout() {
    try {
      await authInstance.get(`user`);
      localStorage.clear();
      router.push("/");
    } catch (error) {
      localStorage.clear();
      router.push("/");
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Settings className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <DropdownMenuLabel className="cursor-pointer" onClick={logout}>
            Logout
          </DropdownMenuLabel>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Logout;
