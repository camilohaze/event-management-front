/* eslint-disable no-useless-escape */
import moment from "moment";

export const isRequired = {
  required: {
    value: true,
    message: "El campo es obligatorio",
  },
};

export const date = (format = "DD-MM-YYYY") => {
  return {
    validate: (value: string) => {
      const d = moment(value, format, true);

      if (d.isValid()) {
        return true;
      }

      return "Ingresa una fecha valida";
    },
  };
};

export const datetime = (format = "DD-MM-YYYY hh:mm a") => {
  return {
    validate: (value: string) => {
      const d = moment(value, format, true);

      if (d.isValid()) {
        return true;
      }

      return "Ingresa una fecha y hora valida";
    },
  };
};

export const isEmail = {
  pattern: {
    value:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    message: "Ingresa una dirección de correo valida",
  },
};

export const number = {
  pattern: {
    value: /^[0-9]*$/,
    message: "Ingresa solo numeros",
  },
};

export const alpha = {
  pattern: {
    value: /^[A-Z a-z áéíóúÁÉÍÓÚñÑ]*$/,
    message: "Ingresa solo letras",
  },
};

export const url = {
  pattern: {
    value:
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
    message: "Ingresa una url valida",
  },
};

export const min = (num: number) => {
  return {
    min: {
      value: num,
      message: `El valor minimo esperado es ${num}`,
    },
  };
};

export const max = (num: number) => {
  return {
    max: {
      value: num,
      message: `El valor maximo esperado es ${num}`,
    },
  };
};

export const minLength = (num: number) => {
  return {
    minLength: {
      value: num,
      message: `La longitud minima de caracteres es ${num}`,
    },
  };
};

export const maxLength = (num: number) => {
  return {
    maxLength: {
      value: num,
      message: `La longitud maxima de caracteres es ${num}`,
    },
  };
};
