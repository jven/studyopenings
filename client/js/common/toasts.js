class Toasts {
  static initialize() {
    toastr.options.showDuration = "300";
    toastr.options.hideDuration = "300";
    toastr.options.timeOut = "0";
    toastr.options.extendedTimeOut = "0";
    toastr.options.preventDuplicates = true;
    toastr.options.positionClass = "toast-top-center";
  }

  static error(title, message) {
    toastr.error(message, title);
  }
}