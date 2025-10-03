import { getTimezoneOffset } from "date-fns-tz";

export function IanaTZtoOffset(iana: string): string {
  const offset = getTimezoneOffset(iana);

  const hours = Math.floor(Math.abs(offset) / 3600000);
  const minutes = Math.floor((Math.abs(offset) % 3600000) / 60000);
  const sign = offset <= 0 ? "-" : "+";

  return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

export function getCityFromIanaTZ(iana: string): string {
  const parts = iana.split("/");
  const city = parts[parts.length - 1].replace(/_/g, " ");

  return city;
}
