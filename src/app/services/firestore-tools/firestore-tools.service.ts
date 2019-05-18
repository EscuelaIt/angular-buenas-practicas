// Angular
import { Injectable } from '@angular/core';

// servicios de terceros
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreToolsService {

  constructor(
    private angularFirestore: AngularFirestore
  ) { }

  updateFirestoneItem<T>(urlWithId: string, item: Partial<T>, noDestructive = true): Promise<void> {
    return this.angularFirestore
            .doc(urlWithId)
            .set(item, { merge: noDestructive });
  }

  updateFirestoneItemById(collectionName: string, id: string, item: {}, noDestructive = true): Promise<void> {
    return  this.angularFirestore
            .doc(collectionName + '/' + id)
            .set(item, { merge: noDestructive });
  }
}
