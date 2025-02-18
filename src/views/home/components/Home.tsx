import ChatRoom from "@/components/ChatRoom";

// import Chat from "./Chat";

function Home() {

  return (
    <>

      {/* <Chat /> */}
      <div className="flex  h-[100%] bg-background text-foreground">
        {/* <Sidebar onSelectRoom={setSelectedRoom} selectedRoomId={selectedRoom} /> */}
        <main className="flex-1 flex flex-col overflow-hidden">
        <ChatRoom  roomId="1"/>
        </main>
      </div>
    </>
  );
}

export default Home;
