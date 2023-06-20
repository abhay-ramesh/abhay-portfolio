import Script from "next/script";
import { isProduction } from "./isProduction";

export function GoogleAnalytics() {
  if (!isProduction) return null;
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-4YTYN4Y7NB"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', 'G-4YTYN4Y7NB');
          `}
      </Script>
    </>
  );
}
