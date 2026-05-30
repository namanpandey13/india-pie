import type { LoginProfile } from '@hausy/types';
import { city } from './events';

export const profile: LoginProfile = {
  id: 'demo-user',
  name: 'Naman Pandey',
  phone: '+91 98765 43210',
  city,
  instagram: '@naman.jpg',
  linkedin: 'linkedin.com/in/namanpandey',
  intent: 'Meet ambitious people offline without WhatsApp chaos',
  initials: 'NP',
};
