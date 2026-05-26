export function OrgJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MazadAuto",
    url: "https://mazadauto.tn",
    logo: "https://mazadauto.tn/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "contact@mazadauto.tn",
      availableLanguage: ["French", "Arabic"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "TN",
      addressLocality: "Tunis",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
