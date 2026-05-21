import { registerSW } from 'virtual:pwa-register';
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

registerSW({ immediate: true });

const versionTag = document.createElement('span');
versionTag.textContent = `v${__APP_VERSION__}`;
versionTag.className = 'app-version';
versionTag.setAttribute('aria-label', `ConvertHub version ${__APP_VERSION__}`);
document.body.appendChild(versionTag);
