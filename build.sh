ionic cordova build android --prod --release -- -- --packageType=bundle
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore release.jks /Users/austinhunter/sbl-work/platforms/android/app/build/outputs/bundle/release/app-release.aab atwork 
