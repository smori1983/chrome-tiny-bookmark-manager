/*
tbm.model = tbm.model || {};
tbm.model.setting = new (Backbone.Model.extend({
    validate: function(attrs) {
        if ($.inArray(attrs.restoreLatestQuery, ["yes", "no"]) < 0 ||
                !/^[1-9]0$/.text(attr.saveQueries.toStrong)) {
            return "attr value error.";
        }
    }

}))();
tbm.model.setting.on("change:restoreLatestQuery", function(model, value) {
    console.log(value);
});
*/
