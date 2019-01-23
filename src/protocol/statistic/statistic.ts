import { StatisticType } from './statistictype';

export interface Statistic {
  repertoireId: string,
  pgn: string,
  statisticType: StatisticType
}
