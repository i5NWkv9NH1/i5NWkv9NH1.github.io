import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://i5NWkv9NH1.github.io", // replace this with your deployed domain
  author: "sora",
  email: "sloananna326@gmail.com",
  // email: 'jannarin@protonmail.com',
  desc: "",
  title: "ゆらぎ荘",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 20,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes,
};

export const PROJECTS = [
  {
    title: "Mind Map",
    href: "https://i5NWkv9NH1.github.io/mind-map",
    description:
      "A mindmap app built with Vuetify.js & SimpleMindMap.js for visualizing and organizing ideas.",
  },
  {
    title: "RBAC system",
    href: "https://github.com/i5NWkv9NH1/foundation-admin-backend",
    description:
      "A basic RBAC system using Vuetify.js and Nest.js for user access control.",
  },
  {
    title: "ABC Notation",
    href: "https://i5NWkv9NH1.github.io/score",
    description:
      "A tool for rendering sheet music using ABC.js with Markdown support.",
  },
  {
    title: "Scrollbar",
    href: "https://i5NWkv9NH1.github.io/scrollbar",
    description: "Quick way to set styles of scrollbar build with Vuetify.js",
  },
  {
    title: "Lightweight Creating Resume",
    href: "https://github.com/i5NWkv9NH1/sora-cv-fe",
    description: "",
  },
  {
    title: "Hot News Crawler",
    href: "https://github.com/i5NWkv9NH1/rebang",
    description:
      "A Nest.js crawler fetching hot search data from major Chinese platforms.",
  },
];

export const LOCALE = {
  lang: "zh", // html lang code. Set this empty and default will be "en"
  langTag: ["zh-CN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "http://github.com/i5NWkv9NH1",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Facebook`,
    active: false,
  },
  {
    name: "Instagram",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Instagram`,
    active: false,
  },
  {
    name: "LinkedIn",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: false,
  },
  {
    name: "Mail",
    href: "sloananna326@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "Twitter",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Twitter`,
    active: false,
  },
  {
    name: "Twitch",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Twitch`,
    active: false,
  },
  {
    name: "YouTube",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on YouTube`,
    active: false,
  },
  {
    name: "WhatsApp",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on WhatsApp`,
    active: false,
  },
  {
    name: "Snapchat",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Snapchat`,
    active: false,
  },
  {
    name: "Pinterest",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Pinterest`,
    active: false,
  },
  {
    name: "TikTok",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on TikTok`,
    active: false,
  },
  {
    name: "CodePen",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on CodePen`,
    active: false,
  },
  {
    name: "Discord",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Discord`,
    active: false,
  },
  {
    name: "GitLab",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on GitLab`,
    active: false,
  },
  {
    name: "Reddit",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Reddit`,
    active: false,
  },
  {
    name: "Skype",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Skype`,
    active: false,
  },
  {
    name: "Steam",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Steam`,
    active: false,
  },
  {
    name: "Telegram",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Telegram`,
    active: false,
  },
  {
    name: "Mastodon",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Mastodon`,
    active: false,
  },
];
