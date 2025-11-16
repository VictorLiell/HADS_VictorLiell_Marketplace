 import { FormEvent, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

type ProviderReview = {
  providerId: string;
  serviceId?: string;
  rating: number;
  comment: string;
};

async function submitReview(review: ProviderReview): Promise<void> {
  // Aqui você integra com sua API / backend / Supabase / etc.
  // Exemplo genérico de POST:
  await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
}

export const ProviderReviewPage = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const serviceId = searchParams.get("serviceId") ?? undefined;

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  if (!providerId) {
    return <p>Prestador não informado.</p>;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const review: ProviderReview = {
      providerId,
      serviceId,
      rating,
      comment,
    };

    try {
      await submitReview(review);
      alert("Avaliação enviada com sucesso!");
      navigate(-1); // volta para a tela anterior
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar avaliação. Tente novamente.");
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
      <h1>Avaliar Prestador</h1>
      {serviceId && <p>Serviço relacionado: {serviceId}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Nota (1 a 5):
            <select
              value={rating || ""}
              onChange={(e) => setRating(Number(e.target.value))}
              required
            >
              <option value="" disabled>
                Selecione
              </option>
              <option value={1}>1 - Péssimo</option>
              <option value={2}>2 - Ruim</option>
              <option value={3}>3 - Regular</option>
              <option value={4}>4 - Bom</option>
              <option value={5}>5 - Excelente</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Comentário:
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              style={{ width: "100%" }}
            />
          </label>
        </div>

        <button type="submit">Enviar avaliação</button>
      </form>
    </div>
  );
};

export default ProviderReviewPage;
