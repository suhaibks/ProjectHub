import { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';

export default function Clients() {
  const [user] = useAuthState(auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');

  const uid = user?.uid;
  const clientsQuery = useMemo(() => {
    if (!uid) return null;
    return query(collection(db, 'clients'), where('userId', '==', uid));
  }, [uid]);

  useEffect(() => {
    if (!clientsQuery) return undefined;

    const unsubscribe = onSnapshot(clientsQuery, (snapshot) => {
      setClients(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });

    return unsubscribe;
  }, [clientsQuery]);

  const addClient = async (event) => {
    event.preventDefault();
    if (!uid || !name.trim()) return;

    setError('');

    await addDoc(collection(db, 'clients'), {
      name: name.trim(),
      email: email.trim(),
      userId: uid,
      createdAt: serverTimestamp(),
    });

    setName('');
    setEmail('');
  };

  const removeClient = async (clientId) => {
    if (!uid) return;

    const clientRef = doc(db, 'clients', clientId);
    const clientSnap = await getDoc(clientRef);

    if (!clientSnap.exists() || clientSnap.data().userId !== uid) {
      setError('Unauthorized action.');
      return;
    }

    await deleteDoc(clientRef);
  };

  return (
    <section>
      <h1>Clients</h1>
      <form onSubmit={addClient}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Client name"
          required
        />
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Client email"
          type="email"
        />
        <button type="submit">Add client</button>
      </form>

      {error && <p>{error}</p>}

      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            <strong>{client.name}</strong> {client.email ? `(${client.email})` : ''}
            <button type="button" onClick={() => removeClient(client.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
