import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';

const getPaymentStatus = (remaining) => {
  if (remaining <= 0) return 'paid';
  return 'partial';
};

export default function Payments() {
  const [user] = useAuthState(auth);
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [paid, setPaid] = useState('');
  const [error, setError] = useState('');

  const uid = user?.uid;

  const projectsQuery = useMemo(() => {
    if (!uid) return null;
    return query(collection(db, 'projects'), where('userId', '==', uid));
  }, [uid]);

  const paymentsQuery = useMemo(() => {
    if (!uid) return null;
    return query(collection(db, 'payments'), where('userId', '==', uid));
  }, [uid]);

  useEffect(() => {
    if (!projectsQuery) return undefined;
    const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
      setProjects(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
    return unsubscribe;
  }, [projectsQuery]);

  useEffect(() => {
    if (!paymentsQuery) return undefined;
    const unsubscribe = onSnapshot(paymentsQuery, (snapshot) => {
      setPayments(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
    return unsubscribe;
  }, [paymentsQuery]);

  const savePayment = async (event) => {
    event.preventDefault();
    if (!uid || !projectId) return;

    setError('');

    const projectRef = doc(db, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists() || projectSnap.data().userId !== uid) {
      setError('Unauthorized action.');
      return;
    }

    const project = projectSnap.data();
    const amount = Number(project.amount || 0);
    const paidAmount = Math.max(0, Number(paid) || 0);
    const remaining = Math.max(0, amount - paidAmount);

    await setDoc(doc(db, 'payments', projectId), {
      userId: uid,
      projectId,
      projectName: project.name,
      projectAmount: amount,
      paid: paidAmount,
      remaining,
      paymentStatus: getPaymentStatus(remaining),
      updatedAt: serverTimestamp(),
    });

    setProjectId('');
    setPaid('');
  };

  return (
    <section>
      <h1>Payments</h1>
      <form onSubmit={savePayment}>
        <select value={projectId} onChange={(event) => setProjectId(event.target.value)} required>
          <option value="">Select project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name} (${Number(project.amount || 0).toFixed(2)})
            </option>
          ))}
        </select>

        <input
          value={paid}
          onChange={(event) => setPaid(event.target.value)}
          placeholder="Paid amount"
          type="number"
          min="0"
          step="0.01"
          required
        />

        <button type="submit">Save payment</button>
      </form>

      {error && <p>{error}</p>}

      <ul>
        {payments.map((payment) => (
          <li key={payment.id}>
            <strong>{payment.projectName}</strong> — Paid: ${Number(payment.paid || 0).toFixed(2)} | 
            Remaining: ${Number(payment.remaining || 0).toFixed(2)} | Status: {payment.paymentStatus}
          </li>
        ))}
      </ul>
    </section>
  );
}
