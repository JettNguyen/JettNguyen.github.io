import {
  PersonalInterestGroup,
  PersonalInterestItem,
  PersonalInterestSectionKey
} from "@/lib/types";
import { fetchDeezerMedia, fetchItunesMedia, fetchWikipediaMovie } from "@/lib/public-media";
import {
  faMusic,
  faFlask,
  faMicrochip,
  faDiagramProject,
  faBrain,
  faPhotoFilm
} from "@fortawesome/free-solid-svg-icons";

export const personalLiveSignals = {
  currentlyListening: "",
  recentlyWatched: "Raising Arizona - ★★★½",
  currentlyInto: "Human behavior systems, interactive storytelling, and audio tooling"
};

export const personalInterestSections: PersonalInterestGroup[] = [
  {
    key: "music",
    title: "Music",
    intro: "Production and tracks that influence how I design rhythm in interfaces.",
    items: [
      {
        section: "music",
        slug: "house-of-balloons",
        title: "House of Balloons",
        subtitle: "The Weeknd (2011)",
        publicMediaLookup: {
          provider: "itunes",
          entity: "album",
          term: "The Weeknd House of Balloons",
          expectedTitle: "House of Balloons",
          expectedArtist: "The Weeknd"
        },
        imageFit: "cover",
        tags: ["Album", "Favorite"],
        description: "The realest project in popular music in my opinion.",
        details: ["I wish I could have been around to experience the mystery when this came out."]
      },
      {
        section: "music",
        slug: "thursday",
        title: "Thursday",
        subtitle: "The Weeknd (2011)",
        publicMediaLookup: {
          provider: "itunes",
          entity: "album",
          term: "The Weeknd Thursday",
          expectedTitle: "Thursday",
          expectedArtist: "The Weeknd"
        },
        imageFit: "cover",
        tags: ["Album", "Favorite"],
        description: "Another Trilogy project I replay a lot.",
        details: ["Fits perfectly when I want a darker sound palette."]
      },
      {
        section: "music",
        slug: "echoes-of-silence",
        title: "Echoes of Silence",
        subtitle: "The Weeknd (2011)",
        publicMediaLookup: {
          provider: "itunes",
          entity: "album",
          term: "The Weeknd Echoes of Silence",
          expectedTitle: "Echoes of Silence",
          expectedArtist: "The Weeknd"
        },
        imageFit: "cover",
        tags: ["Album", "Favorite"],
        description: "Immaculate production all the way through.",
        details: ["This is reserved for when I want a more emotional vibe. "]
      },
      {
        section: "music",
        slug: "kiss-land",
        title: "Kiss Land",
        subtitle: "The Weeknd (2013)",
        publicMediaLookup: {
          provider: "itunes",
          entity: "album",
          term: "The Weeknd Kiss Land",
          expectedTitle: "Kiss Land",
          expectedArtist: "The Weeknd"
        },
        imageFit: "cover",
        tags: ["Album", "Favorite"],
        description: "This is one of my top Weeknd albums.",
        details: ["A project I always circle back to."]
      },
      {
        section: "music",
        slug: "hurry-up-tomorrow",
        title: "Hurry Up Tomorrow",
        subtitle: "The Weeknd (2025)",
        publicMediaLookup: {
          provider: "itunes",
          entity: "album",
          term: "The Weeknd Hurry Up Tomorrow",
          expectedTitle: "Hurry Up Tomorrow",
          expectedArtist: "The Weeknd"
        },
        imageFit: "cover",
        tags: ["Album", "Current"],
        description: "The movie wasn't as good as the album.",
        details: ["I listened to this on repeat for a month straight."]
      },
      {
        section: "music",
        slug: "breakfast-in-america",
        title: "Breakfast in America",
        subtitle: "Supertramp (1979)",
        publicMediaLookup: {
          provider: "itunes",
          entity: "album",
          term: "Supertramp Breakfast in America",
          expectedTitle: "Breakfast in America",
          expectedArtist: "Supertramp"
        },
        imageFit: "cover",
        tags: ["Album", "Classic"],
        description: "Songwriting skills that I aspire to have.",
        details: ["An album I rediscovered and now listen to regularly."]
      },
      {
        section: "music",
        slug: "the-perfect-luv-tape",
        title: "The Perfect LUV Tape",
        subtitle: "Lil Uzi Vert (2016)",
        publicMediaLookup: {
          provider: "itunes",
          entity: "album",
          term: "Lil Uzi Vert The Perfect LUV Tape",
          expectedTitle: "The Perfect LUV Tape",
          expectedArtist: "Lil Uzi Vert"
        },
        imageFit: "cover",
        tags: ["Album", "Replay"],
        description: "Uzi at his most melodic and versatile in my opinion.",
        details: ["Underrated."]
      },
      {
        section: "music",
        slug: "audioslave-self-titled",
        title: "Audioslave",
        subtitle: "Audioslave (2002)",
        publicMediaLookup: {
          provider: "itunes",
          entity: "album",
          term: "Audioslave Audioslave",
          expectedTitle: "Audioslave",
          expectedArtist: "Audioslave"
        },
        imageFit: "cover",
        tags: ["Album", "Rock"],
        description: "Chris Cornell + Rage Against the Machine = perfection.",
        details: ["My favorite rock album of all time."]
      },
      {
        section: "music",
        slug: "minecraft-volume-alpha",
        title: "Minecraft - Volume Alpha",
        subtitle: "C418 (2011)",
        publicMediaLookup: {
          provider: "itunes",
          entity: "album",
          term: "C418 Minecraft Volume Alpha",
          expectedTitle: "Minecraft - Volume Alpha",
          expectedArtist: "C418"
        },
        imageFit: "cover",
        tags: ["Album", "Ambient"],
        description: "Unbelievable writing and production.",
        details: ["/give C418 minecraft:flowers"]
      },
      {
        section: "music",
        slug: "minecraft-volume-beta",
        title: "Minecraft - Volume Beta",
        subtitle: "C418 (2013)",
        publicMediaLookup: {
          provider: "itunes",
          entity: "album",
          term: "C418 Minecraft Volume Beta",
          expectedTitle: "Minecraft - Volume Beta",
          expectedArtist: "C418"
        },
        imageFit: "cover",
        tags: ["Album", "Ambient"],
        description: "Evil twin to Volume Alpha.",
        details: ["Late night coding sessions are not the same without this."]
      },
      {
        section: "music",
        slug: "diamond-life",
        title: "Diamond Life",
        subtitle: "Sade (1984)",
        publicMediaLookup: {
          provider: "itunes",
          entity: "album",
          term: "Sade Diamond Life",
          expectedTitle: "Diamond Life",
          expectedArtist: "Sade"
        },
        imageFit: "cover",
        tags: ["Album", "Classic"],
        description: "Sade is in my top two.",
        details: ["When Sade was finding their niche and vibe."]
      },
      {
        section: "music",
        slug: "promise",
        title: "Promise",
        subtitle: "Sade (1985)",
        publicMediaLookup: {
          provider: "itunes",
          entity: "album",
          term: "Sade Promise",
          expectedTitle: "Promise",
          expectedArtist: "Sade"
        },
        imageFit: "cover",
        tags: ["Album", "Classic"],
        description: "Darker Diamond Life.",
        details: ["When Sade found their best sound in my opinion."]
      },
      {
        section: "music",
        slug: "infinite",
        title: "Infinite",
        subtitle: "Black Atlass (2022)",
        publicMediaLookup: {
          provider: "itunes",
          entity: "album",
          term: "Black Atlass Infinite",
          expectedTitle: "Infinite",
          expectedArtist: "Black Atlass"
        },
        imageFit: "cover",
        tags: ["Album", "Moody"],
        description: "A feel good cinematic vibe.",
        details: ["Black Atlass is way too slept on."]
      },
      {
        section: "music",
        slug: "recess",
        title: "Recess",
        subtitle: "Skrillex (2014)",
        publicMediaLookup: {
          provider: "itunes",
          entity: "album",
          term: "Skrillex Recess",
          expectedTitle: "Recess",
          expectedArtist: "Skrillex"
        },
        imageFit: "cover",
        tags: ["Album", "Dubstep", "Electronic"],
        description: "The most complete Skrillex project.",
        details: ["Been listening since elementary school and it still bangs."]
      },
      {
        section: "music",
        slug: "willow-1973",
        title: "Willow",
        subtitle: "Willow (1973)",
        imageUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/1c/78/fb/1c78fbda-9575-a6a3-df40-9e764544115c/artwork.jpg/600x600bb.jpg",
        imageAlt: "Willow album artwork",
        links: [{ label: "Apple Music", href: "https://music.apple.com/us/album/willow/1611609948" }],
        publicMediaLookup: {
          provider: "itunes",
          entity: "album",
          term: "Willow 1973 album",
          expectedTitle: "Willow"
        },
        imageFit: "cover",
        tags: ["Album", "70s"],
        description: "Super chill 70s collection of songs.",
        details: ["Something I can gatekeep but share here."]
      },
      {
        section: "music",
        slug: "telstar-ponies-space",
        title: "In the Space of a Few Minutes",
        subtitle: "Telstar Ponies (1995)",
        publicMediaLookup: {
          provider: "itunes",
          entity: "album",
          term: "Telstar Ponies In the Space of a Few Minutes",
          expectedTitle: "In the Space of a Few Minutes",
          expectedArtist: "Telstar Ponies"
        },
        imageFit: "cover",
        tags: ["Album", "Niche"],
        description: "One of those albums I'm glad I discovered.",
        details: ["A unique pick in my rotation."]
      },
      {
        section: "music",
        slug: "reaper",
        title: "Reaper",
        subtitle: "No Vacation (2017)",
        publicMediaLookup: {
          provider: "itunes",
          entity: "song",
          term: "No Vacation Reaper",
          expectedTitle: "Reaper",
          expectedArtist: "No Vacation"
        },
        imageFit: "cover",
        tags: ["Song", "Indie"],
        description: "A standout track from No Vacation.",
        details: ["It feels like a warm hug."]
      },
      {
        section: "music",
        slug: "shorty",
        title: "Shorty (Got Her Eyes on Me)",
        subtitle: "Donell Jones (1999)",
        publicMediaLookup: {
          provider: "itunes",
          entity: "song",
          term: "Donell Jones Shorty",
          expectedTitle: "Shorty (Got Her Eyes on Me)",
          expectedArtist: "Donell Jones"
        },
        imageFit: "cover",
        tags: ["Song", "R&B"],
        description: "An addictively smooth R&B track.",
        details: ["A song I can listen to on repeat without getting tired of it."]
      }
    ]
  },
  {
    key: "films",
    title: "Films",
    intro: "Stories and visuals that shape how I think about design, framing, and product narrative.",
    items: [
      {
        section: "films",
        slug: "whiplash",
        title: "Whiplash (2014)",
        subtitle: "★★★★★",
        publicMediaLookup: {
          provider: "wikipedia",
          entity: "movie",
          term: "Whiplash 2014 film",
          expectedTitle: "Whiplash",
          wikipediaPageTitle: "Whiplash (2014 film)"
        },
        imageFit: "cover",
        tags: ["Film", "Favorite"],
        description: "My favorite film ever.",
        details: ["Who won the final battle is still up for debate in my mind."]
      },
      {
        section: "films",
        slug: "la-la-land",
        title: "La La Land (2016)",
        subtitle: "★★★★★",
        publicMediaLookup: {
          provider: "wikipedia",
          entity: "movie",
          term: "La La Land",
          expectedTitle: "La La Land",
          wikipediaPageTitle: "La La Land"
        },
        imageFit: "cover",
        tags: ["Film", "Favorite"],
        description: "Just an amazing story accompanied by stunning visuals.",
        details: ["I am a combination of Sebastian and Mia; the realist and the dreamer."]
      },
      {
        section: "films",
        slug: "singin-in-the-rain",
        title: "Singin' in the Rain (1952)",
        subtitle: "★★★★★",
        publicMediaLookup: {
          provider: "wikipedia",
          entity: "movie",
          term: "Singin in the Rain",
          expectedTitle: "Singin' in the Rain",
          wikipediaPageTitle: "Singin' in the Rain"
        },
        imageFit: "cover",
        tags: ["Film", "Classic", "Musical"],
        description: "Also see Babylon.",
        details: ["One of my favorite classics."]
      },
      {
        section: "films",
        slug: "major-payne",
        title: "Major Payne (1995)",
        subtitle: "★★★★",
        publicMediaLookup: {
          provider: "wikipedia",
          entity: "movie",
          term: "Major Payne",
          expectedTitle: "Major Payne",
          wikipediaPageTitle: "Major Payne"
        },
        imageFit: "cover",
        tags: ["Film", "Comedy"],
        description: "I can probably recite this movie line for line.",
        details: ["A personal throwback favorite."]
      },
      {
        section: "films",
        slug: "social-network",
        title: "The Social Network (2010)",
        subtitle: "★★★★½",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/The_Social_Network_film_poster.png/500px-The_Social_Network_film_poster.png",
        imageAlt: "The Social Network poster",
        publicMediaLookup: {
          provider: "wikipedia",
          entity: "movie",
          term: "The Social Network",
          expectedTitle: "The Social Network",
          wikipediaPageTitle: "The Social Network"
        },
        imageFit: "cover",
        tags: ["Film", "Rewatch"],
        description: "I just think it’s a really strong rewatch.",
        details: ["The pacing is my favorite part."]
      }
    ]
  },
  {
    key: "objects",
    title: "Objects & Tech",
    intro: "Tools and physical systems that influence how I evaluate product quality and craft.",
    items: [
      {
        section: "objects",
        slug: "omnisphere-fl-studio",
        title: "Omnisphere in FL Studio",
        subtitle: "Sound Design Plugin",
        imageUrl: "https://images.musicstore.de/images/1280/spectrasonics-omnisphere-2-_1_PCM0013600-000.jpg",
        imageAlt: "Omnisphere in FL Studio setup",
        imageFit: "cover",
        tags: ["Audio", "Production"],
        description: "Has everything anyone could need for music production.",
        details: ["A core part of my music workflow."]
      },
      {
        section: "objects",
        slug: "unicomp-model-m-2006",
        title: "Unicomp Model M",
        subtitle: "Buckling Spring Keyboard",
        imageUrl: "https://static.mercdn.net/item/detail/orig/photos/m82763767793_1.jpg?1692341160",
        imageAlt: "Unicomp Model M keyboard",
        imageFit: "cover",
        tags: ["Keyboard", "Hardware"],
        description: "Vintage design. Timeless experience.",
        details: ["Great feel and reliability for everyday use."]
      },
      {
        section: "objects",
        slug: "bic-clear-mechanical-pencils",
        title: "BIC Mechanical Pencils (clear case)",
        subtitle: "Simple Daily Writing Tool",
        imageUrl: "https://m.media-amazon.com/images/I/51OYgSP+1FL.jpg",
        imageAlt: "Clear-case BIC mechanical pencils",
        imageFit: "cover",
        tags: ["Stationery", "Daily"],
        description: "The best mechanical pencils I've ever used.",
        details: ["Always in my bag or on my desk."]
      }
    ]
  },
  {
    key: "vintage",
    title: "Vintage Clothing Pieces",
    intro: "A collection of my favorite vintage pieces and finds I own.",
    items: [
      {
        section: "vintage",
        slug: "number-nine-tee",
        title: "Number (N)ineCharles Manson Skull Tee",
        subtitle: "2006 [~$200]",
        imageUrl: "https://image.reversible.com/offer/641d15915fdf03c36fd370b9caedc6fe",
        imageAlt: "Charles Manson Skull Tee",
        imageFit: "cover",
        tags: ["Number (N)ine", "2000s", "Vintage"],
        description: "A standout piece from Number (N)ine's S/S 2006 collection.",
        details: ["A replacement piece for my original 1993 tee I sold."]
      },
      {
        section: "vintage",
        slug: "led-zeppelin-wizard-tee",
        title: "Led Zeppelin Wizard Tee",
        subtitle: "1992 [~$200]",
        imageUrl: "https://media.karousell.com/media/photos/products/2024/8/28/1992_led_zeppelin_wizard_aop_v_1724840858_2dd9a29d_progressive.jpg",
        imageAlt: "Led Zeppelin Wizard Tee",
        imageFit: "cover",
        tags: ["Led Zeppelin", "90s", "Vintage"],
        description: "The most unique and detailed Led Zeppelin tee I've seen.",
        details: ["One of my five Led Zeppelin tees, but the only one I will keep forever."]
      },
      {
        section: "vintage",
        slug: "liquid-blue-dragon-tee",
        title: "Liquid Blue AOP Dragon vs. Knight Tee",
        subtitle: "1993 [~$150]",
        imageUrl: "https://image.reversible.com/offer/7486decfe16ff4b331b19be3691c3b899fb7b68c86b9b61035cf33d3e27866e4",
        imageAlt: "Liquid Blue Dragon Tee",
        imageFit: "cover",
        tags: ["Liquid Blue", "90s", "Vintage"],
        description: "When print and material quality were at their peak.",
        details: ["My second one of these after selling my thrashed one in 2021."]
      }
    ]
  },
  {
    key: "curiosities",
    title: "Curiosities",
    intro: "Themes I keep coming back to across creation, interaction design, systems, and human behavior.",
    items: [
      {
        section: "curiosities",
        slug: "music-creative-interfaces",
        title: "Music & Creative Interfaces",
        subtitle: "Creation, agency, and flow over passive consumption",
        icon: faMusic,
        imageAlt: "Music and creative interface curiosity placeholder",
        imageFit: "cover",
        tags: ["Creative Systems", "Interaction"],
        description: "I enjoy how music creation feels active and immersive compared to passive listening.",
        details: [
          "I keep studying how agency and flow state change the experience of making something.",
          "I care a lot about making creative tools intuitive and fun."
        ]
      },
      {
        section: "curiosities",
        slug: "experimental-interaction-ux",
        title: "Experimental Interaction & UX",
        subtitle: "Memorable interfaces, tactile patterns, and perspective-aware design",
        icon: faFlask,
        imageAlt: "Experimental UX curiosity placeholder",
        imageFit: "cover",
        tags: ["UX", "Interaction"],
        description: "I care about experiences that feel fun and stick in memory.",
        details: [
          "I’m constantly exploring where to balance simplicity and depth.",
          "I’m especially interested in personalization and how it changes perception."
        ]
      },
      {
        section: "curiosities",
        slug: "nostalgic-physical-vintage-tech",
        title: "Nostalgic / Physical / Vintage Tech",
        subtitle: "Why older tactile devices feel more satisfying",
        icon: faMicrochip,
        imageAlt: "Vintage tech curiosity placeholder",
        imageFit: "cover",
        tags: ["Vintage Tech", "Tactile"],
        description: "I really like old tech that feels physical and real to use.",
        details: [
          "I care about how texture, feedback, and physicality shape user emotion.",
          "I see tech as expression, not only utility."
        ]
      },
      {
        section: "curiosities",
        slug: "systems-thinking-optimization",
        title: "Systems Thinking & Optimization",
        subtitle: "Modeling real systems and finding inefficiencies",
        icon: faDiagramProject,
        imageAlt: "Systems optimization curiosity placeholder",
        imageFit: "cover",
        tags: ["Systems", "Optimization"],
        description: "I like finding weak points in systems and figuring out better ways to run them.",
        details: [
          "I’m curious about the relationship between individual agency and system constraints.",
          "I’m drawn to problems where better coordination creates large gains."
        ]
      },
      {
        section: "curiosities",
        slug: "psychology-human-behavior",
        title: "Psychology & Human Behavior",
        subtitle: "Perspective, memory, authenticity, and cognitive limits",
        icon: faBrain,
        imageAlt: "Psychology and behavior curiosity placeholder",
        imageFit: "cover",
        tags: ["Psychology", "Behavior"],
        description: "I’m interested in what makes experiences feel personal and authentic.",
        details: [
          "I often think about nature vs nurture and where human limits come from.",
          "I keep exploring why creation feels fundamentally different from passive consumption."
        ]
      },
      {
        section: "curiosities",
        slug: "media-personal-interests",
        title: "Media & Personal Interests",
        subtitle: "Music, films, collectibles, and rotating obsessions",
        icon: faPhotoFilm,
        imageAlt: "Media and personal interests curiosity placeholder",
        imageFit: "cover",
        tags: ["Media", "Collecting"],
        description: "I like curating music, movies, vintage clothing, and whatever I’m currently into.",
        details: [
          "This section rotates over time as new interests become recurring themes.",
          "Right now the strongest overlap is between AI, UX, and creative tooling."
        ]
      }
    ]
  }
];

export function getPersonalSections() {
  return personalInterestSections;
}

function withSourceLink(item: PersonalInterestItem, sourceLabel: string, sourceUrl?: string) {
  if (!sourceUrl) {
    return item;
  }

  const existing = item.links ?? [];
  if (existing.some((link) => link.href === sourceUrl)) {
    return item;
  }

  return {
    ...item,
    links: [{ label: sourceLabel, href: sourceUrl }, ...existing]
  };
}

function buildSpotifySearchUrl(item: PersonalInterestItem) {
  const artistHint = item.publicMediaLookup?.expectedArtist;
  const query = [artistHint, item.title].filter(Boolean).join(" ").trim();

  if (!query) {
    return undefined;
  }

  return `https://open.spotify.com/search/${encodeURIComponent(query)}`;
}

async function enrichPersonalItemMedia(item: PersonalInterestItem): Promise<PersonalInterestItem> {
  if (!item.publicMediaLookup) {
    return item;
  }

  let apiResult = null;

  if (item.publicMediaLookup.provider === "itunes") {
    if (item.publicMediaLookup.entity === "song" || item.publicMediaLookup.entity === "album") {
      apiResult = await fetchDeezerMedia(item.publicMediaLookup.term, item.publicMediaLookup.entity, {
        expectedTitle: item.publicMediaLookup.expectedTitle ?? item.title,
        expectedArtist: item.publicMediaLookup.expectedArtist
      });

      if (!apiResult) {
        apiResult = await fetchItunesMedia(item.publicMediaLookup.term, item.publicMediaLookup.entity, {
          expectedTitle: item.publicMediaLookup.expectedTitle ?? item.title,
          expectedArtist: item.publicMediaLookup.expectedArtist
        });
      }
    }
  }

  if (item.publicMediaLookup.provider === "wikipedia" && item.publicMediaLookup.entity === "movie") {
    apiResult = await fetchWikipediaMovie(item.publicMediaLookup.term, {
      expectedTitle: item.publicMediaLookup.expectedTitle ?? item.title,
      wikipediaPageTitle: item.publicMediaLookup.wikipediaPageTitle
    });
  }

  if (!apiResult) {
    return item;
  }

  const normalizedTitle = item.title;
  const normalizedSubtitle = item.subtitle;

  const merged = {
    ...item,
    title: normalizedTitle,
    subtitle: normalizedSubtitle,
    spotifyUrl: item.spotifyUrl ?? (item.section === "music" ? buildSpotifySearchUrl(item) : undefined),
    imageUrl: item.imageUrl ?? apiResult.imageUrl,
    imageAlt: apiResult.imageAlt ?? item.imageAlt,
    details: item.details.slice(0, 2),
    tags: item.tags.slice(0, 2)
  };

  return withSourceLink(merged, apiResult.sourceLabel, apiResult.externalUrl);
}

export async function getPersonalSectionsWithMedia() {
  const enrichedSections = await Promise.all(
    personalInterestSections.map(async (section) => {
      const items = await Promise.all(section.items.map((item) => enrichPersonalItemMedia({ ...item })));

      return {
        ...section,
        items
      };
    })
  );

  return enrichedSections;
}

export async function getPersonalItemWithMedia(section: PersonalInterestSectionKey, slug: string) {
  const match = getPersonalItem(section, slug);

  if (!match) {
    return undefined;
  }

  return enrichPersonalItemMedia({ ...match });
}

export function getPersonalSection(key: PersonalInterestSectionKey) {
  return personalInterestSections.find((section) => section.key === key);
}

export function getPersonalItem(section: PersonalInterestSectionKey, slug: string) {
  return getPersonalSection(section)?.items.find((item) => item.slug === slug);
}

export function isPersonalSectionKey(value: string): value is PersonalInterestSectionKey {
  return value === "music" || value === "films" || value === "objects" || value === "curiosities" || value === "vintage";
}

export function getAllPersonalItems(): PersonalInterestItem[] {
  return personalInterestSections.flatMap((section) => section.items);
}
