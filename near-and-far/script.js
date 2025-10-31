const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function toNormalCase(str) {
  return str ? (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()) : "";
}

function init() {  
  const stories = jsyaml.loadAll(document.querySelector("script[name=stories]").textContent);
  
  initEntrySection();
  initMainSection();
  initNotFoundSection();
  initStorySection();
  initResultsSection();
  
  function initEntrySection() {
    const entrySection = document.querySelector("section[name=entry]");
    const entryButton = entrySection.querySelector("button");
    entryButton.addEventListener("click", () => {
      transitTo("main");
    });
  }

  function initMainSection() {
    const mainSection = document.querySelector("section[name=main]");
    const entryDisplay = mainSection.querySelector(".entry-display");
    const keyboard = mainSection.querySelector(".keyboard");  
    const readButton = mainSection.querySelector(".read");
    
    readButton.addEventListener("click", () => {
      const storyId = entryDisplay.textContent;
      const story = stories.find((story) => String(story?.Id) === storyId);
      if (story) {
        renderStory(story);
        transitTo("story");
      } else {
        transitTo("not-found");
      }      
      setTimeout(() => {
        entryDisplay.textContent = "";
      }, 200);
    });
    
    function addKeys() {
      const lettersMode = keyboard.classList.contains("letters");
      const keys = lettersMode ? LETTERS : DIGITS;
      keyboard.innerHTML = "";
      keys.forEach((symbol) => {
        const key = document.createElement("button");
        key.value = symbol;
        key.textContent = symbol;      
        keyboard.appendChild(key);
        key.addEventListener("click", () => {
          if (entryDisplay.textContent.length < 4) {
            entryDisplay.textContent += symbol;
          }
        });
      });
      
      const keySwitch = document.createElement("button");
      keySwitch.textContent = lettersMode ? "123" : "ABC";
      keySwitch.addEventListener("click", () => {
        keyboard.classList.toggle("letters", !lettersMode);
        addKeys();
      });
      keyboard.appendChild(keySwitch);
      
      const keyRemove = document.createElement("button");
      keyRemove.textContent = "<";
      keyRemove.addEventListener("click", () => {
        entryDisplay.textContent = entryDisplay.textContent.slice(0, -1);
      });
      keyboard.appendChild(keyRemove);
    }
    
    addKeys();
  }
  
  function initNotFoundSection() {
    const notFoundSection = document.querySelector("section[name=not-found]");
    const notFoundButton = notFoundSection.querySelector("button");
    notFoundButton.addEventListener("click", () => {
      transitTo("main");
    });
  }

  function initStorySection(story) {
    const storySection = document.querySelector("section[name=story]");
    const backButton = storySection.querySelector(".back");
    backButton.addEventListener("click", () => {
      transitTo("main");
    });
  }
  
  function initResultsSection() {
    const resultsSection = document.querySelector("section[name=results]");
    const backButton = resultsSection.querySelector(".back");
    backButton.addEventListener("click", () => {
      transitTo("main");
    });
  }
  
  function renderStory(story) {
    console.log(">>>", story);
    const storySection = document.querySelector("section[name=story]");
    const variantsBlock = storySection.querySelector(".variants");
    storySection.querySelector(".title").textContent = story.Id;
    storySection.querySelector(".text").textContent = story.Text;
    storySection.querySelectorAll(".choices .variant").forEach((n) => {
      n.classList.remove("opened");
    });
    variantsBlock.innerHTML = "";
    story.Variants.forEach((variant) => {
      const variantNode = document.createElement("button");
      variantNode.classList.add("variant", "alternate");
      
      const textNode = document.createElement("div");
      textNode.classList.add("text");
      textNode.textContent = toNormalCase(variant.Short);
      variantNode.appendChild(textNode);      
      
      const reqNode = document.createElement("div");
      reqNode.classList.add("requirement");
      reqNode.textContent = variant.Req;
      variantNode.appendChild(reqNode);
      
      variantsBlock.appendChild(variantNode);
      
      variantNode.addEventListener("click", () => {
        renderResults(variant);
        transitTo("results");
      });
    });
  }
  
  function renderResults(variant) {
    const resultsBlock = document.querySelector("section[name=results]");
    resultsBlock.querySelector(".title").textContent = toNormalCase(variant.Short);
    resultsBlock.querySelector(".text").textContent = variant.Text;
    const results = resultsBlock.querySelector(".results");
    results.innerHTML = "";
    const [, value] = variant.Req.trim().split(" ");
    variant.Results.forEach((result, index) => {
      const resultNode = document.createElement("div");
      resultNode.textContent = `${parseInt(value) + index * 2}: ${result}`;
      results.appendChild(resultNode);
    });
  }

  function transitTo(section) {
    document.querySelectorAll("section:not(.hidden)").forEach((section) => {
      section.classList.add("fade-out");
      setTimeout(() => {
        section.classList.add("hidden");
        section.classList.remove("fade-out");
      }, 200);
    });
    const targetSection = document.querySelector(`section[name=${section}]`);
    setTimeout(() => {
      targetSection.classList.remove("hidden");
      targetSection.classList.add("fade-in");
      setTimeout(() => {
        targetSection.classList.remove("fade-in");
      }, 200);
    }, 200);
  }
}

document.addEventListener("DOMContentLoaded", init);

/*

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
} */