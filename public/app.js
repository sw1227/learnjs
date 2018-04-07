// strictにJSを評価して、問題があればエラーを出させる
'use strict'

// 名前衝突を避けるため、名前空間を作成する
var learnjs = {}; // 実体はJSのオブジェクト


// Single Page Applicationは、#イベントによるルーティングによってリロードなしに移動する

// ビュー関数: ビューに対応するjQueryオブジェクトを返す
learnjs.problemView = function(problemNumber) {
    return $('<div class="problem-view">').text('Problem #' + problemNumber + ' Coming soon!');
}


// ルータ関数: URLハッシュ#とビュー関数を対応づける
learnjs.showView = function(hash) {

    // URLハッシュ#とビュー関数を対応づけるルックアップテーブル
    var routes = {
	'#problem': learnjs.problemView
    };

    var hashParts = hash.split('-')
    // 与えられたhashをもとにビュー関数を得る
    var viewFn = routes[hashParts[0]];

    // ビュー関数を呼び出してview-containerに追加
    if (viewFn) {
	$('.view-container').empty().append(viewFn(hashParts[1]));
    }
}


// ページをロードした後に呼ばれ、ルータ関数を呼び出す
learnjs.appOnReady = function() {
    // hashchangeイベントへのリスナーを登録
    window.onhashchange = function() {
	learnjs.showView(window.location.hash);
    };
    learnjs.showView(window.location.hash);
}
