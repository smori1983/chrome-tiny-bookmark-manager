QUnit.module('tbm.background.user.favoriteQuery', {
  beforeEach: function() {
    this.preset = function() {
      this.SUT.add('word3');
      this.SUT.add('word2');
      this.SUT.add('word1');
    };

    this.SUT = tbm.background.user.favoriteQuery;
    this.SUT.reload();

    localStorage.clear();
  },
  afterEach: function() {
    localStorage.clear();
  },
});

QUnit.cases
  .init([
    { input: 'abc', result: false },
    { input: 'WORD1', result: false },

    { input: 'word1', result: true },
    { input: 'word2', result: true },
    { input: 'word3', result: true },
  ])
  .test('check', function(params, assert) {
    this.preset();

    assert.equal(this.SUT.check(params.input), params.result);
  });

QUnit.test('getAll - no data', function(assert) {
  assert.propEqual(this.SUT.getAll(), []);
});

QUnit.test('getAll', function(assert) {
  this.SUT.add('word3');
  this.SUT.add('word2');
  this.SUT.add('word1');

  var result = [
    { query: 'word1'},
    { query: 'word2'},
    { query: 'word3'},
  ];

  assert.propEqual(this.SUT.getAll(), result);
});

QUnit.test('add - not added twice for existing data', function(assert) {
  this.SUT.add('xxx');
  this.SUT.add('xxx');
  this.SUT.add('xxx');

  var result = [
    { query: 'xxx'},
  ];

  assert.propEqual(this.SUT.getAll(), result);
});

QUnit.test('remove - no effect for non-existing data', function(assert) {
  this.preset();

  this.SUT.remove('word1');
  this.SUT.remove('word2');
  this.SUT.remove('WORD3');

  var result = [
    { query: 'word3'},
  ];

  assert.propEqual(this.SUT.getAll(), result);
});
