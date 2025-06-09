const validationRules: Record<string, { regex: RegExp, error: string}> = {
    first_name: {
        regex: /^[A-ZА-ЯЁ][a-zа-яё-]*$/,
        error: 'Латиница или кириллица, первая заглавная, без пробелов, цифр и спецсимволов (кроме дефиса)'
    },
    second_name: {
        regex: /^[A-ZА-ЯЁ][a-zа-яё-]*$/,
        error: 'Латиница или кириллица, первая заглавная, без пробелов, цифр и спецсимволов (кроме дефиса)'
    },
    login: {
        regex: /^(?![0-9]+$)[a-zA-Z0-9_-]{3,20}$/,
        error: 'От 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, без пробелов (допустимы дефис и подчёркивание)'
    },
    email: {
        regex: /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]+$/,
        error: 'Латиница, может включать цифры и спецсимволы, обязательны @ и точка после неё (перед точкой должны быть буквы)'
    },
    password: {
        regex: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
        error: 'От 8 до 40 символов, хотя бы одна заглавная буква и цифра'
    },
    phone: {
        regex: /^\+?\d{10,15}$/,
        error: 'От 10 до 15 цифр, может начинаться с плюса'
    },
    message: {
        regex: /^.+$/,
        error: 'Сообщение не должно быть пустым'
    }
};

function validateField(fieldName: string, value: string) {
    if (!validationRules[fieldName]) return { isValid: true, error: '' };
    
    const rule = validationRules[fieldName];
    const isValid = rule.regex.test(value);
    
    return {
        isValid,
        error: isValid ? '' : rule.error
    };
}

export function setupFormValidation(form: HTMLFormElement) {
    const fields = form.querySelectorAll('input');
    
    fields.forEach(field => {
        field.addEventListener('blur', (e) => {
            const target = e.target as HTMLInputElement;
            const validation = validateField(target.name, target.value);
            showValidationMessage(target, validation);
        });
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;
        
        fields.forEach(field => {
            const validation = validateField(field.name, field.value);
            showValidationMessage(field, validation);
            
            if (!validation.isValid) {
                isFormValid = false;
            }
        });
            
        if (isFormValid) {
            form.submit();
        }
    });
}

function showValidationMessage(field: HTMLInputElement, validation: { isValid: boolean; error: string }) {
    let errorElement = field.nextElementSibling?.nextElementSibling;
    
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode?.insertBefore(errorElement, field.nextElementSibling?.nextElementSibling || null);
    }
    
    errorElement.textContent = validation.error;
    field.classList.toggle('invalid', !validation.isValid);
}