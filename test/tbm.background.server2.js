QUnit.module('tbm.background.server2.search', {
    beforeEach: function() {
        this.path = '/bookmark/search';

        this.SUT = tbm.background.serverFactory.create(tbm.testLib.bookmarks);

        localStorage.clear();
    },
    afterEach: function() {
        localStorage.clear();
    },
});

QUnit.test('test', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.path, { query: '[t1]' }, function(response) {
            assert.equal(response.status, 'ok');
            assert.equal(response.body.data.length, 1);
            done();
        });
    };

    start();
});

QUnit.test('test - invalid params - query not sent', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.path, {}, function(response) {
            assert.equal(response.status, 'error');
            assert.equal(response.message, 'invalid params: query is required.');
            done();
        });
    };

    start();
});

QUnit.module('tbm.background.server2.bookmarks', {
    beforeEach: function() {
        this.path = '/bookmark/bookmarks';

        this.SUT = tbm.background.serverFactory.create(tbm.testLib.bookmarks);

        localStorage.clear();
    },
    afterEach: function() {
        localStorage.clear();
    },
});

QUnit.test('test - with query', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.path, { query: '[t2]' }, function(response) {
            assert.equal(response.status, 'ok');
            assert.equal(response.body.data.length, 1);
            done();
        });
    };

    start();
});

QUnit.test('test - without query', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.path, {}, function(response) {
            assert.equal(response.status, 'ok');
            assert.equal(response.body.data.length, 3);
            done();
        });
    };

    start();
});

QUnit.module('tbm.background.server2.folders', {
    beforeEach: function() {
        this.path = '/bookmark/folders';

        this.SUT = tbm.background.serverFactory.create(tbm.testLib.bookmarks);

        localStorage.clear();
    },
    afterEach: function() {
        localStorage.clear();
    },
});

QUnit.test('test', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.path, {}, function(response) {
            assert.equal(response.status, 'ok');
            assert.equal(response.body.data.length, 3);
            done();
        });
    };

    start();
});

QUnit.module('tbm.background.server2.tags', {
    beforeEach: function() {
        this.path = '/bookmark/tags';

        this.SUT = tbm.background.serverFactory.create(tbm.testLib.bookmarks);

        localStorage.clear();
    },
    afterEach: function() {
        localStorage.clear();
    },
});

QUnit.test('test', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.path, {}, function(response) {
            assert.equal(response.status, 'ok');
            assert.equal(response.body.data.length, 2);
            done();
        });
    };

    start();
});

QUnit.module('tbm.background.server2.item.update', {
    beforeEach: function() {
        this.path = '/bookmark/item/update';

        this.SUT = tbm.background.serverFactory.create(tbm.testLib.bookmarks);

        localStorage.clear();
    },
    afterEach: function() {
        localStorage.clear();
    },
});

QUnit.test('test', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.path, { id: 111, title: 'New Title' }, function(response) {
            assert.equal(response.status, 'ok');
            assert.equal(response.body.bookmark.id, 111);
            assert.equal(response.body.bookmark.title, 'New Title');
            done();
        });
    };

    start();
});

QUnit.test('invalid params - id not sent', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.path, { title: 'New Title' }, function(response) {
            assert.equal(response.status, 'error');
            assert.equal(response.message, 'invalid params: id is required.');
            done();
        });
    };

    start();
});

QUnit.test('invalid params - title not sent', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.path, { id: 111 }, function(response) {
            assert.equal(response.status, 'error');
            assert.equal(response.message, 'invalid params: title is required.');
            done();
        });
    };

    start();
});

QUnit.module('tbm.background.server2.user.query.latest', {
    beforeEach: function() {
        this.path = '/user/query/latest';

        this.preset = function() {
            tbm.background.user.query.add('xxx');
            tbm.background.user.query.add('yyy');
        };

        this.SUT = tbm.background.serverFactory.create(tbm.testLib.bookmarks);

        localStorage.clear();
        tbm.background.user.query.reload();
    },
    afterEach: function() {
        localStorage.clear();
    },
});

QUnit.test('with data', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.path, {}, function(response) {
            assert.equal(response.status, 'ok');
            assert.equal(response.body.data, 'yyy');
            done();
        });
    };

    that.preset();
    start();
});

QUnit.test('no data', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.path, {}, function(response) {
            assert.equal(response.status, 'ok');
            assert.equal(response.body.data, '');
            done();
        });
    };

    start();
});

QUnit.module('tbm.background.server2.user.query.recent', {
    beforeEach: function() {
        this.path = '/user/query/recent';

        this.preset = function() {
            tbm.background.user.query.add('xxx');
            tbm.background.user.query.add('yyy');
        };

        this.SUT = tbm.background.serverFactory.create(tbm.testLib.bookmarks);

        localStorage.clear();
        tbm.background.user.query.reload();
    },
    afterEach: function() {
        localStorage.clear();
    },
});

QUnit.test('with data', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.path, {}, function(response) {
            assert.equal(response.status, 'ok');
            assert.equal(response.body.data.length, 2);
            assert.equal(response.body.data[0].query, 'yyy');
            assert.equal(response.body.data[1].query, 'xxx');
            done();
        });
    };

    that.preset();
    start();
});

QUnit.test('no data', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.path, {}, function(response){
            assert.equal(response.status, 'ok');
            assert.propEqual(response.body.data, []);
            done();
        });
    };

    start();
});

QUnit.module('tbm.background.server2.user.query.frequent', {
    beforeEach: function() {
        this.path = '/user/query/frequent';

        this.preset = function() {
            tbm.background.user.query.add('xxx');
            tbm.background.user.query.add('yyy');
            tbm.background.user.query.add('xxx');
            tbm.background.user.query.add('yyy');
        };

        this.SUT = tbm.background.serverFactory.create(tbm.testLib.bookmarks);

        localStorage.clear();
        tbm.background.user.query.reload();
    },
    afterEach: function() {
        localStorage.clear();
    },
});

QUnit.test('with data', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.path, {}, function(response) {
            assert.equal(response.status, 'ok');
            assert.equal(response.body.data.length, 2);
            assert.equal(response.body.data[0].count, 2);
            assert.equal(response.body.data[0].query, 'xxx');
            assert.equal(response.body.data[1].count, 2);
            assert.equal(response.body.data[1].query, 'yyy');
            done();
        });
    };

    that.preset();
    start();
});

QUnit.test('no data', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.path, {}, function(response) {
            assert.equal(response.status, 'ok');
            assert.propEqual(response.body.data, []);
            done();
        });
    };

    start();
});

QUnit.module('tbm.background.server2.user.query.add', {
    beforeEach: function() {
        this.pathAdd = '/user/query/add';
        this.pathLatest = '/user/query/latest';
        this.pathFrequent = '/user/query/frequent';

        this.preset = function() {
            tbm.background.user.query.add('xxx');
            tbm.background.user.query.add('yyy');
            tbm.background.user.query.add('xxx');
            tbm.background.user.query.add('yyy');
        };

        this.SUT = tbm.background.serverFactory.create(tbm.testLib.bookmarks);

        localStorage.clear();
        tbm.background.user.query.reload();
    },
    afterEach: function() {
        localStorage.clear();
    },
});

QUnit.test('with data', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.pathAdd, { query: 'zzz' }, function(response) {
            assert.equal(response.status, 'ok');
            assert.equal(response.body.data, null);
            step2();
        });
    };

    var step2 = function() {
        that.SUT.request(that.pathFrequent, {}, function(response) {
            assert.equal(response.status, 'ok');
            assert.equal(response.body.data.length, 3);
            assert.equal(response.body.data[0].query, 'xxx');
            assert.equal(response.body.data[1].query, 'yyy');
            assert.equal(response.body.data[2].query, 'zzz');
            done();
        });
    };

    that.preset();
    start();
});

QUnit.test('no data', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.pathAdd, { query: 'xxx' }, function(response) {
            assert.equal(response.status, 'ok');
            assert.equal(response.body.data, null);
            step2();
        });
    };

    var step2 = function() {
        that.SUT.request(that.pathLatest, {}, function(response) {
            assert.equal(response.status, 'ok');
            assert.equal(response.body.data, 'xxx');
            done();
        });
    };

    start();
});

QUnit.test('invalid params - query not sent', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.pathAdd, {}, function(response) {
            assert.equal(response.status, 'error');
            assert.equal(response.message, 'invalid params: query is required.');
            done();
        });
    };

    start();
});

QUnit.module('tbm.background.server2.user.favorite', {
    beforeEach: function() {
        this.pathList = '/user/query/favorite/list';
        this.pathAdd = '/user/query/favorite/add';
        this.pathRemove = '/user/query/favorite/remove';
        this.pathCheck = '/user/query/favorite/check';

        this.preset = function() {
            tbm.background.user.favoriteQuery.add('xxx');
            tbm.background.user.favoriteQuery.add('yyy');
        };

        this.SUT = tbm.background.serverFactory.create(tbm.testLib.bookmarks);

        localStorage.clear();
        tbm.background.user.favoriteQuery.reload();
    },
    afterEach: function() {
        localStorage.clear();
    },
});

QUnit.test('list - with data', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.pathList, {}, function(response) {
            assert.equal(response.status, 'ok');
            assert.equal(response.body.data.length, 2);
            assert.equal(response.body.data[0].query, 'xxx');
            assert.equal(response.body.data[1].query, 'yyy');
            done();
        });
    };

    that.preset();
    start();
});

QUnit.test('list - no data', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.pathList, {}, function(response) {
            assert.equal(response.status, 'ok');
            assert.propEqual(response.body.data, []);
            done();
        });
    };

    start();
});

QUnit.test('operation', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.pathCheck, { query: 'zzz' }, function(response) {
            assert.equal(response.status, 'ok');
            assert.equal(response.body.answer, false);
            step2();
        });
    };

    var step2 = function() {
        that.SUT.request(that.pathAdd, { query: 'zzz' }, function(response) {
            assert.equal(response.status, 'ok');
            step3();
        });
    };

    var step3 = function() {
        that.SUT.request(that.pathList, {}, function(response) {
            assert.equal(response.status, 'ok');
            assert.equal(response.body.data.length, 1);
            assert.equal(response.body.data[0].query, 'zzz');
            step4();
        });
    };

    var step4 = function() {
        that.SUT.request(that.pathRemove, { query: 'zzz' }, function(response) {
            assert.equal(response.status, 'ok');
            step5();
        });
    };

    var step5 = function() {
        that.SUT.request(that.pathList, {}, function(response) {
            assert.equal(response.status, 'ok');
            assert.equal(response.body.data.length, 0);
            done();
        });
    };

    start();
});

QUnit.test('add - invalid params - query not sent', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.pathAdd, {}, function(response) {
            assert.equal(response.status, 'error');
            assert.equal(response.message, 'invalid params: query is required.');
            done();
        });
    };

    start();
});

QUnit.test('remove - invalid params - query not sent', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.pathRemove, {}, function(response) {
            assert.equal(response.status, 'error');
            assert.equal(response.message, 'invalid params: query is required.');
            done();
        });
    };

    start();
});

QUnit.test('check - invalid params - query not sent', function(assert) {
    var that = this;
    var done = assert.async();

    var start = function() {
        that.SUT.start(function() {
            step1();
        });
    };

    var step1 = function() {
        that.SUT.request(that.pathCheck, {}, function(response) {
            assert.equal(response.status, 'error');
            assert.equal(response.message, 'invalid params: query is required.');
            done();
        });
    };

    start();
});
