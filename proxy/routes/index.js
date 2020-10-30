var express = require("express");
var router = express.Router();

var admin = require("firebase-admin");

admin.initializeApp();

function formatUser(u) {
  return {
    uid: u.uid,
    email: u.email,
    phone: u.phone,
    emailVerified: u.emailVerified,
    displayName: u.displayName,
    photoURL: u.photoURL,
    phoneNumber: u.phoneNumber,
    disabled: u.disabled,
    creationTime: !!u.metadata.creationTime && (new Date(Date.parse(u.metadata.creationTime)).toISOString()),
    lastSignInTime: !!u.metadata.lastSignInTime && (new Date(
      Date.parse(u.metadata.lastSignInTime)
    ).toISOString()),
    providers: u.providerData,
    claims: u.customClaims,
  };
}

/* GET home page. */
router.get("/list", async function (req, res, next) {
  // const {amount, page, sort, filter} = req.query;
  // sort: field to sort, form: {field: +/-1}
  // filter: filtering
  // amount: Amount of results to return
  // page: return amount users between amount*page and amount*(page+1)

  // Get all users and map them to a flat object
  // FIXME: A bit ugly
  const users = await new Promise((resolve, reject) => {
    const users = [];
    function listAllUsers(nextPageToken) {
      admin
        .auth()
        .listUsers(1000, nextPageToken)
        .then((listUsersResult) => {
          listUsersResult.users.forEach(function (u) {
            users.push(formatUser(u));
          });

          if (listUsersResult.pageToken)
            return listAllUsers(listUsersResult.pageToken);
          else resolve(users);
        })
        .catch(reject);
    }

    listAllUsers();
  });

  res.send({ users });
});

/* GET home page. */
router.get("/user/:id", async function (req, res) {
  const { params } = req;
  const { id } = params;
  const user = await admin.auth().getUser(id);
  res.send({ user: formatUser(user) });
});

router.post("/user/:id", async function (req, res) {
  const { params, body } = req;
  const { id } = params;
  const { user, sendVerificationEmail, askPasswordReset } = body;
  const {
    email,
    phoneNumber,
    emailVerified,
    password,
    displayName,
    photoURL,
    disabled,
  } = user;

  // TODO: Add validation here !
  const updatedValues = {
    email: email.length ? email : undefined,
    phoneNumber: phoneNumber.length ? phoneNumber : undefined,
    password: password.length ? password : undefined,
    displayName: displayName.length ? displayName : undefined,
    photoURL: photoURL.length ? photoURL : undefined,
    disabled,
    emailVerified,
  };

  try {
    await admin.auth().updateUser(id, updatedValues);

    if (sendVerificationEmail) {
      const link = await admin.auth().generateEmailVerificationLink(email);
      console.log({ link }); // TODO: Actually send email here
    }

    if (askPasswordReset) {
      const link = await admin.auth().generatePasswordResetLink(email);
      console.log({ link }); // TODO: Actually send email here
    }

    res.send({ result: "OK" });
  } catch (error) {
    console.warn(error)
    res.status(500).send({ error: error.message });
  }
});

/* POST update claims */
router.post("/user/:id/claims", async function (req, res) {
  const { params, body } = req;
  const { id } = params;
  const { claims } = body;

  try {
    await admin.auth().setCustomUserClaims(id, claims);
    res.send({ result: "OK" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/* PATCH Disable user 
router.patch("/user/:id/:disabled", async function (req, res) {
  const { params, body } = req;
  const { id, disabled } = params;

  try {
    await admin.auth().updateUser(id, { disabled: disabled === 'true' });
    res.send({ result: "OK" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
*/

/* DELETE user */
router.delete("/user/:id", async function (req, res) {
  const { params } = req;
  const { id } = params;

  try {
    await admin.auth().deleteUser(id);
    res.send({ result: "OK" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// search users: search in name, email, phone, uid, claims,...

// update user: Update user's data (displayname, email, photoURL, phoneNumber)

// Create user

// Delete user

// gen reset password

// Gen email verif link

// Revoke refresh token

// import users fro CSV, JSON,...

module.exports = router;
