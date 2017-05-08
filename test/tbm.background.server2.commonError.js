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
    var that = this;
    var done = assert.async();

    that.SUT.request(params.path, {}, function(response) {
        assert.equal(response.status, 'error');
        assert.equal(response.message, 'path not found.');
        done();
    });
});
