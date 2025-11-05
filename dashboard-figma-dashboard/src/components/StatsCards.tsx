import { Card } from "./ui/card";
import { Users, Clock, Activity, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/dashboardTranslations';
import type { L1Category } from '../utils/mockMoodData';

interface StatsCardsProps {
  total: number;
  percentages: {
    high_energy_pleasant: number;
    high_energy_unpleasant: number;
    low_energy_unpleasant: number;
    low_energy_pleasant: number;
  };
  averageIntensity: number;
  avgResponseTime: number;
}

export function StatsCards({ total, percentages, averageIntensity, avgResponseTime }: StatsCardsProps) {
  const { language } = useLanguage();
  const t = useTranslation(language);
  
  const pleasantPercentage = percentages.high_energy_pleasant + percentages.low_energy_pleasant;
  const unpleasantPercentage = percentages.high_energy_unpleasant + percentages.low_energy_unpleasant;
  const highEnergyPercentage = percentages.high_energy_pleasant + percentages.high_energy_unpleasant;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">{t('totalResponses')}</p>
            <h2 className="mt-2">{total}</h2>
          </div>
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">{t('pleasantMoods')}</p>
            <h2 className="mt-2">{pleasantPercentage}%</h2>
          </div>
          <TrendingUp className="h-8 w-8 text-green-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">{t('highEnergy')}</p>
            <h2 className="mt-2">{highEnergyPercentage}%</h2>
          </div>
          <Activity className="h-8 w-8 text-yellow-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">{t('avgIntensity')}</p>
            <h2 className="mt-2">{averageIntensity.toFixed(1)}</h2>
          </div>
          <Activity className="h-8 w-8 text-blue-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">{t('avgResponseTime')}</p>
            <h2 className="mt-2">{(avgResponseTime / 1000).toFixed(1)}s</h2>
          </div>
          <Clock className="h-8 w-8 text-purple-500" />
        </div>
      </Card>
    </div>
  );
}
