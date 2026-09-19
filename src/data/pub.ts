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
  // Shown in international form so it is obvious the pub is in Switzerland.
  // The leading 0 of the area code drops when +41 is used.
  phoneDisplay: "+41 43 388 55 08",
  phoneHref: "tel:+41433885508",
  email: "bigben@oberrieden.pub",
  instagram: "https://www.instagram.com/bigbenpubzh/",
  instagramHandle: "@bigbenpubzh",
  facebook: "https://www.facebook.com/BigBenPubOberrieden/",
  /* The listing itself, not a search for it. Same feature id as googleReview
     below, which was confirmed to resolve to this pub. A search URL merely
     tends to find the right place. */
  googleProfile:
    "https://www.google.com/maps/place/Big+Ben+Pub/@47.2788735,8.5749821,17z" +
    "/data=!4m7!3m6!1s0x479aa89b342321f9:0x67127cbd2a207a2b" +
    "!8m2!3d47.2788735!4d8.5749821",
  mapEmbed: (lang: Lang) =>
    `https://www.google.com/maps?q=Big+Ben+Pub%2C+Alte+Landstrasse+20%2C+8942+Oberrieden&z=16&hl=${lang}&output=embed`,
  /* Street View, pinned to the panorama that actually faces the frontage.
     Dropping someone at the address alone points them at a blank wall.
     The pano id is Google's and can change when the street is rephotographed;
     viewpoint is included so the link still lands nearby if that happens.
     Heading 287 is west-north-west, looking across the road at the door. */
  streetView:
    "https://www.google.com/maps/@?api=1&map_action=pano" +
    "&pano=oul30Y3EKG8znOIA1lhdmw" +
    "&viewpoint=47.2788735,8.5749821" +
    "&heading=287.47&pitch=0&fov=80",
  /* The review link, not the listing. Appending !9m1!1b1 to a place URL opens
     the Reviews panel with "Write a review" already in view; a plain listing
     link lands on Overview and needs three more taps, which is three too many
     for someone standing in front of a sign.

     The 1s value is the pub's Google feature id, recovered from the map embed
     on the old flowsight page because the Places API needs a key and Maps puts
     a consent wall in the way. 3d/4d are the pub's coordinates.

     If Paul ever fetches the short g.page/r/<code>/review link from his
     Business Profile it is better still, because it opens the write dialog
     itself. Swapping it in here is the only change needed: printed material
     points at oberrieden.pub/review, never at Google. */
  googleReview:
    "https://www.google.com/maps/place/Big+Ben+Pub/@47.2788735,8.5749821,17z" +
    "/data=!4m7!3m6!1s0x479aa89b342321f9:0x67127cbd2a207a2b" +
    "!8m2!3d47.2788735!4d8.5749821!9m1!1b1",
  /* What is on, kept in one place: a Google Calendar the landlord owns.
     The site does not list fixtures of its own and must not start; it only
     points at this. An empty calendar shows an empty week, which is honest.
     A fixture list on a page that nobody updates shows last season as though
     it were tonight, which is how the previous site died.

     id is the calendar's address, e.g. something@group.calendar.google.com.
     Until it is filled in, nothing links to the calendar and no page loads
     anything from Google beyond the map. A button was once shipped pointing
     at a calendar that did not exist; do not repeat that. Requirements:
     the calendar lives in the landlord's own Google account, is set public,
     and its timezone is Europe/Zurich. */
  calendar: {
    id: "",
    embed: (id: string, lang: Lang) =>
      "https://calendar.google.com/calendar/embed" +
      `?src=${encodeURIComponent(id)}` +
      "&ctz=Europe/Zurich" +
      `&hl=${lang}` +
      /* Agenda, not month: a month grid of a quiet week looks abandoned,
         whereas an agenda simply lists what there is. */
      "&mode=AGENDA&showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0",
    /* Where the button sends someone who wants it in their own calendar. */
    open: (id: string) =>
      `https://calendar.google.com/calendar/u/0?cid=${encodeURIComponent(id)}`,
  },
  directions: (mode: "transit" | "driving" | "walking") =>
    `https://www.google.com/maps/dir/?api=1&destination=Alte+Landstrasse+20%2C+8942+Oberrieden&travelmode=${mode}`,
} as const;

export type Lang = "en" | "de";

/* Opening hours as minutes from midnight, Europe/Zurich, indexed by the
   JavaScript day number so 0 is Sunday. null means closed.
   Confirmed with the landlord on 13 September 2026;
   Saturday moved to a 13:30 opening on 19 September 2026. */
export const hours: ([number, number] | null)[] = [
  [12 * 60, 19 * 60 + 30], // Sunday
  null, // Monday
  [17 * 60, 22 * 60 + 30], // Tuesday
  [17 * 60, 22 * 60 + 30], // Wednesday
  [17 * 60, 23 * 60], // Thursday
  [17 * 60, 23 * 60 + 30], // Friday
  [13 * 60 + 30, 23 * 60 + 30], // Saturday
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
