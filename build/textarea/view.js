/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/textarea/shared/validation.js":
/*!*******************************************!*\
  !*** ./src/textarea/shared/validation.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TextareaValidationHandler: () => (/* binding */ TextareaValidationHandler),
/* harmony export */   setupTextareaValidation: () => (/* binding */ setupTextareaValidation)
/* harmony export */ });
/**
 * Shared validation logic for textarea fields
 * Centralized validation functions to avoid duplication
 */

/**
 * Client-side validation setup for textarea fields
 * @param {string} selector - CSS selector for textarea fields
 */
function setupTextareaValidation(selector = '.textarea-field') {
  document.addEventListener('DOMContentLoaded', function () {
    const textareas = document.querySelectorAll(selector);
    textareas.forEach(function (textarea) {
      const validationHandler = new TextareaValidationHandler(textarea);
      validationHandler.init();
    });
  });
}

/**
 * Textarea Validation Handler Class
 * Handles all validation logic for a single textarea field
 */
class TextareaValidationHandler {
  constructor(textarea) {
    this.textarea = textarea;
    this.validMessage = textarea.getAttribute('data-valid-message');
    this.invalidMessage = textarea.getAttribute('data-invalid-message');
    this.errorElement = null;
    this.successElement = null;
  }
  init() {
    this.textarea.addEventListener('blur', () => this.validateTextarea());
    this.textarea.addEventListener('input', () => {
      if (this.errorElement) {
        this.validateTextarea();
      }
    });
    const form = this.textarea.closest('form');
    if (form) {
      form.addEventListener('submit', e => {
        if (!this.validateTextarea()) {
          e.preventDefault();
          this.textarea.focus();
        }
      });
    }
  }
  showError(message) {
    this.hideError();
    this.hideSuccess();
    this.errorElement = document.createElement('p');
    this.errorElement.className = 'textarea-error';
    this.errorElement.textContent = message;
    this.textarea.parentNode.parentNode.appendChild(this.errorElement);
    this.textarea.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
    this.textarea.classList.remove('border-gray-200', 'focus:border-blue-500', 'focus:ring-blue-500', 'border-teal-500');
    this.triggerFormValidationUpdate();
  }
  showSuccess(message) {
    this.hideError();
    this.hideSuccess();
    if (message) {
      this.successElement = document.createElement('p');
      this.successElement.className = 'textarea-success';
      this.successElement.textContent = message;
      this.textarea.parentNode.parentNode.appendChild(this.successElement);
    }
    this.textarea.classList.add('border-teal-500', 'focus:border-teal-500', 'focus:ring-teal-500');
    this.textarea.classList.remove('border-gray-200', 'focus:border-blue-500', 'focus:ring-blue-500', 'border-red-500');
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
    this.textarea.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500', 'border-teal-500', 'focus:border-teal-500', 'focus:ring-teal-500');
    this.textarea.classList.add('border-gray-200', 'focus:border-blue-500', 'focus:ring-blue-500');
    this.triggerFormValidationUpdate();
  }
  triggerFormValidationUpdate() {
    const form = this.textarea.closest('form');
    if (form) {
      const event = new CustomEvent('textareaValidationChange', {
        bubbles: true
      });
      form.dispatchEvent(event);
    }
  }
  validateTextarea() {
    const value = this.textarea.value;
    if (!value.trim() && !this.textarea.required) {
      this.resetField();
      return true;
    }
    if (this.textarea.required && !value.trim()) {
      this.showError(this.invalidMessage || 'This field is required.');
      return false;
    }
    const minLength = this.textarea.getAttribute('minLength');
    if (minLength && value.length < parseInt(minLength)) {
      this.showError(this.invalidMessage || `Minimum length is ${minLength} characters.`);
      return false;
    }
    const maxLength = this.textarea.getAttribute('maxLength');
    if (maxLength && value.length > parseInt(maxLength)) {
      this.showError(this.invalidMessage || `Maximum length is ${maxLength} characters.`);
      return false;
    }
    const pattern = this.textarea.getAttribute('pattern');
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
/*!******************************!*\
  !*** ./src/textarea/view.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_validation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared/validation.js */ "./src/textarea/shared/validation.js");
/**
 * Client-side validation for textarea fields
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */


(0,_shared_validation_js__WEBPACK_IMPORTED_MODULE_0__.setupTextareaValidation)('.textarea-field');
})();

/******/ })()
;
//# sourceMappingURL=view.js.map