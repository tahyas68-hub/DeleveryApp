import { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export function useFirebaseSync<T>(collectionName: string, documentId: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const dataRef = useRef<T>(initialValue);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const docRef = doc(db, collectionName, documentId);
    
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.data().value as T;
        setData(val);
        dataRef.current = val;
      } else {
        // If it doesn't exist, we fallback to the initialValue (which might be loaded from localStorage for migration)
        setDoc(docRef, { value: initialValue }, { merge: true });
        setData(initialValue);
        dataRef.current = initialValue;
      }
      setInitialized(true);
    });

    return () => unsubscribe();
  }, [collectionName, documentId]);

  const updateData = async (newData: T | ((prev: T) => T)) => {
    let resolvedData: T;
    if (typeof newData === 'function') {
      resolvedData = (newData as (prev: T) => T)(dataRef.current);
    } else {
      resolvedData = newData;
    }
    
    // Optimistic update locally
    dataRef.current = resolvedData;
    setData(resolvedData);
    
    // Persist to firestore
    try {
      const docRef = doc(db, collectionName, documentId);
      await setDoc(docRef, { value: resolvedData }, { merge: true });
    } catch (e) {
      console.error("Firebase sync error for", collectionName, documentId, e);
      throw e;
    }
  };

  return [data, updateData, initialized] as const;
}
