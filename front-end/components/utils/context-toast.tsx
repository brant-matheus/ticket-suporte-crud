"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ToastFailProps {
  description: string;
}

// type children
interface ToastProviderProps {
  children: ReactNode;
}

// values the createContext will have
interface ContextProps {
  ToastSuccess: () => void;
  ToastFail: (props: ToastFailProps) => void;
}

const ToastContext = createContext<ContextProps | null>(null);

// function will be encapsulated in layout
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const { toast } = useToast();

  const ToastSuccess = () => {
    toast({
      variant: "sucess",
      title: `Sucesso`,
      description: "Recarregue a página para visualizar a alteração.",
    });
  };

  const ToastFail = ({ description }: ToastFailProps) => {
    toast({
      description: description,
      variant: "destructive",
      title: "Error",
    });
  };

  return (
    <ToastContext.Provider value={{ ToastSuccess, ToastFail }}>
      {children}
    </ToastContext.Provider>
  );
};

// we export this function to call our functions
export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};
