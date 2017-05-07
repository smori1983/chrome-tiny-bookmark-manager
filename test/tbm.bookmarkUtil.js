QUnit.module('tbm.bookmarkUtil', {
    beforeEach: function() {
        this.SUT = tbm.bookmarkUtil;
    },
    afterEach: function() {
    }
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
