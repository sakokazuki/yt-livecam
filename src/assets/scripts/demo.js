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
  '7H-6gBSAu4o', // レヴンワース
  '1-iS7LArMPA', // タイムズスクエア
  'S1nmRcAklH0', // ジョージ・ワシントン・ブリッジ
  'b8Z0CuNwai8', // ラスベガス
  // 'srlpC5tmhYs', // NYの広場 (あまりおもしろくないので非公開)
  '2wqpy036z24', // ヴァージン諸島のバー
  '-eqdD8qKBbM', // ディアフィールドビーチ US フロリダ州
  // 'dft7XTlPdA4', // フロリダの水中 (現在緑一色になってた)
  'EprUcPFSXkg', // アメリカオーランド州の海沿いのバー
  '7i8ARjIeM2k', // マイアミの水中
  'St7aTfoIdYQ', // オックスフォードの学校
  'yMSc-qqW3To', //The Geiranger-Hellesylt Ferryは、ノルウェーのMøreog Romsdal郡のStranda市にあるGeirangerとHellesylt間のフェリーサービスです。
  // 'KPK_kphkMvE', // アインベック,ドイツ(utc1) deleted
  // '8Ldc9EeXpW8', // オランダ(utc1) deleted
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
  'cTBn7b1WuZw', // トルコ, ordu
  'BGCytWLOmyA', // ブルガリア
  // '85QS7jJuwKU', // タイのセブン deleted
  // 'ZCiK4_BMzxk', // タイ,  The Shack | Fisherman's Village | Koh Samui |
  'WZybiJw_0Os', // タイ,  Thong Sala center, Koh Phangan
  'tBSxKeql2Fk', // タイの動物園？
  'gp69xjCxau0', // ロシア,イルクーツクの滑り台
  '-I6qbjZk0HM', // フィリピン
  'KFpOsiMkMiU', // フィリピンの道2
  '-JhoMGoAfFc', // 韓国の橋
  'lsxYH2XQQCg', // モンキーセンター
  '9GPMcqWhgKA', // 草津温泉
  // 'EHkMjfMw7oU', // 歌舞伎町
  'RX_NCBuV_Z0', // 渋谷スクランブル交差点
  'oD6ywmB6NIs', // オーストラリアのコアラ動物園 ローンパイン・コアラ・サンクチュアリ(utc10)
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
