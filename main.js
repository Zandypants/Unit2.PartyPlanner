// <-- State -->
const state = {
  events: [],
};
const renderKeys = ["name", "date", "location", "description"];
let darkMode = true;

// <-- References -->
const cssRoot = document.querySelector(":root");
const allEventsSection = document.querySelector("#allEvents");
const colorModeButton = document.querySelector("#colorMode");

// <-- Events -->
if (colorModeButton) colorModeButton.onclick = switchMode;

// <-- Load page -->
renderEvents();

/** Fetches event info from API asynchronously */
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

// <-- Display -->
/** Adds state to the DOM in order to display on page */
function render () {
  const elements = state.events.map((event) => {
    const eventSection = createNode("section", "", {class: "containerEvent"});
    
    const subSectionTop = document.createElement("section");
    subSectionTop.appendChild(createNode("div", capitalizeWords(event.name), {class: "eventName"}));

    const date = new Date(event.date);
    const subSectionMid = createNode("section", "", {class: "containerCenter"});
    subSectionMid.replaceChildren(
      createNode("div", toClockTime(date.getHours(), date.getMinutes()), {class: "eventTime"}),
      createNode("div", date.toDateString(), {class: "eventDate"}),
      createNode("div", event.location, {class: "eventLocation"})
    );

    const subSectionBot = document.createElement("section");
    subSectionBot.appendChild(createNode("div", event.description, {class: "eventDescription"}));

    eventSection.replaceChildren(subSectionTop, subSectionMid, subSectionBot);
    return eventSection;
  });

  allEventsSection.replaceChildren(...elements);
}

/** Simple helper to provide one-call page load */
async function renderEvents() {
  await getEvents();
  render();
}

/** Switches between light and dark mode by modifying css variables */
function switchMode() {
  const modeNameFn = () => darkMode ? "dark" : "light";
  let modeName = modeNameFn();

  colorModeButton.style.setProperty("background-color", `var(--${modeName}Background)`);
  colorModeButton.style.setProperty("color", `var(--${modeName}Contrast)`);

  colorModeButton.innerText = `${capitalize(modeName)} Mode`;
  darkMode = !darkMode;
  
  modeName = modeNameFn();
  cssRoot.style.setProperty("--backgroundColor", `var(--${modeName}Background)`);
  cssRoot.style.setProperty("--contrastColor", `var(--${modeName}Contrast)`);
}

// <-- DOM helpers -->
/**
 * Creates a DOM node and modifies it using arguments
 * @param {string} tag (html) for element creation
 * @param {string} content to fill innerText with
 * @param {object} attributes for setAttribute(key, value);
 */
function createNode(tag, content, attributes) {
  const newElement = document.createElement(tag);
  newElement.innerText = content;
  for (key in attributes) {
    newElement.setAttribute(key, attributes[key]);
  }
  return newElement;
}

// <-- String manipulation -->
/**
 * @param {number} hours (military time)
 * @param {number} minutes
 * @returns {string} representing clock time
 */
function toClockTime(hours, minutes) {
  // minutes
  if (minutes < 10) minutes = "0" + minutes;
  // hours
  let suffix = "am";
  if (hours === 24) hours = 0;
  else if (hours >= 12) {
    suffix = "pm";
    if (hours !== 12) hours -= 12;
  }

  // combine
  return `${hours}:${minutes}${suffix}`;
}

/**
 * Returns a copy of the input word with the first letter capitalized
 * @param {string} word to be capitalized (first letter)
 * @returns {string} capitalized word
 */
function capitalize(word) {
  // validation
  if (typeof(word) !== "string" || word.length < 1) 
    return "";

  return word[0].toUpperCase() + word.slice(1);
}

/**
 * Returns a copy of the input sentence with the first letter of each (spaced) word capitalized
 * @param {string} sentence to parse into words then capitalize
 * @returns {string} sentence with capitalized words
 */
function capitalizeWords(sentence) {
  // validation
  if (typeof(sentence) !== "string" || sentence.length < 1) 
    return "";

  const words = sentence.split(' ');
  words.forEach((word, i) => words[i] = capitalize(word));
  return words.join(' ');
}