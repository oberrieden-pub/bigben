/* Single source of truth for everything factual about the pub.
   Hours in particular used to live in three places (two visible tables and the
   status script) and had to be changed in all three. Now they live here. */

export const pub = {
  name: "Big Ben Pub",
  // The commercial register (SHAB, 26.02.2024) files this with a lowercase "l":
  // "The luck of the Irish GmbH". Capitalised here as the landlord asked. It
  // identifies the same company either way, but if anyone ever wants the
  // Impressum to match the register letter for letter, this is the line.
  legalName: "The Luck of the Irish GmbH",
  uid: "CHE-157.131.031",
  director: "Paul Michael Tischler",
  street: "Alte Landstrasse 20",
  postcode: "8942",
  town: "Oberrieden",
  canton: "ZH",
  country: { en: "Switzerland", de: "Schweiz" },
  phoneDisplay: "043 388 55 08",
  phoneHref: "tel:+41433885508",
  email: "bigben@oberrieden.pub",
  instagram: "https://www.instagram.com/bigbenpubzh/",
  instagramHandle: "@bigbenpubzh",
  facebook: "https://www.facebook.com/BigBenPubOberrieden/",
  googleProfile:
    "https://www.google.com/maps/search/?api=1&query=Big+Ben+Pub+Oberrieden",
  mapEmbed: (lang: Lang) =>
    `https://www.google.com/maps?q=Big+Ben+Pub%2C+Alte+Landstrasse+20%2C+8942+Oberrieden&z=16&hl=${lang}&output=embed`,
  directions: (mode: "transit" | "driving" | "walking") =>
    `https://www.google.com/maps/dir/?api=1&destination=Alte+Landstrasse+20%2C+8942+Oberrieden&travelmode=${mode}`,
} as const;

export type Lang = "en" | "de";

/* Opening hours as minutes from midnight, Europe/Zurich, indexed by the
   JavaScript day number so 0 is Sunday. null means closed.
   Confirmed with the landlord on 13 September 2026. */
export const hours: ([number, number] | null)[] = [
  [12 * 60, 19 * 60 + 30], // Sunday
  null, // Monday
  [17 * 60, 22 * 60 + 30], // Tuesday
  [17 * 60, 22 * 60 + 30], // Wednesday
  [17 * 60, 23 * 60], // Thursday
  [17 * 60, 23 * 60 + 30], // Friday
  [17 * 60, 23 * 60 + 30], // Saturday
];

export const dayNames: Record<Lang, string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  de: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
};

export const closedWord: Record<Lang, string> = {
  en: "Closed",
  de: "Geschlossen",
};

export function fmt(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/* Walks Monday to Sunday and merges consecutive days that share the same hours,
   so "Tuesday – Wednesday" appears without anyone maintaining that grouping. */
export function weekRows(lang: Lang) {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const rows: { label: string; value: string; closed: boolean }[] = [];
  let i = 0;
  while (i < order.length) {
    const slot = hours[order[i]];
    let j = i;
    while (
      j + 1 < order.length &&
      JSON.stringify(hours[order[j + 1]]) === JSON.stringify(slot)
    ) {
      j++;
    }
    const first = dayNames[lang][order[i]];
    const last = dayNames[lang][order[j]];
    rows.push({
      label: i === j ? first : `${first} – ${last}`,
      value: slot ? `${fmt(slot[0])} – ${fmt(slot[1])}` : closedWord[lang],
      closed: !slot,
    });
    i = j + 1;
  }
  return rows;
}
