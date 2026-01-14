import { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../Auth/firebase'; // Ensure this path is correct
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // 1. Initialize loading as TRUE so the app waits for Firebase
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Listen for actual Firebase auth changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // If user exists, set them in your context
        // You can also fetch their 'role' from Firestore here later
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'Alex',
          role: 'Admin' // You can make this dynamic later
        });
      } else {
        setUser(null);
      }
      setLoading(false); // 3. Firebase has responded, stop loading
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);