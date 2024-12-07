To get started

```
cd backend
npm i
npx prisma generate
npm start
```
Backend env requirements
1. DATABASE_URL=mongodb+srv://<username>:botOPa0q5QYRgYtM@cluster0.t7zo79z.mongodb.net/<database>?retryWrites=true&w=majority&appName=Cluster0
2. PORT=8000
3. JWT_SECRET="some random string"
4. AWS_ACCESS_KEY_ID =
5. AWS_SECRET_ACCESS_KEY = 
6. BUCKET_NAME = 

```
cd frontend
npm i
npm start or npx expo start -c
```
Frontend env requirements
LOCAL_API_URL = "http://<IPv4_Address_Of_Your_Computer>:8000"
CLOUD_FRONT = 

Note the IP address for the env file can be seen when you run npm start. It will say "Metro waiting on exp://<IP_Address>:8081
When you change the frontend env file, start expo using npx expo start -c to clear the cache.


To load on physical device  
    1. Download Expo Go app  
    2. Scan QR code to open  

To load on emulator  
    1. Download Android Emulator using Android Studio  
    2. Or Download iOS emulator through XCode (Mac required)  
    3. Press 'a' to open Android Emulator or 'i' for iOS emulator.
