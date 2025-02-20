"use client";

import type React from "react";

import { use, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function Chat() {
  const [inputUserName, setInputUserName] = useState("");
  const [userName, setUserName] = useState("");

  const messages = useQuery(api.chat.getMessages);
  const sendMessage = useMutation(api.chat.sendMessage);

  const [newMessageText, setNewMessageText] = useState("");

  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    var userName = window.localStorage.getItem("userName");
    if (userName) {
      setUserName(userName);
    }
  }, []);

  if (!userName) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome to the Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.localStorage.setItem(
                "userName",
                inputUserName.toLowerCase()
              );
              setUserName(inputUserName);
            }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              type="text"
              placeholder="Enter your name..."
              value={inputUserName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputUserName(e.target.value)
              }
            />
            <Button type="submit" disabled={!inputUserName}>
              Enter
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {messages?.map((message, index) => (
            <div
              key={index}
              className={`flex items-start mb-4 ${message.user === userName ? "justify-end" : "justify-start"}`}
              ref={index === messages.length - 1 ? lastMessageRef : null}
            >
              <div>
                <div
                  className={`capitalize flex ${message.user === userName ? "justify-end" : "justify-start"}`}
                >
                  {message.user}
                </div>
                <div
                  className={`px-4 py-2 rounded-lg w-fit ${
                    message.user === userName
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.body}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await sendMessage({ user: userName, body: newMessageText });
            setNewMessageText("");
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessageText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewMessageText(e.target.value)
            }
          />
          <Button type="submit" disabled={!newMessageText}>
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
