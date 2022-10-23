document.addEventListener("DOMContentLoaded", function () {
  // settings fields
  const name = document.getElementById("name");
  const query = document.getElementById("query");
  const clock = document.getElementById("clock");

  const time = document.getElementById("time");
  const greetings = document.getElementById("greetings");
  const backgroundImage = document.getElementById("dynamicBackground");
  const modalForm = document.getElementById("modalForm");
  const modal = document.getElementById("settingsModal");

  const defaultSettings = {
    name: "Human",
    query: null,
    clock: "12-hour",
  };

  setDefaultInputValue();
  getCurrentTime();
  getGreetings();
  getImageQuery();

  function setDefaultInputValue() {
    chrome.storage.sync.get(["name", "query", "clock"], function (result) {
      name.value = result.name || defaultSettings.name;
      query.value = result.query || defaultSettings.query;
      clock.value = result.clock || defaultSettings.clock;
    });
  }

  function getCurrentTime() {
    chrome.storage.sync.get(["clock"], function (result) {
      const clockSettings = result.clock || defaultSettings.clock;
      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: clockSettings === "12-hour" ? true : false,
      });

      time.innerHTML = currentTime;
    });
  }

  function getGreetings() {
    chrome.storage.sync.get(["name"], function (result) {
      const hour = new Date().getHours();
      let greetingsMessage = "Good Morning";

      if (hour < 5) {
        greetingsMessage = "Good Evening";
      } else if (hour < 12) {
        greetingsMessage = "Good Morning";
      } else if (hour < 17) {
        greetingsMessage = "Good Afternoon";
      } else {
        greetingsMessage = "Good Evening";
      }

      const greetingsMessageCombined = `${greetingsMessage}, ${
        result.name || defaultSettings.name
      }`;

      greetings.innerHTML = greetingsMessageCombined;
    });
  }

  function getImageQuery() {
    chrome.storage.sync.get(["query"], function (result) {
      const query = result.query || defaultSettings.query;

      if (query && query != "") {
        const queries = query.split(",").map((item) => item.trim());

        const imageUrl = `url("https://source.unsplash.com/random/1280x720/?${queries.join(
          ","
        )}")`;

        if (backgroundImage.style.backgroundImage !== imageUrl) {
          backgroundImage.style.backgroundImage = imageUrl;
        }
      } else {
        const imageUrl = `url("https://source.unsplash.com/random/1280x720/`;

        if (backgroundImage.style.backgroundImage !== imageUrl) {
          backgroundImage.style.backgroundImage = imageUrl;
        }
      }
    });
  }

  function handleSaveSettings(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const name = formData.get("name");
    const query = formData.get("query");
    const clock = formData.get("clock");

    const data = { name, query, clock };

    chrome.storage.sync.set(data, function () {
      getCurrentTime();
      getGreetings();
      getImageQuery();
      setDefaultInputValue();
      modal.style.display = "none";
    });
  }

  modalForm.onsubmit = handleSaveSettings;

  // Update Loops
  setInterval(function () {
    getCurrentTime();
  }, 1000);
});
