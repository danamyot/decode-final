import MissingImageSVG from "public/images/no-image.svg";

const ShowCard = ({ text, componentClass }) => (
  <div className={`image-element ${componentClass}`}>
    <div className="missing-image-placeholder">
      <MissingImageSVG />
      {text}
    </div>
  </div>
);

export default ShowCard;
