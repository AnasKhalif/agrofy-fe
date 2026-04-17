export interface AccessLogItem {
  id: string;
  userId: string | number | null;
  userName: string;
  role: string;
  path: string;
  method: "NAVIGATE";
  createdAt: string;
}

const ACCESS_LOG_KEY = "system_access_logs";
const MAX_LOG_ITEMS = 500;

const parseLogs = (raw: string | null): AccessLogItem[] => {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as AccessLogItem[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const persistLogs = (logs: AccessLogItem[]) => {
  localStorage.setItem(ACCESS_LOG_KEY, JSON.stringify(logs.slice(0, MAX_LOG_ITEMS)));
};

export const accessLogService = {
  getAll: (): AccessLogItem[] => {
    return parseLogs(localStorage.getItem(ACCESS_LOG_KEY));
  },

  add: (payload: Omit<AccessLogItem, "id" | "createdAt">) => {
    const nextItem: AccessLogItem = {
      ...payload,
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`,
      createdAt: new Date().toISOString(),
    };

    const existing = accessLogService.getAll();
    persistLogs([nextItem, ...existing]);
  },

  clear: () => {
    localStorage.removeItem(ACCESS_LOG_KEY);
  },
};
