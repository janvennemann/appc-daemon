/* eslint security/detect-child-process: 0 */

/**
 * The cached locale value.
 *
 * @type {?String}
 */
let cachedLocale;

/**
 * Determines the current locale of this machine.
 *
 * @param {Boolean} [force=false] - When `true`, it will bypass the cached locale and redetect.
 * @returns {Promise<String>}
 */
export async function locale(force) {
	if (!force && cachedLocale !== undefined) {
		return cachedLocale;
	}

	try {
		if (process.platform === 'win32') {
			const winreglib = require('winreglib');
			let value = winreglib.get('HKCU\\Control Panel\\International', 'Locale');
			if (value) {
				value = value.substring(value.length - 4, value.length);
				const locale = winreglib.get('HKLM\\SOFTWARE\\Classes\\MIME\\Database\\Rfc1766', value);
				const m = locale.match(/([^;,\n]+?);/);
				cachedLocale = m ? m[1].replace(/_/g, '-') : null;
			}
		} else {
			const m = require('child_process').spawnSync('locale').stdout.toString().match(/^LANG="?([^".\s]+)/);
			cachedLocale = m ? m[1].replace(/_/g, '-') : null;
		}
	} catch (e) {
		// this can happen if the 'locale' command is not found in the system path
		cachedLocale = null;
	}

	return cachedLocale;
}
