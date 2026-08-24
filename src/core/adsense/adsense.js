// Google AdSense site-wide integration.
// Replace the placeholder in each page's google-adsense-account meta tag.
(() => {
  const publisherId = document.querySelector('meta[name="google-adsense-account"]')?.content || "";
  if (!/^ca-pub-\d{10,}$/.test(publisherId) || document.querySelector("script[data-google-adsense]") || window.location.protocol === "file:") return;
  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.dataset.googleAdsense = "true";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(publisherId)}`;
  document.head.appendChild(script);
})();
