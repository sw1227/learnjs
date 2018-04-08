describe('LearnJS', function() {
    it('can show a problem view', function() {
	learnjs.showView('#problem-1');
	expect($('.view-container .problem-view').length).toEqual(1);
    });

    it('shows the landing page view when there is no hash', function() {
	// ヌルケース(デフォルトケース)
	learnjs.showView('');
	expect($('.view-container .landing-view').length).toEqual(1);
    });

    it('passes the hash view parameter to the view function', function() {
	// JasmineのspyOn()を使い、指定の関数をスパイに置き換え、呼び出しを全て記録する
	spyOn(learnjs, 'problemView');
	learnjs.showView('#problem-42');
	expect(learnjs.problemView).toHaveBeenCalledWith('42');
    });

    it('invokes the router when loaded', function() {
	spyOn(learnjs, 'showView');
	learnjs.appOnReady();
	expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash);
    });

    it('subscribe to the hash change event', function() {
	// ロードした後にスパイすることで、hashchangeイベント時のshowView()の呼び出しを記録
	learnjs.appOnReady();
	spyOn(learnjs, 'showView');
	// テストランナーのハッシュを変更すると、状態の一貫性がテスト順序によって損なわれ得る
	// 従って実際にハッシュを変更するのではなくjQueryでhashchangeイベントをtriggerする
	$(window).trigger('hashchange');
	expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash);
    });


    describe('problem view', function() {
	it('has a title that includes the problem Number', function () {
	    var view = learnjs.problemView('1');
	    // テキストのままだと, おそらくh3タグによって改行が入りfailする
	    expect(view.find('.title').text()).toEqual('Problem #1');
	});

	it('shows the description', function() {
	    var view = learnjs.problemView('1');
	    expect(view.find('[data-name="description"]').text()).toEqual('What is truth?');
	});

	it('shows the problem code', function() {
	    var view = learnjs.problemView('1');
	    expect(view.find('[data-name="code"]').text())
		.toEqual('function problem() { return __; }');
	});

	it('can check a correct answer by hitting a button', function() {
	    var view = learnjs.problemView('1');
	    view.find('.answer').val('true');
	    view.find('.check-btn').click();
	    expect(view.find('.result span').text()).toEqual('Correct!');
	});

	it('rejects an incorrect answer', function() {
	    var view = learnjs.problemView('1');
	    view.find('.answer').val('false');
	    view.find('.check-btn').click();
	    expect(view.find('.result').text()).toEqual('Incorrect!');
	});
    });
});
