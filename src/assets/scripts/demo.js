// iframe api setup
const tag = document.createElement('script') // scriptタグを生成
tag.src = "https://www.youtube.com/iframe_api"  // APIのURLを付与
const firstScriptTag = document.getElementsByTagName('script')[0] // 生成したタグをセット
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag) // HTML上に挿入

// global variable
let player // 変数playerを用意
let videoCount = 0;
const changeTime = 10 * 60 * 1000; // min * sec * msec
const closedTime = 0;
const openedTime = 8;
const videoList = [
  // アメリカ標準時: https://www.time-j.net/WorldTime/Country/US
  '3XoeAR3OThc', // ラスベガス(UTC-8)
  'cJzYyUpf2mg', // flagstaff (UTC-7) https://www.youtube.com/@VirtualRailfan
  '7H-6gBSAu4o', // レヴンワース(カンザス州 UTC-7)
  // 'aTyNZQHRZ7Q', // ジャクソンホールの服屋 (ワイオミング州 UTC-7) //https://www.youtube.com/c/Seejh
  // 'srlpC5tmhYs', // NYの広場 (あまりおもしろくないので非公開)
  // 'S1nmRcAklH0', // ジョージ・ワシントン・ブリッジ(UTC-5 NY) // 非公開？ https://www.youtube.com/c/FortLeeOnDemand/videos
  '1-iS7LArMPA', // タイムズスクエア(UTC-5 NY)
  'srlpC5tmhYs', // newyorkの公園 https://www.youtube.com/@BryantParkNYC
  '-OrQPf3FEy4', // nycの服や https://www.youtube.com/@originaldpj
  'JquwVoUJbt0', // 鹿　https://www.youtube.com/@BrownvillesFoodPantryForDeer
  // '-eqdD8qKBbM', // ディアフィールドビーチ US フロリダ州 (UTC-5)
  // 'dft7XTlPdA4', // フロリダの水中 (現在緑一色になってた)
  'JrJMPiLEefg', // アメリカオーランド州の海沿いのバー (UTC-5 オーランド州) https://www.youtube.com/@jonnytechnology2640
  '7i8ARjIeM2k', // マイアミの水中 (UTC-5 マイアミ)
  '2wqpy036z24', // ヴァージン諸島のバー(UTC-4) https://www.youtube.com/@GreatExpectationsSTJ
  'St7aTfoIdYQ', // オックスフォードの学校
  'yMSc-qqW3To', //The Geiranger-Hellesylt Ferryは、ノルウェーのMøreog Romsdal郡のStranda市にあるGeirangerとHellesylt間のフェリーサービスです。
  // 'KPK_kphkMvE', // アインベック,ドイツ(utc1) deleted
  // '8Ldc9EeXpW8', // オランダ(utc1) deleted
  'utFHRDryJL0', // デンマーク(utc1) https://www.youtube.com/channel/UCRPhYF9rd5ov7DNKj99MNIg
  'ekgF3k_i9jE', // オランダ // https://www.youtube.com/c/SocialHotspot
  'UWZNkLXKDpo', // オランダ エルブルグ https://www.youtube.com/watch?v=UWZNkLXKDpo
  // 'oTUOTTdqi7I', // オランダ(utc1) アムステルダム https://www.youtube.com/c/AmsterdamLive
  'qwjt-gnItvg', // オーストリア チロル州シュヴァーツ地区シュトゥンマーベルク
  'HpZAez2oYsA', // ヴェネチ
  'dHSRBMgTBvc', // マナローラ・マリーナ(イタリア)
  // 'c4kpeZHcke8', // ノルウェー
  'BQaw7R6vUnw', //エグモンドアーンジーは、オランダの北ホラント州にある北海沿岸の村です https://www.youtube.com/@egmondaanzee
  // '4zLHD1WY6ps', // ケープタウンのビーチ
  'v-wwr4XH9G4', // エルサレム
  'ydYDqZQpim8', // ナミブ
  // 'gzbmXwF2_tQ', // ナミブ２ https://www.youtube.com/channel/UCfn4vrrgKXCCg3rxxLRGOvg
  '-HxJYZI9AMk', // ケニア https://www.youtube.com/@Africamvideos
  'h1wly909BYw', // サンクトペテルブルク
  // 'ssSK5SuimH4', // トルコ,トカット deleted
  'wXRdW7Jy8_0', // トルコ, ordu https://www.youtube.com/c/YakanetWisp
  'A_Aknujc8_E', // ブルガリア https://www.youtube.com/c/Free1video
  // '85QS7jJuwKU', // タイのセブン deleted
  // 'ZCiK4_BMzxk', // タイ,  The Shack | Fisherman's Village | Koh Samui |
  'HoHlSQoOWBk', // タイ,  Thong Sala center, Koh Phangan https://www.youtube.com/c/Teleportcamera
  'gp69xjCxau0', // ロシア,イルクーツクの滑り台
  '8oVQjO-0b7k', // フィリピン // https://www.youtube.com/c/JazBazPhilippines
  'MPGNOavzqik', // フィリピンの道2
  '-JhoMGoAfFc', // 韓国の橋
  'lsxYH2XQQCg', // モンキーセンター
  'GrEEoEmmrKs', // 草津温泉
  // 'EHkMjfMw7oU', // 歌舞伎町
  '75TyMXSXlTE', // 渋谷スクランブル交差点 // https://www.youtube.com/user/FNNnewsCH
  'MtG3qakph4w', // オーストラリア チャールズ・スタート大学の鳥
  // 'oD6ywmB6NIs', // オーストラリアのコアラ動物園 ローンパイン・コアラ・サンクチュアリ(utc10) // https://www.youtube.com/c/lonepinekoala
]

const getVideoId = ()=>{
  const result = videoList[videoCount];
  videoCount++;
  if(videoCount==videoList.length)
    videoCount=0;
  return result;
}

const createPlayer = ()=>{
  player = new YT.Player('player', { // YT.Playerオブジェクトを作成（'player'は動画の挿入先のid名）
    videoId: getVideoId(),
    playerVars: {
      'playsinline': 1,
      'mute': 1,
      'controls': 0,
      'rel': 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onStateChange
    },
  });
}

window.onPlayerReady = (event) =>{
  event.target.mute();
  setTimeout(()=>{
    event.target.playVideo();
  }, 1000*1)
}

window.onStateChange = (state)=>{
  $('.debug').text(state.data)
  // 何故かロードに失敗しビデオが終了することがある
  // その時は次のビデオに移動させる
  if(state.data == 0){ // state 0: 動画終了
    changeVideo();
  }
}
window.onYouTubeIframeAPIReady= ()=> { // APIが読み込まれて準備が整ったら実行される関数
  createPlayer();
}


const timeCheck= ()=>{
  const now = new Date();
  const hour = now.getHours();
  let bOffHours = false;
  if(closedTime <= hour && hour < openedTime)
    bOffHours = true;

  const bCurrentOffHours = $('.cover').hasClass('off-hours');
  if(bCurrentOffHours!=bOffHours){
    $('.cover').toggleClass('off-hours');
  }
}
timeCheck(); // initial check


const changeVideo = () =>{
  if(!player)
    return;

  if(false){
    // プレイヤー作り直しモード
    player.destroy();
    createPlayer();
  }else{
    // 動画ロードモード
    player.loadVideoById({'videoId': getVideoId()});
  }
}

setInterval(()=>{
  changeVideo();
  timeCheck();
}, changeTime);

$('.cover').on('click', ()=>{
  changeVideo();
});
