import Link from "next/link";

const Banner = ({
  preHeading,
  preHeadingLink,
  heading,
  subHeading,
  background
}) => (
  <section
    id="banner"
    className="style2"
    style={background && { backgroundImage: `url(${background})` }}
  >
    <div className="inner">
      {preHeading && (
        <Link href={preHeadingLink}>
          <a className="pre-header h3">{preHeading}</a>
        </Link>
      )}
      <header className="major">
        <h1>{heading}</h1>
      </header>
      <div className="content">
        <p>{subHeading}</p>
      </div>
    </div>
  </section>
);

export default Banner;
