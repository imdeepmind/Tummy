document.addEventListener("DOMContentLoaded", function () {
  // settings fields
  const name = document.getElementById("name");
  const query = document.getElementById("query");

  const time = document.getElementById("time");
  const greetings = document.getElementById("greetings");
  const backgroundImage = document.getElementById("dynamicBackground");
  const modalForm = document.getElementById("modalForm");
  const modal = document.getElementById("settingsModal");

  const defaultSettings = {
    name: "Human",
    query: null,
  };

  setDefaultInputValue();
  getCurrentTime();
  getGreetings();
  getImageQuery();

  function setDefaultInputValue() {
    chrome.storage.sync.get(["name", "query"], function (result) {
      name.value = result.name || defaultSettings.name;
      query.value = result.query || defaultSettings.query;
    });
  }

  function getCurrentTime() {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    time.innerHTML = currentTime;
  }

  function getGreetings() {
    chrome.storage.sync.get(["name"], function (result) {
      const greetingsMessage = `Good Morning, ${
        result.name || defaultSettings.name
      }`;

      greetings.innerHTML = greetingsMessage;
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

    const data = { name, query };

    chrome.storage.sync.set(data, function () {
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
