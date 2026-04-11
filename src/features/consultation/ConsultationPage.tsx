import { useState } from "react";
import { Icon } from "@iconify/react";
import { useGetConsultations } from "@/app/api/consultation/useConsultationApi";
import { Badge } from "@/shared/components/agrofy-ui/ui/badge";
import { Button } from "@/shared/components/agrofy-ui/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/agrofy-ui/ui/tabs";
import ChatRoom from "./components/ChatRoom";
import NewConsultationDialog from "./components/NewConsultationDialog";
import type { Consultation } from "@/app/api/consultation/type";

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  ongoing: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
};

const statusLabel = {
  pending: "Menunggu",
  ongoing: "Berlangsung",
  completed: "Selesai",
};

const ConsultationPage = () => {
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isNewOpen, setIsNewOpen] = useState(false);

  const { data, isLoading, refetch } = useGetConsultations(
    activeStatus !== "all" ? { status: activeStatus } : undefined
  );
  const consultations = data?.data?.data ?? [];

  if (selectedConsultation) {
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col">
        <ChatRoom
          consultation={selectedConsultation}
          onBack={() => { setSelectedConsultation(null); refetch(); }}
          onStatusChange={refetch}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Konsultasi Online</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Komunikasi dengan tenaga kesehatan
          </p>
        </div>
        <Button
          onClick={() => setIsNewOpen(true)}
          className="bg-[#0152EA] hover:bg-blue-700 text-white gap-2"
        >
          <Icon icon="solar:chat-round-dots-outline" width={18} />
          Konsultasi Baru
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeStatus} onValueChange={setActiveStatus}>
        <TabsList className="bg-gray-100 dark:bg-darkminisidebar">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="pending">Menunggu</TabsTrigger>
          <TabsTrigger value="ongoing">Berlangsung</TabsTrigger>
          <TabsTrigger value="completed">Selesai</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Consultation List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-darkminisidebar" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 dark:bg-darkminisidebar rounded w-1/3" />
                  <div className="h-3 bg-gray-100 dark:bg-darkminisidebar rounded w-2/3" />
                </div>
              </div>
            </div>
          ))
        ) : consultations.length === 0 ? (
          <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder py-16 text-center">
            <Icon icon="solar:chat-round-line-outline" width={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Belum ada konsultasi</p>
            <Button
              variant="link"
              className="text-[#0152EA] mt-1"
              onClick={() => setIsNewOpen(true)}
            >
              Mulai konsultasi baru
            </Button>
          </div>
        ) : (
          consultations.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedConsultation(c)}
              className="w-full bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4 hover:border-[#0152EA] hover:shadow-sm transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0152EA] flex items-center justify-center text-white font-medium flex-shrink-0">
                  {(c.health_worker?.name ?? "D")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                      {c.health_worker?.name ?? "Tenaga Kesehatan"}
                    </p>
                    <Badge className={`text-xs flex-shrink-0 ${statusColor[c.status]}`}>
                      {statusLabel[c.status]}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {c.subject ?? "Konsultasi umum"}
                  </p>
                  {c.latest_message && (
                    <p className="text-xs text-gray-400 truncate mt-1">
                      {c.latest_message.message}
                    </p>
                  )}
                </div>
                <Icon icon="solar:alt-arrow-right-outline" className="text-gray-300 flex-shrink-0" width={16} />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">
                {new Date(c.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </button>
          ))
        )}
      </div>

      <NewConsultationDialog
        open={isNewOpen}
        onClose={() => { setIsNewOpen(false); refetch(); }}
      />
    </div>
  );
};

export default ConsultationPage;
