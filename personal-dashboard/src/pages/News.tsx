import { useState, useEffect } from "react";

const ALL_NEWS = [
  { id: 1, cat: "Tech", title: "OpenAI releases GPT-5 with groundbreaking multimodal reasoning", source: "TechCrunch", time: "2h ago", hot: true },
  { id: 2, cat: "Science", title: "NASA confirms water ice deposits near lunar south pole, paving way for Moon base", source: "NASA", time: "3h ago", hot: false },
  { id: 3, cat: "Tech", title: "Apple unveils Vision Pro 2 with revolutionary spatial computing features and 4K resolution", source: "Apple Insider", time: "4h ago", hot: true },
  { id: 4, cat: "Business", title: "S&P 500 reaches all-time high amid strong earnings season, tech stocks lead rally", source: "Reuters", time: "1h ago", hot: false },
  { id: 5, cat: "Health", title: "Researchers discover major breakthrough in Alzheimer's treatment using targeted gene therapy", source: "Nature", time: "5h ago", hot: true },
  { id: 6, cat: "Tech", title: "Google DeepMind's AlphaFold 3 predicts protein-protein interactions with 95% accuracy", source: "DeepMind", time: "6h ago", hot: false },
  { id: 7, cat: "World", title: "G7 nations agree on historic framework for AI governance, safety, and accountability", source: "BBC", time: "7h ago", hot: false },
  { id: 8, cat: "Science", title: "James Webb Space Telescope captures oldest galaxy ever observed, 13.5 billion light-years away", source: "ESA", time: "8h ago", hot: true },
  { id: 9, cat: "Business", title: "Electric vehicle sales surpass gasoline cars in Europe for the first time in automotive history", source: "Bloomberg", time: "2h ago", hot: false },
  { id: 10, cat: "Health", title: "New landmark study links gut microbiome diversity to significantly improved mental health outcomes", source: "Nature Medicine", time: "9h ago", hot: false },
  { id: 11, cat: "Tech", title: "Microsoft announces Copilot+ integration across all Windows 11 devices with AI-powered features", source: "The Verge", time: "3h ago", hot: true },
  { id: 12, cat: "World", title: "UN Climate Summit reaches binding agreement to limit global warming to 1.5°C by 2040", source: "Reuters", time: "10h ago", hot: true },
  { id: 13, cat: "Sports", title: "Record-breaking 100m sprint breaks world record at Tokyo World Athletics Championship", source: "ESPN", time: "1h ago", hot: false },
  { id: 14, cat: "Business", title: "Bitcoin surpasses $100K milestone for the first time amid institutional adoption wave", source: "CoinDesk", time: "4h ago", hot: true },
  { id: 15, cat: "Science", title: "Scientists develop room-temperature superconductor, potentially revolutionizing energy transmission", source: "Physical Review Letters", time: "11h ago", hot: true },
  { id: 16, cat: "Health", title: "FDA approves revolutionary mRNA cancer vaccine showing 90% efficacy in Phase 3 trials", source: "FDA.gov", time: "5h ago", hot: true },
  { id: 17, cat: "Tech", title: "SpaceX Starship completes first successful full reusability mission with precision landing", source: "SpaceX", time: "6h ago", hot: false },
  { id: 18, cat: "World", title: "Historic peace agreement signed between nations ending decade-long regional conflict", source: "Al Jazeera", time: "12h ago", hot: false },
  { id: 19, cat: "Sports", title: "FIFA announces 2030 World Cup expansion to 48 teams with global co-hosting format", source: "FIFA", time: "7h ago", hot: false },
  { id: 20, cat: "Business", title: "Amazon introduces same-hour drone delivery service across 50 major US cities", source: "Wall Street Journal", time: "8h ago", hot: false },
];

const CATEGORIES = ["All", "Tech", "Science", "Business", "Health", "World", "Sports"];

const catColors: Record<string, string> = {
  Tech: "bg-blue-500/20 text-blue-400",
  Science: "bg-purple-500/20 text-purple-400",
  Business: "bg-green-500/20 text-green-400",
  Health: "bg-red-500/20 text-red-400",
  World: "bg-yellow-500/20 text-yellow-400",
  Sports: "bg-orange-500/20 text-orange-400",
};

export default function News() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [nextRefresh, setNextRefresh] = useState(600);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setNextRefresh((prev) => {
        if (prev <= 1) {
          setLastRefresh(new Date());
          return 600;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filtered = selectedCat === "All" ? ALL_NEWS : ALL_NEWS.filter((n) => n.cat === selectedCat);
  const mins = Math.floor(nextRefresh / 60);
  const secs = nextRefresh % 60;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 fade-up">
          <div>
            <h2 className="text-2xl font-bold text-foreground">News</h2>
            <p className="text-muted-foreground text-sm">
              Last updated: {lastRefresh.toLocaleTimeString()} • Next refresh in {mins}:{secs.toString().padStart(2, "0")}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-xl px-3 py-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Auto-refresh in {mins}:{secs.toString().padStart(2, "0")}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-6 fade-up">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                selectedCat === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, i) => (
            <div key={item.id} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all fade-up group cursor-pointer" style={{ animationDelay: `${i * 30}ms` }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${catColors[item.cat] ?? ""}`}>{item.cat}</span>
                  {item.hot && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">🔥 Hot</span>}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.source}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
