// strictにJSを評価して、問題があればエラーを出させる
'use strict'

// 名前衝突を避けるため、名前空間を作成する
var learnjs = {}; // 実体はJSのオブジェクト

// データモデルを定義する
// ふつうのJSデータ構造でデータを保持すると、JSONドキュメントをDynamoDBでレコードとして格納
// でき、オブジェクトマッピングの障壁が低くなる
learnjs.problems = [
    {
	description: "What is truth?",
	code: "function problem() { return __; }"
    },
    {
	description: "Simple Math",
	code: "function problem() { return 42 === 6 * __; }"
    }
];

// データバインディング関数
learnjs.applyObject = function(obj, elem) {
    // 引数のJSオブジェクトのキーに基づいてjQueryオブジェクトの要素を更新
    for (var key in obj) {
	// HTML5のデータ属性に、どのプロパティをバインドするかが指定されている
	elem.find('[data-name="' + key + '"]').text(obj[key]);
    }
};

// 回答を再評価したことをユーザに知らせるエフェクト
learnjs.flashElement = function(elem, content) {
    elem.fadeOut('fast', function() {
	elem.html(content);
	elem.fadeIn();
    });
};

// templateから指定したクラスの要素を取りだす
learnjs.template = function(name) {
    return $('.templates .' + name).clone();
}

learnjs.triggerEvent = function(name, args) {
    $('.view-container>*').trigger(name, args);
}

// 正解時のFlash
learnjs.buildCorrectFlash = function (problemNum) {
    var correctFlash = learnjs.template('correct-flash');
    var link = correctFlash.find('a');
    if (problemNum < learnjs.problems.length) {
	link.attr('href', '#problem-' + (problemNum + 1));
    } else {
	link.attr('href', '');
	link.text("You're Finished!");
    }
    return correctFlash;
};

// Single Page Applicationは、#イベントによるルーティングによってリロードなしに移動する

// ビュー関数: ビューに対応するjQueryオブジェクトを返す
learnjs.problemView = function(data) {
    var problemNumber = parseInt(data, 10);
    var view = learnjs.template('problem-view'); // templatesをコピーする
    var problemData = learnjs.problems[problemNumber - 1];
    var resultFlash = view.find('.result');

    // textarea.answerに記入された内容で問題の__を置き換え、評価する
    function checkAnswer() {
	var answer = view.find('.answer').val();
	var test = problemData.code.replace('__', answer) + '; problem();';
	return eval(test);
    }

    function checkAnswerClick() {
	if(checkAnswer()) {
	    // 正解した時のみ次の問題へのリンクも表示
	    learnjs.flashElement(resultFlash, learnjs.buildCorrectFlash(problemNumber));
	} else {
	    learnjs.flashElement(resultFlash, 'Incorrect!');
	}
	// falseを返すことでフォームを送信しないようにする
	//  (送信するとページがリロードされてアプリケーションの状態がリセットされる)
	return false;
    }

    view.find('.check-btn').click(checkAnswerClick); // クリックハンドラ
    view.find('.title').text('Problem #' + problemNumber);
    learnjs.applyObject(problemData, view); // データバインディング

    if (problemNumber < learnjs.problems.length) {
	var buttonItem = learnjs.template('skip-btn');
	buttonItem.find('a').attr('href', '#problem-' + (problemNumber + 1));
	$('.nav-list').append(buttonItem);
	// jQueryのbind()を使い、ルータ関数でtriggerされるremovingViewにリスナーをアタッチ
	view.bind('removingView', function() {
	    buttonItem.remove();
	});
    }

    return view;
}

learnjs.landingView = function() {
    return learnjs.template('landing-view');
};

// ルータ関数: URLハッシュ#とビュー関数を対応づける
learnjs.showView = function(hash) {

    // URLハッシュ#とビュー関数を対応づけるルックアップテーブル
    var routes = {
	'#problem': learnjs.problemView,
	'': learnjs.landingView,
	'#': learnjs.landingView
    };

    var hashParts = hash.split('-')
    // 与えられたhashをもとにビュー関数を得る
    var viewFn = routes[hashParts[0]];

    // ビュー関数を呼び出してview-containerに追加
    if (viewFn) {
	learnjs.triggerEvent('removingView', []); // 既存のビューに削除されることを知らせる
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
