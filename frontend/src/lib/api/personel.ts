import { api } from "@/lib/api";
import type { TalepListe } from "@/types";

export const personelApi = {
  atananTalepler: () => api.get<TalepListe[]>("/personel/atanan-talepler").then((r) => r.data),
};
