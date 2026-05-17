import { HeroGreeting } from "@/components/home/hero-greeting";
import { DailyKeyword } from "@/components/home/daily-keyword";
import { QuoteCard } from "@/components/home/quote-card";
import { TodayMealsCard } from "@/components/home/today-meals-card";
import { TodayTennisCard } from "@/components/home/today-tennis-card";

export default function HomePage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <HeroGreeting />

      <div className="grid gap-5 lg:grid-cols-12 lg:grid-rows-2 lg:auto-rows-fr">
        <div className="lg:col-span-5 lg:row-start-1 flex">
          <DailyKeyword />
        </div>
        <div className="lg:col-span-7 lg:row-start-1 flex">
          <TodayMealsCard />
        </div>
        <div className="lg:col-span-5 lg:row-start-2 flex">
          <QuoteCard />
        </div>
        <div className="lg:col-span-7 lg:row-start-2 flex">
          <TodayTennisCard />
        </div>
      </div>
    </div>
  );
}
