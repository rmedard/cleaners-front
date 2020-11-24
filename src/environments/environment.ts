// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import CloudinaryConfiguration from '@cloudinary/angular-5.x/lib/cloudinary-configuration.class';

export const environment = {
  production: false,
  apiUrl: 'http://localhost:5001/api',
  workingHourMin: 8,
  workingHourMax: 20,
  cloudinaryConfig: {
    cloud_name: 'eurekacloud',
    upload_preset: 'dgxq7gom',
    api_key: '517876783793992',
    api_secret: 'MIl9nYKYWR8m_wcyC5wWTAFQinw'
  } as CloudinaryConfiguration
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
