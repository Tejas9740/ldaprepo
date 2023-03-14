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
* Configuration profile management.
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
	session_save_path("../../sess");
}
@session_start();

setlanguage();


$cfg = new LAMCfgMain();
$files = getConfigProfiles();

// check if submit button was pressed
if (isset($_POST['action'])) {
	// check master password
	if (!$cfg->checkPassword($_POST['passwd'])) {
		$error = _("Master password is wrong!");
	}
	// add new profile
	elseif ($_POST['action'] == "add") {
		// check profile password
		if ($_POST['addpassword'] && $_POST['addpassword2'] && ($_POST['addpassword'] == $_POST['addpassword2'])) {
			$result = createConfigProfile($_POST['addprofile'], $_POST['addpassword'], $_POST['addTemplate']);
			if ($result === true) {
				$_SESSION['conf_isAuthenticated'] = $_POST['addprofile'];
				$_SESSION['conf_config'] = new LAMConfig($_POST['addprofile']);
				$_SESSION['conf_messages'][] = array('INFO', _("Created new profile."), $_POST['addprofile']);
				metaRefresh('confmain.php');
				exit;
			}
			else {
				$error = $result;
			}
		}
		else {
			$error = _("Profile passwords are different or empty!");
		}
	}
	// rename profile
	elseif ($_POST['action'] == "rename") {
		if (preg_match("/^[a-z0-9_-]+$/i", $_POST['oldfilename']) && preg_match("/^[a-z0-9_-]+$/i", $_POST['renfilename']) && !in_array($_POST['renfilename'], getConfigProfiles())) {
			if (rename("../../config/" . $_POST['oldfilename'] . ".conf", "../../config/" . $_POST['renfilename'] . ".conf")) {
			    // rename pdf and profiles folder
			    rename("../../config/profiles/" . $_POST['oldfilename'], "../../config/profiles/" . $_POST['renfilename']);
			    rename("../../config/pdf/" . $_POST['oldfilename'], "../../config/pdf/" . $_POST['renfilename']);
				// rename sqlite database if any
				if (file_exists("../../config/" . $_POST['oldfilename'] . ".sqlite")) {
					rename("../../config/" . $_POST['oldfilename'] . ".sqlite", "../../config/" . $_POST['renfilename'] . ".sqlite");
				}
				$msg = _("Renamed profile.");
			}
			else $error = _("Could not rename file!");
			// update default profile setting if needed
			if ($cfg->default == $_POST['oldfilename']) {
				$cfg->default = $_POST['renfilename'];
				$cfg->save();
			}
			// reread profile list
			$files = getConfigProfiles();
		}
		else $error = _("Profile name is invalid!");
	}
	// delete profile
	elseif ($_POST['action'] == "delete") {
		if (deleteConfigProfile($_POST['delfilename']) == null) {
			$msg = _("Profile deleted.");
			// update default profile setting if needed
			if ($cfg->default == $_POST['delfilename']) {
				$filesNew = array_delete(array($_POST['delfilename']), $files);
				if (sizeof($filesNew) > 0) {
					sort($filesNew);
					$cfg->default = $filesNew[0];
					$cfg->save();
				}
			}
			// reread profile list
			$files = getConfigProfiles();
		}
		else $error = _("Unable to delete profile!");
	}
	// set new profile password
	elseif ($_POST['action'] == "setpass") {
		if (preg_match("/^[a-z0-9_-]+$/i", $_POST['setprofile'])) {
			if ($_POST['setpassword'] && $_POST['setpassword2'] && ($_POST['setpassword'] == $_POST['setpassword2'])) {
				$config = new LAMConfig($_POST['setprofile']);
				$config->set_Passwd($_POST['setpassword']);
				$config->save();
				$config = null;
				$msg = _("New password set successfully.");
			}
			else $error = _("Profile passwords are different or empty!");
		}
		else $error = _("Profile name is invalid!");
	}
	// set default profile
	elseif ($_POST['action'] == "setdefault") {
		if (preg_match("/^[a-z0-9_-]+$/i", $_POST['defaultfilename'])) {
			$configMain = new LAMCfgMain();
			$configMain->default = $_POST['defaultfilename'];
			$configMain->save();
			$configMain = null;
			$msg = _("New default profile set successfully.");
		}
		else $error = _("Profile name is invalid!");
	}
}


echo $_SESSION['header'];

?>

		<title>
			<?php
				echo _("Profile management");
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
		<table border=0 width="100%" class="lamHeader ui-corner-all">
			<tr>
				<td align="left" height="30">
					<a class="lamLogo" href="http://www.ldap-account-manager.org/" target="new_window">LDAP Account Manager</a>
				</td>
			</tr>
		</table>
		<br>

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

// print messages
if (isset($error) || isset($msg)) {
	if (isset($error)) {
		StatusMessage("ERROR", $error);
	}
	if (isset($msg)) {
		StatusMessage("INFO", $msg);
	}
}

// check if config.cfg is valid
if (!isset($cfg->default)) {
	StatusMessage("ERROR", _("Please set up your master configuration file (config/config.cfg) first!"), "");
	echo "</body>\n</html>\n";
	die();
}

?>

		<br>
		<!-- form for adding/renaming/deleting profiles -->
		<form id="profileForm" name="profileForm" action="profmanage.php" method="post">
<?php
$topicSpacer = new htmlSpacer(null, '20px');

$tabindex = 1;
$container = new htmlTable('100%');

$container->addElement(new htmlTitle(_("Profile management")), true);

// new profile
$container->addElement(new htmlSubTitle(_("Add profile")), true);
$newProfileInput = new htmlTableExtendedInputField(_("Profile name"), 'addprofile', null, '230');
$newProfileInput->setFieldSize(15);
$container->addElement($newProfileInput, true);
$profileNewPwd1 = new htmlTableExtendedInputField(_("Profile password"), 'addpassword');
$profileNewPwd1->setIsPassword(true);
$profileNewPwd1->setFieldSize(15);
$container->addElement($profileNewPwd1, true);
$profileNewPwd2 = new htmlTableExtendedInputField(_("Reenter password"), 'addpassword2');
$profileNewPwd2->setIsPassword(true);
$profileNewPwd2->setFieldSize(15);
$profileNewPwd2->setSameValueFieldID('addpassword');
$container->addElement($profileNewPwd2, true);
$existing = array();
foreach ($files as $file) {
	$existing[$file] = $file . '.conf';
}
$builtIn = array();
foreach (getConfigTemplates() as $file) {
	$builtIn[$file] = $file . '.conf.sample';
}
$templates = array(
	_('Built-in templates') => $builtIn,
	_('Existing server profiles') => $existing,
);
$addTemplateSelect = new htmlTableExtendedSelect('addTemplate', $templates, array('unix.conf.sample'), _('Template'), '267');
$addTemplateSelect->setContainsOptgroups(true);
$addTemplateSelect->setHasDescriptiveElements(true);
$container->addElement($addTemplateSelect, true);
$newProfileButton = new htmlButton('btnAddProfile', _('Add'));
$newProfileButton->setOnClick("jQuery('#action').val('add');showConfirmationDialog('" . _("Add profile") . "', '" .
	_('Ok') . "', '" . _('Cancel') . "', 'passwordDialogDiv', 'profileForm', null); document.getElementById('passwd').focus();");
$container->addElement($newProfileButton, true);
$container->addElement($topicSpacer, true);

// rename profile
$container->addElement(new htmlSubTitle(_("Rename profile")), true);
$container->addElement(new htmlTableExtendedSelect('oldfilename', $files, array(), _('Profile name'), '231'), true);
$oldProfileInput = new htmlTableExtendedInputField(_('New profile name'), 'renfilename');
$oldProfileInput->setFieldSize(15);
$container->addElement($oldProfileInput, true);
$renameProfileButton = new htmlButton('btnRenameProfile', _('Rename'));
$renameProfileButton->setOnClick("jQuery('#action').val('rename');showConfirmationDialog('" . _("Rename profile") . "', '" .
	_('Ok') . "', '" . _('Cancel') . "', 'passwordDialogDiv', 'profileForm', null); document.getElementById('passwd').focus();");
$container->addElement($renameProfileButton, true);
$container->addElement($topicSpacer, true);

// delete profile
$container->addElement(new htmlSubTitle(_("Delete profile")), true);
$container->addElement(new htmlTableExtendedSelect('delfilename', $files, array(), _('Profile name'), '232'), true);
$deleteProfileButton = new htmlButton('btnDeleteProfile', _('Delete'));
$deleteProfileButton->setOnClick("jQuery('#action').val('delete');showConfirmationDialog('" . _("Delete profile") . "', '" .
	_('Ok') . "', '" . _('Cancel') . "', 'passwordDialogDiv', 'profileForm', null); document.getElementById('passwd').focus();");
$container->addElement($deleteProfileButton, true);
$container->addElement($topicSpacer, true);

// set password
$container->addElement(new htmlSubTitle(_("Set profile password")), true);
$container->addElement(new htmlTableExtendedSelect('setprofile', $files, array(), _('Profile name'), '233'), true);
$profileSetPwd1 = new htmlTableExtendedInputField(_("Profile password"), 'setpassword');
$profileSetPwd1->setIsPassword(true);
$profileSetPwd1->setFieldSize(15);
$container->addElement($profileSetPwd1, true);
$profileSetPwd2 = new htmlTableExtendedInputField(_("Reenter password"), 'setpassword2');
$profileSetPwd2->setIsPassword(true);
$profileSetPwd2->setFieldSize(15);
$profileSetPwd2->setSameValueFieldID('setpassword');
$container->addElement($profileSetPwd2, true);
$setPasswordProfileButton = new htmlButton('btnSetPasswordProfile', _('Set profile password'));
$setPasswordProfileButton->setOnClick("jQuery('#action').val('setpass');showConfirmationDialog('" . _("Set profile password") . "', '" .
	_('Ok') . "', '" . _('Cancel') . "', 'passwordDialogDiv', 'profileForm', null); document.getElementById('passwd').focus();");
$container->addElement($setPasswordProfileButton, true);
$container->addElement($topicSpacer, true);

// set default profile
$conf = new LAMCfgMain();
$defaultprofile = $conf->default;
$container->addElement(new htmlSubTitle(_("Change default profile")), true);
$container->addElement(new htmlTableExtendedSelect('defaultfilename', $files, array($defaultprofile), _('Profile name'), '234'), true);
$defaultProfileButton = new htmlButton('btnDefaultProfile', _('Ok'));
$defaultProfileButton->setOnClick("jQuery('#action').val('setdefault');showConfirmationDialog('" . _("Change default profile") . "', '" .
	_('Ok') . "', '" . _('Cancel') . "', 'passwordDialogDiv', 'profileForm', null); document.getElementById('passwd').focus();");
$container->addElement($defaultProfileButton, true);
$container->addElement($topicSpacer, true);

$container->addElement(new htmlHiddenInput('action', 'none'), true);

$dialogDivContent = new htmlTable();
$dialogDivContent->addElement(new htmlOutputText(_("Master password")));
$masterPassword = new htmlInputField('passwd');
$masterPassword->setIsPassword(true);
$dialogDivContent->addElement($masterPassword);
$dialogDivContent->addElement(new htmlHelpLink('236'));
$dialogDiv = new htmlDiv('passwordDialogDiv', $dialogDivContent);
$dialogDiv->setCSSClasses(array('hidden'));
$container->addElement($dialogDiv, true);

$container->setCSSClasses(array('roundedShadowBox', 'ui-corner-all'));

$mainContainer = new htmlGroup();
$mainContainer->addElement($container);
$mainContainer->addElement(new htmlOutputText('<p><br></p>', false));
$mainContainer->addElement(new htmlLink(_("Back to profile login"), 'conflogin.php', '../../graphics/undo.png'));

parseHtml('', $mainContainer, array(), false, $tabindex, 'user');

?>
		</form>
		<p><br></p>

	</body>
</html>

