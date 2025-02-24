export interface Asset {
  id: number;
  name: string;
  location: string;
  type: 'wind' | 'solar';
  status: 'Online' | 'Offline' | 'Maintenance';
  power: string;
} 