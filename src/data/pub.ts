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
  /* The /people/<slug>/<id>/ form, because the page has no vanity username.
     The number is the page id and is the part that matters.

     The tidier facebook.com/BigBenPubOberrieden that used to be here is not
     the pub: Facebook answers it with "This content isn't available at the
     moment". Do not shorten this link back to that. Note also that curl gets
     HTTP 400 from both, so a status code proves nothing here - it has to be
     opened in a browser. Confirmed 19 September 2026. */
  facebook:
    "https://www.facebook.com/people/Big-Ben-Pub-Oberrieden/61560243984952/",
  /* The listing itself. cid is the decimal of the second half of the feature
     id, 0x67127cbd2a207a2b, and is the shortest unambiguous way to open a
     Google place.

     Deliberately not the /maps/place/..!4m7!3m6!.. form. Those data payloads
     are counted - !4m7 declares seven following elements - so the URL cannot
     be edited by hand. Trimming the reviews flag off the end of one left a
     count of 7 with 5 elements behind it, and Google would not open it. */
  googleProfile: "https://maps.google.com/?cid=7427135887384803883",
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
  /* Opens Google's write-a-review dialog directly: stars ready, nothing to
     find first. Confirmed working 19 September 2026.

     The placeid is derived, not looked up. Google's Places API needs a key
     and Maps sits behind a consent wall, but a ChIJ.. place id is only
     base64url of a small protobuf wrapping the feature id, and the feature
     id was recoverable from the map embed on the old flowsight page:

       0x0a 0x12 0x09 <ftid high, little-endian u64>
                 0x11 <ftid low,  little-endian u64>
       ftid = 0x479aa89b342321f9:0x67127cbd2a207a2b

     Earlier versions of this pointed at a Maps search, then at the reviews
     panel. Both landed the visitor somewhere they still had to hunt for the
     button. If this ever breaks, Paul can get the official short link from
     his Business Profile under "Ask for reviews" and it goes straight here.

     Google shows a one-off "How your posts appear" notice over the stars the
     first time an account uses this. That belongs to the dialog, not to the
     link, and any tap dismisses it. */
  googleReview:
    "https://search.google.com/local/writereview" +
    "?placeid=ChIJ-SEjNJuomkcRK3ogKr18Emc",
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
  /* One row per day, Monday first.

     Consecutive identical days used to be merged into "Tuesday - Wednesday",
     which was tidier and worse: the reader had to work out whether their day
     fell inside a range, and a change to a single day silently restructured
     the whole table. Seven rows always look the same and answer the question
     by being read straight down. */
  const order = [1, 2, 3, 4, 5, 6, 0];
  return order.map((day) => {
    const slot = hours[day];
    return {
      label: dayNames[lang][day],
      value: slot ? `${fmt(slot[0])} – ${fmt(slot[1])}` : closedWord[lang],
      closed: !slot,
    };
  });
}
