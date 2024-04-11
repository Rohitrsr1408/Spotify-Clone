let currentSong = new Audio();
let songs;
let currfolder;
let cardContainer = document.querySelector(".cardContainer");
let play = document.querySelector(".songbuttons .play");
let songList = [];
async function getSongs(folder) {
  currfolder = folder;
  let a = await fetch(`/Spotify-Clone/songs/${folder}`);
  let response = await a.text();
  //    console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    if (as[i].href.endsWith(".mp3")) {
      songs.push(as[i].href);
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
      console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
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
  currentSong.src = `/Spotify-Clone/songs/${currfolder}/` + track;
  currentSong.play();
  play.src = "svgs/pause.svg";
  document.querySelector(".songInfo").innerHTML = track;
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
}

async function displayAlbums() {
  let a = await fetch(`/Spotify-Clone/songs/`);
  let response = await a.text();
  //    console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");

  let arr = Array.from(anchors);
  for (let index = 0; index < arr.length; index++) {
    let e = arr[index];
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/")[5];

      let a = await fetch(`/Spotify-Clone/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        ` <div data-folder="${folder}" class="card ">
      <img src="songs/${folder}/cover.webp">
      <h2>${response.title}</h2>
      <p>${response.description}</p> 
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
          console.log(item.currentTarget.dataset.folder);
          songs = await getSongs(`${item.currentTarget.dataset.folder}`);
          playMusic(songs[0].split("/")[6].replaceAll("%20", " "));
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
    currentSong.src = songs[songs.length - 1];
    currentSong.play();
  } else {
    currentSong.src = songs[index + 1];
    currentSong.play();
    play.src = "svgs/pause.svg";
    document.querySelector(".songInfo").innerHTML = songList[index + 1];
  }
}
async function main() {
  let clickCount = 0;
  await getSongs("Animal");
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
    console.log("next clicked");
    let index = 0;
    for (let i = 0; i < songs.length; i++) {
      if (songs[i] === currentSong.src) {
        index = i;
      }
    }
    if (index === songs.length - 1) {
      currentSong.src = songs[songs.length - 1];
      currentSong.play();
    } else {
      currentSong.src = songs[index + 1];
      currentSong.play();
      play.src = "svgs/pause.svg";
      document.querySelector(".songInfo").innerHTML = songList[index + 1];
      console.log(index, songList);
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

