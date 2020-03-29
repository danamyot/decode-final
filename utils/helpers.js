import Link from "next/link";

export function arrayCapitalize(arr) {
  return arr.map(item => {
    if (typeof item !== "string") return item;
    return item.slice(0, 1).toUpperCase() + item.slice(1);
  });
}

export function generateDescription(overview, readMoreLink) {
  let formattedDesc;
  const descLength = 300;
  if (overview && overview.length > descLength) {
    formattedDesc = (
      <>
        <p>
          {overview.slice(0, descLength) + "..."}
          <br />
          <Link href={readMoreLink}>
            <a>Read More</a>
          </Link>
        </p>
      </>
    );
  } else {
    formattedDesc = <p>{overview}</p>;
  }
  return formattedDesc;
}
