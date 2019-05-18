// Angular
import { Injectable, TemplateRef } from '@angular/core';

// servicios de terceros
import { MatBottomSheetConfig, MatBottomSheet, MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material';
import { ComponentType } from '@angular/cdk/overlay/index';
import { ModalWindowComponent } from 'src/app/components/modal-window/modal-window.component';

@Injectable({
  providedIn: 'root'
})
export class WindowSpinnerSnackbarService {

  constructor(
    private matBottomSheet: MatBottomSheet,
    private matDialog: MatDialog
  ) { }

  openSpinner() {
    // apertura de spiner de MATERIAL
  }

  closeSpiner(forced?: true) {
    // cierre de spiner de material
  }

  showDialogWindowWithoutReference(configModal: ConfigModalInterface, userCanClose = false): void {
    // apertura de ventana modal de Mrterial sin referencia
  }

// tslint:disable-next-line: max-line-length
  showDialogWindowReturnReference(configModal: ConfigModalInterface, userCanClose = false): MatDialogRef<ModalWindowComponent, ButtonModalInterface> {
    const dialogRef = this.matDialog.open(ModalWindowComponent, {
      disableClose: !userCanClose, // Whether the user can use escape or clicking on the backdrop to close the modal.
      data: configModal
    });
    return dialogRef;
  }

  showCustomDialogWindowReturnReference<T, D = any, R = any>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: MatDialogConfig<D>
  ): MatDialogRef<T, R> {
    return this.matDialog.open(componentOrTemplateRef, config);
  }

  openBottomSheet(configData: Array<BottomSheetDataInterface>) {
    // apertura de un MatBottomSheet de Material
  }
}
