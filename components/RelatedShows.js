import Slider from "react-slick";

import ShowCard from "components/ShowCard";

const relatedSliderSettings = {
  infinite: false,
  slidesToShow: 4,
  slidesToScroll: 4,
  responsive: [
    {
      breakpoint: 736, // small breakpoint
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      }
    },
    {
      breakpoint: 480, // xsmall breakpoint
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    }
  ]
};

const RelatedShows = ({ relatedShowsData }) => (
  <section id="four" className="related-shows">
    <div className="inner">
      <header className="major">
        <h2>Related Shows</h2>
      </header>
      <Slider {...relatedSliderSettings}>
        {relatedShowsData.map(show => (
          <div key={show.ids.trakt} className="related-show-slide">
            <ShowCard key={show.ids.trakt} show={show} />
          </div>
        ))}
      </Slider>

      <div className="show-card-container"></div>
    </div>
  </section>
);

export default RelatedShows;
