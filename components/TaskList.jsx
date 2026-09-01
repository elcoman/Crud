'use client';

import { useEffect, useState } from "react";

import styles from '@/app/page.module.css';
import Link from 'next/link';
const TaskList = () => {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchTasks = async () => {

            try {

                const response = await fetch('/api/tasks', {
                    cache: 'no-store',
                });

                const data = await response.json();
                setTasks(data);

            } catch (error) {

                console.error('Taak ophalen mislukt', error);

            } finally {

                setLoading(false);

            }

        };

        fetchTasks();

    }, []);

    const handleDelete = async (taskId) => {
        if (!confirm('Weet je zeker dat je deze taak wilt verwijderen?')) {
            return;
    }
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            setTasks(tasks.filter((task) => task.id !== taskId));
        } else {
            throw new Error('Taak verwijderen mislukt');
        }
    } catch (error) {
        console.error('Taak verwijderen mislukt', error);
    }
};

    if (loading) {

        return <p>Geduld moet je hebben...</p>;

    }

    return (

        <div className={styles.taskList}>

            <h1>Takenlijst</h1>

            <ul>

                {
                    tasks.length > 0 ? (

                        tasks.map((task) => (

                            <li key={task.id}>
                                {task.title} - <Link href={`/edit/${task.id}`}>Aanpassen</Link>
                                    <button onClick={() => handleDelete(task.id)}>Verwijderen</button>
                            </li>

                        ))

                    ) : (

                        <li>Geen taken gevonden</li>

                    )
                }

            </ul>

        </div>

    );

};

export default TaskList;
