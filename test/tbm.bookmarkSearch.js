QUnit.module('tbm.bookmarkSearch', {
  beforeEach: function() {
    this.SUT = tbm.bookmarkSearch;

    this.bookmarkData = [
      {
        id: 101,
        title: 'title101',
        fullTitle: '[f1]title101',
        url: 'http://example.com/101',
        folders: ['f1'],
      },
      {
        id: 102,
        title: '[t1]title102',
        fullTitle: '[f2][t1]title102',
        url: 'http://example.com/102',
        folders: ['f2'],
      },
    ];

    this.foundIds = function(searchResult) {
      return searchResult.map(function(bookmark) {
        return bookmark.id;
      });
    };
  },
  afterEach: function() {
  },
});

QUnit.cases
  .init([
    { input: 'foo', ids: [] },

    { input: '10', ids: [101, 102] },

    { input: 'TITLE', ids: [101, 102] },

    { input: '[f1]', ids: [101] },
    { input: ' [f1]', ids: [101] },
    { input: '[f1] ', ids: [101] },
    { input: ' [f1] ', ids: [101] },

    { input: '[t1]', ids: [102] },
    { input: ' [t1]', ids: [102] },
    { input: '[t1] ', ids: [102] },
    { input: ' [t1] ', ids: [102] },

    { input: 'title 10', ids: [101, 102] },
    { input: 'title 999', ids: [] },

    { input: '[f1] [t1]', ids: [] },

    { input: '[f2][t1]', ids: [102] },
  ])
  .test('search', function(params, assert) {
    var found = this.SUT.execute(this.bookmarkData, params.input);

    assert.propEqual(this.foundIds(found), params.ids);
  });
