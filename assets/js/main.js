document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("settingsModal");
  const btn = document.getElementById("settings");
  const span = document.getElementsByClassName("close")[0];
  const time = document.getElementsByClassName("time")[0];
  const greetings = document.getElementsByClassName("greetings")[0];
  const backgroundImage =
    document.getElementsByClassName("background-image")[0];
  const modalForm = document.getElementById("modalForm");

  btn.onclick = function () {
    modal.style.display = "block";
  };

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  getCurrentTime();
  getGreetings();
  getImageQuery();

  setInterval(function () {
    getCurrentTime();
  }, 1000);

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
      console.log("getting");
      const greetingsMessage = `Good Morning, ${result.name}`;
      console.log({ greetingsMessage, result });

      greetings.innerHTML = greetingsMessage;
    });
  }

  function getImageQuery() {
    chrome.storage.sync.get(["query"], function (result) {
      const query = result.query;

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
      modal.style.display = "none";
    });
  }

  modalForm.onsubmit = handleSaveSettings;
});
