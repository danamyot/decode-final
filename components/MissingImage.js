import MissingImageSVG from "public/images/no-image.svg";

const ShowCard = ({ text }) => (
  <div className="image-element">
    <div className="missing-image-placeholder">
      <MissingImageSVG />
      {text}
    </div>
  </div>
);

export default ShowCard;
