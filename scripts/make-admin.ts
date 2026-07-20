import { adminDb } from "../src/firebase/admin";
import { COLLECTIONS } from "../src/types/firestore";

async function makeAdmin(email: string) {
  if (!email) {
    console.error("Please provide an email address.");
    process.exit(1);
  }

  console.log(`Searching for user with email: ${email}...`);
  try {
    const snap = await adminDb
      .collection(COLLECTIONS.users)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snap.empty) {
      console.error(`No user found with email ${email}. Please register on the website first.`);
      process.exit(1);
    }

    const docId = snap.docs[0]!.id;
    await adminDb.collection(COLLECTIONS.users).doc(docId).update({
      role: "admin",
    });

    console.log(`Success! User ${email} has been granted the 'admin' role.`);
  } catch (err: any) {
    console.error("Failed to update user role:", err.message);
    process.exit(1);
  }
}

const emailArg = process.argv[2];
if (!emailArg) {
  console.error("Usage: npx tsx --env-file=.env scripts/make-admin.ts <user-email>");
  process.exit(1);
}

makeAdmin(emailArg);
