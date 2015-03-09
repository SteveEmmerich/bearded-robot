(function(inner)
{
    var values = {};
    var nextIndex = 0;
    inner.create = function(val)
    {
        var id = nextIndex;
        nextIndex++;
        values[id] = val;
        return id;
    }

    inner.get = function(id)
    {
        return values[id];
    }

    inner.kill = function(id)
    {
        delete values[id];
        return this;
    }
})((function()
{
    if (typeof exports != 'undefined')
        return exports;

    window.valueManager = {};
    return window.valueManager;
}));