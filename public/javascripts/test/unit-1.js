/**
 * Created by WuYijie on 1/15/15.
 */

function format(string, values) {
    for (var key in values) {
        string = string.replace(new RegExp("\{" + key + "}", "g"), values[key]);
    }
    return string;
}

module("basics", {
    setup: function(){

    },
    teardown: function(){

    }

});

test("basics", function() {
    var values = {
        name: "World"
    };
    equal( format("Hello, {name}", values), "Hello, World", "单个匹配" );
    equal( format("Hello, {name}, how is {name} today?", values),
        "Hello, World, how is World today?", "多个匹配" );
});