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
