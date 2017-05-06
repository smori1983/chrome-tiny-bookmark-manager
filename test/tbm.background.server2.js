QUnit.module('tbm.background.server2.user.query.latest', {
    beforeEach: function() {
        this.path = '/user/query/latest';

        this.preset = function() {
            tbm.background.user.query.add('xxx');
            tbm.background.user.query.add('yyy');
        };

        this.SUT = tbm.background.server2;

        localStorage.clear();
        tbm.background.user.query.reload();
    },
    afterEach: function() {
        localStorage.clear();
    }
});

QUnit.test('with data', function(assert) {
    this.preset();

    var result = this.SUT.request(this.path, {});

    assert.equal(result.status, 'ok');
    assert.equal(result.response.data, 'yyy');
});

QUnit.test('no data', function(assert) {
    var result = this.SUT.request(this.path, {});

    assert.equal(result.status, 'ok');
    assert.equal(result.response.data, '');
});

QUnit.module('tbm.background.server2.user.query.recent', {
    beforeEach: function() {
        this.path = '/user/query/recent';

        this.preset = function() {
            tbm.background.user.query.add('xxx');
            tbm.background.user.query.add('yyy');
        };

        this.SUT = tbm.background.server2;

        localStorage.clear();
        tbm.background.user.query.reload();
    },
    afterEach: function() {
        localStorage.clear();
    }
});

QUnit.test('with data', function(assert) {
    this.preset();

    var result = this.SUT.request(this.path, {});

    assert.equal(result.status, 'ok');
    assert.equal(result.response.data.length, 2);
    assert.equal(result.response.data[0].query, 'yyy');
    assert.equal(result.response.data[1].query, 'xxx');
});

QUnit.test('no data', function(assert) {
    var result = this.SUT.request(this.path, {});

    assert.equal(result.status, 'ok');
    assert.propEqual(result.response.data, []);
});

QUnit.module('tbm.background.server2.user.query.frequent', {
    beforeEach: function() {
        this.path = '/user/query/frequent';

        this.preset = function() {
            tbm.background.user.query.add('xxx');
            tbm.background.user.query.add('yyy');
            tbm.background.user.query.add('xxx');
            tbm.background.user.query.add('yyy');
        };

        this.SUT = tbm.background.server2;

        localStorage.clear();
        tbm.background.user.query.reload();
    },
    afterEach: function() {
        localStorage.clear();
    }
});

QUnit.test('with data', function(assert) {
    this.preset();

    var result = this.SUT.request(this.path, {});

    assert.equal(result.status, 'ok');
    assert.equal(result.response.data.length, 2);
    assert.equal(result.response.data[0].count, 2);
    assert.equal(result.response.data[0].query, 'xxx');
    assert.equal(result.response.data[1].count, 2);
    assert.equal(result.response.data[1].query, 'yyy');
});

QUnit.test('no data', function(assert) {
    var result = this.SUT.request(this.path, {});

    assert.equal(result.status, 'ok');
    assert.propEqual(result.response.data, []);
});

QUnit.module('tbm.background.server2.user.query.add', {
    beforeEach: function() {
        this.pathAdd = '/user/query/add';
        this.pathLatest = '/user/query/latest';
        this.pathFrequent = '/user/query/frequent';

        this.preset = function() {
            tbm.background.user.query.add('xxx');
            tbm.background.user.query.add('yyy');
            tbm.background.user.query.add('xxx');
            tbm.background.user.query.add('yyy');
        };

        this.SUT = tbm.background.server2;

        localStorage.clear();
        tbm.background.user.query.reload();
    },
    afterEach: function() {
        localStorage.clear();
    }
});

QUnit.test('with data', function(assert) {
    this.preset();

    var result = this.SUT.request(this.pathAdd, { query: 'zzz' });

    assert.equal(result.status, 'ok');
    assert.equal(result.response.data, null);

    var frequent = this.SUT.request(this.pathFrequent, {});

    assert.equal(frequent.status, 'ok');
    assert.equal(frequent.response.data.length, 3);
    assert.equal(frequent.response.data[0].query, 'xxx');
    assert.equal(frequent.response.data[1].query, 'yyy');
    assert.equal(frequent.response.data[2].query, 'zzz');
});

QUnit.test('no data', function(assert) {
    var result = this.SUT.request(this.pathAdd, { query: 'xxx' });

    assert.equal(result.status, 'ok');
    assert.equal(result.response.data, null);

    var latest = this.SUT.request(this.pathLatest, {});

    assert.equal(latest.status, 'ok');
    assert.equal(latest.response.data, 'xxx');
});

QUnit.test('invalid params - query not sent', function(assert) {
    var result = this.SUT.request(this.pathAdd, {});

    assert.equal(result.status, 'error');
    assert.equal(result.message, 'invalid params: query is required.');
});
