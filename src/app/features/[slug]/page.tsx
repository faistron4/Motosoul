// "/features/[slug]" - single feature/article page
type Props = {
  params: { slug: string };
};

export default function FeatureDetailPage({ params }: Props) {
  return (
    <article>
      <h1>Feature: {params.slug}</h1>
      {/* TODO: fetch article by slug (backend ready hone par) */}
    </article>
  );
}
