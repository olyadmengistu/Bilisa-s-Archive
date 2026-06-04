# Firestore Security Rules for Bilisa Archive

## Overview
These security rules ensure that your notes are protected and only accessible by authenticated users. Each user can only access their own notes.

## Security Rules

Copy and paste these rules into your Firebase Console → Firestore Database → Rules tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Function to check if user owns the document
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Users collection - each user has their own subcollection
    match /users/{userId}/{document=**} {
      // Allow read/write if user is authenticated and owns the data
      allow read, write: if isAuthenticated() && isOwner(userId);
    }
    
    // Prevent any other access patterns
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Rule Explanation

### `isAuthenticated()`
- Checks if the request has a valid Firebase Authentication token
- Prevents unauthenticated users from accessing any data

### `isOwner(userId)`
- Ensures users can only access their own data
- Compares the authenticated user's UID with the userId in the path
- Prevents users from accessing other users' notes

### Collection Structure
- Notes are stored at: `/users/{userId}/notes/{noteId}`
- Each user has their own subcollection
- Security rules enforce this isolation

## How to Apply Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: "bilisa-s-archive"
3. Navigate to Firestore Database → Rules
4. Delete existing rules
5. Paste the rules above
6. Click "Publish"

## Testing Security Rules

After publishing, test that:
- ✅ Authenticated users can read/write their own notes
- ✅ Users cannot access other users' notes
- ✅ Unauthenticated users cannot access any data
- ✅ Users can only create notes in their own subcollection

## Additional Security Considerations

### Data Validation (Optional)
For additional security, you can add data validation rules:

```javascript
// Validate note data structure
function isValidNote() {
  return request.resource.data.keys().hasAll([
    'title', 'content', 'grade', 'subject', 'unit'
  ]) &&
  request.resource.data.title is string &&
  request.resource.data.title.size() > 0 &&
  request.resource.data.content is string &&
  request.resource.data.grade is string &&
  request.resource.data.subject is string &&
  request.resource.data.unit is string;
}

// Update the create rule
allow create: if isAuthenticated() && isOwner(userId) && isValidNote();
```

### Rate Limiting (Optional)
For production, consider implementing rate limiting through Firebase App Check or Cloud Functions.

## Monitoring
Monitor your Firestore usage in Firebase Console to:
- Track read/write operations
- Identify unusual patterns
- Ensure security rules are working as expected
