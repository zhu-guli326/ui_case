const DESIGN_SYSTEM_DOMAINS = {
  claude:"claude.ai", cohere:"cohere.com", elevenlabs:"elevenlabs.io", minimax:"minimax.io", "mistral.ai":"mistral.ai",
  ollama:"ollama.com", "opencode.ai":"opencode.ai", replicate:"replicate.com", runwayml:"runwayml.com", "together.ai":"together.ai",
  voltagent:"voltagent.dev", "x.ai":"x.ai", cursor:"cursor.com", expo:"expo.dev", lovable:"lovable.dev", raycast:"raycast.com",
  superhuman:"superhuman.com", vercel:"vercel.com", warp:"warp.dev", clickhouse:"clickhouse.com", composio:"composio.dev",
  hashicorp:"hashicorp.com", mongodb:"mongodb.com", posthog:"posthog.com", sanity:"sanity.io", sentry:"sentry.io", supabase:"supabase.com",
  cal:"cal.com", intercom:"intercom.com", "linear.app":"linear.app", mintlify:"mintlify.com", notion:"notion.so", resend:"resend.com",
  zapier:"zapier.com", airtable:"airtable.com", clay:"clay.com", figma:"figma.com", framer:"framer.com", miro:"miro.com",
  webflow:"webflow.com", binance:"binance.com", coinbase:"coinbase.com", kraken:"kraken.com", mastercard:"mastercard.com",
  revolut:"revolut.com", stripe:"stripe.com", wise:"wise.com", airbnb:"airbnb.com", meta:"meta.com", nike:"nike.com",
  shopify:"shopify.com", starbucks:"starbucks.com", apple:"apple.com", hp:"hp.com", ibm:"ibm.com", nvidia:"nvidia.com",
  pinterest:"pinterest.com", playstation:"playstation.com", spacex:"spacex.com", spotify:"spotify.com", theverge:"theverge.com",
  uber:"uber.com", vodafone:"vodafone.com", wired:"wired.com", bmw:"bmw.com", "bmw-m":"bmw-m.com", bugatti:"bugatti.com",
  ferrari:"ferrari.com", lamborghini:"lamborghini.com", renault:"renault.com", tesla:"tesla.com", "dell-1996":"dell.com",
  "nintendo-2001":"nintendo.com"
};

export function faviconUrl(domain) {
  return domain ? `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(`https://${domain}`)}&sz=128` : "";
}

export function designSystemLogoUrl(item) {
  return faviconUrl(DESIGN_SYSTEM_DOMAINS[item?.slug]);
}

export function logoInitials(item, fallback = "DS") {
  const name = item?.name?.replace(/\([^)]*\)/g, "").trim() || "";
  const parts = name.split(/[\s.-]+/).filter(Boolean);
  return (parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0]?.slice(0, 2) || fallback).toUpperCase();
}

export function setLogo(node, { url, name, initials }) {
  if (!node) return;
  const image = node.querySelector("img");
  const fallback = node.querySelector("b");
  fallback.textContent = initials;
  image.alt = `${name} logo`;
  node.classList.toggle("is-fallback", !url);
  image.onload = () => node.classList.remove("is-fallback");
  image.onerror = () => node.classList.add("is-fallback");
  image.src = url;
}
