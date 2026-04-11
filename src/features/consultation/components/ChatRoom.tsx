import { useRef, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useGetMessages, useSendMessage, useUpdateConsultationStatus } from "@/app/api/consultation/useConsultationApi";
import { useAuth } from "@/app/auth";
import { Button } from "@/shared/components/agrofy-ui/ui/button";
import { Input } from "@/shared/components/agrofy-ui/ui/input";
import { Badge } from "@/shared/components/agrofy-ui/ui/badge";
import { useToast } from "@/shared/hooks";
import type { Consultation } from "@/app/api/consultation/type";

interface Props {
  consultation: Consultation;
  onBack: () => void;
  onStatusChange?: () => void;
}

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  ongoing: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

const statusLabel = {
  pending: "Menunggu",
  ongoing: "Berlangsung",
  completed: "Selesai",
};

const ChatRoom = ({ consultation, onBack, onStatusChange }: Props) => {
  const { user } = useAuth();
  const toast = useToast();
  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: msgData, isLoading } = useGetMessages(consultation.id);
  const messages = msgData?.data?.data ?? [];

  const sendMutation = useSendMessage(consultation.id, {
    onSuccess: () => setMessage(""),
    onError: () => toast.error("Gagal mengirim pesan"),
  });

  const statusMutation = useUpdateConsultationStatus({
    onSuccess: () => {
      toast.success("Status konsultasi diperbarui");
      onStatusChange?.();
    },
    onError: () => toast.error("Gagal memperbarui status"),
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMutation.mutate({ message: message.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentUserId = user?.id;
  const isHealthWorker = typeof user?.role === "string"
    ? user.role === "dokter" || user.role === "health_worker"
    : user?.role?.name === "dokter" || user?.role?.name === "health_worker";

  const otherParty = isHealthWorker ? consultation.parent : consultation.health_worker;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-darkborder bg-white dark:bg-darkgray">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0">
            <Icon icon="solar:alt-arrow-left-outline" width={18} />
          </Button>
          <div className="w-9 h-9 rounded-full bg-[#0152EA] flex items-center justify-center text-white font-medium text-sm">
            {otherParty?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900 dark:text-white">{otherParty?.name ?? "-"}</p>
            {consultation.subject && (
              <p className="text-xs text-gray-400 line-clamp-1">{consultation.subject}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusColor[consultation.status]}>
            {statusLabel[consultation.status]}
          </Badge>
          {isHealthWorker && consultation.status === "ongoing" && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => statusMutation.mutate({ id: consultation.id, status: "completed" })}
              disabled={statusMutation.isPending}
            >
              <Icon icon="solar:check-circle-outline" className="mr-1" width={14} />
              Selesaikan
            </Button>
          )}
          {isHealthWorker && consultation.status === "pending" && (
            <Button
              size="sm"
              className="bg-[#0152EA] hover:bg-blue-700 text-white text-xs"
              onClick={() => statusMutation.mutate({ id: consultation.id, status: "ongoing" })}
              disabled={statusMutation.isPending}
            >
              <Icon icon="solar:play-circle-outline" className="mr-1" width={14} />
              Mulai
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-gray-50 dark:bg-dark">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Icon icon="solar:refresh-line-duotone" className="animate-spin text-gray-400" width={28} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <Icon icon="solar:chat-round-dots-outline" width={48} className="opacity-30" />
            <p className="text-sm">Belum ada pesan. Mulai percakapan!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMine = String(msg.sender_id) === String(currentUserId);
            const prevMsg = messages[idx - 1];
            const isSameAsPrev = prevMsg && prevMsg.sender_id === msg.sender_id;
            const time = new Date(msg.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"} ${isSameAsPrev ? "mt-0.5" : "mt-3"}`}
              >
                {/* Avatar for other party */}
                {!isMine && (
                  <div className={`w-7 h-7 rounded-full bg-[#0152EA] flex items-center justify-center text-white text-xs flex-shrink-0 ${isSameAsPrev ? "invisible" : ""}`}>
                    {msg.sender?.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}

                {/* Bubble */}
                <div className={`max-w-[68%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                  <div className={`relative px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isMine
                      ? "bg-[#0152EA] text-white rounded-br-none"
                      : "bg-white dark:bg-darkgray text-gray-800 dark:text-white rounded-bl-none"
                  }`}>
                    <p className="whitespace-pre-wrap break-words pr-12">{msg.message}</p>
                    {/* Time + ticks — inside bubble bottom-right */}
                    <div className={`absolute bottom-1.5 right-2 flex items-center gap-0.5 ${isMine ? "text-blue-200" : "text-gray-400"}`}>
                      <span className="text-[10px] leading-none">{time}</span>
                      {isMine && (
                        msg.is_read ? (
                          /* Double tick = read */
                          <svg width="18" height="11" viewBox="0 0 18 11" fill="none" className="ml-0.5 flex-shrink-0">
                            <path d="M1 5.5L4.5 9L11 1" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6 5.5L9.5 9L16 1" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          /* Single tick = sent, not read */
                          <svg width="12" height="10" viewBox="0 0 12 10" fill="none" className="ml-0.5 flex-shrink-0">
                            <path d="M1 5L4 8L11 1" stroke="rgba(255,255,255,0.85)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Spacer for my messages (no avatar) */}
                {isMine && <div className="w-7 flex-shrink-0" />}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 bg-white dark:bg-darkgray border-t border-gray-200 dark:border-darkborder">
        {consultation.status === "completed" ? (
          <div className="text-center text-sm text-gray-400 py-2">
            <Icon icon="solar:lock-outline" className="inline mr-1" width={14} />
            Konsultasi telah selesai
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan..."
              className="flex-1"
              disabled={sendMutation.isPending}
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim() || sendMutation.isPending}
              className="bg-[#0152EA] hover:bg-blue-700 text-white h-10 w-10 p-0 flex-shrink-0"
            >
              {sendMutation.isPending
                ? <Icon icon="solar:refresh-line-duotone" className="animate-spin" width={18} />
                : <Icon icon="solar:plain-2-outline" width={18} />
              }
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
