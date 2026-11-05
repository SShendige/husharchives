import { PrismaClient, DiscoveryStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Admin User — only created if none exists yet.
  //    We NEVER reset or overwrite an existing admin's password.
  //    On first-time setup, read ADMIN_SEED_PASSWORD from the environment.
  //    If it is not set, generate a random one and print it once — it is
  //    never stored in source code.
  const existingAdmin = await prisma.adminUser.findFirst();
  if (!existingAdmin) {
    const adminEmail = "admin@husharchive.com";
    const seedPassword =
      process.env.ADMIN_SEED_PASSWORD ?? crypto.randomBytes(16).toString("hex");
    const passwordHash = await bcrypt.hash(seedPassword, 12);

    await prisma.adminUser.create({
      data: { email: adminEmail, passwordHash },
    });

    console.log("─────────────────────────────────────────────────────");
    console.log("[SEED] Admin account created for first-time setup.");
    console.log(`       Email   : ${adminEmail}`);
    console.log(`       Password: ${seedPassword}`);
    console.log("       Save this password now — it will not be shown again.");
    console.log("─────────────────────────────────────────────────────");
  } else {
    console.log(
      `Admin user already exists (${existingAdmin.email}). Password left unchanged.`
    );
  }

  // 2. Categories
  const categoriesData = [
    {
      name: "Digital Experiments",
      slug: "digital-experiments",
      description:
        "Interactive sandboxes, creative WebGL shaders, audiovisual generators, and computational curiosities that push the frontier of modern browsers.",
      imageUrl:
        "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Hidden Websites",
      slug: "hidden-websites",
      description:
        "Enigmatic digital realms, surreal secret portals, eccentric micro-sites, and curious corners of the web overlooked by mainstream algorithms.",
      imageUrl:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Learn Something",
      slug: "learn-something",
      description:
        "Illuminating visual essays, interactive explanations, cosmic timelines, and exploratory encyclopaedias designed to spark genuine wonder.",
      imageUrl:
        "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Internet Playground",
      slug: "internet-playground",
      description:
        "Playful micro-games, tactile digital toys, kinetic simulations, and delightfully useless creations crafted purely for joy.",
      imageUrl:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Indie Creations",
      slug: "indie-creations",
      description:
        "Artisanal solo-developer projects, unconventional homepages, digital gardens, and boutique webcraft crafted with singular devotion.",
      imageUrl:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Digital Archives",
      slug: "digital-archives",
      description:
        "Living repositories of computing history, ephemeral net art, obsolete operating systems, and forgotten digital culture.",
      imageUrl:
        "https://images.unsplash.com/photo-1507842229451-797199719627?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        imageUrl: cat.imageUrl,
      },
      create: cat,
    });
    categoryMap.set(cat.slug, record.id);
  }
  console.log(`Seeded ${categoriesData.length} categories.`);

  // 3. Discoveries
  const discoveriesData = [
    {
      archiveNumber: "FILE 0001",
      title: "Radio Garden",
      slug: "radio-garden",
      shortDescription:
        "A three-dimensional globe allowing you to explore thousands of live radio broadcasts from every timezone and latitude.",
      fullDescription:
        "Radio Garden turns the entire planet into an interactive radio receiver. By rotating a digital globe dotted with green signal nodes, visitors can tune in seamlessly to local radio broadcasts emanating live from remote islands, mega-cities, alpine valleys, and coastal communities. Created in Amsterdam by Studio Puckey and Moniker in collaboration with the Netherlands Institute for Sound and Vision, it serves as a tactile antidote to border-bound perception.",
      whyInteresting:
        "It transforms sound into geography. Rather than algorithmic feeds based on your listening habits, Radio Garden grounds music, talk, and language in real physical place, offering an uncurated slice of world life as it happens right now.",
      whatToExplore:
        "Rotate to the Arctic Circle in Tromsø, Norway, tune into community broadcast radio stations in the South Pacific, or listen to late-night call-in shows across the African Sahel.",
      websiteUrl: "https://radio.garden",
      imageUrl:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
      categorySlug: "digital-experiments",
      tags: ["Radio", "Audio", "3D Globe", "Cartography", "Live Broadcast"],
      isFeatured: true,
      status: DiscoveryStatus.PUBLISHED,
      publishedAt: new Date("2026-01-15T10:00:00Z"),
    },
    {
      archiveNumber: "FILE 0002",
      title: "The Library of Babel",
      slug: "library-of-babel",
      shortDescription:
        "A digital realization of Borges' mythical universe containing every possible combination of 410-page books.",
      fullDescription:
        "Inspired by Argentine author Jorge Luis Borges' 1941 short story, developer Jonathan Basile created a universal digital library that contains every permutation of 25 characters (22 lowercase letters, comma, period, and space). Each 410-page book is indexed algorithmically. Because every combination exists, the library holds the true story of your life, the cure for every disease, every lost poem of Sappho, and billions of pages of pure gibberish.",
      whyInteresting:
        "It turns a metaphysical paradox into a deterministic web application. Basile's pseudorandom algorithm generates pages instantaneously based on coordinate addresses, making the infinite library browseable in seconds.",
      whatToExplore:
        "Use the search tool to find your exact name, or input an obscure phrase to discover the precise hexagon, wall, shelf, and volume where your sentence was preordained.",
      websiteUrl: "https://libraryofbabel.info",
      imageUrl:
        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
      categorySlug: "hidden-websites",
      tags: ["Literature", "Philosophy", "Infinite", "Algorithmic", "Borges"],
      isFeatured: true,
      status: DiscoveryStatus.PUBLISHED,
      publishedAt: new Date("2026-01-18T14:30:00Z"),
    },
    {
      archiveNumber: "FILE 0003",
      title: "Slow Roads",
      slug: "slow-roads",
      shortDescription:
        "A procedurally generated, endless scenic driving simulator operating completely inside modern WebGL.",
      fullDescription:
        "Slow Roads is a meditative browser-based driving game developed by Anslo. Built using Three.js and custom procedural terrain algorithms, the experience drops players onto endless highways meandering across serene hills, autumn forests, and snow-capped mountain ridges. There is no destination, timer, or opponent—just continuous motion, shifting seasons, and ambient lighting.",
      whyInteresting:
        "It represents a monumental feat of browser-side procedural generation. Running smoothly at 60 FPS without downloading gigabytes of assets, it proves the web browser can serve as an immersive aesthetic canvas.",
      whatToExplore:
        "Switch between vehicle types (roadster, heavy hauler, motorcycle), toggle cruise control or autonomous auto-pilot, and adjust the seasonal color grading between golden autumn and silent winter.",
      websiteUrl: "https://slowroads.io",
      imageUrl:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
      categorySlug: "digital-experiments",
      tags: ["WebGL", "Three.js", "Procedural", "Simulator", "Ambient"],
      isFeatured: true,
      status: DiscoveryStatus.PUBLISHED,
      publishedAt: new Date("2026-01-22T08:15:00Z"),
    },
    {
      archiveNumber: "FILE 0004",
      title: "The Deep Sea (Neal.fun)",
      slug: "the-deep-sea",
      shortDescription:
        "An interactive scroll down the ocean trench exploring the bizarre creatures and crushing pressures of the abyss.",
      fullDescription:
        "Created by creative technologist Neal Agarwal, 'The Deep Sea' lets visitors scroll down through oceanic zones from the sunlit surface to the Hadal depths of the Challenger Deep (10,928 metres). As you descend, the ambient light fades to pitch darkness, ambient pressure readouts escalate, and increasingly alien bioluminescent organisms appear at their real biological depths.",
      whyInteresting:
        "It uses web scrolling physics as a visceral metaphor for physical depth and underwater pressure, educating through pacing, visual silence, and scale.",
      whatToExplore:
        "Keep scrolling past the realm of scuba divers and blue whales to reach the benthic depth where deep-sea snailfish survive under water pressures equivalent to an elephant standing on your thumb.",
      websiteUrl: "https://neal.fun/deep-sea/",
      imageUrl:
        "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1200&q=80",
      categorySlug: "learn-something",
      tags: ["Oceanography", "Interactive", "Scroll", "Education", "Biology"],
      isFeatured: true,
      status: DiscoveryStatus.PUBLISHED,
      publishedAt: new Date("2026-02-01T12:00:00Z"),
    },
    {
      archiveNumber: "FILE 0005",
      title: "Pointer Pointer",
      slug: "pointer-pointer",
      shortDescription:
        "A surreal web artifact that precisely finds a photograph of someone pointing directly at your cursor position.",
      fullDescription:
        "Created by Studio Moniker, Pointer Pointer is one of the early legendaries of weird net culture. No matter where you position your mouse cursor on the screen and stop moving, the system pauses, searches its crowdsourced repository of thousands of real party and snapshot photos, and displays a person pointing their index finger right at your mouse pointer.",
      whyInteresting:
        "It combines an absurd premise with an obsessively compiled coordinate database. It creates an uncanny sensation of being witnessed across time by strangers in faded photographs.",
      whatToExplore:
        "Place your cursor at extreme screen corners, along the borders, or right in the exact centre to test how meticulously the collection covers coordinates.",
      websiteUrl: "https://pointerpointer.com",
      imageUrl:
        "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?auto=format&fit=crop&w=1200&q=80",
      categorySlug: "internet-playground",
      tags: ["Humor", "Surreal", "Interactive", "Web Art", "Mouse"],
      isFeatured: false,
      status: DiscoveryStatus.PUBLISHED,
      publishedAt: new Date("2026-02-05T16:45:00Z"),
    },
    {
      archiveNumber: "FILE 0006",
      title: "WindowSwap",
      slug: "window-swap",
      shortDescription:
        "Open a window anywhere on Earth and watch quiet video moments recorded from strangers' bedrooms and balconies.",
      fullDescription:
        "Created during global lockdowns by Sonali Ranjit and Vaishnav Balasubramaniam, WindowSwap invites participants worldwide to share 10-minute HD video clips showing the view from their real window, accompanied by the natural sounds of rain, birdsong, city traffic, or distant waves. With a single click, you are instantly gazing out over a balcony in Buenos Aires, a misty alley in Kyoto, or a farm in Scotland.",
      whyInteresting:
        "It restores gentle, ambient travel without the hyperactive velocity of social media. It celebrates quiet, mundane intimacy and the shared experience of shelter.",
      whatToExplore:
        "Click 'Open a new window somewhere in the world' to cycle randomly across domestic vistas, listening closely for local birds and morning conversations.",
      websiteUrl: "https://www.window-swap.com",
      imageUrl:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      categorySlug: "hidden-websites",
      tags: ["Ambient", "Global", "Video", "Mindfulness", "Travel"],
      isFeatured: true,
      status: DiscoveryStatus.PUBLISHED,
      publishedAt: new Date("2026-02-10T11:20:00Z"),
    },
    {
      archiveNumber: "FILE 0007",
      title: "Scale of the Universe 2",
      slug: "scale-of-the-universe-2",
      shortDescription:
        "An interactive zoom slider spanning thirty orders of magnitude from Planck length to the cosmic horizon.",
      fullDescription:
        "Developed by twin brothers Cary and Michael Huang when they were high school students, Scale of the Universe 2 allows visitors to zoom smoothly from the hypothetical fabric of spacetime (Planck length, 10^-35m) past atoms, cellular biology, organisms, planetary bodies, galaxies, up to the full observable universe (10^27m). Clicking any object reveals humorous and rigorous commentary.",
      whyInteresting:
        "Human intuition is notoriously ill-equipped to comprehend microscopic and astronomical scales. By placing everything on a single logarithmic slider, the project builds a palpable conceptual ladder for cosmic perspective.",
      whatToExplore:
        "Compare the size of a virus against a bacterium, inspect the size of Minecraft worlds compared to Neptune, and observe the titanic proportions of supergiant stars like Stephenson 2-18.",
      websiteUrl: "https://scaleofuniverse.com",
      imageUrl:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      categorySlug: "learn-something",
      tags: ["Astrophysics", "Quantum", "Interactive Scale", "Logarithmic", "Science"],
      isFeatured: false,
      status: DiscoveryStatus.PUBLISHED,
      publishedAt: new Date("2026-02-14T09:00:00Z"),
    },
    {
      archiveNumber: "FILE 0008",
      title: "Poolsuite FM",
      slug: "poolsuite-fm",
      shortDescription:
        "An ultra-nostalgic retro-Macintosh summer audio player streaming yacht rock, poolside disco, and vintage sunwaves.",
      fullDescription:
        "Originally launched as Poolside FM by Marty Bell, Poolsuite FM wraps an expertly curated stream of breezy 80s boogie, French house, and feel-good disco in a pixel-perfect emulation of a classic Macintosh System 7 desktop interface, complete with retro menu bars, monochrome iconography, and looping CRT summer video clips.",
      whyInteresting:
        "It demonstrates how skeuomorphism and nostalgic art direction can infuse web applications with tangible emotional resonance and mood.",
      whatToExplore:
        "Switch between daytime 'Poolsuite Breeze' and midnight 'Tokyo Disco' playlists, change the retro window UI themes, and enjoy the nostalgic visualizers.",
      websiteUrl: "https://poolsuite.net",
      imageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      categorySlug: "indie-creations",
      tags: ["Music", "Retro", "Macintosh", "Skeuomorphism", "Curation"],
      isFeatured: true,
      status: DiscoveryStatus.PUBLISHED,
      publishedAt: new Date("2026-02-18T19:30:00Z"),
    },
    {
      archiveNumber: "FILE 0009",
      title: "Oldweb.today",
      slug: "oldweb-today",
      shortDescription:
        "Live emulation of archaic web browsers accessing historical internet archives inside your modern browser.",
      fullDescription:
        "Oldweb.today lets users surf the web through genuine emulated legacy software—including early versions of Mosaic, Netscape Navigator, Internet Explorer 4, and retro Mac OS browsers—pulling web snapshots from the Internet Archive, Bibliotheca Alexandrina, and memory institutions worldwide.",
      whyInteresting:
        "Web history is not just about preserved HTML; it is fundamentally about how that code was rendered and experienced through historical interface constraints and modem latency.",
      whatToExplore:
        "Launch Netscape Navigator 3.0 on Windows 95, navigate to early 1996 Yahoo or Apple, and hear the simulated dial-up modem audio handshake.",
      websiteUrl: "https://oldweb.today",
      imageUrl:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
      categorySlug: "digital-archives",
      tags: ["Emulation", "Net History", "Netscape", "Wayback", "Web Preservation"],
      isFeatured: false,
      status: DiscoveryStatus.PUBLISHED,
      publishedAt: new Date("2026-02-22T14:10:00Z"),
    },
    {
      archiveNumber: "FILE 0010",
      title: "Astronomy Picture of the Day Archive",
      slug: "apod-archive",
      shortDescription:
        "A legendary thirty-year continuous archive of celestial photography paired with professional astronomer explanations.",
      fullDescription:
        "Curated by NASA astrophysicists Robert Nemiroff and Jerry Bonnell since June 16, 1995, APOD is one of the longest continuously running daily archives on the World Wide Web. Its raw HTML layout has remained virtually unchanged for three decades, yet it remains the preeminent daily window into interstellar exploration.",
      whyInteresting:
        "It stands as a timeless monument to the unadorned, hyper-durable 1990s web. While web frameworks rose and fell, APOD kept publishing every single dawn without disruption.",
      whatToExplore:
        "Browse the calendar archive back to mid-1995 to inspect how telescope optics, space probes, and cosmic understanding evolved across three decades.",
      websiteUrl: "https://apod.nasa.gov/apod/archivepix.html",
      imageUrl:
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80",
      categorySlug: "digital-archives",
      tags: ["NASA", "Cosmos", "Archive", "Space", "Photography"],
      isFeatured: false,
      status: DiscoveryStatus.PUBLISHED,
      publishedAt: new Date("2026-02-25T07:45:00Z"),
    },
    {
      archiveNumber: "FILE 0011",
      title: "EarthCam Live Streams",
      slug: "earthcam",
      shortDescription:
        "A global network of high-definition live camera feeds peering into remote vistas, bustling cities, and oceanic lighthouses.",
      fullDescription:
        "EarthCam operates an extensive network of outdoor video cameras broadcasting uninterrupted views of planetary life. From the stormy tip of Cape Hatteras to the quiet shrines of Kyoto and the neon canyon of Shibuya, it provides a hypnotic, ambient real-time link to physical existence outside your room.",
      whyInteresting:
        "Live webcams are among the purest artifacts of the early open internet: unscripted, non-performative, and persistently real.",
      whatToExplore:
        "Switch between live weather cams during Atlantic hurricanes, watch snowfall in the Swiss Alps, or view the slow rhythmic wake of ships navigating the Panama Canal.",
      websiteUrl: "https://www.earthcam.com",
      imageUrl:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      categorySlug: "hidden-websites",
      tags: ["Webcams", "Earth", "Livestream", "Ambient", "Geography"],
      isFeatured: false,
      status: DiscoveryStatus.PUBLISHED,
      publishedAt: new Date("2026-03-01T10:00:00Z"),
    },
    {
      archiveNumber: "FILE 0012",
      title: "Falling Sand Simulation",
      slug: "falling-sand-game",
      shortDescription:
        "A responsive cellular automata sandbox simulating particle interactions between sand, water, fire, oil, and acid.",
      fullDescription:
        "Originating in early 2000s browser gaming, falling sand games simulate complex physics using simple cellular automata rules. Each pixel acts as an independent particle following gravity, pressure, thermal dissipation, and chemical reactions. Players can draw with sand, pour water, light oil fires, and watch emergent chain reactions unfold in real-time.",
      whyInteresting:
        "It turns mathematical grid automata into an infinitely satisfying tactile canvas where simple local interaction rules create startlingly realistic natural phenomena.",
      whatToExplore:
        "Layer gunpowder beneath stone arches, drop sparks from above, and observe how gaseous fire creates explosive pressure waves across neighboring particle cells.",
      websiteUrl: "https://sandspiel.club",
      imageUrl:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      categorySlug: "digital-experiments",
      tags: ["Cellular Automata", "Physics", "Simulation", "Interactive", "Particles"],
      isFeatured: false,
      status: DiscoveryStatus.PUBLISHED,
      publishedAt: new Date("2026-03-05T15:20:00Z"),
    },
    {
      archiveNumber: "FILE 0013",
      title: "Unfolding Space (Draft)",
      slug: "unfolding-space-draft",
      shortDescription:
        "An experimental exploration of non-Euclidean digital architecture currently undergoing archival curation.",
      fullDescription:
        "A bespoke interactive experiment demonstrating higher-dimensional topological manifolds and non-Euclidean perspective inside modern WebGL. Currently under editorial review for full inclusion in the archive.",
      whyInteresting:
        "Challenges ordinary notions of screen geometry by warping space based on observer velocity.",
      whatToExplore: "Review draft parameters and inspect spatial deformation shaders.",
      websiteUrl: "https://example.com/unfolding-space",
      imageUrl:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      categorySlug: "digital-experiments",
      tags: ["Topology", "Geometry", "Experimental"],
      isFeatured: false,
      status: DiscoveryStatus.DRAFT,
      publishedAt: null,
    },
  ];

  for (const disc of discoveriesData) {
    const categoryId = categoryMap.get(disc.categorySlug);
    if (!categoryId) {
      console.warn(`Category not found for slug: ${disc.categorySlug}`);
      continue;
    }

    await prisma.discovery.upsert({
      where: { slug: disc.slug },
      update: {
        archiveNumber: disc.archiveNumber,
        title: disc.title,
        shortDescription: disc.shortDescription,
        fullDescription: disc.fullDescription,
        whyInteresting: disc.whyInteresting,
        whatToExplore: disc.whatToExplore,
        websiteUrl: disc.websiteUrl,
        imageUrl: disc.imageUrl,
        categoryId,
        tags: disc.tags,
        isFeatured: disc.isFeatured,
        status: disc.status,
        publishedAt: disc.publishedAt,
      },
      create: {
        archiveNumber: disc.archiveNumber,
        title: disc.title,
        slug: disc.slug,
        shortDescription: disc.shortDescription,
        fullDescription: disc.fullDescription,
        whyInteresting: disc.whyInteresting,
        whatToExplore: disc.whatToExplore,
        websiteUrl: disc.websiteUrl,
        imageUrl: disc.imageUrl,
        categoryId,
        tags: disc.tags,
        isFeatured: disc.isFeatured,
        status: disc.status,
        publishedAt: disc.publishedAt,
      },
    });
  }
  console.log(`Seeded ${discoveriesData.length} sample discoveries.`);

  // 4. Sample Newsletter Subscribers
  const sampleSubscribers = [
    "curator@husharchive.com",
    "wanderer@internet-curiosity.org",
  ];

  for (const email of sampleSubscribers) {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email, status: "ACTIVE" },
    });
  }
  console.log(`Seeded ${sampleSubscribers.length} sample newsletter subscribers.`);

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
