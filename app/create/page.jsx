"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/create/create.module.css";

const CreateTaskPage = () => {
    const [title, setTitle] = useState("");
    const router = useRouter();

    const handleSubmit = async (event) => {

        event.preventDefault();
        if (!title) return;

        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        });
        if (response.ok) {
            router.push('/');
        } else {
            alert('Taak aanmaken mislukt');
        }
    }; 

    return (
        <div>
            <h1 className={styles.title}>Taak aanmaken</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input className={styles.input} type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Taak naam" />
                <button className={styles.button} type="submit">Bevestigen</button>
            </form>

        </div>
    );

}

export default CreateTaskPage;
