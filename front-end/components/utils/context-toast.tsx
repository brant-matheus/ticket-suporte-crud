"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

// type of what is expected by the function
interface ToastProps {
  variant: "default" | "destructive" | "sucess" | null | undefined;
  title: string;
  description: string;
}

// type children
interface ToastProviderProps {
  children: ReactNode;
}

// values the createContext will have
interface ContextProps {
  ToastSuccess: (props: ToastProps) => void;
  ToastFail: (props: ToastProps) => void;
  ToastDefault: (props: ToastProps) => void;
}

const ToastContext = createContext<ContextProps | null>(null);

// function will be encapsulated in layout
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const { toast } = useToast();

  const ToastSuccess = ({ variant, title, description }: ToastProps) => {
    toast({
      variant,
      title,
      description,
    });
  };

  const ToastFail = ({ variant, title, description }: ToastProps) => {
    toast({
      variant,
      title,
      description,
    });
  };

  const ToastDefault = ({ variant, title, description }: ToastProps) => {
    toast({
      variant,
      title,
      description,
    });
  };

  return (
    <ToastContext.Provider value={{ ToastSuccess, ToastFail, ToastDefault }}>
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
