<?php
/*
$Id$

  This code is part of LDAP Account Manager (http://www.ldap-account-manager.org/)
  Copyright (C) 2003 - 2016  Roland Gruber

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
* Login page to change the preferences.
*
* @package configuration
* @author Roland Gruber
*/


/** Access to config functions */
include_once('../../lib/config.inc');
/** Used to print status messages */
include_once('../../lib/status.inc');

// start session
if (strtolower(session_module_name()) == 'files') {
	session_save_path(dirname(__FILE__) . '/../../sess');
}
session_set_cookie_params(0, '/', null, null, true);
session_start();
session_regenerate_id(true);

setlanguage();

// get error message from confmain.php
if (isset($_SESSION['conf_message'])) $message = $_SESSION['conf_message'];

// remove settings from session
$sessionKeys = array_keys($_SESSION);
for ($i = 0; $i < sizeof($sessionKeys); $i++) {
	if (substr($sessionKeys[$i], 0, 5) == "conf_") unset($_SESSION[$sessionKeys[$i]]);
}

echo $_SESSION['header'];

$files = getConfigProfiles();
?>

		<title>
			<?php
				echo _("Login");
			?>
		</title>
	<?php
		// include all CSS files
		$cssDirName = dirname(__FILE__) . '/../../style';
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
			echo "<link rel=\"stylesheet\" type=\"text/css\" href=\"../../style/" . $cssEntry . "\">\n";
		}
	?>
		<link rel="shortcut icon" type="image/x-icon" href="../../graphics/favicon.ico">
		<link rel="icon" href="../../graphics/logo136.png">
	</head>
	<body>
		<?php
			// include all JavaScript files
			$jsDirName = dirname(__FILE__) . '/../lib';
			$jsDir = dir($jsDirName);
			$jsFiles = array();
			while ($jsEntry = $jsDir->read()) {
				if (substr($jsEntry, strlen($jsEntry) - 3, 3) != '.js') continue;
				$jsFiles[] = $jsEntry;
			}
			sort($jsFiles);
			foreach ($jsFiles as $jsEntry) {
				echo "<script type=\"text/javascript\" src=\"../lib/" . $jsEntry . "\"></script>\n";
			}
			// set focus on password field
			?>
			<script type="text/javascript" language="javascript">
			<!--
			window.onload = function() {
				loginField = document.getElementsByName('passwd')[0];
				loginField.focus();
			}
			jQuery(document).ready(function() {
				jQuery('#submitButton').button();
			});
			//-->
			</script>
		<table border=0 width="100%" class="lamHeader ui-corner-all">
			<tr>
				<td align="left" height="30">
					<a class="lamLogo" href="http://www.ldap-account-manager.org/" target="new_window">LDAP Account Manager</a>
				</td>
			</tr>
		</table>
		<br><br>
		<!-- form to change existing profiles -->
		<form action="confmain.php" method="post" autocomplete="off">
		<table align="center"><tr><td>
		<table align="center" border="0" rules="none" bgcolor="white" class="ui-corner-all roundedShadowBox">
			<tr>
				<td style="border-style:none" rowspan="3" width="20"></td>
				<td style="border-style:none" height="20"></td>
				<td style="border-style:none" rowspan="3" width="20"></td>
			</tr>
			<tr>
				<td style="border-style:none" align="center">
					<b>
					<?php
						if (sizeof($files) > 0) {
							echo _("Please enter your password to change the server preferences:");
						}
					?>
					</b>
				</td>
			</tr>
			<tr><td style="border-style:none" >&nbsp;</td></tr>
<?php
	if (sizeof($files) < 1) $message = _("No server profiles found. Please create one.");
	// print message if login was incorrect or no config profiles are present
	if (isset($message)) {  // $message is set by confmain.php (requires conflogin.php then)
		echo "<tr>\n";
			echo "<td style=\"border-style:none\" rowspan=\"2\"></td>\n";
			echo "<td style=\"border-style:none\" align=\"center\"><b><font color=red>" . $message . "</font></b></td>\n";
			echo "<td style=\"border-style:none\" rowspan=\"2\"></td>\n";
		echo "</tr>\n";
		echo "<tr>\n";
			echo "<td style=\"border-style:none\" >&nbsp;</td>\n";
		echo "</tr>\n";
	}
?>
			<tr>
				<td style="border-style:none" rowspan="4" width="20"></td>
				<td style="border-style:none" align="center">
					<?php
						$conf = new LAMCfgMain();
						$group = new htmlTable();
						$profiles = array();
						$selectedProfile = array();
						$profilesExisting = false;
						if (sizeof($files) > 0) {
							$profiles = $files;
							if (!empty($_COOKIE["lam_default_profile"]) && in_array($_COOKIE["lam_default_profile"], $files)) {
								$selectedProfile[] = $_COOKIE["lam_default_profile"];
							}
							else {
								$selectedProfile[] = $conf->default;
							}
							$profilesExisting = true;
							$select = new htmlSelect('filename', $profiles, $selectedProfile);
							$select->setIsEnabled($profilesExisting);
							$group->addElement($select);
							$passwordField = new htmlInputField('passwd');
							$passwordField->setIsPassword(true);
							$passwordField->setIsEnabled($profilesExisting);
							$passwordField->setFieldSize(20);
							$group->addElement($passwordField);
							$button = new htmlButton('submit', _("Ok"));
							$button->setIsEnabled($profilesExisting);
							$group->addElement($button);
							$group->addElement(new htmlHelpLink('200'));
							$tabindex = 1;
							parseHtml(null, $group, array(), false, $tabindex, 'user');
						}
						?>
				</td>
				<td style="border-style:none" rowspan="4" width="20"></td>
			</tr>
			<tr>
				<td  style="border-style:none">&nbsp;</td>
			</tr>
			<tr>
				<td style="border-style:none" align="center">
					<b><a href="profmanage.php"><?php echo _("Manage server profiles") ?></a></b>
				</td>
			</tr>
			<tr>
				<td style="border-style:none" height="20"></td>
			</tr>
		</table>
		</td></tr>
		<tr><td>
		<br><a href="../login.php"><IMG alt="configuration" src="../../graphics/undo.png">&nbsp;<?php echo _("Back to login"); ?> </a>
		</td></tr>
		</table>
		</form>

		<p><br><br></p>


	</body>
</html>
