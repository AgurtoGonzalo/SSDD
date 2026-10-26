'use client';

import { useState, useEffect, FormEvent } from 'react';
import styles from './page.module.css';

interface Note {
  id: string;
  title: string;
  text: string;
  color: string;
  validUntil: number;
  notified: boolean;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [color, setColor] = useState('#fef08a');
  const [minutes, setMinutes] = useState('5');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(() => (typeof Date !== 'undefined' ? Date.now() : 0));
  const API_URL = 'http://localhost:3001/api/notas';


  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotes(data);
        }
      })
      .catch(e => console.error('Error cargando notas desde la API:', e));

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);

      setNotes(prevNotes => {
        let hasChanges = false;
        const newNotes = prevNotes.map(note => {
          if (now >= note.validUntil && !note.notified) {
            hasChanges = true;

            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('¡Nota expirada!', {
                body: `La nota "${note.title}" ha llegado a su tiempo límite.`,
                icon: '/favicon.ico',
              });
            }

            fetch(`${API_URL}/${note.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ notified: true }),
            }).catch(console.error);

            return { ...note, notified: true };
          }
          return note;
        });

        return hasChanges ? newNotes : prevNotes;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;

    const validUntil = Date.now() + parseInt(minutes) * 60 * 1000;

    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            text,
            color,
            validUntil,
            notified: false,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.message || 'Error al actualizar nota');
          return;
        }

        const updatedNote = await res.json();
        setNotes(prev => prev.map(n => (n.id === editingId ? updatedNote : n)));
        setEditingId(null);
      } else {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            text,
            color,
            validUntil,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.message || 'Error al crear nota');
          return;
        }

        const newNote = await res.json();
        setNotes(prev => [newNote, ...prev]);
      }

      setTitle('');
      setText('');
      setColor('#fef08a');
      setMinutes('5');
    } catch (err) {
      console.error('Error al conectar con la API:', err);
      alert('No se pudo conectar con el servidor backend.');
    }
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setText(note.text);
    setColor(note.color);
    const baseTime = currentTime || 0;
    const remainingMs = Math.max(0, note.validUntil - baseTime);
    setMinutes(Math.ceil(remainingMs / 60000).toString());

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Error al eliminar nota');
        return;
      }

      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error al eliminar la nota:', err);
      alert('No se pudo conectar con el servidor backend.');
    }
  };

  return (
    <main className="board-container">
      <header className="header">
        <h1>Notas Visuales</h1>
        <p>Una herramienta minimalista con recordatorios</p>
      </header>

      <div className={styles.main}>
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="title">Título</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                placeholder="Ej: Comprar pan"
              />
            </div>

            <div className={styles.inputGroup} style={{ flex: 0.5 }}>
              <label htmlFor="color">Color</label>
              <input
                id="color"
                type="color"
                className={styles.colorPicker}
                value={color}
                onChange={e => setColor(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="text">Contenido</label>
            <textarea
              id="text"
              value={text}
              onChange={e => setText(e.target.value)}
              required
              placeholder="Detalles de la nota..."
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="minutes">Validez (minutos)</label>
              <input
                id="minutes"
                type="number"
                min="1"
                value={minutes}
                onChange={e => setMinutes(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup} style={{ justifyContent: 'flex-end' }}>
              <button type="submit" className={styles.btn}>
                {editingId ? 'Guardar Cambios' : 'Crear Nota'}
              </button>
            </div>
          </div>

          {editingId && (
            <button type="button" onClick={() => {
              setEditingId(null);
              setTitle(''); setText(''); setMinutes('5');
            }} className={`${styles.btn} ${styles.btnDanger}`} style={{ marginTop: '1rem' }}>
              Cancelar Edición
            </button>
          )}
        </form>

        <section className={styles.board}>
          {notes.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8' }}>
              No hay notas aún. ¡Creá una arriba!
            </p>
          ) : (
            notes.map(note => {
              const isExpired = currentTime > 0 ? currentTime >= note.validUntil : false;

              return (
                <article
                  key={note.id}
                  className={styles.note}
                  style={{ backgroundColor: note.color }}
                >
                  <header className={styles.noteHeader}>
                    <h2 className={styles.noteTitle}>{note.title}</h2>
                    {isExpired && <span className={styles.expiredBadge}>Expirada</span>}
                  </header>

                  <p className={styles.noteText}>{note.text}</p>

                  <footer className={styles.noteFooter}>
                    <span>
                      {!isExpired && `Expira a las ${new Date(note.validUntil).toLocaleTimeString()}`}
                    </span>

                    <div className={styles.actions}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleEdit(note)}
                        aria-label="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleDelete(note.id)}
                        aria-label="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </footer>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
