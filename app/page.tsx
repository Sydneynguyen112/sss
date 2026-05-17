import { HeroGreeting } from "@/components/home/hero-greeting";
import { DailyKeyword } from "@/components/home/daily-keyword";
import { QuoteCard } from "@/components/home/quote-card";
import { TodaySchedulePreview } from "@/components/home/today-schedule-preview";
import { DailyGoalsCard } from "@/components/home/daily-goals-card";
import { JournalFab } from "@/components/home/journal-fab";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <HeroGreeting />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <DailyKeyword />
          <QuoteCard />
        </div>
        <div className="space-y-6">
          <TodaySchedulePreview />
          <DailyGoalsCard />
        </div>
      </div>

      <JournalFab />
    </div>
  );
}
