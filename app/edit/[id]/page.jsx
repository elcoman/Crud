"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const EditTaskPage = () => {
  const [title, setTitle] = useState("");
  const router = useRouter();
  const { id } = useParams(); 

  useEffect(() => {
    const fetchTask = async () => {
      const response = await fetch(`/api/tasks/${id}`);
      if (!response.ok) throw new Error("Taak niet gevonden");
      const data = await response.json();
      setTitle(data.title);
    };
    if (id) fetchTask();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) throw new Error("Taak bijwerken mislukt");
    router.push("/");
  };

  return (
    <div>
      <h1>Taak aanpassen</h1>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <button type="submit">Opslaan</button>
      </form>
    </div>
  );
};

export default EditTaskPage;