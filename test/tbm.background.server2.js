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
