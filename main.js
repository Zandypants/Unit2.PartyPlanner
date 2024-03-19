// State
// define some state to store event info
const state = {
  events: [],
};

// References
const allEventsSection = document.querySelector("#allEvents");

// fetch event info from API (asynchronously)
async function getEvents () {
  try {
    const fetchedEvents = await fetch("https://fsa-crud-2aa9294fe819.herokuapp.com/api/2402-FTB-ET-WEB-FT/events");
    // parse to json
    const json = await fetchedEvents.json();
    // store json data in state
    state.events = json.data;
    console.log(state.events);
  } catch (error) {
    console.log("Error caught:", error);
  }
}

getEvents();

// render state to screen
  // choose tag to use for each event (or split details from event into separate tags for styling purposes?)
  // create DOM elements
  // add state objects values to relevant tags
  // add all DOM elements to the page at once
