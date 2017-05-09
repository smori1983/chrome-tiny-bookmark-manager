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
    }
});

QUnit.test('with data', function(assert) {
    var that = this;
    var done = assert.async();

    that.preset();

    that.SUT.request(that.path, {}, function(response) {
        assert.equal(response.status, 'ok');
        assert.equal(response.body.data, 'yyy');
        done();
    });
});

QUnit.test('no data', function(assert) {
    var that = this;
    var done = assert.async();

    that.SUT.request(that.path, {}, function(response) {
        assert.equal(response.status, 'ok');
        assert.equal(response.body.data, '');
        done();
    });
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
    }
});

QUnit.test('with data', function(assert) {
    var that = this;
    var done = assert.async();

    that.preset();

    that.SUT.request(that.path, {}, function(response) {
        assert.equal(response.status, 'ok');
        assert.equal(response.body.data.length, 2);
        assert.equal(response.body.data[0].query, 'yyy');
        assert.equal(response.body.data[1].query, 'xxx');
        done();
    });
});

QUnit.test('no data', function(assert) {
    var that = this;
    var done = assert.async();

    that.SUT.request(that.path, {}, function(response){
        assert.equal(response.status, 'ok');
        assert.propEqual(response.body.data, []);
        done();
    });
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
    }
});

QUnit.test('with data', function(assert) {
    var that = this;
    var done = assert.async();

    that.preset();

    that.SUT.request(that.path, {}, function(response) {
        assert.equal(response.status, 'ok');
        assert.equal(response.body.data.length, 2);
        assert.equal(response.body.data[0].count, 2);
        assert.equal(response.body.data[0].query, 'xxx');
        assert.equal(response.body.data[1].count, 2);
        assert.equal(response.body.data[1].query, 'yyy');
        done();
    });
});

QUnit.test('no data', function(assert) {
    var that = this;
    var done = assert.async();

    that.SUT.request(that.path, {}, function(response) {
        assert.equal(response.status, 'ok');
        assert.propEqual(response.body.data, []);
        done();
    });
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
    }
});

QUnit.test('with data', function(assert) {
    var that = this;
    var done = assert.async();

    that.preset();

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

    step1();
});

QUnit.test('no data', function(assert) {
    var that = this;
    var done = assert.async();

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

    step1();
});

QUnit.test('invalid params - query not sent', function(assert) {
    var that = this;
    var done = assert.async();

    that.SUT.request(that.pathAdd, {}, function(response) {
        assert.equal(response.status, 'error');
        assert.equal(response.message, 'invalid params: query is required.');
        done();
    });
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
    }
});

QUnit.test('list - with data', function(assert) {
    var that = this;
    var done = assert.async();

    that.preset();

    that.SUT.request(that.pathList, {}, function(response) {
        assert.equal(response.status, 'ok');
        assert.equal(response.body.data.length, 2);
        assert.equal(response.body.data[0].query, 'xxx');
        assert.equal(response.body.data[1].query, 'yyy');
        done();
    });
});

QUnit.test('list - no data', function(assert) {
    var that = this;
    var done = assert.async();

    that.SUT.request(that.pathList, {}, function(response) {
        assert.equal(response.status, 'ok');
        assert.propEqual(response.body.data, []);
        done();
    });
});

QUnit.test('operation', function(assert) {
    var that = this;
    var done = assert.async();

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

    step1();
});

QUnit.test('add - invalid params - query not sent', function(assert) {
    var that = this;
    var done = assert.async();

    that.SUT.request(that.pathAdd, {}, function(response) {
        assert.equal(response.status, 'error');
        assert.equal(response.message, 'invalid params: query is required.');
        done();
    });
});

QUnit.test('remove - invalid params - query not sent', function(assert) {
    var that = this;
    var done = assert.async();

    that.SUT.request(that.pathRemove, {}, function(response) {
        assert.equal(response.status, 'error');
        assert.equal(response.message, 'invalid params: query is required.');
        done();
    });
});

QUnit.test('check - invalid params - query not sent', function(assert) {
    var that = this;
    var done = assert.async();

    that.SUT.request(that.pathCheck, {}, function(response) {
        assert.equal(response.status, 'error');
        assert.equal(response.message, 'invalid params: query is required.');
        done();
    });
});
