let currentSong = new Audio();
let songs;
let currfolder;
let cardContainer = document.querySelector(".cardContainer");
let play = document.querySelector(".songbuttons .play");
let songList = [];
const access_token = "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";
async function getSongs(folder) {
  currfolder = folder;
  let a = await fetch(
    `https://api.github.com/repos/Rohitrsr1408/Spotify-Clone/contents/songs/${folder}`,
    {
      headers: {
        Authorization: `token${access_token}`,
      },
    }
  );

  if (!a.ok) {
    throw new Error(
      `Failed to fetch folder contents. Status code: ${a.status}`
    );
  }
  let response = await a.json();

  let div = document.createElement("div");
  div.innerHTML = response;

  songs = [];

  for (let i = 0; i < response.length; i++) {
    const element = response[i];
    if (element.name.endsWith(".mp3")) {
      songs.push(element.url.replaceAll("?ref=main", ""));
    }
  }

  for (let song of songs) {
    songList.push(
      song
        .split(`songs/${currfolder}/`)[1]
        .replaceAll("%20", " ")
        .replaceAll("(PagalWorld.Com.IN)", "")
        .replaceAll("(PagalWorld.com.cm)", "")
    );
  }

  for (let song of songList) {
    let songName = document.createElement("li");
    songName.innerHTML = `  
    <img src="svgs/music.svg"  class="invert">
    <div class="info">
    <div>${song.replaceAll("-", "")}</div>
    <div>RSR</div>
  </div>
  <div class="playnow">
    <span>Play Now</span>
    <img class="invert" src="svgs/play.svg">
  </div>`;

    listOfSongs.appendChild(songName);
  }

  Array.from(document.querySelectorAll(".songList li")).forEach((e) => {
    e.addEventListener("click", (element) => {
      //console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
}

let listOfSongs = document.querySelector(".songList ul");
//for converting seconds to minutes
function secondsToMinuteSeconds(seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = Math.floor(seconds % 60);
  return (
    minutes.toString().padStart(2, "0") +
    ":" +
    remainingSeconds.toString().padStart(2, "0")
  );
}

// Example usage:

function playMusic(track) {
  currentSong.src =
    `https://raw.githubusercontent.com/Rohitrsr1408/Spotify-Clone/main/songs/${currfolder}/` +
    track;
  currentSong.play();
  play.src = "svgs/pause.svg";
  document.querySelector(".songInfo").innerHTML = track;
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
}

async function displayAlbums() {
  let a = await fetch(
    `https://api.github.com/repos/Rohitrsr1408/Spotify-Clone/contents/songs/`,
    {
      headers: {
        Authorization: `token  ${access_token}`,
      },
    }
  );
  //console.log(a);
  let response = await a.json();

  let div = document.createElement("div");
  div.innerHTML = response;

  let urls = [];

  Array.from(response).forEach((e) => {
    urls.push(e.url);
  });

  let arr = Array.from(urls);
  for (let index = 0; index < arr.length; index++) {
    let e = arr[index];
    if (e.includes("/songs/")) {
      // console.log(e.href);

      let link = e.split("/");

      var folder = link[link.length - 1].replaceAll("?ref=main", "");

      let a = await fetch(
        `https://api.github.com/repos/Rohitrsr1408/Spotify-Clone/contents/songs/${folder}/info.json`,
        {
          headers: {
            Authorization: `token ${access_token}`,
          },
        }
      );
      let data = await a.json();

      let encodedData = data.content;
      const decodedData = atob(encodedData);
      const utf8DecodedData = decodeURIComponent(escape(decodedData));

      const JsonData = JSON.parse(utf8DecodedData);

      cardContainer.innerHTML =
        cardContainer.innerHTML +
        ` <div data-folder="${folder}" class="card ">
      <img src="songs/${folder}/cover.webp">
      <h2>${JsonData.title}</h2>
      <p>${JsonData.description}</p> 
      <svg class="circle-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle class="circle-background" cx="50" cy="50" r="50"/>
        <g class="svg-container">
          <svg class="svg-icon" viewBox="0 0 24 24" fill="#000000">
            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
          </svg>
  </div>`;

      Array.from(document.querySelectorAll(".card")).forEach((e) => {
        e.addEventListener("click", async (item) => {
          listOfSongs.innerHTML = "";
          songList = [];
          //console.log(item.currentTarget.dataset.folder);
          songs = await getSongs(`${item.currentTarget.dataset.folder}`);
          var splitit = songs[0].split("/");
          playMusic(splitit[splitit.length - 1].replaceAll("%20", " "));
        });
      });
    }
  }
}
function playNext() {
  let index = 0;
  for (let i = 0; i < songs.length; i++) {
    if (songs[i] === currentSong.src) {
      index = i;
    }
  }

  if (index === songs.length - 1) {
    currentSong.src = songs[0];
    console.log("yes");
    currentSong.play();
    document.querySelector(".songInfo").innerHTML = songList[0];
  } else {
    currentSong.src = songs[index + 1];
    currentSong.play();
    console.log("yes");
    play.src = "svgs/pause.svg";
    document.querySelector(".songInfo").innerHTML = songList[index + 1];
  }
}
async function main() {
  let clickCount = 0;
  await getSongs("Animal");
  document.querySelector(".volume input").value = "100";
  currentSong.src = songs[0];
  document.querySelector(".songInfo").innerHTML = songs[0]
    .split(`/songs/${currfolder}/`)[1]
    .replaceAll("%20", "");
  document.querySelector(".songTime").innerHTML = "00:00/00:00";

  //Display all albums
  displayAlbums();
  //Attach an event to play the song
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "svgs/pause.svg";
    } else {
      currentSong.pause();
      play.src = "svgs/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secondsToMinuteSeconds(
      currentSong.currentTime
    )} / ${secondsToMinuteSeconds(currentSong.duration)}`;
    document.querySelector(".seekbar .circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
    if (
      secondsToMinuteSeconds(currentSong.currentTime) ===
      secondsToMinuteSeconds(currentSong.duration)
    ) {
      playNext();
    }
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (percent * currentSong.duration) / 100;
  });
  //     var audio = new Audio(songs[2]);
  //   audio.play();

  //hamburger event
  document.querySelector(".nav .hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  //cross event
  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // adding event listener for previous and next
  document.querySelector(".previous").addEventListener("click", () => {
    let index = 0;
    for (let i = 0; i < songs.length; i++) {
      if (songs[i] === currentSong.src) {
        index = i;
      }
    }
    if (index === 0) {
      currentSong.src = songs[0];
      currentSong.play();
    } else {
      currentSong.src = songs[index - 1];
      currentSong.play();
      play.src = "svgs/pause.svg";
      document.querySelector(".songInfo").innerHTML = songList[index - 1];
    }
  });

  document.querySelector(".next").addEventListener("click", () => {
    // console.log("next clicked");
    let index = 0;
    for (let i = 0; i < songs.length; i++) {
      if (songs[i] === currentSong.src) {
        index = i;
      }
    }
    if (index === songs.length - 1) {
      currentSong.src = songs[0];
      currentSong.play();
      document.querySelector(".songInfo").innerHTML = songList[0];
    } else {
      currentSong.src = songs[index + 1];
      currentSong.play();
      play.src = "svgs/pause.svg";
      document.querySelector(".songInfo").innerHTML = songList[index + 1];
      //console.log(index, songList);
    }
  });

  //event for changing volume
  document.querySelector(".volume input").addEventListener("change", (e) => {
    currentSong.volume = e.target.value / 100;
    if (e.target.value === "0") {
      document.querySelector(".volume img").src = "svgs/mute.svg";
    } else if (e.target.value < 50 && e.target.value > 0) {
      document.querySelector(".volume img").src = "svgs/lowVolume.svg";
    } else {
      document.querySelector(".volume img").src = "svgs/volume.svg";
    }
  });

  document.querySelector(".volume img").addEventListener("click", (e) => {
    clickCount++;

    if (
      clickCount % 2 != 0 &&
      document.querySelector(".volume input").value != "0"
    ) {
      document.querySelector(".volume img").src = "svgs/mute.svg";
      currentSong.volume = "0";
      document.querySelector(".volume input").value = "0";
    } else {
      document.querySelector(".volume img").src = "svgs/volume.svg";
      currentSong.volume = "0.5";
      document.querySelector(".volume input").value = "50";
    }
  });
}

main();

