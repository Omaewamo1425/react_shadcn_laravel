import Swal from "sweetalert2";

export const confirmAction = async (message = "Are you sure?") => {
  const res = await Swal.fire({
    title: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
  });
  return res.isConfirmed;
};
