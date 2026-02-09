function isValidEmail(stringToTest) {
	const emailRegex = /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_'+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;
	return emailRegex.test(stringToTest);
}

function removeExistingErrors(form) {
	for (const errorEl of form.querySelectorAll(".form-error")) {
		errorEl.remove();
	}
}

function showError({ afterElement, id, message }) {
	const errorEl = document.createElement("p");
	errorEl.className = "form-error";
	errorEl.id = id;
	errorEl.innerText = message;
	afterElement.insertAdjacentElement("afterend", errorEl);
	return errorEl;
}

function clearAriaState(elements) {
	for (const el of elements) {
		el.removeAttribute("aria-invalid");
		el.removeAttribute("aria-describedby");
	}
}

function setAriaInvalid(elements, errorId) {
	for (const el of elements) {
		el.setAttribute("aria-invalid", "true");
		el.setAttribute("aria-describedby", errorId);
	}
}

function setupFormValidation() {
	const form = document.querySelector("#contact-form");
	if (!form) return;

	const emailInput = form.querySelector("#contact-email");
	const checkboxList = Array.from(form.querySelectorAll('input[name="visitor-type"]'));
	const checkboxFieldset = form.querySelector("#visitor-type-fieldset");

	form.addEventListener("submit", (event) => {
		removeExistingErrors(form);
		clearAriaState([emailInput, ...checkboxList]);

		let firstInvalidElement = null;
		let isValid = true;

		const emailValue = String(emailInput.value ?? "").trim();
		const emailIsValid = emailValue.length > 0 && isValidEmail(emailValue);
		if (!emailIsValid) {
			isValid = false;
			const errorId = "email-error";
			showError({
				afterElement: emailInput,
				id: errorId,
				message: "Please enter a valid email address.",
			});
			setAriaInvalid([emailInput], errorId);
			firstInvalidElement ??= emailInput;
		}

		const anyChecked = checkboxList.some((c) => c.checked);
		if (!anyChecked) {
			isValid = false;
			const errorId = "visitor-type-error";
			showError({
				afterElement: checkboxFieldset,
				id: errorId,
				message: "Please select at least one option.",
			});
			setAriaInvalid(checkboxList, errorId);
			firstInvalidElement ??= checkboxList[0];
		}

		if (!isValid) {
			event.preventDefault();
			firstInvalidElement?.focus();
		}
	});
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", setupFormValidation);
} else {
	setupFormValidation();
}
