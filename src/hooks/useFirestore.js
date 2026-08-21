import { useState, useEffect, useCallback } from 'react';
import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export function useFirestore(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time listener
  useEffect(() => {
    if (!db) {
      setLoading(false);
      setData([]);
      return;
    }
    
    setLoading(true);
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setData(items);
      setLoading(false);
    }, (err) => {
      console.error(`Firestore error (${collectionName}):`, err);
      setError(err.message);
      setLoading(false);
    });

    return unsubscribe;
  }, [collectionName]);

  const addItem = useCallback(async (item) => {
    const docRef = await addDoc(collection(db, collectionName), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }, [collectionName]);

  const updateItem = useCallback(async (id, updates) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
  }, [collectionName]);

  const deleteItem = useCallback(async (id) => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  }, [collectionName]);

  return { data, loading, error, addItem, updateItem, deleteItem };
}

// Hook for non-realtime fetching (problem statements etc.)
export function useFirestoreOnce(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!db) {
        setLoading(false);
        setData([]);
        return;
      }
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setData(items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [collectionName]);

  return { data, loading };
}
