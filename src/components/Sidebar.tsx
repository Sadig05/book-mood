import React, { useState } from "react";
import { useQuery } from "react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MessageCircle, Search, Settings, LogOut } from "lucide-react";
import { signOut } from "@/utils/auth";
import { useRouter } from "@tanstack/react-router";

interface Room {
  id: string;
  name: string;
  description: string;
  avatar: string;
  unreadCount: number;
}

interface SidebarProps {
  onSelectRoom: (roomId: string) => void;
  selectedRoomId: string | null;
}

const fetchRooms = async (): Promise<Room[]> => {
  // This is a mock API call. Replace with your actual API endpoint.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          name: "General",
          description: "General chat for everyone",
          avatar: "/avatars/general.png",
          unreadCount: 3,
        },
        {
          id: "2",
          name: "Random",
          description: "Random discussions and fun",
          avatar: "/avatars/random.png",
          unreadCount: 0,
        },
        {
          id: "3",
          name: "Tech Talk",
          description: "All things technology",
          avatar: "/avatars/tech.png",
          unreadCount: 5,
        },
        {
          id: "4",
          name: "Design",
          description: "UI/UX and graphic design",
          avatar: "/avatars/design.png",
          unreadCount: 1,
        },
        {
          id: "5",
          name: "Marketing",
          description: "Marketing strategies and ideas",
          avatar: "/avatars/marketing.png",
          unreadCount: 0,
        },
      ]);
    }, 500);
  });
};

const Sidebar: React.FC<SidebarProps> = ({ onSelectRoom, selectedRoomId }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: rooms, isLoading, error } = useQuery("rooms", fetchRooms);


  const filteredRooms = rooms?.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading)
    return <div className="p-4 text-muted-foreground">Loading rooms...</div>;
  if (error)
    return <div className="p-4 text-destructive">Error loading rooms</div>;

  return (
    <aside className="w-96 bg-card text-card-foreground border-r border-border flex flex-col h-screen">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2 mb-6">
          <MessageCircle className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">ChatApp</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search rooms..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-2">
          {filteredRooms?.map((room) => (
            <Button
              key={room.id}
              variant={selectedRoomId === room.id ? "secondary" : "ghost"}
              className="w-full justify-start py-6 px-4 space-x-4 relative"
              onClick={() => onSelectRoom(room.id)}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={room.avatar} alt={room.name} />
                <AvatarFallback>
                  {room.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-lg font-semibold truncate w-full">
                  {room.name}
                </span>
                <span className="text-sm text-muted-foreground truncate w-full">
                  {room.description}
                </span>
              </div>
              {room.unreadCount > 0 && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-bold">
                  {room.unreadCount}
                </div>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="/avatars/user.png" alt="User" />
              <AvatarFallback>Q</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Qabil Turkoglu</p>
              <p className="text-sm text-muted-foreground">Qabil@Turkoglu.AU</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={async () => {
            signOut();
            router.invalidate();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
