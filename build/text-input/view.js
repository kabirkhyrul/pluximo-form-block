/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/text-input/shared/validation.js":
/*!*********************************************!*\
  !*** ./src/text-input/shared/validation.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TextInputValidationHandler: () => (/* binding */ TextInputValidationHandler),
/* harmony export */   setupTextInputValidation: () => (/* binding */ setupTextInputValidation)
/* harmony export */ });
/**
 * Shared validation logic for text input fields
 * Centralized validation functions to avoid duplication
 */

/**
 * Client-side validation setup for text input fields
 * @param {string} selector - CSS selector for input fields
 */
function setupTextInputValidation(selector = '.text-input-field') {
  document.addEventListener('DOMContentLoaded', function () {
    const textInputs = document.querySelectorAll(selector);
    textInputs.forEach(function (input) {
      const validationHandler = new TextInputValidationHandler(input);
      validationHandler.init();
    });
  });
}

/**
 * Text Input Validation Handler Class
 * Handles all validation logic for a single text input field
 */
class TextInputValidationHandler {
  constructor(input) {
    this.input = input;
    this.validMessage = input.getAttribute('data-valid-message');
    this.invalidMessage = input.getAttribute('data-invalid-message');
    this.errorElement = null;
    this.successElement = null;
  }
  init() {
    this.input.addEventListener('blur', () => this.validateInput());
    this.input.addEventListener('input', () => {
      if (this.errorElement) {
        this.validateInput();
      }
    });
    const form = this.input.closest('form');
    if (form) {
      form.addEventListener('submit', e => {
        if (!this.validateInput()) {
          e.preventDefault();
          this.input.focus();
        }
      });
    }
  }
  showError(message) {
    this.hideError();
    this.hideSuccess();
    this.errorElement = document.createElement('p');
    this.errorElement.className = 'text-input-error';
    this.errorElement.textContent = message;
    this.input.parentNode.parentNode.appendChild(this.errorElement);
    this.input.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
    this.input.classList.remove('border-gray-200', 'focus:border-blue-500', 'focus:ring-blue-500', 'border-teal-500');
    this.triggerFormValidationUpdate();
  }
  showSuccess(message) {
    this.hideError();
    this.hideSuccess();
    if (message) {
      this.successElement = document.createElement('p');
      this.successElement.className = 'text-input-success';
      this.successElement.textContent = message;
      this.input.parentNode.parentNode.appendChild(this.successElement);
    }
    this.input.classList.add('border-teal-500', 'focus:border-teal-500', 'focus:ring-teal-500');
    this.input.classList.remove('border-gray-200', 'focus:border-blue-500', 'focus:ring-blue-500', 'border-red-500');
    this.triggerFormValidationUpdate();
  }
  hideError() {
    if (this.errorElement) {
      this.errorElement.remove();
      this.errorElement = null;
    }
  }
  hideSuccess() {
    if (this.successElement) {
      this.successElement.remove();
      this.successElement = null;
    }
  }
  resetField() {
    this.hideError();
    this.hideSuccess();
    this.input.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500', 'border-teal-500', 'focus:border-teal-500', 'focus:ring-teal-500');
    this.input.classList.add('border-gray-200', 'focus:border-blue-500', 'focus:ring-blue-500');
    this.triggerFormValidationUpdate();
  }
  triggerFormValidationUpdate() {
    const form = this.input.closest('form');
    if (form) {
      const event = new CustomEvent('textInputValidationChange', {
        bubbles: true
      });
      form.dispatchEvent(event);
    }
  }
  validateInput() {
    const value = this.input.value;
    if (!value.trim() && !this.input.required) {
      this.resetField();
      return true;
    }
    if (this.input.required && !value.trim()) {
      this.showError(this.invalidMessage || 'This field is required.');
      return false;
    }
    const minLength = this.input.getAttribute('minLength');
    if (minLength && value.length < parseInt(minLength)) {
      this.showError(this.invalidMessage || `Minimum length is ${minLength} characters.`);
      return false;
    }
    const maxLength = this.input.getAttribute('maxLength');
    if (maxLength && value.length > parseInt(maxLength)) {
      this.showError(this.invalidMessage || `Maximum length is ${maxLength} characters.`);
      return false;
    }
    const pattern = this.input.getAttribute('pattern');
    if (pattern && value && !new RegExp(pattern).test(value)) {
      this.showError(this.invalidMessage || 'Please enter a valid value.');
      return false;
    }
    if (value.trim()) {
      this.showSuccess(this.validMessage);
    } else {
      this.resetField();
    }
    return true;
  }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!********************************!*\
  !*** ./src/text-input/view.js ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_validation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared/validation.js */ "./src/text-input/shared/validation.js");
/**
 * Client-side validation for text input fields
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */


(0,_shared_validation_js__WEBPACK_IMPORTED_MODULE_0__.setupTextInputValidation)('.text-input-field');
})();

/******/ })()
;
//# sourceMappingURL=view.js.map