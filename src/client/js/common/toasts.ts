import { error, options } from 'toastr';

export class Toasts {
  static initialize() {
    options.showDuration = 300;
    options.hideDuration = 300;
    options.timeOut = 0;
    options.extendedTimeOut = 0;
    options.preventDuplicates = true;
    options.positionClass = "toast-top-center";
  }

  static error(title: string, message: string) {
    error(message, title);
  }
}