const READ_TEXT = 'Читати';
const EMPTY_TEXT = ' ';
const BUTTONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'T', 'V', 'S', EMPTY_TEXT, READ_TEXT];

const BUTTON_TAG_NAME = document.createElement("button").tagName;

async function init() {
  const mainSection = document.querySelector("section[name=main]");
  const notFoundSection = document.querySelector("section[name=not-found]");
  const storySection = document.querySelector("section[name=story]");
  const keyboard = document.querySelector(".keyboard");
  const entryDisplay = document.querySelector(".entry-display");

  notFoundSection.querySelector("button").addEventListener("click", () => {
    location.hash = "";
  }); 
  storySection.querySelector("button").addEventListener("click", () => {
    location.hash = "";
  });

  let storyId = "";

  const stories = jsyaml.loadAll(await(await fetch("/near-and-far/stories.yaml")).text());

  BUTTONS.forEach((symbol) => {
    const key = document.createElement("button");
    key.value = symbol;
    key.textContent = symbol;
    keyboard.appendChild(key);
  });

  keyboard.addEventListener("click", ({ target: { tagName, value } }) => {
    if (tagName === BUTTON_TAG_NAME) {
      switch (value) {
        case EMPTY_TEXT:
          if (storyId !== 0) {
            storyId = storyId.slice(0, -1);          
          }
          break;
        case READ_TEXT:
          location.hash = storyId;
          break;
        default:
          if (storyId.length < 3) {
            storyId += event.target.value;
          } 
      }
      entryDisplay.textContent = storyId;
    }
  });  

  window.addEventListener("hashchange", onHashChange);

  function onHashChange() {
    const hash = location.hash.slice(1);
    if (hash) {
      const found = stories.find((story) => String(story?.Id) === hash);
      if (found) {
        renderStory(found);
        transit(mainSection, storySection);
      } else {
        transit(mainSection, notFoundSection);
      }
    } else {
      transit(storySection.style.display === "block" ? storySection : notFoundSection, mainSection);
      storyId = "";
      entryDisplay.textContent = "";
    }
  }

  storySection.querySelectorAll(".variant").forEach((n) => {
    n.addEventListener("click", () => {
      n.classList.toggle("opened")
    });
  })

  setTimeout(onHashChange, 200);
}

window.addEventListener("DOMContentLoaded", init);

function renderStory(story) {
  const section = document.querySelector("section[name=story]");  
  section.querySelector(".title").textContent = story.Id;
  section.querySelector(".text").textContent = story.Text;  
  section.querySelectorAll(".choices .variant").forEach((node, i) => {
    node.classList.remove("opened");
    const { 
      Req = "",
      Short = "",
      Text = "",
      Results = []
    } = story.Variants[i] || {};
    const [, value] = Req.trim().split(" ");
    node.querySelector(".requirenment").textContent = Req;
    node.querySelector(".title").textContent = Short;
    node.querySelector(".text").textContent = Text;
    node.querySelectorAll(".results div").forEach((n, l) => {
      n.textContent = `${parseInt(value) + l * 2}: ${Results[l]}`;
    })
  });  

}

function transit(from, to) {
  animate((state) => {
    from.style.opacity = 1 - state;
  }, () => {
    from.style.display = "none";
    to.style.opacity = 0;
    to.style.display = "block";
    animate((state) => {
      to.style.opacity = state;
    }, () => {
      to.style.opacity = 1;
    })
  });
}

function easeInOut(time) {
  return time > 0.5 ? (4 * Math.pow((time - 1), 3)) + 1 : 4 * Math.pow(time, 3);
}

function animate(frame, onEnd, duration = 300, easing = easeInOut) {
  let canceled = false;

  const start = Date.now();

  const next = () => {
    if (canceled) return;

    const delta = Date.now() - start;

    if (delta < duration) {
      frame(easing(delta / duration));
      window.requestAnimationFrame(next);

      return;
    }
    frame(1);
    if (onEnd) onEnd();
  };

  window.requestAnimationFrame(next);

  return () => {
    canceled = true;
  };
}