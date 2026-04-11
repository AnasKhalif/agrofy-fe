import { useState } from "react";
import { Icon } from "@iconify/react";
import { useGetConsultations } from "@/app/api/consultation/useConsultationApi";
import { Badge } from "@/shared/components/agrofy-ui/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/agrofy-ui/ui/tabs";
import ChatRoom from "./components/ChatRoom";
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

const DoctorConsultationPage = () => {
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  const { data, isLoading, refetch } = useGetConsultations(
    activeStatus !== "all" ? { status: activeStatus } : undefined
  );
  const consultations = data?.data?.data ?? [];

  const pending = consultations.filter((c) => c.status === "pending").length;
  const ongoing = consultations.filter((c) => c.status === "ongoing").length;

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Konsultasi</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Kelola dan respons konsultasi dari orang tua
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Menunggu", value: pending, icon: "solar:clock-circle-outline", color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20" },
          { label: "Berlangsung", value: ongoing, icon: "solar:chat-round-line-outline", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
          { label: "Total", value: consultations.length, icon: "solar:checklist-minimalistic-outline", color: "text-gray-600 bg-gray-50 dark:bg-gray-800" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
              <Icon icon={stat.icon} width={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeStatus} onValueChange={setActiveStatus}>
        <TabsList className="bg-gray-100 dark:bg-darkminisidebar">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="pending">
            Menunggu
            {pending > 0 && (
              <span className="ml-1.5 bg-yellow-500 text-white text-xs rounded-full px-1.5 py-0.5">{pending}</span>
            )}
          </TabsTrigger>
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
            <p className="text-gray-500 dark:text-gray-400">Tidak ada konsultasi</p>
          </div>
        ) : (
          consultations.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedConsultation(c)}
              className="w-full bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4 hover:border-[#0152EA] hover:shadow-sm transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 font-medium flex-shrink-0">
                  {(c.parent?.name ?? "P")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                      {c.parent?.name ?? "Orang Tua"}
                    </p>
                    <Badge className={`text-xs flex-shrink-0 ${statusColor[c.status]}`}>
                      {statusLabel[c.status]}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {c.subject ?? "Konsultasi umum"}
                  </p>
                  {c.child && (
                    <p className="text-xs text-blue-500 mt-0.5">
                      <Icon icon="solar:user-outline" className="inline mr-1" width={12} />
                      Anak: {c.child.name}
                    </p>
                  )}
                  {c.latest_message && (
                    <p className="text-xs text-gray-400 truncate mt-1">
                      {c.latest_message.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Icon icon="solar:alt-arrow-right-outline" className="text-gray-300" width={16} />
                  {c.status === "pending" && (
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">
                {new Date(c.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorConsultationPage;
