QUnit.module('tbm.bookmarkDataBuilder', {
    beforeEach: function() {
        this.SUT = tbm.bookmarkDataBuilder;
    },
    afterEach: function() {
    }
});

QUnit.test('build', function(assert) {
    var bookmarks = [
        {
            id: 101,
            title: 'webpage_01_01',
            fullTitle: 'webpage_01_01',
            url: 'http://example.com/01_01',
            folders: ['ブックマーク バー'],
        },
        {
            id: 103,
            title: '[t2][t1]webpage_01_02',
            fullTitle: '[folder_01_01][t2][t1]webpage_01_02',
            url: 'http://example.com/01_02',
            folders: ['ブックマーク バー', 'folder_01_01'],
        },
        {
            id: 102,
            title: 'webpage_02_01',
            fullTitle: 'webpage_02_01',
            url: 'http://example.com/02_01',
            folders: ['その他のブックマーク'],
        },
    ];

    var folders = [
        { name: 'folder_01_01' },
        { name: 'その他のブックマーク' },
        { name: 'ブックマーク バー' },
    ];

    var tags = [
        { name: 't1' },
        { name: 't2' },
    ];

    var rootNode = tbm.testLib.bookmarkTreeNode.getRootNode();
    var data = this.SUT.build(rootNode);

    assert.propEqual(data.bookmarks, bookmarks);
    assert.propEqual(data.folders, folders);
    assert.propEqual(data.tags, tags);
});
