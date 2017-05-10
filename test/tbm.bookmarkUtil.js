QUnit.module('tbm.bookmarkUtil', {
    beforeEach: function() {
        this.SUT = tbm.bookmarkUtil;
    },
    afterEach: function() {
    },
});

QUnit.cases.init([
    { input: '', output: [] },
    { input: 'title', output: [] },
    { input: '[]title', output: [] },
    { input: '[tag1title', output: [] },
    { input: '[[]]title', output: [] },
    { input: '[[tag1]]title', output: [] },

    { input: '[tag1]title', output: ['tag1'] },
    { input: '[tag1][tag2]title', output: ['tag1', 'tag2'] },

    { input: ' [tag1][tag2]title', output: ['tag1', 'tag2'] },

    { input: '[tag1] [tag2]title', output: ['tag1', 'tag2'] },

    { input: '[tag1][tag1][tag1]title', output: ['tag1', 'tag1', 'tag1'] },
]).
test('tags', function(params, assert) {
    assert.propEqual(this.SUT.getTags(params.input), params.output);
});

QUnit.cases.init([
    { title: 'title', folders: ['bookmark bar'], output: 'title' },

    { title: 'title', folders: ['bookmark bar', 'f1'], output: '[f1]title' },
    { title: 'title', folders: ['bookmark bar', 'f1', 'f2'], output: '[f1][f2]title' },

    { title: '[t1]title', folders: ['bookmark bar'], output: '[t1]title' },
    { title: '[t1][t2]title', folders: ['bookmark bar'], output: '[t1][t2]title' },

    { title: '[t1][t2]title', folders: ['bookmark bar', 'f1', 'f2'], output: '[f1][f2][t1][t2]title' },
]).
test('fullTitle', function(params, assert) {
    assert.equal(this.SUT.getFullTitle(params.title, params.folders), params.output);
});
