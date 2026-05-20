declare const __VERSION__: string;

const appRoot = document.getElementById('app');

if (appRoot !== null) {
  appRoot.innerHTML = `<p>ConvertHub v${__VERSION__} — bootstrap</p>`;
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js', { scope: '/' });
  });
}
