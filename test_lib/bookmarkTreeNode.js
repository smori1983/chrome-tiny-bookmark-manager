var tbm = tbm || {};

tbm.testLib = tbm.testLib || {};

tbm.testLib.bookmarkTreeNode = (function() {
    var that = {};

    that.getRootNode = function() {
        return { children: [
            {
                title: 'ブックマーク バー', children: [
                    {
                        id: 101, title: 'webpage_01_01', url: 'http://example.com/01_01',
                    },
                    {
                        title: 'folder_01_01', children: [
                            {
                                id: 103, title: '[t2][t1]webpage_01_02', url: 'http://example.com/01_02',
                            },
                        ],
                    },
                ],
            },
            {
                title: 'その他のブックマーク', children: [
                    {
                        id: 102, title: 'webpage_02_01', url: 'http://example.com/02_01',
                    },
                ],
            },
        ]};
    };

    return that;
})();
