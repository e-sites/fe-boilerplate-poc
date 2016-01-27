/**
 * Global Parsley configuration
 *
 * @see  http://parsleyjs.org/doc/annotated-source/defaults.html
 * @type {Object}
 */
window.ParsleyConfig = {
	errorsWrapper: '<div class="parsley-error-line"></div>',
	errorTemplate: '<span></span>',
	i18n: {
		en: {
			defaultMessage: 'This value seems to be invalid',
			type: {
				required: 'This value is required',
				email: 'No valid email address given'
			}
		},
		nl: {
			defaultMessage: 'Dit veld is niet correct ingevuld',
			type: {
				required: 'Dit is een verplicht veld',
				email: 'Er is geen geldig e-mailadres opgegeven'
			}
		}
	}
};