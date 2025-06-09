import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleDestroy, OnModuleInit {
  private readonly eventsRef: admin.database.Reference;
  private firebaseInitialized = false;
  private readonly logger = new Logger(FirebaseService.name);

  constructor(
    @Inject('FIREBASE_DATABASE')
    private readonly firebaseDb: admin.database.Database,
  ) {
    if (this.firebaseDb) {
      this.firebaseInitialized = true;
      this.eventsRef = this.firebaseDb.ref('events/135');
    } else {
      this.logger.error(
        'Firebase Realtime Database instance is not available. Most Firebase operations will fail.',
      );
    }
  }

  onModuleInit() {
    if (this.firebaseInitialized) {
      this.setupRealtimeListeners();
    } else {
      this.logger.warn(
        'Skipping Firebase real-time listener setup as Firebase was not initialized.',
      );
    }
  }

  onModuleDestroy() {
    if (this.eventsRef) {
      this.logger.log('Detaching Firebase Realtime Database listeners...');
      this.eventsRef.off(); // Detach all listeners
    } else {
      this.logger.warn('Firebase not ready. No listeners to detach.');
    }
  }

  private setupRealtimeListeners() {
    this.logger.log('Setting up Firebase Realtime Database listeners...');
    this.eventsRef.on(
      'child_added',
      (/*snapshot*/) => {},
      (error) => {
        this.logger.error(`Child added listener error: ${error.message}`);
      },
    );

    this.eventsRef.on(
      'child_changed',
      (/*snapshot*/) => {},
      (error) => {
        this.logger.error(`Child changed listener error: ${error.message}`);
      },
    );

    this.eventsRef.on(
      'child_removed',
      (/*snapshot*/) => {},
      (error) => {
        this.logger.error(`Child removed listener error: ${error.message}`);
      },
    );
  }

  async testFirebaseDB() {
    // const snapshot = await this.eventsRef.once('value');
    // console.log(snapshot.val());
  }
}
