import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigAppService {
  CONFIG_APP = {
    bottomSheetData: {
      email: [
        {
          title: 'BottomSheetInfoComponent.email.title',
          messages: ['BottomSheetInfoComponent.email.info']
        },
        {
          title: 'BottomSheetInfoComponent.typeEvent.inputType',
          messages: ['PlaceHolders.madatoryInputExtend']
        }
      ],
      password: [
        {
          title: 'BottomSheetInfoComponent.password.title',
          messages: ['BottomSheetInfoComponent.password.info']
        },
        {
          title: 'BottomSheetInfoComponent.password.passRequirements',
// tslint:disable-next-line: max-line-length
          messages: ['Errors.mandatoryInput', 'Errors.minlength8', 'Errors.hasNumber', 'Errors.hasCapitalCase', 'Errors.hasSmallCase', 'Errors.hasSpecialCharacters']
        }
      ],
    }
  };
}
