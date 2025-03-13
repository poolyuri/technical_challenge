class HistoryInfoKey {
  id: string;
}

export class HistoryEntity extends HistoryInfoKey {
  name: string;
  gender: string;
  birth_year: string;
  name_planet: string;
  climate: string;
  weather: string;
  createdAt?: number;
  updatedAt?: number;
}
