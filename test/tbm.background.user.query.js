QUnit.module('tbm.background.user.query', {
    beforeEach: function() {
        this.SUT = tbm.background.user.query;
        this.SUT.setStoreDays(28);
        this.SUT.setRecentFetchSize(20);
        this.SUT.setFrequentFetchSize(20);
        this.SUT.reload();

        localStorage.clear();
    },
    afterEach: function() {
        localStorage.clear();
    }
});

QUnit.test('getLatest', function(assert) {
    this.SUT.add('aaa');
    this.SUT.add('bbb');
    this.SUT.add('ccc');

    assert.equal(this.SUT.getLatest(), 'ccc');
});

QUnit.test('getRecent', function(assert) {
    this.SUT.setRecentFetchSize(2);

    this.SUT.add('aaa');
    this.SUT.add('bbb');
    this.SUT.add('ccc');

    var recent = this.SUT.getRecent();

    assert.equal(recent.length, 2);
    assert.equal(recent[0].query, 'ccc');
    assert.equal(recent[1].query, 'bbb');
});

QUnit.test('getRecent - with expired data', function(assert) {
    smodules.storage.setJSON('user.query', [
        { date: '2000-01-01', query: 'ccc' },
        { date: '2000-01-02', query: 'ccc' },
        { date: '2000-01-03', query: 'ccc' },
    ]);

    this.SUT.add('aaa');

    var recent = this.SUT.getRecent();

    assert.equal(recent.length, 1);
    assert.equal(recent[0].query, 'aaa');
});

QUnit.test('getFrequent', function(assert) {
    this.SUT.setFrequentFetchSize(2);

    this.SUT.add('aaa');
    this.SUT.add('bbb');
    this.SUT.add('ccc');
    this.SUT.add('bbb');
    this.SUT.add('ccc');
    this.SUT.add('ccc');

    var frequent = this.SUT.getFrequent();

    assert.equal(frequent.length, 2);
    assert.equal(frequent[0].query, 'ccc');
    assert.equal(frequent[0].count, 3);
    assert.equal(frequent[1].query, 'bbb');
    assert.equal(frequent[1].count, 2);
});

QUnit.test('getFrequent - with expired data', function(assert) {
    smodules.storage.setJSON('user.query', [
        { date: '2000-01-01', query: 'ccc' },
        { date: '2000-01-02', query: 'ccc' },
        { date: '2000-01-03', query: 'ccc' },
    ]);

    this.SUT.add('aaa');

    var frequent = this.SUT.getFrequent();

    assert.equal(frequent.length, 1);
});
