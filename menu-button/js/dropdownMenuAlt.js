/**
 * @fileOverview Dropdown menu button widget
 * @name PayPal Dropdown Menu Alt
 * @author swesthafer, dlembree
 */

(function() {
	"use strict";
	
	$.widget("widget.dropdownMenuAlt", {
		options: {
			showOn: "click" //default show on click. Mouseenter another valid option
		},
		_create: function() {
			this._getElements();
			this._updateElements();
			this._addListeners();
		},
		// get elements to manipulate and base calculations off of
		_getElements: function() {
			this.elements = {};
			
			// the menu container (div role=menu)
			this.elements.container = this.element.find("div:first");
		},
		// add listeners for show/hide the menu
		_addListeners: function() {
			
			// close menu when you click off the dropdownMenu
			$("html").bind("click", $.proxy(this.closeMenu, this));
			this.element.bind("click", function (event) { event.stopPropagation(); });
			
			// close menu when someone clicks on a link
			this.element.find("ul a").on("click", $.proxy(this.closeMenu, this));
			
			// toggle the menu open/closed when you click on the link
			this.element.find(".menuButton").on(this.options.showOn,$.proxy(function(event) {
				event.preventDefault();
				this._toggleMenu();
			}, this));
			
			// toggle menu by keyboard when hitting Enter or Space
			this.element.find(".menuButton").on("keydown", $.proxy(function(event) {
				if (event.keyCode === $.ui.keyCode.ENTER || event.keyCode === $.ui.keyCode.SPACE) {
					event.preventDefault();
					this._toggleMenu();
				}
			}, this));
			
			// bind keyboard events
			this.element.bind("keydown", $.proxy(function(event) {
				
				// close menu by keyboard when hitting Escape or Tab
				if (event.keyCode === $.ui.keyCode.TAB || event.keyCode === $.ui.keyCode.ESCAPE) {
					this.closeMenu();
				}

				// navigate down
				if (event.keyCode === $.ui.keyCode.DOWN) {
					event.preventDefault();
					
					// navigate if menu is open, otherwise open the menu if it's closed
					if (this.elements.container.is(':visible')) {
						this.focus('+1');
					} else {
						this.openMenu();
					}
				}
				
				// navigate up
				if (event.keyCode === $.ui.keyCode.UP) {
					event.preventDefault();
					
					// navigate if menu is open, otherwise open the menu if it's closed
					if (this.elements.container.is(':visible')) {
						this.focus('-1');
					} else {
						this.openMenu();
					}
				}
			}, this));

			// close when another menu opens
			$('html').bind('openMenu.dropdownMenu', $.proxy(this.closeMenu, this));
		},

		// gets a menu item from a given index
		getItem: function(index) {
			return $(this.element.find('ul li a').parent('li')[index]);
		},

		// gets the index of the focused item
		getFocusedIndex: function() {
			var focusedIndex;
			this.element.find('ul li a').parent('li').each(function(index, item) {
				if ($(item).find('a:focus').length) {
					focusedIndex = index;
				}
				if (focusedIndex===undefined) {
					focusedIndex = -1;
				}
			});
			return focusedIndex;
		},

		// focuses on an item (can be an index number or the strings '+1' or '-1')
		focus: function(index) {
			var item;
			var len = this.element.find('ul a').length;
			
			// get the next available index
			if (index === '+1') {
				// increment index until we find an enabled item
				index = this.getFocusedIndex();
				do { index++; } while (this.getItem(index).hasClass('disabled'));
				if (index > len-1 ) {
					index = 0;
				}
			} 
			else if (index  === '-1') {
				// decrement index until we find an enabled item
				index = this.getFocusedIndex();
				do { index--; } while (this.getItem(index).hasClass('disabled'));
				if (index < 0 ) {
					index = len-1;
				}
			}
			
			// get item using index
			item = this.getItem(index);
			
			// return if no item to select
			if (!item.length) {
				return;
			}
			
			// set focus
			$(item.find('a')[0]).focus();
			
			// control tabindex for Firefox and Opera issues
			this.element.find('ul:first li a').attr("tabindex", "-1");
			$(item.find('a')[0]).attr("tabindex", "0");
		},
		
		// toggles the menu
		_toggleMenu: function() {
			if (this.element.hasClass('showMenu')) {
				this.closeMenu();
			} else {
				this.openMenu();
			}
		},
		
		// add parameters to elements
		_updateElements: function() {
			this.element.find('a:first').attr("aria-haspopup", "true")
				.attr("role", "button");
			this.elements.container.attr("role", "menu")
				.attr("aria-hidden", "true");
			this.element.find('div div').attr("role", "presentation");
			this.element.find('ul:first').attr("role", "presentation");
			this.element.find('ul:first li').attr("role", "presentation");
			this.element.find('ul:first li a').attr("role", "menuitem")
				.attr("tabindex", "-1");
		},
		
		// shows button
		showButton: function() {
			this.element.addClass('showButton');
		},
		
		// hides button
		hideButton: function() {
			this.element.removeClass('showButton');
			this.closeMenu();
		},
		
		// opens the menu
		openMenu: function() {
			if (this.element.hasClass('showMenu')) {
				return;
			}
			this.element.trigger('openMenu.dropdownMenu', this);
			this.element.addClass('showButton showMenu');
			this.element.find('div:first').attr("aria-hidden", "false");
			this.element.find('a:first').attr("aria-expanded", "true");
			this.focus('+1');
		},
		
		// closes the menu
		closeMenu: function() {
			if (!this.element.hasClass("showMenu")) {
				return;
			}
			this.element.removeClass("showMenu");
			this.element.find("div:first").attr("aria-hidden", "true");
			this.element.find(".menuButton").attr("aria-expanded", "false");
			this.element.find(".menuButton").focus();
		}
	});
		

}());