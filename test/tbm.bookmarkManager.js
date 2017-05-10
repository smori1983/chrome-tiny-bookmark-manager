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
    },
});

QUnit.test('getBookmarks', function(assert) {
    var that = this;
    var manager = that.SUT(tbm.testLib.bookmarks);
    var done = assert.async();

    manager.init(function() {
        assert.propEqual(that.foundIds(manager.getBookmarks()), [101, 103, 102]);
        done();
    });
});

QUnit.cases.init([
    { query: '[t1]', ids: [103] },
    { query: '01', ids: [101, 103, 102] },
]).
test('getBookmarks - with query', function(params, assert) {
    var that = this;
    var manager = that.SUT(tbm.testLib.bookmarks);
    var done = assert.async();

    manager.init(function() {
        assert.propEqual(that.foundIds(manager.getBookmarks(params.query)), params.ids);
        done();
    });
});

QUnit.test('getFolders', function(assert) {
    var that = this;
    var manager = that.SUT(tbm.testLib.bookmarks);
    var done = assert.async();

    var expected = [
        { name: 'folder_01_01' },
        { name: 'その他のブックマーク' },
        { name: 'ブックマーク バー' },
    ];

    manager.init(function() {
        assert.propEqual(manager.getFolders(), expected);
        done();
    });
});

QUnit.test('getTags', function(assert) {
    var that = this;
    var manager = that.SUT(tbm.testLib.bookmarks);
    var done = assert.async();

    var expected = [
        { name: 't1' },
        { name: 't2' },
    ];

    manager.init(function() {
        assert.propEqual(manager.getTags(), expected);
        done();
    });
});

QUnit.test('updateBookmark', function(assert) {
    var that = this;
    var manager = that.SUT(tbm.testLib.bookmarks);
    var done = assert.async();

    manager.init(function() {
        manager.updateBookmark(100, {
            title: 'Modified Title',
        }, function(bookmark) {
            assert.equal(bookmark.id, 100);
            assert.equal(bookmark.title, 'Modified Title');
            done();
        });
    });
});

QUnit.test('update', function(assert) {
    var that = this;
    var manager = that.SUT(tbm.testLib.bookmarks);
    var done = assert.async();

    var timestamp1;
    var timestamp2;

    var step1 = function() {
        manager.init(function() {
            timestamp1 = manager.getTimestamp();
            step2();
        });
    };

    var step2 = function() {
        manager.update(function() {
            timestamp2 = manager.getTimestamp();
            assert.ok(timestamp1 < timestamp2);
            done();
        });
    };

    step1();
});
