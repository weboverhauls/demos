(function ( $ ) {

	$.fn.tabs = function tabs (options) {

		return this.each(function onEach() {

			// set variables
			var $tabsWidget = $(this),
				$tablist = $tabsWidget.find('> ul'),
				$tabs = $tablist.find('> li'),
				$links = $tabs.find('> a'),
				$panels = $tabsWidget.find('> div div'),
				activeTab,
				prevItem,
				lastItem,
				nextItem,
				firstItem;

			// init - Add ARIA role and state
			$tablist.attr('role', 'tablist');

			$tabs.attr('role', 'presentation');

			$links
				.attr('role', 'tab')
				.attr('aria-selected', 'false')
				.attr("tabindex", "-1")
				.first()
					.attr('aria-selected', 'true')
					.attr("tabindex", "0");

			$panels
				.attr('role', 'tabpanel')
				.attr('aria-hidden', 'true')
				.first()
					.attr('aria-hidden', 'false');

			// init - Add aria labelledby and controls
			$links.each(function onEachTab(idx, el) {
				var $tab = $(el),
					tabId = $tabsWidget.attr('id') + '_t_' + idx,
					panelId = $tabsWidget.attr('id') + '_p_' + idx;

				$tab
					.attr('id', tabId)
					.attr('aria-controls', panelId);

				$panels.eq(idx)
					.attr('id', panelId)
					.attr('aria-labelledby', tabId);
			});

			// Unselect active tab, select the new tab, show panel
			var focusTab = function(newTab) {
				// Unselect active tab
				activeTab = $($tabsWidget).find('a[aria-selected=true]');
				
				activeTab
					.attr("aria-selected", "false")
					.attr("tabindex", "-1");

				// Hide active panel
				$("#" + activeTab.attr("aria-controls")).attr("aria-hidden", "true");

				// Select the new tab
				newTab
					.attr("aria-selected", "true")
					.attr("tabindex", "0");

				// Show the controlled panel 
				$("#" + newTab.attr("aria-controls")).attr("aria-hidden", "false");
					newTab.focus();
			}

			// Capture key events on tabs
			$($tabsWidget).find("a[role='tab']").keydown(function(event) {
				if (event.which === 37 || event.which === 38) { // left or up keys
					prevItem = $(event.currentTarget).parent().prev().find("a");
					// Go to previous, if exists
					if (prevItem.length > 0) {
						focusTab(prevItem);
						event.preventDefault(); 
					}
					else {
						// Go to last
						lastItem = $(event.currentTarget).parent().siblings().last().find("a");
						focusTab(lastItem);
						event.preventDefault();
					}
				}
				else if (event.which === 39 || event.which === 40) { // right or down keys
					nextItem = $(event.currentTarget).parent().next().find("a");
					// Go to next, if exists
					if (nextItem.length > 0) {
						focusTab(nextItem);
						event.preventDefault(); 
					}
					else {
						// Go to first
						firstItem = $(event.currentTarget).parent().siblings().first().find("a");
						focusTab(firstItem);
						event.preventDefault(); 
					}
				}
				else if (event.which === 36) { // home key
					firstItem = $(event.currentTarget).parent().siblings().first().find("a");
					focusTab(firstItem);
					event.preventDefault();
				}
				else if (event.which === 35) { // end key
					lastItem = $(event.currentTarget).parent().siblings().last().find("a");
					focusTab(lastItem);
					event.preventDefault();
				}
			});

			// Support mouse click on tabs
			$links.click(function(event) {
				focusTab($(event.currentTarget));
				event.preventDefault(); 
			});

		});
	};
}( jQuery ));
