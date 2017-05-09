QUnit.module('tbm.bookmarkManager', {
    beforeEach: function() {
        this.SUT = tbm.bookmarkManager;

        this.foundIds = function(searchResult) {
            return searchResult.map(function(bookmark) {
                return bookmark.id;
            });
        };

        localStorage.clear();
    },
    afterEach: function() {
        localStorage.clear();
    }
});

QUnit.test('getBookmarks', function(assert) {
    var that = this;
    var manager = that.SUT(tbm.testLib.bookmarks);

    manager.init();

    assert.propEqual(that.foundIds(manager.getBookmarks()), [101, 103, 102]);
});

QUnit.cases.init([
    { query: '[t1]', ids: [103] },
    { query: '01', ids: [101, 103, 102] },
]).
test('getBookmarks - with query', function(params, assert) {
    var that = this;
    var manager = that.SUT(tbm.testLib.bookmarks);

    manager.init();

    assert.propEqual(that.foundIds(manager.getBookmarks(params.query)), params.ids);
});

QUnit.test('getFolders', function(assert) {
    var that = this;
    var manager = that.SUT(tbm.testLib.bookmarks);

    manager.init();

    var expected = [
        { name: 'folder_01_01' },
        { name: 'その他のブックマーク' },
        { name: 'ブックマーク バー' },
    ];

    assert.propEqual(manager.getFolders(), expected);
});

QUnit.test('getTags', function(assert) {
    var that = this;
    var manager = that.SUT(tbm.testLib.bookmarks);

    manager.init();

    var expected = [
        { name: 't1' },
        { name: 't2' },
    ];

    assert.propEqual(manager.getTags(), expected);
});

QUnit.test('updateBookmark', function(assert) {
    var that = this;
    var manager = that.SUT(tbm.testLib.bookmarks);
    var done = assert.async();

    manager.init();

    manager.updateBookmark(100, {
        title: 'Modified Title',
    }, function(bookmark) {
        assert.equal(bookmark.id, 100);
        assert.equal(bookmark.title, 'Modified Title');
        done();
    });
});
