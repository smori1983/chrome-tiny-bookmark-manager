QUnit.module('tbm.background.server2.commonError', {
  beforeEach: function() {
    this.SUT = tbm.background.serverFactory.create(tbm.testLib.bookmarks);

    localStorage.clear();
  },
  afterEach: function() {
    localStorage.clear();
  },
});

QUnit.cases
  .init([
    { path: '/foo' },
    { path: '/USER/QUERY/LATEST' },
  ])
  .test('invalid path', function(params, assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
      that.SUT.start(function() {
        step1();
      });
    };

    var step1 = function() {
      that.SUT.request(params.path, {}, function(response) {
        assert.equal(response.status, 'error');
        assert.equal(response.message, 'path not found.');
        done();
      });
    };

    start();
  });
