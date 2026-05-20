export interface Translations {
  app_title: string;
  app_description: string;
  nav_currencies: string;
  nav_distance: string;
  nav_weight: string;
  nav_volume: string;
  nav_temperature: string;
  nav_speed: string;
  nav_sizes: string;
  nav_history: string;
  nav_favorites: string;
  nav_notes: string;
  nav_settings: string;
  common_from: string;
  common_to: string;
  common_swap: string;
  common_save: string;
  common_delete: string;
  common_clear: string;
  error_invalid_amount: string;
  error_invalid_currency: string;
  error_unsupported_language: string;
  offline_notice: string;
}

export type TranslationKey = keyof Translations;
