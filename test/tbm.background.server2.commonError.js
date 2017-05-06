QUnit.module('tbm.background.server2.commonError', {
    beforeEach: function() {
        this.SUT = tbm.background.server2;

        localStorage.clear();
    },
    afterEach: function() {
        localStorage.clear();
    }
});

QUnit.cases.init([
    { path: '/foo' },
    { path: '/USER/QUERY/LATEST' },
]).
test('invalid path', function(params, assert) {
    var result = this.SUT.request(params.path, {});

    assert.equal(result.status, 'error');
    assert.equal(result.message, 'path not found.');
});
