const YouTubePlayer = ({ videoURL }) => (
  <div className="player-container">
    <iframe
      src={videoURL}
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
);

export default YouTubePlayer;
