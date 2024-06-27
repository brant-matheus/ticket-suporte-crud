"use client";
import { authInstance } from "@/app/axios-config";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { formatIso } from "../utils/formatIso";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ErrorMessage } from "@hookform/error-message";
import LoaderButton from "../buttons/loader-button";

interface User {
  id: number;
  fullName: string;
  email: string;
  isAdmin: number;
  createdAt: string;
  updatedAt: string;
}

interface TicketComment {
  id: number;
  content: string;
  responsibleId: number;
  ticketId: number;
  createdAt: string;
  updatedAt: string;
  user: User;
}
interface CommentaryProps {
  comment: string;
}
interface TicketCommentArray extends Array<TicketComment> {}
interface ChatAreaProps {}
export default function ChatArea() {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams<{ "chat-area": string }>();
  const pathname = usePathname();
  const [data, setData] = useState<TicketCommentArray>([]);
  const router = useRouter();
  async function getComments() {
    try {
      const { data } = await authInstance.get("comments", {
        params: { ticketId: params["chat-area"] },
      });
      setData(data);
    } catch (error) {}
  }
  useEffect(() => {
    getComments();
  }, []);
  const scrollAreaRef = useRef<HTMLDivElement>(null); // Explicitly specify the type

  useEffect(() => {
    if (scrollAreaRef.current) {
      // Access the viewport inside ScrollArea and scroll to bottom
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) as HTMLDivElement; // Type assertion
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [data]);
  const isPageAdmin = pathname.includes("admin");
  const limit: number = 500;
  const [caracters, setCaracters] = useState(0);
  const commentSchema = z.object({
    comment: z.string().max(500, { message: "Limite de 500 caracteres" }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CommentaryProps>({
    resolver: zodResolver(commentSchema),
  });
  async function storeComment(comment: CommentaryProps) {
    setIsLoading(true);
    try {
      const { status, request } = await authInstance.post("comments", comment, {
        params: { ticketId: parseInt(params["chat-area"]) },
      });

      if (status == 201) {
        setIsLoading(false);
        location.reload();
      }
    } catch (error) {
      setIsLoading(false);
    }
  }
  return (
    <div className="container mx-auto my-12 p-8 rounded-lg border border-blue-500 shadow-lg space-y-4">
      <div className="container-md mx-auto ">
        <ScrollArea className="h-96 w-auto" ref={scrollAreaRef}>
          {data.map((value) => {
            const isAdmin = value.user.isAdmin;
            const condition =
              (isAdmin && isPageAdmin) || (!isAdmin && !isPageAdmin);

            return (
              <div
                key={value.id}
                className={
                  condition
                    ? "flex justify-end mr-6 container w-[800px]"
                    : "flex justify-start container w-full"
                }
              >
                <div className="grind grid-cols-1">
                  <p
                    className={
                      condition
                        ? "text-cyan-300 text-balance"
                        : "text-rose-500 text-balance"
                    }
                  >
                    {value.content}
                  </p>
                  <p className="flex justify-end text-zinc-400 italic text-sm">
                    {formatIso(value.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </div>
      <div className="space-y-1">
        <p className="flex justify-end mr-48 items-center gap-x-1">
          Caracteres: {caracters} limite: {limit}
        </p>
        <form
          className="flex items-center gap-x-6 justify-center mt-auto "
          onSubmit={handleSubmit(storeComment)}
        >
          <Textarea
            maxLength={limit}
            className="w-5/6 resize-none h-5"
            placeholder="Digite seu comentário"
            onChange={(e) => {
              setCaracters(e.target.value.length);
              setValue("comment", e.target.value, {
                shouldValidate: true,
              });
            }}
          />
          {isLoading ? (
            <LoaderButton title="" />
          ) : (
            <Button variant="link">
              <Send />
            </Button>
          )}
        </form>
        <div className="text-center">
          <ErrorMessage
            errors={errors}
            name="comment"
            render={({ message }) => <p className="text-red-500">{message}</p>}
          />
        </div>
      </div>
    </div>
  );
}
