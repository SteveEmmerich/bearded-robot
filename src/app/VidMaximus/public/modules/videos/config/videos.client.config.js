'use strict';

// Configuring the Articles module
angular.module('videos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Videos', 'videos', 'dropdown', '/videos(/create)?');
		Menus.addSubMenuItem('topbar', 'videos', 'List Videos', 'videos');
		Menus.addSubMenuItem('topbar', 'videos', 'New Video', 'videos/create');
	}
]);