<?php
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
* User is logged off from LDAP server, session is destroyed.
*
* @package main
* @author Roland Gruber
*/


// delete key and iv in cookie
if (function_exists('openssl_random_pseudo_bytes')) {
	setcookie("Key", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", 0, "/", null, null, true);
	setcookie("IV", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", 0, "/", null, null, true);
}

/** security functions */
include_once("../lib/security.inc");
/** Used to display status messages */
include_once("../lib/status.inc");
/** LDAP settings are deleted at logout */
include_once("../lib/ldap.inc");

// start session
startSecureSession();

// log message
if (isset($_SESSION['loggedIn']) || ($_SESSION['loggedIn'] === true)) {
	$ldapUser = $_SESSION['ldap']->decrypt_login();
	logNewMessage(LOG_NOTICE, 'User ' . $ldapUser[0] . ' logged off.');

	// close LDAP connection
	@$_SESSION["ldap"]->destroy();
}

setlanguage();

// destroy session
session_destroy();
unset($_SESSION);

// redirect to login page
metaRefresh('login.php');
?>
