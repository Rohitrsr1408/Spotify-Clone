let currentSong=new Audio();

let play=document.querySelector('.songbuttons .play');
async function getSongs(){
    let a= await fetch("http://127.0.0.1:5500/Spotify%20%20Clone/songs/")
    let response = await a.text();
//    console.log(response);
    let div=document.createElement('div');
    div.innerHTML=response;
    let as=div.getElementsByTagName('a');
    let songs=[];
    for(let i=0;i<as.length;i++){
        if(as[i].href.endsWith('.mp3')){
            songs.push(as[i].href);
        }
    }
    return songs;
}

let listOfSongs=document.querySelector('.songList ul');





function playMusic(track){
    currentSong.src="/Spotify%20%20Clone/songs/"+track;
    currentSong.play();
    play.src="pause.svg";
}




async function main(){
    let songs= await getSongs();
    
    let songList=[];
for(let song of songs){
    songList.push(song.split("songs/")[1].replaceAll("%20"," ").replaceAll("(PagalWorld.Com.IN)","").replaceAll("(PagalWorld.com.cm)",""));
}
   
   for(let song of songList){
    let songName=document.createElement('li');
    songName.innerHTML=`  
    <img src="music.svg"  class="invert">
    <div class="info">
    <div>${song.replaceAll("-","")}</div>
    <div>RSR</div>
  </div>
  <div class="playnow">
    <span>Play Now</span>
    <img class="invert" src="play.svg">
  </div>`;
     
    listOfSongs.appendChild(songName);
   }


    Array.from(document.querySelectorAll(".songList li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector('.info').firstElementChild.innerHTML.trim());
             playMusic(e.querySelector('.info').firstElementChild.innerHTML.trim());
        })
    }
    );
   
  play.addEventListener('click',()=>{
      if(currentSong.paused){
        currentSong.play();
        play.src="pause.svg";
      }
      else{
        currentSong.pause();
        play.src="play.svg";
      }
  })

//     var audio = new Audio(songs[2]);
//   audio.play();
}
main();
