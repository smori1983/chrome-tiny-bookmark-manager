QUnit.module('tbm.setting', {
    beforeEach: function() {
        localStorage.clear();
    },
    afterEach: function() {
        localStorage.clear();
    }
});

QUnit.test('latest_query - default value', function(assert) {
    assert.equal(tbm.setting.get('latest_query'), 'yes');
});

QUnit.test('latest_query - update', function(assert) {
    tbm.setting.set('latest_query', 'yes');
    assert.equal(tbm.setting.get('latest_query'), 'yes');

    tbm.setting.set('latest_query', 'no');
    assert.equal(tbm.setting.get('latest_query'), 'no');
});

QUnit.test('query_store_days - default value', function(assert) {
    assert.equal(tbm.setting.get('query_store_days'), '30');
});

QUnit.test('query_store_days - update', function(assert) {
    tbm.setting.set('query_store_days', '90');
    assert.equal(tbm.setting.get('query_store_days'), '90');

    tbm.setting.set('query_store_days', '10');
    assert.equal(tbm.setting.get('query_store_days'), '10');
});

QUnit.test('invalid key - set', function(assert) {
    tbm.setting.set('hoge', 'hogehoge');
    assert.equal(tbm.setting.get('hoge'), null);
});

QUnit.test('invalid key - get', function(assert) {
    assert.equal(tbm.setting.get('hoge'), null);
});

