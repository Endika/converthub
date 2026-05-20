import { buildContainer, SERVICES } from './apps/web/di/setup';
import { HomePage } from './apps/web/ui/pages/HomePage';
import './apps/web/styles/index.css';
import type { UpdateExchangeRatesUseCase } from './contexts/exchange-rate/application/UpdateExchangeRatesUseCase';
import type { ExchangeRateService } from './contexts/exchange-rate/domain/services/ExchangeRateService';

const root = document.getElementById('app');
if (root === null) {
  throw new Error('Missing #app root element');
}

const container = buildContainer();
new HomePage(root, container);

const exchangeRateService = container.get<ExchangeRateService>(
  SERVICES.exchangeRateService,
);
if (exchangeRateService.needsUpdate()) {
  const updater = container.get<UpdateExchangeRatesUseCase>(
    SERVICES.updateExchangeRatesUseCase,
  );
  void updater.execute();
}

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL;
    void navigator.serviceWorker
      .register(`${base}sw.js`, { scope: base })
      .catch(() => {
        /* Service worker is optional — fail silently until vite-plugin-pwa is wired. */
      });
  });
}
