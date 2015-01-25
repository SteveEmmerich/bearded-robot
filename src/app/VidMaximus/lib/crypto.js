/**
*	Crypto library
**/
'use strict';

var crypto = function() 
{
	var cryptLevel = -1;
	this.getCryptLevel = function()
	{
		return cryptLevel;
	};
	this.setCryptLevel = function(level)
	{
		if (cryptLevel === -1)
		{
			cryptLevel = level;
		}
	};
};

model.exports = new crypto();