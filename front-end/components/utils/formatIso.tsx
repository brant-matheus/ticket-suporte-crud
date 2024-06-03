import { DateTime } from "luxon";

export function formatIso(iso: string) {
  return DateTime.fromISO(iso, { locale: "pt-BR" }).toLocaleString(
    DateTime.DATETIME_FULL_WITH_SECONDS
  );
}
