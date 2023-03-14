<?php
namespace LAM\HEADER;
/*
$Id$

  This code is part of LDAP Account Manager (http://www.ldap-account-manager.org/)
  Copyright (C) 2003 - 2017  Roland Gruber

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation; either version 2 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

*/

/**
* Head part of page which includes links to lists etc.
*
* @package main
* @author Roland Gruber
*/

$headerPrefix = "";
if (is_file("../login.php")) $headerPrefix = "../";
elseif (is_file("../../login.php")) $headerPrefix = "../../";

/** tool definitions */
include_once($headerPrefix . "../lib/tools.inc");

$pro = '';
if (isLAMProVersion()) {
	$pro = ' Pro';
}

// HTML header and title
echo $_SESSION['header'];
echo "<link rel=\"shortcut icon\" type=\"image/x-icon\" href=\"" . $headerPrefix . "../graphics/favicon.ico\">\n";
echo "<link rel=\"icon\" href=\"" . $headerPrefix . "../graphics/logo136.png\">\n";
echo "<title>LDAP Account Manager" . $pro . " (" . str_replace(array('ldap://', 'ldaps://'), array('', ''), $_SESSION['config']->get_ServerURL()) . ")</title>\n";

// include all CSS files
$cssDirName = dirname(__FILE__) . '/../style';
$cssDir = dir($cssDirName);
$cssFiles = array();
$cssEntry = $cssDir->read();
while ($cssEntry !== false) {
	if (substr($cssEntry, strlen($cssEntry) - 4, 4) == '.css') {
		$cssFiles[] = $cssEntry;
	}
	$cssEntry = $cssDir->read();
}
sort($cssFiles);
foreach ($cssFiles as $cssEntry) {
	echo "<link rel=\"stylesheet\" type=\"text/css\" href=\"" . $headerPrefix . "../style/" . $cssEntry . "\">\n";
}

echo "</head><body>\n";

// include all JavaScript files
$jsDirName = dirname(__FILE__) . '/lib';
$jsDir = dir($jsDirName);
$jsFiles = array();
while ($jsEntry = $jsDir->read()) {
	if ((substr($jsEntry, strlen($jsEntry) - 3, 3) != '.js') && (substr($jsEntry, strlen($jsEntry) - 4, 4) != '.php')) {
		continue;
	}
	$jsFiles[] = $jsEntry;
}
sort($jsFiles);
foreach ($jsFiles as $jsEntry) {
	echo "<script type=\"text/javascript\" src=\"" . $headerPrefix . "lib/" . $jsEntry . "\"></script>\n";
}

// get tool list
$availableTools = getTools();
$toolSettings = $_SESSION['config']->getToolSettings();
// sort tools
$toSort = array();
for ($i = 0; $i < sizeof($availableTools); $i++) {
	$toolClass = $availableTools[$i];
    $myTool = new $toolClass();
	if ($myTool->getRequiresWriteAccess() && !checkIfWriteAccessIsAllowed()) {
		continue;
	}
	if ($myTool->getRequiresPasswordChangeRights() && !checkIfPasswordChangeIsAllowed()) {
		continue;
	}
	// check visibility
	if (!$myTool->isVisible()) {
		continue;
	}
	// check if hidden by config
	$toolName = substr($toolClass, strrpos($toolClass, '\\') + 1);
	if (isset($toolSettings['tool_hide_' . $toolName]) && ($toolSettings['tool_hide_' . $toolName] == 'true')) {
		continue;
	}
	$toSort[$availableTools[$i]] = $myTool->getPosition();
}
asort($toSort);
$tools = array();
foreach ($toSort as $key => $value) {
	$tools[] = new $key();
}
?>

<table border=0 width="100%" class="lamHeader ui-corner-all">
	<tr>
		<td align="left" height="30" class="nowrap">
			<a class="lamLogo" href="http://www.ldap-account-manager.org/" target="new_window">
				LDAP Account Manager
				<?php
				echo $pro . " - " . LAMVersion();
				?>
			</a>
		</td>
		<td align="left" height="30" class="nowrap">
			<?php
				echo '&nbsp;&nbsp;<small>';
				$userData = $_SESSION['ldap']->decrypt_login();
				printf('(' . _('Logged in as: %s') . ')', getAbstractDN($userData[0]));
				$userData = null;
				echo '</small>';
			?>
		</td>
	<td align="right" height=30 width="100%">
	<ul id="dropmenu" class="dropmenu">
		<li><a href="<?php echo $headerPrefix; ?>logout.php" target="_top"><img class="align-middle" height="16" width="16" alt="logout" src="<?php echo $headerPrefix; ?>../graphics/exit.png">&nbsp;<?php echo _("Logout") ?></a></li>
		<?php
		if (is_dir(dirname(__FILE__) . '/../docs/manual')) {
		?>
	    <li>
			<a target="_blank" href="<?php echo $headerPrefix; ?>../docs/manual/index.html"><img class="align-middle" width="16" height="16" alt="help" src="<?php echo $headerPrefix; ?>../graphics/help.png">&nbsp;<?php echo _("Help") ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
		</li>
		<?php
		}
		if (sizeof($tools) > 0) {
		?>
		<li>
			<a href="<?php echo $headerPrefix; ?>tools.php"><img class="align-middle" height="16" width="16" alt="tools" src="<?php echo $headerPrefix; ?>../graphics/tools.png">&nbsp;<?php echo _("Tools") ?></a>
				<ul>
				<?php
					for ($i = 0; $i < sizeof($tools); $i++) {
						$subTools = $tools[$i]->getSubTools();
						echo '<li title="' . $tools[$i]->getDescription() . '">';
						$link = $headerPrefix . $tools[$i]->getLink();
						echo '<a href="' . $link . "\">\n";
						echo '<img height="16" width="16" alt="" src="' . $headerPrefix . '../graphics/' . $tools[$i]->getImageLink() . '"> ' . $tools[$i]->getName();
						echo "</a>\n";
						if (sizeof($subTools) > 0) {
							echo "<ul>\n";
							for ($s = 0; $s < sizeof($subTools); $s++) {
								echo "<li title=\"" . $subTools[$s]->description . "\">\n";
								echo "<a href=\"" . $headerPrefix . $subTools[$s]->link . "\">\n";
								echo '<img width=16 height=16 alt="" src="' . $headerPrefix . '../graphics/' . $subTools[$s]->image . '"> ' . $subTools[$s]->name;
								echo "</a>\n";
								echo "</li>\n";
							}
							echo "</ul>\n";
						}
						echo "</li>\n";
					}
				?>
			</ul>
		</li>
		<?php
		}
		if ($_SESSION['config']->get_Suffix('tree') != "") {
		?>
	    <li>
			<a href="<?php echo $headerPrefix; ?>tree/treeViewContainer.php"><img class="align-middle" height="16" width="16" alt="tree" src="<?php echo $headerPrefix; ?>../graphics/process.png">&nbsp;<?php echo _("Tree view") ?></a>
		</li>
		<?php
		}
		?>
	</ul>
	</td>
	</tr>
</table>

<script type="text/javascript">
jQuery(document).ready(function() {
	jQuery('#dropmenu').dropmenu({
		effect  : 'slide',
		nbsp    : true,
		timeout : 350,
		speed   : 'fast'
	});
});
</script>

<br>
<div class="ui-tabs ui-widget ui-widget-content ui-corner-all">
<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">
	<?php
		printTypeTabs($headerPrefix);
	?>
</ul>

<?php

function printTypeTabs($headerPrefix) {
	$typeManager = new \LAM\TYPES\TypeManager();
	$types = $typeManager->getConfiguredTypes();
	foreach ($types as $type) {
		if ($type->isHidden()) {
			continue;
		}
		$link = '<a href="' . $headerPrefix . 'lists/list.php?type=' . $type->getId() .
		'" onmouseover="jQuery(this).addClass(\'tabs-hover\');" onmouseout="jQuery(this).removeClass(\'tabs-hover\');">' .
		'<img height="16" width="16" alt="' . $type->getId() . '" src="' . $headerPrefix . '../graphics/' . $type->getIcon() . '">&nbsp;' .
		$type->getAlias() . '</a>';
		echo '<li id="tab_' . $type->getId() . '" class="ui-state-default ui-corner-top">';
		echo $link;
		echo "</li>\n";
	}
}

