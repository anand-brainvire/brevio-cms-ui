export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const VALUE_REGEX = /^(\d+(\.\d{1,2})?)$/;

export const PHONEREGEX = /^\d{10}$/;

export const PHONECODE_REGEX = /^\+\d+$/;

export const NAMEVALIDATION = /^[a-zA-Z\s]+$/;

export const SPACE_REGEX = /^[a-zA-Z][a-zA-Z\s]*$/;

export const VALID_NAME = /^[a-zA-Z0-9_-]+$/;

export const NUMERIC_VALUE = /\D/g;

export const ONLY_DIGIT = /^\d+$/;

export const PHONE_CODE_REGEX = /^\+?\[0-9]+$/;

export const SPECIAL_ALPHABET = /^[a-zA-Z!@#$%^&*()_+{}[\]:;<>,.?~ ]+$/;
export const SPACE_REMOVER_REGEX = /\s/g;
export const SPECIAL_CHARACTERS_REMOVER = /[^\w-]+/g;