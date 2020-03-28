## Do this

- [x] axios for auth handling
- [ ] Better handling of external (TVDB/TRAKT) API errors
- [x] Capitalize genres in show page (front end)
- [ ] Episodes in a slider instead of season image in show info page - How to do this effeiciently, lots of episodes and images to load. New endpoint?
- [ ] Implement cache for backend requests, no fetching new data from APIs when it's already available locally. Will this scale when live?
- [ ] Add Next/Last episode for show info page
- [ ] Hide related shows if none found

## Questions

- [ ] What does `exportPathMap` do?
- [ ] Is the first page the only one that's truly rendered server-side?
- [ ] What is, and how do I set up CORS?
- [ ] How do I quickly get a show image in the front end? Example: random top 10 show image in the banner background.
- [ ] How do I handle errors in the backend and front end?
- [ ] How to fetch mutltiple endpoints that the page needs (ie. main show info first, and only after something like similar shows & extra data? for a smaller component) I want to keep the page render quick.
- [ ] getInitialProps and SWR, am I doing it wrong? Follow up to above

### Next Work

- [x] Axios
- [ ] Make smaller components for pages
