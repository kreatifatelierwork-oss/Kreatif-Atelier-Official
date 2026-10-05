/** Registers every journey and starts on the home page's. Import this before anything reads the route. */
import { registerJourney, setJourney } from "../route";
import { companies } from "./companies";
import { home } from "./home";

registerJourney(home);
for (const c of companies) registerJourney(c);
setJourney(home);

export { companies, home };
