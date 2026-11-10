import Swal from 'sweetalert2';

export const confirmAction = ({
  title,
  text,
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar',
  icon = 'warning',
}) =>
  Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: '#193C47',
    cancelButtonColor: '#6C7D82',
    reverseButtons: true,
    focusCancel: true,
  });

export const toastSuccess = (title) =>
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
