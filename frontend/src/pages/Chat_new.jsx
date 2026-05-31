import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import API from "../services/axios";
import socket from "../socket/socket";

const Container = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  height: calc(100vh - 80px);
  background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
  gap: 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: rgba(15, 23, 42, 0.95);
  border-right: 1px solid rgba(148, 163, 184, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    display: ${(p) => (p.showOnMobile ? "flex" : "none")};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
`;

const SidebarHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SidebarTitle = styled.h2`
  color: #f1f5f9;
  font-size: 18px;
  margin: 0;
  flex: 1;
`;

const CloseBtn = styled.button`
  display: none;
  background: none;
  border: none;
  color: #f1f5f9;
  font-size: 24px;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const List = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(148, 163, 184, 0.5);
    }
  }
`;

const ListItem = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: ${(p) =>
    p.active ? "rgba(6, 182, 212, 0.2)" : "rgba(71, 85, 105, 0.1)"};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  border: 1px solid ${(p) =>
    p.active ? "rgba(6, 182, 212, 0.3)" : "transparent"};

  &:hover {
    background: rgba(71, 85, 105, 0.2);
  }
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${(p) => p.color || "#06b6d4"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  ${(p) =>
    p.image &&
    `
    background-image: url(${p.image});
    background-size: cover;
    background-position: center;
  `}

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${(p) => (p.isOnline ? "#10b981" : "#6b7280")};
    border: 2px solid rgba(15, 23, 42, 0.95);
  }
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  color: #f1f5f9;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserMeta = styled.div`
  color: #94a3b8;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatSection = styled.div`
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  position: relative;

  @media (max-width: 768px) {
    display: ${(p) => (p.showOnMobile ? "flex" : "none")};
  }
`;

const ChatHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;

  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const HeaderInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const HeaderName = styled.div`
  color: #f1f5f9;
  font-weight: 600;
  font-size: 16px;
`;

const HeaderStatus = styled.div`
  color: #94a3b8;
  font-size: 12px;
`;

const BackBtn = styled.button`
  display: none;
  background: none;
  border: none;
  color: #f1f5f9;
  font-size: 24px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const CloseHeaderBtn = styled.button`
  background: none;
  border: none;
  color: #f1f5f9;
  font-size: 24px;
  cursor: pointer;
  margin-left: auto;

  &:hover {
    color: #ef4444;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(148, 163, 184, 0.5);
    }
  }
`;

const MessageBubble = styled.div`
  display: flex;
  justify-content: ${(p) => (p.isOwn ? "flex-end" : "flex-start")};
  gap: 8px;
`;

const MessageContent = styled.div`
  background: ${(p) => (p.isOwn ? "#06b6d4" : "rgba(71, 85, 105, 0.3)")};
  color: #f1f5f9;
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 70%;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.4;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: #64748b;
  font-size: 14px;
  text-align: center;
  padding: 20px;
`;

const InputSection = styled.div`
  padding: 16px;
  background: rgba(15, 23, 42, 0.5);
  border-top: 1px solid rgba(148, 163, 184, 0.1);
  display: flex;
  gap: 12px;
`;

const MessageInput = styled.input`
  flex: 1;
  background: rgba(71, 85, 105, 0.2);
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: #f1f5f9;
  padding: 10px 14px;
  border-radius: 8px;
  outline: none;
  font-size: 14px;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    border-color: #06b6d4;
    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.1);
  }
`;

const SendBtn = styled.button`
  background: #06b6d4;
  border: none;
  color: white;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: #0891b2;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #64748b;
    cursor: not-allowed;
    transform: none;
  }
`;

const Chat = () => {
  const currentUser = useSelector((state) => state.user.user);
  const [doctors, setDoctors] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileView, setMobileView] = useState(null);

  useEffect(() => {
    if (!currentUser?._id) return;

    socket.emit("join", currentUser._id);

    socket.on("onlineUsers", setOnlineUsers);
    socket.on("receiveMessage", handleNewMessage);

    loadInitialData();

    return () => {
      socket.off("onlineUsers");
      socket.off("receiveMessage");
    };
  }, [currentUser?._id]);

  const loadInitialData = async () => {
    try {
      if (currentUser?.role === "patient") {
        const res = await API.get("/user/doctors");
        setDoctors(res.data.doctors || []);
        setMobileView("sidebar");
      } else if (currentUser?.role === "doctor") {
        const res = await API.get("/chat/conversations");
        setConversations(res.data.conversations || []);
        setMobileView("sidebar");
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const handleNewMessage = (msg) => {
    setMessages((prev) => [
      ...prev,
      {
        _id: msg._id,
        sender: msg.sender,
        content: msg.content,
        type: msg.type,
        createdAt: msg.createdAt,
      },
    ]);
  };

  useEffect(() => {
    if (!selectedConversation?._id) return;

    const loadMessages = async () => {
      try {
        const res = await API.get(`/chat/messages/${selectedConversation._id}`);
        setMessages(res.data.messages || []);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    loadMessages();
  }, [selectedConversation?._id]);

  const handleDoctorClick = async (doctor) => {
    setSelectedUser(doctor);
    setLoading(true);

    try {
      const res = await API.post("/chat/conversation", {
        receiverId: doctor._id,
      });

      const conversation = {
        _id: res.data.conversation._id,
        otherUser: doctor,
        participants: res.data.conversation.participants,
      };

      setSelectedConversation(conversation);
      setMessages([]);
      setMobileView("chat");
    } catch (error) {
      console.error("Failed to create/get conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = async (conv) => {
    setSelectedConversation(conv);
    setSelectedUser(conv.otherUser);

    try {
      const res = await API.get(`/chat/messages/${conv._id}`);
      setMessages(res.data.messages || []);
      setMobileView("chat");
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const sendMessage = () => {
    if (!messageText.trim() || !selectedConversation?._id) return;

    socket.emit("sendMessage", {
      conversationId: selectedConversation._id,
      sender: currentUser._id,
      receiver: selectedUser._id,
      content: messageText,
    });

    setMessageText("");
  };

  const isUserOnline = (userId) => onlineUsers.includes(userId);

  return (
    <Container>
      <Sidebar showOnMobile={mobileView === "sidebar"}>
        <SidebarHeader>
          <SidebarTitle>
            {currentUser?.role === "patient" ? "Doctors" : "Conversations"}
          </SidebarTitle>
          <CloseBtn onClick={() => setMobileView("chat")}>✕</CloseBtn>
        </SidebarHeader>

        <List>
          {currentUser?.role === "patient" ? (
            doctors.length > 0 ? (
              doctors.map((doctor) => (
                <ListItem
                  key={doctor._id}
                  active={selectedUser?._id === doctor._id}
                  onClick={() => handleDoctorClick(doctor)}
                >
                  <Avatar
                    image={doctor.avatar}
                    isOnline={isUserOnline(doctor._id)}
                  >
                    {!doctor.avatar && doctor.name.charAt(0)}
                  </Avatar>
                  <UserInfo>
                    <UserName>{doctor.name}</UserName>
                    <UserMeta>
                      {doctor.specialization}
                      {doctor.experience > 0 && ` • ${doctor.experience}y`}
                    </UserMeta>
                  </UserInfo>
                </ListItem>
              ))
            ) : (
              <EmptyState>No doctors available</EmptyState>
            )
          ) : (
            conversations.length > 0 ? (
              conversations.map((conv) => (
                <ListItem
                  key={conv._id}
                  active={selectedConversation?._id === conv._id}
                  onClick={() => handleConversationClick(conv)}
                >
                  <Avatar
                    image={conv.otherUser?.avatar}
                    isOnline={isUserOnline(conv.otherUser?._id)}
                  >
                    {!conv.otherUser?.avatar &&
                      conv.otherUser?.name.charAt(0)}
                  </Avatar>
                  <UserInfo>
                    <UserName>{conv.otherUser?.name}</UserName>
                    <UserMeta>Patient</UserMeta>
                  </UserInfo>
                </ListItem>
              ))
            ) : (
              <EmptyState>No conversations yet</EmptyState>
            )
          )}
        </List>
      </Sidebar>

      <ChatSection showOnMobile={mobileView === "chat"}>
        {selectedConversation ? (
          <>
            <ChatHeader>
              <BackBtn onClick={() => setMobileView("sidebar")}>←</BackBtn>
              <HeaderInfo>
                <Avatar
                  image={selectedUser?.avatar}
                  isOnline={isUserOnline(selectedUser?._id)}
                >
                  {!selectedUser?.avatar && selectedUser?.name.charAt(0)}
                </Avatar>
                <HeaderMeta>
                  <HeaderName>{selectedUser?.name}</HeaderName>
                  <HeaderStatus>
                    {isUserOnline(selectedUser?._id)
                      ? "Online"
                      : "Offline"}
                    {selectedUser?.specialization &&
                      ` • ${selectedUser.specialization}`}
                  </HeaderStatus>
                </HeaderMeta>
              </HeaderInfo>
              <CloseHeaderBtn onClick={() => setSelectedConversation(null)}>
                ✕
              </CloseHeaderBtn>
            </ChatHeader>

            <MessagesContainer>
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <MessageBubble
                    key={msg._id}
                    isOwn={msg.sender?._id === currentUser._id}
                  >
                    <MessageContent
                      isOwn={msg.sender?._id === currentUser._id}
                    >
                      {msg.content}
                    </MessageContent>
                  </MessageBubble>
                ))
              ) : (
                <EmptyState>No messages yet. Start the conversation!</EmptyState>
              )}
            </MessagesContainer>

            <InputSection>
              <MessageInput
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
              />
              <SendBtn onClick={sendMessage} disabled={!messageText.trim()}>
                Send
              </SendBtn>
            </InputSection>
          </>
        ) : (
          <EmptyState>Select a chat to start messaging</EmptyState>
        )}
      </ChatSection>
    </Container>
  );
};

export default Chat;
