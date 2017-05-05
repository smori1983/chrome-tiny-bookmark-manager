QUnit.module('tbm.util.tag', {
    beforeEach: function() {
    },
    afterEach: function() {
    }
});

QUnit.cases.init([
    { input: null, output: '' },
    { input: true, output: '' },
    { input: false, output: '' },
    { input: 10, output: '' },
    { input: 1.1, output: '' },
    { input: [], output: '' },
    { input: {}, output: '' },

    { input: 'hoge', output: 'hoge' },

    { input: '{{strong}}', output: '{{strong}}' },
    { input: '{{code}}', output: '{{code}}' },

    { input: '{{h1:hoge}}', output: '{{h1:hoge}}' },
    { input: '{{div:hoge}}', output: '{{div:hoge}}' },

    { input: '{{strong:hoge}}', output: '<strong>hoge</strong>' },
    { input: '{{code:hoge}}', output: '<code>hoge</code>' },
]).
test('tests', function(params, assert) {
    assert.equal(tbm.util.tag(params.input), params.output);
});
