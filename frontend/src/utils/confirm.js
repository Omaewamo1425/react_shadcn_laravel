// src/utils/confirm.js
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showToast } from "./toast";

const MySwal = withReactContent(Swal);

/**
 * Confirm action and handle API errors.
 * @param {string} message - Confirmation message
 * @param {Function} onConfirm - Async function that performs the action
 * @returns {Promise<boolean>} - true if confirmed and successful
 */
export const confirmAction = async (message = "Are you sure?", onConfirm) => {
  const result = await MySwal.fire({
    title: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    backdrop: true,
  });

  if (!result.isConfirmed) return false;

  try {
    await onConfirm();
    return true;
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.values(error.response.data.errors).forEach((messages) => {
        messages.forEach((msg) => showToast(msg, "error"));
      });
    } else {
      const msg = error.response?.data?.message || error.message || "Unknown error";
      showToast(msg, "error");
    }
    return false;
  }
};
