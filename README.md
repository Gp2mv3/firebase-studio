## Firebase Studio

This tool helps to manage Firebase authentication users. It's a "super firebase console".

It includes:

- A better search for users
- A clearer list (with all fields, including picture, full email address, name,...)
- The possibility to see and edit custom claims associated to a user
- The possibility to edit any information related to a specific user

## How to use:

The project is composed of two elements:
- The client: The web interface, built with React
- The proxy: Interface between Firebase admin SDK and the client, built with Node and Express

### Environment variables for Admin SDK

Firebase Studio uses the [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) and needs to be initialized to use your own Firebase credentials.
You need to set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable. Refer to the [official documentation for the initialization](https://firebase.google.com/docs/admin/setup#initialize-sdk).

### Proxy

Simply load the proxy, in the `proxy` folder, run:
```
cd proxy
npm start
```

### Client

In dev, you can simply use `npm start` in the client folder:
```
cd client
npm start
```

In prod, compile the application with `npm build` and host the content of the build folder on any static file hosting:
```
cd client
npm build
```

## Found a bug?

Feel free to open an issue !
