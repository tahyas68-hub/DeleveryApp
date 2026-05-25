import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export function useFirebaseSync<T>(collectionName: string, documentId: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const docRef = doc(db, collectionName, documentId);
    
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.data().value as T);
      } else {
        // If it doesn't exist, we fallback to the initialValue (which might be loaded from localStorage for migration)
        setDoc(docRef, { value: initialValue }, { merge: true });
        setData(initialValue);
      }
      setInitialized(true);
    });

    return () => unsubscribe();
  }, [collectionName, documentId]);

  const updateData = async (newData: T | ((prev: T) => T)) => {
    let resolvedData: T;
    if (typeof newData === 'function') {
      resolvedData = (newData as (prev: T) => T)(data);
    } else {
      resolvedData = newData;
    }
    
    // Optimistic update locally
    setData(resolvedData);
    
    // Persist to firestore
    const docRef = doc(db, collectionName, documentId);
    await setDoc(docRef, { value: resolvedData }, { merge: true });
  };

  return [data, updateData, initialized] as const;
}
