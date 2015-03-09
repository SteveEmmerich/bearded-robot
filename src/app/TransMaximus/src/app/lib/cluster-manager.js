var cluster = require('cluster');
var valueCache = require('lib/value-manager.js');
var logger = require('lib/logger.js');

var hasForked = false;
var preForkedListeners = {};
var workers = [];
var exports = {};
exports.listen = function(cmd, hookFunc)
{
	if (cluster.isMaster)
	{
		if (!hasForked)
		{
			if (typeof preForkedListeners[cmd] == 'undefined')
			{
				preForkedListeners[cmd] = [];
			}
			preForkedListeners[cmd].push(hookFunc);
		}
		else
		{
			for (var k in cluster.workers)
			{
				cluster.workers[k].setMaxListeners(0);
				cluster.workers[k].on('message',
				(function(workerId)
				{
					return function(msg) {
						if (typeof msg != 'object' || typeof msg.cmd != 'string' || msg.cmd !== cmd)
						{
							return;
						}
						return hookFunc(msg.data, workerId);
					};

				})(k));
			}
		}
	}
	else
	{
		process.on('message', function(msg)
		{
			if (typeof msg != 'object' || typeof msg.cmd != 'string' || msg.cmd !== cmd)
				return;
			return hookFunc(msg.data, false);
		})
	}
}

exports.fork = function()
{
	if(!cluster.isMaster)
		throw 'workers cannot fork workers'
	if(hasForked)
		throw 'workers are already forked'
	
	var numCpu = require('os').cpus().length;
	for (var i = 0; i < 1; ++i)
	{
		cluster.fork();
	}
	for (var k in cluster.workers)
	{
		workers.push(k);
	}
	hasForked = true;
	for (var cmd in preForkedListeners)
	{
		preForkedListeners[cmd].forEach(function(hookFunc)
		{
			exports.listen(cmd, hookFunc);
		});
	}
	preForkedListeners = false;
    return numCpu;
}

exports.sendToWorker = function(workerId, cmd, data, done)
{
	if (!cluster.isMaster)
	{
		return process.nextTick(function ()
		{
			done('Cannot sent to worker ' + workerId + ' from worker');
		});
	}
	else
	{
		cluster.workers[workerId].send({cmd: cmd, data:data});
	}
}

exports.send = function(cmd, data)
{
	if (cluster.isMaster)
	{
		for (var k in cluster.workers)
		{
			cluster.workers[k].send({cmd: cmd, data:data});
		}
	}
	else
	{
		process.send({cmd:cmd, data:data});
	}
}

exports.getWorkerIds = function()
{
	return JSON.parse(JSON.stringify(workers));
}

exports.eachWorker = function(func)
{
	workers.forEach(function(k)
	{
		func(k);
	});
}

function isFirstWorker()
{
	if(cluster.isMaster)
	{
		return false;
	}
	else
	{
		return ('' + cluster.worker.id) == '1';
	}
}

exports.workerId = function()
{
	if (cluster.isMaster)
	{
		return false;
	}
	else
	{
		return cluster.worker.id;
	}
}

exports.isMaster = function()
{
	return cluster.isMaster;
}

exports.isWorker = function()
{
	return !cluster.isMaster;
}

exports.createSync = function(id, func)
{
	if (cluster.isMaster)
	{
		exports.listen(id, function(args, workerId)
		{
			var func_args = [];
			for( var i = 0; i < args.length; ++i)
			{
				(function(arg)
				{
					if (typeof arg == 'object' && arg !== null && arg.$__func === true)
					{
						func_args.push(function()
						{
							exports.sendToWorker(workerId, id, {
								func: arg.func,
								args: [].slice.call(arguments)
							});
						});
					}
					else
					{
						func_args.push(arg);
					}
				})(args[i]);
			}
			func.apply(null, func_args);
		});
		return func;
	}
	else
	{
		exports.listen(id, function(data)
		{
			valueCache.get(data.func).apply(null, data.args);
			valueCache.kill(data.func);
		});
		return function()
		{
			var args = [];
			for (var i = 0; i < arguments.length; ++i)
			{
				if (typeof arguments[i] == 'function')
				{
					args.push({$__func:true, func:valueCache.create(arguments[i])});
				}
				else
				{
					args.push(arguments[i]);
				}
			}
			exports.send(id, args);
		}
	}
}
module.exports = exports;
