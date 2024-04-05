let currentSong = new Audio();

let play = document.querySelector(".songbuttons .play");
async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/Spotify-Clone/songs/");
  let response = await a.text();
  //    console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    if (as[i].href.endsWith(".mp3")) {
      songs.push(as[i].href);
    }
  }
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
  currentSong.src = "/Spotify-Clone/songs/" + track;
  currentSong.play();
  play.src = "svgs/pause.svg";
  document.querySelector(".songInfo").innerHTML = track;
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
}

async function main() {
  let songs = await getSongs();
  currentSong.src = songs[0];
  document.querySelector(".songInfo").innerHTML = songs[0]
    .split("/songs/")[1]
    .replaceAll("%20", "");
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
  let songList = [];
  for (let song of songs) {
    songList.push(
      song
        .split("songs/")[1]
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
  //Attach an event to play the song
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "svgs/pause.svg";
      document.querySelector(".songInfo").innerHTML = songs[0]
        .split("/songs/")[1]
        .replaceAll("%20", "");
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
}
main();
