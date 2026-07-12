interface OfflineBannerProps {
  lastKnownTime?: string | null;
}

/** Banner indicating that the application is running in offline fallback mode. */
export function OfflineBanner({ lastKnownTime }: OfflineBannerProps): React.JSX.Element {
  return (
    <div className="offline-banner" role="status">
      <span className="offline-banner__icon" aria-hidden="true">⚠️</span>
      <span className="offline-banner__text">
        Offline — showing last known data {lastKnownTime ? `(from ${lastKnownTime})` : ''}
      </span>
    </div>
  );
}
