import Big from "big.js";

import perform from "./perform";
import isNumber from "./isNumber";

export default function calculate(obj, buttonName) {
  if (buttonName === "AC") {
    return {
      total: null,
      next: null,
      operation: null,
    };
  }

  if (isNumber(buttonName)) {
    if (buttonName === "0" && obj.next === "0") {
      return {};
    }

    if (obj.operation) {
      if (obj.next) {
        return { next: obj.next + buttonName };
      }
      return { next: buttonName };
    }
    
    if (obj.next) {
      const next = obj.next === "0" ? buttonName : obj.next + buttonName;
      return {
        next,
        total: null,
      };
    }
    return {
      next: buttonName,
      total: null,
    };
  }

  if (buttonName === "%") {
    if (obj.operation && obj.next) {
      const result = perform(obj.total, obj.next, obj.operation);
      return {
        total: Big(result)
          .div(Big("100"))
          .toString(),
        next: null,
        operation: null,
      };
    }
    if (obj.next) {
      return {
        next: Big(obj.next)
          .div(Big("100"))
          .toString(),
      };
    }
    return {};
  }

  if (buttonName === ".") {
    if (obj.next) {
      // ignore a . if the next number already has one
      if (obj.next.includes(".")) {
        return {};
      }
      return { next: obj.next + "." };
    }
    return { next: "0." };
  }

  if (buttonName === "=") {
    if (obj.next && obj.operation) {
      return {
        total: perform(obj.total, obj.next, obj.operation),
        next: null,
        operation: null,
      };
    } else {
      // '=' with no operation, nothing to do
      return {};
    }
  }

  if (buttonName === "+/-") {
    if (obj.next) {
      return { next: (-1 * parseFloat(obj.next)).toString() };
    }
    if (obj.total) {
      return { total: (-1 * parseFloat(obj.total)).toString() };
    }
    return {};
  }

  if (obj.operation) {
    return {
      total: perform(obj.total, obj.next, obj.operation),
      next: null,
      operation: buttonName,
    };
  }

  if (!obj.next) {
    return { operation: buttonName };
  }

  return {
    total: obj.next,
    next: null,
    operation: buttonName,
  };
}
