export type Rice = {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  wm: string;
  distro: string;
  tags: string[];
  screenshots: string[];
  description: string;
  dots: string;
  tips: number;
  downloads: number;
  createdAt: string;
};

export const WM_OPTIONS = [
  "All",
  "Hyprland",
  "i3",
  "sway",
  "bspwm",
  "dwm",
  "awesome",
  "qtile",
  "KDE",
  "GNOME",
] as const;

export const MOCK_RICES: Rice[] = [
  {
    id: "1",
    title: "Midnight Catppuccin",
    author: "kitsune",
    authorAvatar: "",
    wm: "Hyprland",
    distro: "Arch Linux",
    tags: ["catppuccin", "mocha", "minimal", "waybar"],
    screenshots: [
      "https://placehold.co/1920x1080/1a1520/f8fafc?text=Midnight+Catppuccin",
      "https://placehold.co/1920x1080/1a1520/f8fafc?text=Terminal+View",
    ],
    description:
      "A mocha-flavored Hyprland setup with rounded corners, Waybar, and rofi. Heavily inspired by the Catppuccin color scheme with custom blur and animations.",
    dots: "https://github.com/kitsune/dots",
    tips: 42,
    downloads: 1283,
    createdAt: "2026-05-10",
  },
  {
    id: "2",
    title: "Nord Frost",
    author: "arctician",
    authorAvatar: "",
    wm: "sway",
    distro: "NixOS",
    tags: ["nord", "sway", "clean", "wofi"],
    screenshots: [
      "https://placehold.co/1920x1080/2e3440/d8dee9?text=Nord+Frost",
      "https://placehold.co/1920x1080/2e3440/d8dee9?text=Tiling+Layout",
    ],
    description:
      "Clean NixOS + Sway config with the Nord palette. Features declarative config management, waybar with custom modules, and wofi launcher.",
    dots: "https://github.com/arctician/nix-dots",
    tips: 78,
    downloads: 2150,
    createdAt: "2026-05-08",
  },
  {
    id: "3",
    title: "Gruvbox Material",
    author: "ricefarmer",
    authorAvatar: "",
    wm: "i3",
    distro: "Void Linux",
    tags: ["gruvbox", "i3gaps", "polybar", "retro"],
    screenshots: [
      "https://placehold.co/1920x1080/282828/ebdbb2?text=Gruvbox+Material",
      "https://placehold.co/1920x1080/282828/ebdbb2?text=Workflow",
    ],
    description:
      "A warm Gruvbox Material setup on Void Linux. i3-gaps with polybar, picom animations, and a custom rofi theme. Every detail has been tuned.",
    dots: "https://github.com/ricefarmer/void-gruvbox",
    tips: 156,
    downloads: 4521,
    createdAt: "2026-04-28",
  },
  {
    id: "4",
    title: "Tokyo Night",
    author: "neonsamurai",
    authorAvatar: "",
    wm: "Hyprland",
    distro: "Arch Linux",
    tags: ["tokyo-night", "hyprland", "eww", "animated"],
    screenshots: [
      "https://placehold.co/1920x1080/1a1b26/a9b1d6?text=Tokyo+Night",
      "https://placehold.co/1920x1080/1a1b26/a9b1d6?text=Dashboard",
    ],
    description:
      "Tokyo Night themed Hyprland with custom EWW widgets, animated wallpapers via swww, and a full dashboard. Uses Starship prompt and custom Kitty config.",
    dots: "https://github.com/neonsamurai/tokyo-hypr",
    tips: 203,
    downloads: 5890,
    createdAt: "2026-05-01",
  },
  {
    id: "5",
    title: "Dracula Pro",
    author: "vampire_dev",
    authorAvatar: "",
    wm: "awesome",
    distro: "Fedora",
    tags: ["dracula", "awesome", "picom", "nerd-fonts"],
    screenshots: [
      "https://placehold.co/1920x1080/282a36/f8f8f2?text=Dracula+Pro",
      "https://placehold.co/1920x1080/282a36/f8f8f2?text=Multi+Monitor",
    ],
    description:
      "Full Dracula theme across AwesomeWM with custom Lua widgets, picom dual-kawase blur, and multi-monitor support. Includes matching GTK and icon themes.",
    dots: "https://github.com/vampire_dev/awesome-dracula",
    tips: 91,
    downloads: 3200,
    createdAt: "2026-05-15",
  },
  {
    id: "6",
    title: "Rosé Pine Dawn",
    author: "pastelcoder",
    authorAvatar: "",
    wm: "dwm",
    distro: "Gentoo",
    tags: ["rose-pine", "dwm", "st", "minimal"],
    screenshots: [
      "https://placehold.co/1920x1080/191724/e0def4?text=Rosé+Pine",
      "https://placehold.co/1920x1080/191724/e0def4?text=Patches",
    ],
    description:
      "Minimal dwm build with Rosé Pine colors. Patched with vanitygaps, swallow, and systray. Custom st terminal with scrollback and alpha patches.",
    dots: "https://github.com/pastelcoder/dwm-rose",
    tips: 67,
    downloads: 1890,
    createdAt: "2026-05-18",
  },
  {
    id: "7",
    title: "Everforest Zen",
    author: "treeline",
    authorAvatar: "",
    wm: "bspwm",
    distro: "Arch Linux",
    tags: ["everforest", "bspwm", "polybar", "zen"],
    screenshots: [
      "https://placehold.co/1920x1080/2b3339/d3c6aa?text=Everforest+Zen",
      "https://placehold.co/1920x1080/2b3339/d3c6aa?text=Terminals",
    ],
    description:
      "An Everforest-themed bspwm setup focused on calm aesthetics. Polybar with custom scripts, dunst notifications, and thunar file manager theming.",
    dots: "https://github.com/treeline/everforest-bspwm",
    tips: 44,
    downloads: 1120,
    createdAt: "2026-05-20",
  },
  {
    id: "8",
    title: "Kanagawa Wave",
    author: "ukiyoe",
    authorAvatar: "",
    wm: "Hyprland",
    distro: "Arch Linux",
    tags: ["kanagawa", "hyprland", "ags", "anime"],
    screenshots: [
      "https://placehold.co/1920x1080/1f1f28/dcd7ba?text=Kanagawa+Wave",
      "https://placehold.co/1920x1080/1f1f28/dcd7ba?text=Widgets",
    ],
    description:
      "Kanagawa colorscheme on Hyprland with AGS widgets, custom SDDM theme, and wallust color generation. Anime-inspired lock screen and GRUB theme.",
    dots: "https://github.com/ukiyoe/kanagawa-hypr",
    tips: 312,
    downloads: 8450,
    createdAt: "2026-04-15",
  },
  {
    id: "9",
    title: "One Dark Plasma",
    author: "plasmoid",
    authorAvatar: "",
    wm: "KDE",
    distro: "Kubuntu",
    tags: ["one-dark", "kde", "plasma", "latte"],
    screenshots: [
      "https://placehold.co/1920x1080/282c34/abb2bf?text=One+Dark+Plasma",
      "https://placehold.co/1920x1080/282c34/abb2bf?text=Desktop",
    ],
    description:
      "One Dark theme for KDE Plasma with Latte Dock, custom Kvantum theme, and matching Konsole profile. Full coherence across all KDE apps.",
    dots: "https://github.com/plasmoid/onedark-kde",
    tips: 55,
    downloads: 2340,
    createdAt: "2026-05-12",
  },
];
