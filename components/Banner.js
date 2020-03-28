const Banner = props => (
  <section
    id="banner"
    className="style2"
    style={props.background && { backgroundImage: `url(${props.background})` }}
  >
    <div className="inner">
      <header className="major">
        <h1>{props.heading}</h1>
      </header>
      <div className="content">
        <p>{props.subHeading}</p>
      </div>
    </div>
  </section>
);

export default Banner;
