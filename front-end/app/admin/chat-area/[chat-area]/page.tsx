import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function ChatArea() {
  const messages = [
    {
      text: "Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?",
      isAdmin: true,
    },
    {
      text: "Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?",
      isAdmin: false,
    },
    {
      text: "hi there! How have you been? It's been a while since we last caught up. Any exciting news to share?",
      isAdmin: false,
    },
    {
      text: "Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?",
      isAdmin: true,
    },
    {
      text: "Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?",
      isAdmin: false,
    },
    {
      text: "Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?",
      isAdmin: true,
    },
    {
      text: "Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?",
      isAdmin: false,
    },
    {
      text: "Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?",
      isAdmin: true,
    },
    {
      text: "Hey there! How have you been? It's been a while since we last caught up. Any exciting news to share?",
      isAdmin: false,
    },
  ];

  return (
    <>
      <div className="container  rounded-md border">
        <div className="container-md mx-auto ">
          {" "}
          <ScrollArea className="h-96 w-auto">
            <div className=" space-y-2">
              {" "}
              {messages.map((value) =>
                value.isAdmin ? (
                  <div
                    className="flex justify-end mr-6 container w-full
                  "
                  >
                    <div className="grind grid-cols-1">
                      <p className="text-cyan-300">{value.text}</p>
                      <p className="flex justify-end text-zinc-400 italic text-sm">
                        enviado há 50 minutos por você
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start  container w-full ">
                    <div className="grind grid-cols-1">
                      <p className="text-red-400">{value.text}</p>
                      <p className="flex justify-start text-zinc-400 italic text-sm">
                        enviado há 50 minutos por você
                      </p>
                    </div>{" "}
                  </div>
                )
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="flex items-center gap-x-6 justify-center mt-auto mb-2">
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
