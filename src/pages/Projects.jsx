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
  updateDoc,
  where,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';

const statusOptions = ['pending', 'in-progress', 'completed'];

export default function Projects() {
  const [user] = useAuthState(auth);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clientId, setClientId] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('pending');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const uid = user?.uid;

  const clientsQuery = useMemo(() => {
    if (!uid) return null;
    return query(collection(db, 'clients'), where('userId', '==', uid));
  }, [uid]);

  const projectsQuery = useMemo(() => {
    if (!uid) return null;
    return query(collection(db, 'projects'), where('userId', '==', uid));
  }, [uid]);

  useEffect(() => {
    if (!clientsQuery) return undefined;

    const unsubscribe = onSnapshot(clientsQuery, (snapshot) => {
      setClients(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });

    return unsubscribe;
  }, [clientsQuery]);

  useEffect(() => {
    if (!projectsQuery) return undefined;

    const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
      setProjects(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });

    return unsubscribe;
  }, [projectsQuery]);

  const createProject = async (event) => {
    event.preventDefault();
    if (!uid || !clientId || !name.trim()) return;

    setError('');

    const client = clients.find((entry) => entry.id === clientId);
    if (!client || client.userId !== uid) {
      setError('Invalid client selection.');
      return;
    }

    await addDoc(collection(db, 'projects'), {
      clientId,
      clientName: client.name,
      name: name.trim(),
      status,
      amount: Number(amount) || 0,
      userId: uid,
      createdAt: serverTimestamp(),
    });

    setClientId('');
    setName('');
    setStatus('pending');
    setAmount('');
  };

  const removeProject = async (projectId) => {
    if (!uid) return;
    const projectRef = doc(db, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists() || projectSnap.data().userId !== uid) {
      setError('Unauthorized action.');
      return;
    }

    await deleteDoc(projectRef);
  };

  const changeStatus = async (projectId, nextStatus) => {
    if (!uid || !statusOptions.includes(nextStatus)) return;

    const projectRef = doc(db, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists() || projectSnap.data().userId !== uid) {
      setError('Unauthorized action.');
      return;
    }

    await updateDoc(projectRef, { status: nextStatus });
  };

  return (
    <section>
      <h1>Projects</h1>

      <form onSubmit={createProject}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Project name"
          required
        />

        <select value={clientId} onChange={(event) => setClientId(event.target.value)} required>
          <option value="">Select client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Amount"
          type="number"
          min="0"
          step="0.01"
          required
        />

        <button type="submit">Create project</button>
      </form>

      {error && <p>{error}</p>}

      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <div>
              <strong>{project.name}</strong> — {project.clientName}
            </div>
            <div>
              ${Number(project.amount || 0).toFixed(2)} | Status: {project.status}
            </div>
            <select
              value={project.status}
              onChange={(event) => changeStatus(project.id, event.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => removeProject(project.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
