type ProcessStepProps = {
  step: string;
  title: string;
  body?: string | null;
};

export function ProcessStep({ step, title, body }: ProcessStepProps) {
  return (
    <article className="process-step">
      <p className="process-step__number">{step}</p>
      <h3>{title}</h3>
      {body ? <p>{body}</p> : null}
    </article>
  );
}
