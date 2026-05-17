import { HeroGreeting } from "@/components/home/hero-greeting";
import { DailyKeyword } from "@/components/home/daily-keyword";
import { QuoteCard } from "@/components/home/quote-card";
import { TodayMealsCard } from "@/components/home/today-meals-card";
import { TodayTrainingCard } from "@/components/home/today-training-card";
import { JournalFab } from "@/components/home/journal-fab";

export default function HomePage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <HeroGreeting />

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-5">
          <DailyKeyword />
          <QuoteCard />
        </div>
        <div className="lg:col-span-7 space-y-5">
          <TodayMealsCard />
          <TodayTrainingCard />
        </div>
      </div>

      <JournalFab />
    </div>
  );
}
