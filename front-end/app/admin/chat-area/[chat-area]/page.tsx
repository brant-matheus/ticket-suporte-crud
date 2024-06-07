"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Ticket } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { authInstance } from "@/app/axios-config";
import { DateTime } from "luxon";
import { formatIso } from "@/components/utils/formatIso";

interface User {
  id: number;
  fullName: string;
  email: string;
  isAdmin: number;
  createdAt: string;
  updatedAt: string;
}

interface ticket {
  id: number;
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

interface TicketCommentArray extends Array<TicketComment> {}
export default function ChatArea() {
  const [data, setData] = useState<TicketCommentArray>([]);
  async function getComments() {
    try {
      const { data } = await authInstance.get("comments", {
        params: { ticketId: 1 },
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

  return (
    <>
      <div className="container mt-2 rounded-md border border-blue-500 space-y-2">
        <div className="container-md mx-auto ">
          {" "}
          <ScrollArea ref={scrollAreaRef} className="h-96 w-auto">
            <div className=" space-y-2">
              {" "}
              {data.map((value) =>
                value.user.isAdmin ? (
                  <div
                    key={value.id}
                    className="flex justify-end mr-6 container w-[800px]
                  "
                  >
                    <div className="grind grid-cols-1">
                      <p className="text-cyan-300 text-balance">
                        {value.content}
                      </p>
                      <p className="flex justify-end text-zinc-400 italic text-sm">
                        {formatIso(value.createdAt)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex justify-start  container w-full "
                    key={value.id}
                  >
                    <div className="grind grid-cols-1">
                      <p className="text-red-400">{value.content}</p>
                      <p className="flex justify-start text-zinc-400 italic text-sm">
                        {formatIso(value.createdAt)}
                      </p>
                    </div>{" "}
                  </div>
                )
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="flex items-center gap-x-6 justify-center mt-auto ">
          {" "}
          <Textarea
            className="w-5/6 resize-none h-5"
            placeholder="Digite seu comentário"
          />
          <Button variant="link">
            <Send />
          </Button>
        </div>
      </div>
    </>
  );
}
