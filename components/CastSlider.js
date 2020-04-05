import Slider from "react-slick";

import ProfileSVG from "public/images/profile.svg";

import { BASE_TVDB_IMG_URL } from "config/dev.config.json";

const castSliderSettings = {
  infinite: false,
  slidesToShow: 6,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 980, // medium breakpoint
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4
      }
    },
    {
      breakpoint: 480, // xsmall breakpoint
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      }
    }
  ]
};

const CastSlider = ({ cast }) => (
  <div className="cast">
    <header className="major">
      <h2>Cast</h2>
    </header>
    <div className="cast-container">
      <Slider {...castSliderSettings}>
        {cast.map((castMember, i) => (
          <div key={i} className="cast-member">
            <div className="cast-member-img-container">
              {castMember.image ? (
                <div
                  style={{
                    backgroundImage: `URL(${BASE_TVDB_IMG_URL}/${castMember.image})`
                  }}
                  className="cast-member-img"
                ></div>
              ) : (
                <div className="cast-member-img default-img">
                  <ProfileSVG />
                </div>
              )}
            </div>
            <p className="cast-member-role" title={castMember.role}>
              {castMember.role}
            </p>
            <p className="cast-member-actor" title={castMember.name}>
              {castMember.name}
            </p>
          </div>
        ))}
      </Slider>
    </div>
  </div>
);

export default CastSlider;
