import { Global, Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { FirebaseService } from './firebase.service';
import * as fs from 'fs';
import { join } from 'path';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_APP',
      useFactory: (/*configService: ConfigService*/) => {
        const filePath = join(
          __dirname,
          process.env.FIREBASE_CONFIG_FILE ?? '',
        );
        const serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DATABASE_URL,
          });
        }
        return admin.app();
      },
      inject: [ConfigService],
    },
    {
      provide: 'FIREBASE_DATABASE',
      useFactory: (firebaseApp: admin.app.App) => firebaseApp.database(),
      inject: ['FIREBASE_APP'],
    },
    FirebaseService,
  ],
  exports: [FirebaseService],
})
export class FirebaseModule {}
