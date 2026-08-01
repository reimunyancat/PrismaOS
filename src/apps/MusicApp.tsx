import "./Music.css";

const PLAYLIST_ID = "6Qbk2CL38vTDw9OZw3cdWN?si=1c2a7eab383a4eb3";

export function MusicApp() {
  return (
    <div className="music">
      <div className="music__aurora" />
      <header className="music__bar">
        <span className="music__logo">prism.fm</span>
        <div className="music__eq" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </header>
      <div className="music__frame">
        <iframe
          title="Spotify player"
          src={`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?theme=0`}
          width="100%"
          height="100%"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
      </div>
      <footer className="music__hint">streaming via Spotify</footer>
    </div>
  );
}
