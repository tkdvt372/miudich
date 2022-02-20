const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $(".cd");
const player = $(".player");
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const PlayBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $(' .btn-next');
const prevBtn = $(' .btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $(' .btn-repeat');
const playList =$(".playlist");
const PLAYER_STORAGE_KEY = 'DVT_PLAYER'
const app = {
  currentIndex: 0,
  isPLaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem('PLAYER_STORAGE_KEY'))   || {},
  songs: [
    
    {
      name: "Hãy Trao Cho Anh",
      singer: "Sơn Tùng MTP",
      path: "./audio/mtp.mp3",
      image:
        "https://yt3.ggpht.com/ytc/AKedOLRkY5n3Hd-EXXEpeUPp4INtDJTT_awisaAOhndN1g=s900-c-k-c0x00ffffff-no-rj",
    },
    {
      name: "Bông Hoa Đẹp Nhât",
      singer: "Quân AP",
      path: "./audio/Bonghoa.mp3",
      image: "https://image.thanhnien.vn/w1024/Uploaded/2022/apluwaj/2021_03_16/quan-ap-p7_oxii.jpg",
    },
    {
      name: "Nàng Thơ",
      singer: "Hoàng Dũng",
      path: "./audio/NangTho.mp3",
      image:
        "https://kenh14cdn.com/thumb_w/660/203336854389633024/2021/1/11/hoangdung-16103077497771408953124.jpg",
    },
    {
      name: "Phải Chăng Em Đã Yêu?",
      singer: "Juky San, RedT",
      path: "./audio/PhaiChangEmDaYeu-JukySanRedT-6940932.mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/singer/avatar/2021/02/17/a/3/2/1/1613561860337_600.jpg",
    },
    {
      name: "Quá Lâu",
      singer: "Vinh Khuất",
      path: "./audio/qualau.mp3",
      image: "https://static2.yan.vn/YanNews/2167221/202011/vinh-khuat-la-ai-tieu-su-su-nghiep-doi-tu-cua-nam-ca-si-ebbc9bf5-0a05ddff.png",
    },
    {
      name: "Trên Tình Bạn Dưới Tình Yêu",
      singer: "Min",
      path: "./audio/TrenTinhBanDuoiTinhYeu-MIN-6802163.mp3",
      image:
        "https://znews-photo.zadn.vn/w660/Uploaded/unvjuas/2020_03_29/91914216_197520345003302_5529046972149105331_n_1.jpg",
    },
    {
      name: "Muốn Nói Với Em",
      singer: "TTEAM",
      path: "./audio/MuonNoiVoiEm-TTeam-6288870.mp3",
      image:
        "https://event.mediacdn.vn/2020/9/10/t-team-15997141408601170362100.jpg",
    },
    
  ],
  setConfig: function(key,value) {
    this.config[key]=value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  defineProperties:function () {
        Object.defineProperty(this,'currentSong',{
            get:function () {
                return this.songs[this.currentIndex]
            }
        })
        
  },
  render: function () {
    const htmld = this.songs.map((song,index) => {
      return `
              <div style="cursor: pointer" class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`;
    });
    playList.innerHTML = htmld.join("");
  },
  handleEvent: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    const cdThumbAnimate = cdThumb.animate([
      {transform: 'rotate(360deg)'}
    ],{
      duration: 10000,
      iteration:Infinity,
    })
    cdThumbAnimate.pause();
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop;
      const newcdWidth = cdWidth - scrollTop;
      cd.style.width = newcdWidth > 0 ? newcdWidth + "px" : 0;
      cd.style.opacity = newcdWidth / cdWidth;
    };
    PlayBtn.onclick= function () {
        if (_this.isPLaying) {
            audio.pause();
            cdThumbAnimate.pause();

        }else{
            audio.play();
            cdThumbAnimate.play();

        }
        audio.onplay = function () {
          _this.isPLaying=true;
          player.classList.add("playing")
        }
        audio.onpause = function () {
            _this.isPLaying=false;
          player.classList.remove("playing")
        }
        audio.ontimeupdate = function () {
          if(audio.duration)
         {
           const progressPercent = Math.floor(audio.currentTime/audio.duration *100);
           progress.value = progressPercent;
         }
        }
        progress.onchange = function(e){
          const seekTime = Math.floor(audio.duration / 100 * e.target.value)
          audio.currentTime = seekTime
        } 
        nextBtn.onclick = function(){
          if(_this.isRandom){
            _this.playRandomSong();
          }else{
            _this.nextSong();
          }
          audio.play();
          _this.render();
          _this.scrollToActiveSong();
        } 
        prevBtn.onclick = function(){
          if(_this.isRandom){
            _this.playRandomSong();
          }else{
          _this.prevSong();
          }
          audio.play();
          _this.render();

        }
        
        randomBtn.onclick = function(e){
          _this.isRandom=!_this.isRandom;
          _this.setConfig('isRandom',_this.isRandom);
          randomBtn.classList.toggle('active',_this.isRandom)
          
        }
        audio.onended = function(){
            if(_this.isRandom){
              _this.playRandomSong();
            }else{
              _this.nextSong();
            }
            audio.play();
          
        }
        repeatBtn.onclick = function(e){
          _this.isRepeat=!_this.isRepeat;
          _this.setConfig('isRepeat',_this.isRepeat);
          repeatBtn.classList.toggle('active',_this.isRepeat)
        }
        audio.onended=function () {
          if (_this.isRepeat) {
              audio.play();
           } else {
             nextBtn.click ();
          }
        }
        playList.onclick = function(e){
          const songNode = e.target.closest('.song:not(.active)')
          if (songNode || e.target.closest('.option')) {
             if (songNode){
              _this.currentIndex = Number(songNode.dataset.index)
              _this.loadCurrentSong()
              audio.play()
              _this.render()
             }
             if ( e.target.closest('.option')){
               
            }
        }
      }
    }
  },
  scrollToActiveSong:function () {
    setTimeout(function () {
      $('.song.active').scrollIntoView({
        behavior:'smooth',
        block: 'center'
      });

    },300)
  },
  loadCurrentSong: function(e){
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;

  },
  nextSong: function(){
    this.currentIndex++;
    if(this.currentIndex > this.songs.length -1){
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  loadConfiguration: function(){
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  prevSong: function(){
    this.currentIndex--;
    if(this.currentIndex < 0){
      this.currentIndex = this.songs.length -1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function(){
      let newIndex;
      do{
        newIndex= Math.floor(Math.random() * this.songs.length);
      }while(newIndex === this.currentIndex )
      this.currentIndex = newIndex;
      this.loadCurrentSong();
  },
  start: function () {
    this.loadConfiguration();
    this.defineProperties();
    this.handleEvent();
    this.loadCurrentSong();
    this.render();
  }
};
app.start();
