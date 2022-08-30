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
  'b8Z0CuNwai8', // ラスベガス(UTC-8)
  '7H-6gBSAu4o', // レヴンワース(カンザス州 UTC-7)
  'aTyNZQHRZ7Q', // ジャクソンホールの服屋 (ワイオミング州 UTC-7) //https://www.youtube.com/c/Seejh
  // 'srlpC5tmhYs', // NYの広場 (あまりおもしろくないので非公開)
  'S1nmRcAklH0', // ジョージ・ワシントン・ブリッジ(UTC-5 NY)
  '1-iS7LArMPA', // タイムズスクエア(UTC-5 NY)
  '-eqdD8qKBbM', // ディアフィールドビーチ US フロリダ州 (UTC-5)
  // 'dft7XTlPdA4', // フロリダの水中 (現在緑一色になってた)
  '06-9leYioUI', // アメリカオーランド州の海沿いのバー (UTC-5 オーランド州)
  '7i8ARjIeM2k', // マイアミの水中 (UTC-5 マイアミ)
  '2wqpy036z24', // ヴァージン諸島のバー(UTC-4)
  'St7aTfoIdYQ', // オックスフォードの学校
  'yMSc-qqW3To', //The Geiranger-Hellesylt Ferryは、ノルウェーのMøreog Romsdal郡のStranda市にあるGeirangerとHellesylt間のフェリーサービスです。
  // 'KPK_kphkMvE', // アインベック,ドイツ(utc1) deleted
  // '8Ldc9EeXpW8', // オランダ(utc1) deleted
  'utFHRDryJL0', // デンマーク(utc1) https://www.youtube.com/channel/UCRPhYF9rd5ov7DNKj99MNIg
  '9N9OmvwRAF8', // オランダ エグモンドアーンジー
  'UWZNkLXKDpo', // オランダ エルブルグ https://www.youtube.com/watch?v=UWZNkLXKDpo
  // 'oTUOTTdqi7I', // オランダ(utc1) アムステルダム https://www.youtube.com/c/AmsterdamLive
  'qwjt-gnItvg', // オーストリア チロル州シュヴァーツ地区シュトゥンマーベルク
  'HpZAez2oYsA', // ヴェネチ
  'dHSRBMgTBvc', // マナローラ・マリーナ(イタリア)
  // 'c4kpeZHcke8', // ノルウェー
  'IjSGWGt6xu8', //エグモンドアーンジーは、オランダの北ホラント州にある北海沿岸の村です
  // '4zLHD1WY6ps', // ケープタウンのビーチ
  'v-wwr4XH9G4', // エルサレム
  'ydYDqZQpim8', // ナミブ
  'h1wly909BYw', // サンクトペテルブルク
  // 'ssSK5SuimH4', // トルコ,トカット deleted
  'zv4T-KA63-E', // トルコ, ordu https://www.youtube.com/c/YakanetWisp
  'A_Aknujc8_E', // ブルガリア https://www.youtube.com/c/Free1video
  // '85QS7jJuwKU', // タイのセブン deleted
  // 'ZCiK4_BMzxk', // タイ,  The Shack | Fisherman's Village | Koh Samui |
  '0EaQuajibHU', // タイ,  Thong Sala center, Koh Phangan https://www.youtube.com/c/Teleportcamera
  'tBSxKeql2Fk', // タイの動物園？
  'gp69xjCxau0', // ロシア,イルクーツクの滑り台
  '-I6qbjZk0HM', // フィリピン // https://www.youtube.com/c/JazBazPhilippines
  'KFpOsiMkMiU', // フィリピンの道2
  '-JhoMGoAfFc', // 韓国の橋
  'lsxYH2XQQCg', // モンキーセンター
  '9GPMcqWhgKA', // 草津温泉
  // 'EHkMjfMw7oU', // 歌舞伎町
  '3-jHG_SnsEk', // 渋谷スクランブル交差点 // https://www.youtube.com/user/FNNnewsCH
  'oD6ywmB6NIs', // オーストラリアのコアラ動物園 ローンパイン・コアラ・サンクチュアリ(utc10) // https://www.youtube.com/c/lonepinekoala
  '86YLFOog4GM', // ISS
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
